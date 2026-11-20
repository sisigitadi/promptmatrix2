import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const slugs = [
  'prompt-matrix-prompt-architect',
  'antislop-ui-and-copy-auditor',
  'fullstack-ts-nextjs-architect',
  'mcp-server-production-builder',
  'seo-geo-aeo-content-engine',
  'multimodal-video-image-director',
  'owasp-api-and-cloud-security-auditor',
  'multi-agent-swarm-and-subagent-orchestrator',
  'postgres-prisma-zero-downtime-sql-tuner',
  'playwright-e2e-and-openapi-contract-suite'
];

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: text };
  const rawFm = match[1];
  const body = match[2];
  const fm = {};
  for (const line of rawFm.split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (kv) {
      let val = kv[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[kv[1]] = val;
    }
  }
  return { frontmatter: fm, body };
}

const records = {};

for (const s of slugs) {
  const p = path.join(ROOT, 'agensi-skills', s, 'SKILL.md');
  const txt = fs.readFileSync(p, 'utf8');
  const { frontmatter, body } = parseFrontmatter(txt);
  records[s] = {
    slug: s,
    name: frontmatter.name || s,
    description: frontmatter.description || '',
    license: frontmatter.license || 'MIT',
    compatibility: frontmatter.compatibility || 'Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and 27 Open Agent Skills runtimes.',
    author: 'Sigit Adi (PromptMatrix)',
    version: '1.0.0',
    rawMarkdown: txt,
    body: body.trim()
  };
}

const outputTs = `// Auto-generated flagship skills data for PromptMatrix Studio editor
import { AgentSkillSpec } from '../services/agentSkillService';
import { SKILL_LISTING_DEMOS } from './skillListingDemos';
import { AGENSI_CONFIG } from '../config/agensiConfig';

export interface FlagshipSkillRecord {
  readonly slug: string;
  readonly name: string;
  readonly title: string;
  readonly category: string;
  readonly priceUsd: number;
  readonly rawMarkdown: string;
  readonly spec: AgentSkillSpec;
  readonly tagline: string;
  readonly tags: readonly string[];
  readonly demoRequest: string;
  readonly demoResult: string;
}

const RAW_FLAGSHIP_RECORDS: Record<string, {
  slug: string;
  name: string;
  description: string;
  license: string;
  compatibility: string;
  author: string;
  version: string;
  rawMarkdown: string;
  body: string;
}> = ${JSON.stringify(records, null, 2)};

export const FLAGSHIP_SKILLS_DATA: Record<string, FlagshipSkillRecord> = (() => {
  const map: Record<string, FlagshipSkillRecord> = {};
  for (const pack of AGENSI_CONFIG.bundledSkillPacks) {
    const raw = RAW_FLAGSHIP_RECORDS[pack.slug];
    const demo = SKILL_LISTING_DEMOS[pack.slug];
    if (raw && demo) {
      const spec: AgentSkillSpec = {
        name: raw.name,
        description: raw.description,
        license: raw.license,
        compatibility: raw.compatibility,
        metadata: {
          author: raw.author,
          version: raw.version,
          source: 'PromptMatrix 2.0',
          category: demo.categoryLabel || pack.matchedCategories[0] || 'General',
          language: 'id',
          framework: pack.title,
        },
        body: raw.body,
        sections: {
          roleAndTrigger: demo.tagline,
          inputParameters: demo.tags.join(', '),
          executionSteps: demo.highlights.join('\\n'),
          verificationChecklist: 'Standard Open Agent Skills Quality Gateway',
        },
      };

      map[pack.slug] = {
        slug: pack.slug,
        name: raw.name,
        title: pack.title,
        category: demo.categoryLabel || pack.matchedCategories[0] || 'General',
        priceUsd: pack.priceUsd,
        rawMarkdown: raw.rawMarkdown,
        spec,
        tagline: demo.tagline,
        tags: demo.tags,
        demoRequest: demo.demoRequest,
        demoResult: demo.demoResult,
      };
    }
  }
  return map;
})();
`;

fs.writeFileSync(path.join(ROOT, 'data', 'flagshipSkillsData.ts'), outputTs, 'utf8');
console.log('Successfully generated data/flagshipSkillsData.ts with', Object.keys(records).length, 'skills');
