#!/usr/bin/env node
/**
 * validate-agent-workspace.mjs
 * Validates agent workspace files and swarm orchestration artifacts:
 *   - SKILL.md YAML frontmatter (kebab-case name <= 64, description <= 1024)
 *   - AGENTS.md and CLAUDE.md structural checks (headings and optional frontmatter)
 *   - Swarm handoff contract JSON (tasks, dependencies, cycles, disjoint ownedPaths)
 *
 * Usage:
 *   node scripts/validate-agent-workspace.mjs <file-or-dir> [--strict] [--json]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_WORKSPACE_MODES = new Set(['inherit', 'share', 'branch']);
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage']);

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;

  const raw = match[1];
  const fields = {};
  const lines = raw.split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const topMatch = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (topMatch && !line.startsWith(' ') && !line.startsWith('\t')) {
      currentKey = topMatch[1];
      let val = topMatch[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fields[currentKey] = val;
    } else if (currentKey && (line.startsWith('  ') || line.startsWith('\t'))) {
      const existing = typeof fields[currentKey] === 'string' ? fields[currentKey] : '';
      fields[currentKey] = existing ? `${existing} ${line.trim()}` : line.trim();
    }
  }
  return fields;
}

function validateMarkdownFile(filePath, strict) {
  const errors = [];
  const warnings = [];
  const baseName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const trimmed = content.trim();

  if (trimmed.length === 0) {
    errors.push(`${filePath}: file is empty.`);
    return { errors, warnings };
  }

  const fm = parseFrontmatter(content);

  if (baseName === 'SKILL.md') {
    if (!fm) {
      errors.push(`${filePath}: missing YAML frontmatter block (--- ... ---).`);
      return { errors, warnings };
    }
    const name = typeof fm.name === 'string' ? fm.name.trim() : '';
    const desc = typeof fm.description === 'string' ? fm.description.trim() : '';

    if (!name) {
      errors.push(`${filePath}: frontmatter missing required "name".`);
    } else {
      if (name.length > 64) {
        errors.push(`${filePath}: frontmatter "name" exceeds 64 characters (${name.length}).`);
      }
      if (!KEBAB_CASE_REGEX.test(name)) {
        errors.push(`${filePath}: frontmatter "name" must be kebab-case (got "${name}").`);
      }
      const parentDir = path.basename(path.dirname(filePath));
      if (parentDir && parentDir !== '.' && parentDir !== name) {
        const msg = `${filePath}: parent folder "${parentDir}" does not match skill name "${name}".`;
        if (strict) errors.push(msg);
        else warnings.push(msg);
      }
    }

    if (!desc) {
      errors.push(`${filePath}: frontmatter missing required "description".`);
    } else if (desc.length > 1024) {
      errors.push(`${filePath}: frontmatter "description" exceeds 1024 characters (${desc.length}).`);
    }
  } else {
    if (!/^#\s+\S+/m.test(content)) {
      const msg = `${filePath}: missing top-level Markdown heading (# Title).`;
      if (strict) errors.push(msg);
      else warnings.push(msg);
    }
    if (fm) {
      if (typeof fm.name === 'string' && fm.name.trim()) {
        if (fm.name.trim().length > 64 || !KEBAB_CASE_REGEX.test(fm.name.trim())) {
          errors.push(`${filePath}: optional frontmatter "name" must be kebab-case <= 64 chars.`);
        }
      }
      if (typeof fm.description === 'string' && fm.description.trim().length > 1024) {
        errors.push(`${filePath}: optional frontmatter "description" exceeds 1024 chars.`);
      }
    }
  }

  return { errors, warnings };
}

function pathsOverlap(a, b) {
  const normA = a.replaceAll('\\', '/').replace(/\/+$/, '');
  const normB = b.replaceAll('\\', '/').replace(/\/+$/, '');
  if (!normA || !normB) return false;
  return (
    normA === normB ||
    normA.startsWith(`${normB}/`) ||
    normB.startsWith(`${normA}/`)
  );
}

function hasDependencyEdge(taskMap, startId, targetId) {
  const visited = new Set();
  const stack = [startId];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === targetId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const node = taskMap.get(current);
    if (node && Array.isArray(node.dependsOn)) {
      for (const dep of node.dependsOn) {
        if (typeof dep === 'string') stack.push(dep);
      }
    }
  }
  return false;
}

function validateSwarmContract(filePath, strict) {
  const errors = [];
  const warnings = [];
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    errors.push(`${filePath}: invalid JSON (${err instanceof Error ? err.message : String(err)}).`);
    return { errors, warnings };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push(`${filePath}: root value must be a JSON object.`);
    return { errors, warnings };
  }

  for (const field of ['contractVersion', 'swarmId', 'goal', 'topology']) {
    if (typeof data[field] !== 'string' || data[field].trim().length === 0) {
      errors.push(`${filePath}: missing non-empty string "${field}".`);
    }
  }

  if (!Array.isArray(data.tasks) || data.tasks.length === 0) {
    errors.push(`${filePath}: "tasks" must be a non-empty array.`);
    return { errors, warnings };
  }

  const taskIds = new Set();
  const agentNames = new Set();
  const taskMap = new Map();

  for (let i = 0; i < data.tasks.length; i++) {
    const t = data.tasks[i];
    const prefix = `${filePath} tasks[${i}]`;
    if (!t || typeof t !== 'object' || Array.isArray(t)) {
      errors.push(`${prefix}: task entry must be an object.`);
      continue;
    }

    if (typeof t.id !== 'string' || t.id.trim().length === 0) {
      errors.push(`${prefix}.id: must be a non-empty string.`);
    } else if (taskIds.has(t.id)) {
      errors.push(`${prefix}.id: duplicate task id "${t.id}".`);
    } else {
      taskIds.add(t.id);
      taskMap.set(t.id, t);
    }

    if (typeof t.agentName !== 'string' || !KEBAB_CASE_REGEX.test(t.agentName) || t.agentName.length > 64) {
      errors.push(`${prefix}.agentName: must be kebab-case <= 64 chars (got ${JSON.stringify(t.agentName)}).`);
    } else if (agentNames.has(t.agentName)) {
      errors.push(`${prefix}.agentName: duplicate agentName "${t.agentName}".`);
    } else {
      agentNames.add(t.agentName);
    }

    if (typeof t.workspaceMode !== 'string' || !VALID_WORKSPACE_MODES.has(t.workspaceMode)) {
      errors.push(`${prefix}.workspaceMode: must be one of inherit, share, branch.`);
    }

    if (!Array.isArray(t.ownedPaths) || t.ownedPaths.length === 0) {
      errors.push(`${prefix}.ownedPaths: must be a non-empty array of file or directory paths.`);
    }

    if (!Array.isArray(t.acceptanceCriteria) || t.acceptanceCriteria.length === 0) {
      errors.push(`${prefix}.acceptanceCriteria: must be a non-empty array.`);
    }

    if (t.dependsOn !== undefined && !Array.isArray(t.dependsOn)) {
      errors.push(`${prefix}.dependsOn: must be an array of task IDs.`);
    }

    if (strict && (typeof t.handoffTo !== 'string' || t.handoffTo.trim().length === 0)) {
      errors.push(`${prefix}.handoffTo: required in strict mode.`);
    }
  }

  // Validate dependency references and cycles
  for (const t of data.tasks) {
    if (!t || typeof t !== 'object' || !Array.isArray(t.dependsOn)) continue;
    for (const dep of t.dependsOn) {
      if (typeof dep !== 'string' || !taskMap.has(dep)) {
        errors.push(`${filePath}: task "${t.id}" dependsOn unknown task "${String(dep)}".`);
      } else if (dep === t.id) {
        errors.push(`${filePath}: task "${t.id}" cannot depend on itself.`);
      } else if (hasDependencyEdge(taskMap, dep, t.id)) {
        errors.push(`${filePath}: dependency cycle detected involving "${t.id}" and "${dep}".`);
      }
    }
  }

  // Check concurrent inherit tasks for overlapping ownedPaths
  for (let i = 0; i < data.tasks.length; i++) {
    const a = data.tasks[i];
    if (!a || a.workspaceMode !== 'inherit' || !Array.isArray(a.ownedPaths)) continue;
    for (let j = i + 1; j < data.tasks.length; j++) {
      const b = data.tasks[j];
      if (!b || b.workspaceMode !== 'inherit' || !Array.isArray(b.ownedPaths)) continue;
      const ordered = hasDependencyEdge(taskMap, a.id, b.id) || hasDependencyEdge(taskMap, b.id, a.id);
      if (ordered) continue;
      for (const pathA of a.ownedPaths) {
        for (const pathB of b.ownedPaths) {
          if (typeof pathA === 'string' && typeof pathB === 'string' && pathsOverlap(pathA, pathB)) {
            errors.push(
              `${filePath}: concurrent inherit tasks "${a.id}" and "${b.id}" have overlapping ownedPaths ("${pathA}" vs "${pathB}"). Use dependsOn or share/branch workspaceMode.`
            );
          }
        }
      }
    }
  }

  return { errors, warnings };
}

function collectTargets(targetPath) {
  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Path not found: ${targetPath}`);
  }
  const stat = fs.statSync(resolved);
  if (stat.isFile()) {
    return [resolved];
  }
  const results = [];
  for (const entry of fs.readdirSync(resolved, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTargets(full));
    } else if (entry.isFile()) {
      if (
        entry.name === 'SKILL.md' ||
        entry.name === 'AGENTS.md' ||
        entry.name === 'CLAUDE.md' ||
        entry.name.endsWith('contract.json')
      ) {
        results.push(full);
      }
    }
  }
  return results;
}

function printHelp() {
  console.log('Usage: node validate-agent-workspace.mjs <file-or-dir> [--strict] [--json]');
  console.log('');
  console.log('Validates:');
  console.log('  - SKILL.md frontmatter (kebab-case name <= 64, description <= 1024)');
  console.log('  - AGENTS.md / CLAUDE.md markdown structure');
  console.log('  - Swarm handoff contract JSON files');
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  if (args.length === 0) {
    printHelp();
    process.exit(1);
  }

  const target = args.find((a) => !a.startsWith('--'));
  const strict = args.includes('--strict');
  const jsonOut = args.includes('--json');

  if (!target) {
    console.error('Error: missing <file-or-dir> argument.');
    process.exit(1);
  }

  let files;
  try {
    files = collectTargets(target);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (files.length === 0) {
    console.log(`PASS: No agent workspace or contract files found in ${target}.`);
    process.exit(0);
  }

  const allErrors = [];
  const allWarnings = [];

  for (const file of files) {
    const rel = path.relative(process.cwd(), file).replaceAll('\\', '/');
    const ext = path.extname(file).toLowerCase();
    const res =
      ext === '.json'
        ? validateSwarmContract(file, strict)
        : validateMarkdownFile(file, strict);
    for (const e of res.errors) allErrors.push(e.replace(file, rel));
    for (const w of res.warnings) allWarnings.push(w.replace(file, rel));
  }

  if (jsonOut) {
    console.log(
      JSON.stringify(
        {
          validatedFiles: files.length,
          errors: allErrors,
          warnings: allWarnings,
          status: allErrors.length > 0 ? 'fail' : 'pass',
        },
        null,
        2
      )
    );
    process.exit(allErrors.length > 0 ? 1 : 0);
  }

  for (const w of allWarnings) console.warn(`WARN  ${w}`);
  for (const e of allErrors) console.error(`ERROR ${e}`);

  if (allErrors.length > 0) {
    console.error(`\nFAIL: ${allErrors.length} error(s), ${allWarnings.length} warning(s) across ${files.length} file(s).`);
    process.exit(1);
  }

  console.log(`PASS: Validated ${files.length} agent workspace/contract file(s) with 0 errors (${allWarnings.length} warning(s)).`);
  process.exit(0);
}

main();
