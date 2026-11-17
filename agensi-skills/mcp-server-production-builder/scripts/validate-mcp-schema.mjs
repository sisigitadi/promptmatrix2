#!/usr/bin/env node
/**
 * validate-mcp-schema.mjs
 * Validates MCP tool definitions (single tool JSON, array of tools, or { tools: [...] })
 * against Model Context Protocol JSON Schema conventions and secret-leak checks.
 *
 * Usage:
 *   node scripts/validate-mcp-schema.mjs <schema.json> [--strict]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TOOL_NAME_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;
const SECRET_LEAK_REGEX = /\b(sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,})\b/;

function validatePropertySchema(propName, propDef, pathLabel, errors, warnings, strict) {
  if (!propDef || typeof propDef !== 'object' || Array.isArray(propDef)) {
    errors.push(`${pathLabel}.${propName}: property definition must be an object.`);
    return;
  }
  if (!propDef.type && !propDef.anyOf && !propDef.oneOf && !propDef.$ref) {
    errors.push(`${pathLabel}.${propName}: missing "type" (or "anyOf"/"oneOf"/"$ref").`);
  }
  if (typeof propDef.description !== 'string' || propDef.description.trim().length === 0) {
    const msg = `${pathLabel}.${propName}: missing non-empty "description" for LLM parameter guidance.`;
    if (strict) errors.push(msg);
    else warnings.push(msg);
  }
  if (propDef.default !== undefined && typeof propDef.default === 'string') {
    if (SECRET_LEAK_REGEX.test(propDef.default)) {
      errors.push(`${pathLabel}.${propName}: potential secret detected in "default" value.`);
    }
  }
  if (propDef.type === 'object' && propDef.properties) {
    for (const [childName, childDef] of Object.entries(propDef.properties)) {
      validatePropertySchema(childName, childDef, `${pathLabel}.${propName}.properties`, errors, warnings, strict);
    }
  }
}

function validateTool(tool, index, strict) {
  const errors = [];
  const warnings = [];
  const prefix = `tools[${index}]`;

  if (!tool || typeof tool !== 'object' || Array.isArray(tool)) {
    errors.push(`${prefix}: tool entry must be an object.`);
    return { errors, warnings };
  }

  if (typeof tool.name !== 'string' || !TOOL_NAME_REGEX.test(tool.name)) {
    errors.push(`${prefix}.name: must match ^[a-zA-Z0-9_-]{1,64}$ (got ${JSON.stringify(tool.name)}).`);
  }

  if (typeof tool.description !== 'string' || tool.description.trim().length < 10) {
    errors.push(`${prefix}.description: must be a clear string of at least 10 characters.`);
  } else if (SECRET_LEAK_REGEX.test(tool.description)) {
    errors.push(`${prefix}.description: potential secret literal detected.`);
  }

  const schema = tool.inputSchema;
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    errors.push(`${prefix}.inputSchema: required JSON Schema object is missing.`);
    return { errors, warnings };
  }

  if (schema.type !== 'object') {
    errors.push(`${prefix}.inputSchema.type: must be "object" per MCP tool specification.`);
  }

  if (schema.additionalProperties === undefined) {
    const msg = `${prefix}.inputSchema.additionalProperties: explicitly set false to block unexpected fields.`;
    if (strict) errors.push(msg);
    else warnings.push(msg);
  }

  const props = schema.properties && typeof schema.properties === 'object' ? schema.properties : {};
  if (schema.properties !== undefined && (typeof schema.properties !== 'object' || Array.isArray(schema.properties))) {
    errors.push(`${prefix}.inputSchema.properties: must be an object.`);
  } else {
    for (const [propName, propDef] of Object.entries(props)) {
      validatePropertySchema(propName, propDef, `${prefix}.inputSchema.properties`, errors, warnings, strict);
    }
  }

  if (schema.required !== undefined) {
    if (!Array.isArray(schema.required)) {
      errors.push(`${prefix}.inputSchema.required: must be an array of strings.`);
    } else {
      for (const reqField of schema.required) {
        if (typeof reqField !== 'string' || !(reqField in props)) {
          errors.push(`${prefix}.inputSchema.required: "${String(reqField)}" is not declared in properties.`);
        }
      }
    }
  }

  return { errors, warnings };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node validate-mcp-schema.mjs <schema.json> [--strict]');
    process.exit(args.length === 0 ? 1 : 0);
  }

  const target = args.find((a) => !a.startsWith('--'));
  const strict = args.includes('--strict');
  if (!target) {
    console.error('Error: missing <schema.json> argument.');
    process.exit(1);
  }

  const resolved = path.resolve(target);
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${target}`);
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  } catch (err) {
    console.error(`Invalid JSON in ${target}: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  let tools;
  if (Array.isArray(parsed)) {
    tools = parsed;
  } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.tools)) {
    tools = parsed.tools;
  } else if (parsed && typeof parsed === 'object' && typeof parsed.name === 'string') {
    tools = [parsed];
  } else {
    console.error('Expected a tool object, an array of tools, or { "tools": [...] }.');
    process.exit(1);
  }

  if (tools.length === 0) {
    console.error('No MCP tools found in schema file.');
    process.exit(1);
  }

  let errorCount = 0;
  let warningCount = 0;
  const seenNames = new Set();

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    if (tool && typeof tool.name === 'string') {
      if (seenNames.has(tool.name)) {
        console.error(`ERROR tools[${i}].name: duplicate tool name "${tool.name}".`);
        errorCount++;
      }
      seenNames.add(tool.name);
    }

    const { errors, warnings } = validateTool(tool, i, strict);
    for (const w of warnings) {
      console.warn(`WARN  ${w}`);
      warningCount++;
    }
    for (const e of errors) {
      console.error(`ERROR ${e}`);
      errorCount++;
    }
  }

  if (errorCount > 0) {
    console.error(`\nMCP schema validation failed: ${errorCount} error(s), ${warningCount} warning(s).`);
    process.exit(1);
  }
  console.log(`PASS: Validated ${tools.length} MCP tool schema(s) (${warningCount} warning(s)).`);
}

main();
