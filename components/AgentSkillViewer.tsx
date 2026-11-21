import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RUNNER_INSTALL_GUIDES, RunnerInstallGuide } from '../data/skillListingDemos';
import {
  AgentSkillSpec,
  SKILL_LICENSE_PRESETS,
  SkillLicensePreset,
  SkillValidationResult,
  auditSkillMarketReadiness,
  validateAgentSkillSpec,
} from '../services/agentSkillService';
import {
  buildAgensiListingCopy,
  buildFormulaSkillZipBundle,
  inferAgensiPillar,
  triggerZipDownload,
} from '../services/skillZipService';
import { suggestSkillMetadataWithUniversalAI } from '../services/universalAIService';
import { isAIConfigured } from '../services/aiSettingsService';
import { FLAGSHIP_SKILLS_DATA } from '../data/flagshipSkillsData';
import { translateFrameworkName } from '../services/localizationService';
import {
  generateSkillLogoSvgWithUniversalAI,
  generateAlignedSkillLogoSvg,
  generateMidjourneyLogoPrompt,
} from '../services/skillLogoService';

export interface SkillListingOverrides {
  readonly tagline?: string;
  readonly priceUsd?: number;
  readonly tags?: readonly string[];
  readonly demoRequest?: string;
  readonly demoResult?: string;
}

export interface AgentSkillViewerProps {
  skillSpec: AgentSkillSpec;
  skillMarkdown: string;
  validation: SkillValidationResult;
  onCopy: () => void;
  onDownload?: () => void;
  isCopied: boolean;
  isLightTheme?: boolean;
  formValues?: Record<string, string | number | boolean | string[]>;
  customOtherValues?: Record<string, string>;
  compiledPrompt?: string;
  onZipDownloaded?: (filename: string) => void;
  onCopyListing?: (listingMarkdown: string) => void;
  listingOverrides?: SkillListingOverrides;
  onUpdateDemoFields?: (patch: { demoRequest?: string; demoResult?: string }) => void;
  isExpanded?: boolean;
  onExpand?: () => void;
  onOpenAiSettings?: () => void;
  onAiSuggestToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
  selectedSkillSlug?: string | null;
  onSelectSkillSlug?: (slug: string | null) => void;
  selectedFrameworkName?: string | null;
}

type CreatorStep = 'info' | 'test' | 'sell';
type DemoViewMode = 'edit' | 'preview';

interface ZipFileDescriptor {
  readonly path: string;
  readonly descId: string;
  readonly descEn: string;
}

const ZIP_BUNDLE_FILES: readonly ZipFileDescriptor[] = [
  {
    path: 'SKILL.md',
    descId: 'Instruksi utama agen & metadata YAML agar otomatis terbaca di runtime AI.',
    descEn: 'Core agent instructions and YAML frontmatter auto-discovered by AI runtimes.',
  },
  {
    path: 'references/framework-guide.md',
    descId: 'Panduan struktur parameter & aturan eksekusi tambahan untuk agen.',
    descEn: 'Parameter structure guide and supplementary execution rules for the agent.',
  },
  {
    path: 'templates/sample-input.json',
    descId: 'Data input contoh untuk pengujian cepat (smoke test) sebelum dijual.',
    descEn: 'Sample input payload for quick smoke testing before publishing.',
  },
  {
    path: 'scripts/validate-output.mjs',
    descId: 'Skrip Node.js offline untuk memverifikasi keutuhan output tanpa error.',
    descEn: 'Offline Node.js script to verify output integrity without parse errors.',
  },
];

const ZIP_BUNDLE_FILE_TREE: readonly string[] = ZIP_BUNDLE_FILES.map((item) => item.path);

const renderInlineTokens = (text: string, isLightTheme: boolean): React.ReactNode[] => {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code
          key={idx}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] break-all ${isLightTheme
              ? 'bg-slate-200/80 text-emerald-900'
              : 'bg-slate-800 text-emerald-300'
            }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong
          key={idx}
          className={isLightTheme ? 'font-bold text-slate-900' : 'font-bold text-slate-100'}
        >
          {token.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
};

const renderSafeMarkdownPreview = (markdown: string, isLightTheme: boolean): React.ReactNode => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const langLabel = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      elements.push(
        <div
          key={`code-${i}`}
          className={`rounded-xl border overflow-hidden my-2 ${isLightTheme
              ? 'bg-slate-900 border-slate-300 text-slate-100'
              : 'bg-[#070b12] border-slate-800 text-slate-200'
            }`}
        >
          {langLabel && (
            <div className="px-3 py-1 border-b border-slate-800 text-[10px] font-mono uppercase text-emerald-400 bg-slate-950">
              {langLabel}
            </div>
          )}
          <pre className="p-3 text-[11px] font-mono overflow-x-auto leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    if (
      trimmed.startsWith('|') &&
      i + 1 < lines.length &&
      /^\|[\s:|-]+\|/.test(lines[i + 1].trim())
    ) {
      const parseRow = (rowLine: string): string[] =>
        rowLine
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim());

      const headers = parseRow(lines[i]);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseRow(lines[i]));
        i += 1;
      }
      elements.push(
        <div
          key={`table-${i}`}
          className={`overflow-x-auto rounded-xl border my-2 ${isLightTheme ? 'border-slate-300' : 'border-slate-800'
            }`}
        >
          <table className="w-full text-left border-collapse text-[11px]">
            <thead
              className={
                isLightTheme ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-100'
              }
            >
              <tr>
                {headers.map((head, hIdx) => (
                  <th key={hIdx} className="px-3 py-2 font-semibold border-b border-slate-700/40">
                    {renderInlineTokens(head, isLightTheme)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={
                    isLightTheme
                      ? 'border-t border-slate-200 bg-white'
                      : 'border-t border-slate-800/80 bg-[#090d16]'
                  }
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-3 py-2 align-top break-words ${isLightTheme ? 'text-slate-800' : 'text-slate-300'
                        }`}
                    >
                      {renderInlineTokens(cell, isLightTheme)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4
          key={`h3-${i}`}
          className={`text-xs font-bold pt-2 break-words ${isLightTheme ? 'text-slate-900' : 'text-emerald-300'
            }`}
        >
          {renderInlineTokens(trimmed.slice(4), isLightTheme)}
        </h4>
      );
      i += 1;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3
          key={`h2-${i}`}
          className={`text-sm font-bold pt-2.5 pb-1 border-b break-words ${isLightTheme
              ? 'text-slate-900 border-slate-200'
              : 'text-slate-100 border-slate-800'
            }`}
        >
          {renderInlineTokens(trimmed.slice(3), isLightTheme)}
        </h3>
      );
      i += 1;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2
          key={`h1-${i}`}
          className={`text-base font-bold break-words ${isLightTheme ? 'text-slate-900' : 'text-slate-100'
            }`}
        >
          {renderInlineTokens(trimmed.slice(2), isLightTheme)}
        </h2>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(lines[i].trim().slice(2));
        i += 1;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 text-xs leading-relaxed my-1.5">
          {listItems.map((item, liIdx) => (
            <li key={liIdx} className={`break-words ${isLightTheme ? 'text-slate-800' : 'text-slate-300'}`}>
              {renderInlineTokens(item, isLightTheme)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1 text-xs leading-relaxed my-1.5">
          {listItems.map((item, liIdx) => (
            <li key={liIdx} className={`break-words ${isLightTheme ? 'text-slate-800' : 'text-slate-300'}`}>
              {renderInlineTokens(item, isLightTheme)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    elements.push(
      <p
        key={`p-${i}`}
        className={`text-xs leading-relaxed break-words [overflow-wrap:anywhere] ${isLightTheme ? 'text-slate-800' : 'text-slate-300'
          }`}
      >
        {renderInlineTokens(trimmed, isLightTheme)}
      </p>
    );
    i += 1;
  }

  return <div className="space-y-2 min-w-0">{elements}</div>;
};

export const AgentSkillViewer: React.FC<AgentSkillViewerProps> = ({
  skillSpec,
  skillMarkdown,
  validation,
  onCopy,
  isCopied,
  isLightTheme = false,
  formValues = {},
  customOtherValues = {},
  compiledPrompt = '',
  onZipDownloaded,
  onCopyListing,
  listingOverrides,
  onUpdateDemoFields,
  isExpanded = false,
  onExpand,
  onOpenAiSettings,
  onAiSuggestToast,
  selectedSkillSlug,
  onSelectSkillSlug,
  selectedFrameworkName,
}) => {
  const { t, language } = useLanguage();
  const isId = language === 'id';

  const [activeStep, setActiveStep] = useState<CreatorStep>('info');
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(true);
  const [demoViewMode, setDemoViewMode] = useState<DemoViewMode>('edit');
  const [selectedRunnerId, setSelectedRunnerId] = useState<string>(
    RUNNER_INSTALL_GUIDES[0]?.id ?? 'antigravity'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [aiSuggestingField, setAiSuggestingField] = useState<string | null>(null);
  const [marketFormatTab, setMarketFormatTab] = useState<'universal' | 'promptbase' | 'storefront' | 'oss' | 'jsonld'>('universal');

  // Active skill source resolution: current formula, one of 10 flagships, or custom draft
  const activeSourceSlug = selectedSkillSlug || 'current_formula';
  const flagshipPacks = useMemo(() => Object.values(FLAGSHIP_SKILLS_DATA), []);

  const baseRecord = useMemo(() => {
    if (activeSourceSlug && activeSourceSlug !== 'current_formula' && activeSourceSlug !== 'custom_new' && FLAGSHIP_SKILLS_DATA[activeSourceSlug]) {
      const f = FLAGSHIP_SKILLS_DATA[activeSourceSlug];
      const localizedTitle = isId && f.titleId ? f.titleId : f.title;
      const localizedTagline = isId && f.taglineId ? f.taglineId : f.tagline;
      const localizedDemoReq = isId && f.demoRequestId ? f.demoRequestId : f.demoRequest;
      const localizedDemoRes = isId && f.demoResultId ? f.demoResultId : f.demoResult;
      const localizedCategory = isId && f.categoryId ? f.categoryId : f.category;
      return {
        name: f.name,
        title: localizedTitle,
        category: localizedCategory,
        priceUsd: f.priceUsd,
        tagline: localizedTagline,
        tags: f.tags,
        demoRequest: localizedDemoReq,
        demoResult: localizedDemoRes,
        rawMarkdown: f.rawMarkdown,
        author: f.spec.metadata.author,
        version: f.spec.metadata.version,
        license: f.spec.license,
        compatibility: f.spec.compatibility,
        description: isId && f.taglineId ? `${f.taglineId} Gunakan skill ini saat memerlukan alur kerja terstruktur.` : f.spec.description,
        body: f.spec.body,
        spec: f.spec,
        pillar: f.pillar,
      };
    }

    if (activeSourceSlug === 'custom_new') {
      const defaultDesc = isId
        ? 'Mengeksekusi workflow domain kustom, kontrak tugas deterministik, dan prompt operasional. Aktifkan saat diminta pengguna atau pipeline otomatis.'
        : 'Executes custom domain workflows, deterministic task contracts, and operational prompts. Activate when prompted by user request or automated pipeline.';

      const defaultBody = [
        '# Custom Agent Skill',
        '',
        isId
          ? 'Ubah alur kerja domain khusus menjadi spesifikasi prompt dan kontrak agen yang deterministik dan dapat diuji.'
          : 'Turn custom domain workflows into deterministic, testable prompt specifications and agent contracts.',
        '',
        '## When to Activate',
        '',
        isId
          ? '- Mengonversi instruksi ambigu menjadi alur kerja agen yang terstruktur.\n- Menjalankan tugas operasional multi-langkah dengan verifikasi ketat.'
          : '- Converting ambiguous instructions into structured agent workflows.\n- Executing multi-step operational tasks with explicit verification checks.',
        '',
        '## Step 1: Execution Instructions',
        '',
        isId
          ? 'Kumpulkan konteks masukan dan terapkan aturan batasan bernomor sebelum menyusun hasil akhir.'
          : 'Assemble task context and apply numbered hard constraints before generating final output.',
        '',
        '## Verification Checklist',
        '',
        isId
          ? '- [ ] Masukan diisolasi dari input yang tidak tepercaya.\n- [ ] Keluaran sesuai skema yang diminta tanpa kesalahan parse.'
          : '- [ ] Input payload is isolated from untrusted input.\n- [ ] Output conforms to required schema with zero parse errors.',
      ].join('\n');

      const customSpec: AgentSkillSpec = {
        name: 'custom-agent-skill',
        description: defaultDesc,
        license: 'MIT',
        compatibility: 'Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes',
        metadata: {
          author: 'Sigit Adi (PromptMatrix)',
          version: '1.0.0',
          source: 'PromptMatrix 2.0 Studio',
          category: 'General',
          language,
          framework: 'Custom Agent Skill',
        },
        body: defaultBody,
        sections: {
          roleAndTrigger: defaultDesc,
          inputParameters: 'custom-parameters',
          executionSteps: isId ? '1. Parse input\n2. Eksekusi alur\n3. Verifikasi checklist' : '1. Parse input\n2. Execute workflow\n3. Verify checklist',
          verificationChecklist: 'Standard Open Agent Skills Quality Gateway',
        },
      };

      return {
        name: 'custom-agent-skill',
        title: 'Custom Agent Skill',
        category: 'General',
        priceUsd: 9.99,
        tagline: isId
          ? 'Agent skill otonom untuk alur kerja kustom dan eksekusi tugas deterministik.'
          : 'Autonomous agent skill for custom domain workflows and deterministic execution.',
        tags: ['agent-skill', 'workflow', 'automation', 'productivity'] as readonly string[],
        demoRequest: isId
          ? 'Jalankan alur kerja kustom untuk spesifikasi proyek saya.'
          : 'Execute custom agent workflow for my project specifications.',
        demoResult: isId
          ? '## Summary\nBerhasil mengeksekusi alur kerja kustom tanpa kesalahan parse.\n\n### Hasil Pekerjaan\n- Seluruh checklist verifikasi terpenuhi dengan baik.\n\n## Next Steps\nJalankan smoke test pada runner agen.'
          : '## Summary\nExecuted custom workflow cleanly with zero parse errors.\n\n### Deliverables\n- Verification checklist verified.\n\n## Next Steps\nRun smoke test on agent runner.',
        rawMarkdown: defaultBody,
        author: 'Sigit Adi (PromptMatrix)',
        version: '1.0.0',
        license: 'MIT',
        compatibility: 'Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes',
        description: defaultDesc,
        body: defaultBody,
        spec: customSpec,
      };
    }

    // Default: active studio formula
    const rawFwName = selectedFrameworkName || skillSpec.metadata.framework || skillSpec.name;
    const localizedFwTitle = isId ? translateFrameworkName(rawFwName, 'id') : translateFrameworkName(rawFwName, 'en');
    return {
      name: skillSpec.name,
      title: localizedFwTitle || rawFwName,
      category: skillSpec.metadata.category || (isId ? 'Umum' : 'General'),
      priceUsd: listingOverrides?.priceUsd,
      tagline: listingOverrides?.tagline,
      tags: listingOverrides?.tags,
      demoRequest: listingOverrides?.demoRequest,
      demoResult: listingOverrides?.demoResult,
      rawMarkdown: skillMarkdown,
      author: skillSpec.metadata.author,
      version: skillSpec.metadata.version,
      license: skillSpec.license,
      compatibility: skillSpec.compatibility,
      description: skillSpec.description,
      body: skillSpec.body,
      spec: skillSpec,
    };
  }, [activeSourceSlug, skillSpec, skillMarkdown, listingOverrides, language, isId]);

  // Local editable draft overrides (null means "use auto-compiled base default")
  const [editedSkillName, setEditedSkillName] = useState<string | null>(null);
  const [editedCategory, setEditedCategory] = useState<string | null>(null);
  const [editedAuthor, setEditedAuthor] = useState<string | null>(null);
  const [editedVersion, setEditedVersion] = useState<string | null>(null);
  const [editedLicense, setEditedLicense] = useState<string | null>(null);
  const [editedTriggerDesc, setEditedTriggerDesc] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string | null>(null);
  const [editedTagline, setEditedTagline] = useState<string | null>(null);
  const [editedPriceStr, setEditedPriceStr] = useState<string | null>(null);
  const [editedTagsStr, setEditedTagsStr] = useState<string | null>(null);
  const [editedDescMd, setEditedDescMd] = useState<string | null>(null);
  const [editedDemoRequest, setEditedDemoRequest] = useState<string | null>(null);
  const [editedDemoResult, setEditedDemoResult] = useState<string | null>(null);
  const [aiUpdateRecord, setAiUpdateRecord] = useState<{
    timestamp: number;
    field: string;
    previousScore: number;
    newScore: number;
    resolvedChecks: string[];
    updatedFields: string[];
    totalChecksCount: number;
    passedChecksCount: number;
  } | null>(null);

  const [skillLogoSvg, setSkillLogoSvg] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);

  const prevReqRef = useRef<string | undefined>(listingOverrides?.demoRequest);
  const prevResRef = useRef<string | undefined>(listingOverrides?.demoResult);

  const draftStorageKey = `pm_skill_draft_${activeSourceSlug}`;

  // Sync draft from localStorage when switching skills or when base formula changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const f = FLAGSHIP_SKILLS_DATA[activeSourceSlug];
          setEditedSkillName(parsed.name ?? null);
          setEditedCategory(parsed.category ?? null);
          setEditedAuthor(parsed.author ?? null);
          setEditedVersion(parsed.version ?? null);
          setEditedLicense(parsed.license ?? null);
          setEditedTriggerDesc(parsed.triggerDesc ?? null);
          const rawTitle = parsed.title;
          const isStaleEnglishTitle = isId && f && f.titleId && rawTitle === f.title;
          const sanitizedTitle =
            rawTitle &&
              rawTitle !== 'Universal Agent Skill & Market Kit' &&
              rawTitle !== t('skill_universal_kit_title') &&
              !isStaleEnglishTitle
              ? rawTitle
              : null;
          setEditedTitle(sanitizedTitle);
          const rawTagline = parsed.tagline;
          const isStaleEnglishTagline = isId && f && f.taglineId && rawTagline === f.tagline;
          setEditedTagline(!isStaleEnglishTagline ? (rawTagline ?? null) : null);
          setEditedPriceStr(parsed.priceStr ?? null);
          setEditedTagsStr(parsed.tagsStr ?? null);
          const rawDescMd = parsed.descMd;
          const sanitizedDescMd =
            rawDescMd &&
              typeof rawDescMd === 'string' &&
              !rawDescMd.trim().startsWith('---') &&
              !rawDescMd.trim().startsWith('# ')
              ? rawDescMd
              : null;
          setEditedDescMd(sanitizedDescMd);
          const rawDemoReq = parsed.demoRequest;
          const isStaleEnglishReq = isId && f && f.demoRequestId && rawDemoReq === f.demoRequest;
          setEditedDemoRequest(!isStaleEnglishReq ? (rawDemoReq ?? null) : null);
          const rawDemoRes = parsed.demoResult;
          const isStaleEnglishRes = isId && f && f.demoResultId && rawDemoRes === f.demoResult;
          setEditedDemoResult(!isStaleEnglishRes ? (rawDemoRes ?? null) : null);
          if (parsed.logoSvg && typeof parsed.logoSvg === 'string' && parsed.logoSvg.trim().startsWith('<svg')) {
            setSkillLogoSvg(parsed.logoSvg.trim());
          } else {
            setSkillLogoSvg(null);
          }
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse skill draft:', e);
    }

    setEditedSkillName(null);
    setEditedCategory(null);
    setEditedAuthor(null);
    setEditedVersion(null);
    setEditedLicense(null);
    setEditedTriggerDesc(null);
    setEditedTitle(null);
    setEditedTagline(null);
    setEditedPriceStr(null);
    setEditedTagsStr(null);
    setEditedDescMd(null);
    setEditedDemoRequest(null);
    setEditedDemoResult(null);
    setAiUpdateRecord(null);
    setSkillLogoSvg(null);
  }, [activeSourceSlug, skillSpec.name, draftStorageKey]);

  useEffect(() => {
    if (listingOverrides?.demoRequest !== prevReqRef.current) {
      prevReqRef.current = listingOverrides?.demoRequest;
      setEditedDemoRequest(
        listingOverrides?.demoRequest !== undefined ? listingOverrides.demoRequest : null
      );
    }
  }, [listingOverrides?.demoRequest]);

  useEffect(() => {
    if (listingOverrides?.demoResult !== prevResRef.current) {
      prevResRef.current = listingOverrides?.demoResult;
      setEditedDemoResult(
        listingOverrides?.demoResult !== undefined ? listingOverrides.demoResult : null
      );
    }
  }, [listingOverrides?.demoResult]);

  const effectiveName = useMemo(() => {
    const raw = (editedSkillName ?? baseRecord.name).trim().toLowerCase();
    return raw.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'agent-skill';
  }, [editedSkillName, baseRecord.name]);

  const effectiveTitle = editedTitle ?? baseRecord.title;
  const effectiveCategory = editedCategory ?? baseRecord.category;
  const effectiveAuthor = editedAuthor ?? baseRecord.author;
  const effectiveVersion = editedVersion ?? baseRecord.version;
  const effectiveLicense = editedLicense ?? baseRecord.license;
  const effectiveTriggerDesc = editedTriggerDesc ?? baseRecord.description;
  const effectiveBody = baseRecord.body;

  const activeSpec: AgentSkillSpec = useMemo(() => {
    return {
      ...baseRecord.spec,
      name: effectiveName,
      description: effectiveTriggerDesc,
      license: effectiveLicense,
      metadata: {
        ...baseRecord.spec.metadata,
        author: effectiveAuthor,
        version: effectiveVersion,
        category: effectiveCategory,
        framework: effectiveTitle || effectiveName,
      },
      body: effectiveBody,
    };
  }, [baseRecord.spec, effectiveName, effectiveTriggerDesc, effectiveLicense, effectiveAuthor, effectiveVersion, effectiveCategory, effectiveTitle, effectiveBody]);

  const activeSkillMarkdown: string = useMemo(() => {
    const cleanDesc = effectiveTriggerDesc.replace(/\r?\n/g, ' ').replace(/"/g, '\\"');
    return [
      '---',
      `name: ${effectiveName}`,
      `description: "${cleanDesc}"`,
      `license: ${effectiveLicense}`,
      `compatibility: ${activeSpec.compatibility}`,
      'metadata:',
      `  author: "${effectiveAuthor}"`,
      `  version: "${effectiveVersion}"`,
      `  category: "${effectiveCategory}"`,
      '---',
      '',
      effectiveBody.trim(),
      '',
    ].join('\n');
  }, [effectiveName, effectiveTriggerDesc, effectiveLicense, activeSpec.compatibility, effectiveAuthor, effectiveVersion, effectiveCategory, effectiveBody]);

  const activeValidation: SkillValidationResult = useMemo(() => {
    return validateAgentSkillSpec(activeSpec);
  }, [activeSpec]);

  const nameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const isNameValid = effectiveName.length >= 3 && effectiveName.length <= 64 && nameRegex.test(effectiveName);

  const matchedPreset: SkillLicensePreset | undefined = useMemo(() => {
    const raw = effectiveLicense.trim().toLowerCase();
    return SKILL_LICENSE_PRESETS.find(
      (p) => p.id.toLowerCase() === raw || p.name.toLowerCase() === raw
    );
  }, [effectiveLicense]);

  const listingCopy = useMemo(
    () =>
      buildAgensiListingCopy({
        slug: effectiveName,
        title: effectiveTitle,
        description: effectiveTriggerDesc,
        category: effectiveCategory,
        pillar: baseRecord.pillar,
        priceUsd: baseRecord.priceUsd,
        includedFiles: ZIP_BUNDLE_FILE_TREE,
        language,
        tagline: baseRecord.tagline,
        tags: baseRecord.tags,
        demoRequest: baseRecord.demoRequest,
        demoResult: baseRecord.demoResult,
        compiledPrompt: activeSourceSlug === 'current_formula' ? compiledPrompt : undefined,
        formValues: activeSourceSlug === 'current_formula' ? formValues : undefined,
      }),
    [effectiveName, effectiveTitle, effectiveTriggerDesc, effectiveCategory, baseRecord, language, activeSourceSlug, compiledPrompt, formValues]
  );

  const activeTitle = editedTitle ?? listingCopy.title;
  const activeTagline = editedTagline ?? listingCopy.tagline;
  const activePriceStr = editedPriceStr ?? (baseRecord.priceUsd !== undefined ? baseRecord.priceUsd.toFixed(2) : listingCopy.recommendedPriceUsd.toFixed(2));
  const activeTagsStr = editedTagsStr ?? (baseRecord.tags ? baseRecord.tags.join(', ') : listingCopy.tags.join(', '));
  const activeDescMd = editedDescMd ?? listingCopy.descriptionMarkdown;
  const activeDemoRequest = editedDemoRequest ?? (baseRecord.demoRequest || listingCopy.demoRequest);
  const activeDemoResult = editedDemoResult ?? (baseRecord.demoResult || listingCopy.demoResult);

  const activeTagsList = useMemo(() => {
    return activeTagsStr
      .split(',')
      .map((item) => item.trim().toLowerCase().replace(/^#+/, '').replace(/[^a-z0-9-]+/g, '-'))
      .filter((item) => item.length > 0);
  }, [activeTagsStr]);

  const demoResultChars = activeDemoResult.trim().length;
  const demoResultHasSummary = /^##\s+(?:Summary|Ringkasan)\b/im.test(activeDemoResult);
  const demoResultReady = demoResultChars >= 700 && demoResultHasSummary;

  const currentRunner: RunnerInstallGuide = useMemo(
    () =>
      RUNNER_INSTALL_GUIDES.find((r) => r.id === selectedRunnerId) ?? RUNNER_INSTALL_GUIDES[0],
    [selectedRunnerId]
  );

  const effectiveLogoSvg = useMemo(() => {
    if (skillLogoSvg && skillLogoSvg.trim().startsWith('<svg')) {
      return skillLogoSvg.trim();
    }
    return generateAlignedSkillLogoSvg({
      slug: activeSourceSlug,
      name: effectiveName,
      title: activeTitle,
      category: effectiveCategory,
      pillar: inferAgensiPillar(effectiveCategory, activeTagsList, activeSourceSlug),
    });
  }, [skillLogoSvg, activeSourceSlug, effectiveName, activeTitle, effectiveCategory, activeTagsList]);

  const auditResult = useMemo(
    () =>
      auditSkillMarketReadiness(activeSpec, {
        tagline: activeTagline,
        tags: activeTagsList,
        demoRequest: activeDemoRequest,
        demoResult: activeDemoResult,
      }),
    [activeSpec, activeTagline, activeTagsList, activeDemoRequest, activeDemoResult]
  );

  const handleSaveDraft = () => {
    try {
      const draftPayload = {
        name: effectiveName,
        category: effectiveCategory,
        author: effectiveAuthor,
        version: effectiveVersion,
        license: effectiveLicense,
        triggerDesc: effectiveTriggerDesc,
        title: activeTitle,
        tagline: activeTagline,
        priceStr: activePriceStr,
        tagsStr: activeTagsStr,
        descMd: activeDescMd,
        demoRequest: activeDemoRequest,
        demoResult: activeDemoResult,
        logoSvg: skillLogoSvg,
        savedAt: Date.now(),
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(draftPayload));
      onAiSuggestToast?.(t('toast_skill_draft_saved'), 'success');
    } catch (e) {
      console.error('Failed to save skill draft:', e);
    }
  };

  const handleResetDraft = () => {
    try {
      localStorage.removeItem(draftStorageKey);
      setEditedSkillName(null);
      setEditedCategory(null);
      setEditedAuthor(null);
      setEditedVersion(null);
      setEditedLicense(null);
      setEditedTriggerDesc(null);
      setEditedTitle(null);
      setEditedTagline(null);
      setEditedPriceStr(null);
      setEditedTagsStr(null);
      setEditedDescMd(null);
      setEditedDemoRequest(null);
      setEditedDemoResult(null);
      setAiUpdateRecord(null);
      setSkillLogoSvg(null);
      onAiSuggestToast?.(t('toast_skill_draft_reset'), 'info');
    } catch (e) {
      console.error('Failed to reset skill draft:', e);
    }
  };

  const failedAuditChecks = useMemo(
    () => auditResult.checks.filter((check) => !check.passed),
    [auditResult.checks]
  );

  const fullListingKitMarkdown = useMemo(
    () =>
      [
        `# ${activeTitle}`,
        `**Tagline:** ${activeTagline}`,
        `**Price:** $${activePriceStr}`,
        `**Tags:** ${activeTagsStr}`,
        '',
        '## Product Description',
        activeDescMd,
        '',
        '## See It in Action (Demo)',
        '',
        '### The Request (What the buyer types)',
        '```text',
        activeDemoRequest,
        '```',
        '',
        '### The Result (What your agent delivers)',
        activeDemoResult,
      ].join('\n'),
    [activeTitle, activeTagline, activePriceStr, activeTagsStr, activeDescMd, activeDemoRequest, activeDemoResult]
  );

  const handleCopyField = async (key: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  const handleDownloadZip = () => {
    const bundle = buildFormulaSkillZipBundle({
      skillSpec: activeSpec,
      skillMarkdown: activeSkillMarkdown,
      formValues,
      customOtherValues,
      compiledPrompt,
      logoSvg: effectiveLogoSvg,
    });
    triggerZipDownload(bundle.filename, bundle.archiveBytes);
    onZipDownloaded?.(bundle.filename);
  };

  const handleGenerateSkillLogo = async () => {
    if (!isAIConfigured()) {
      onAiSuggestToast?.(t('toast_need_ai_setup'), 'info');
      onOpenAiSettings?.();
      return;
    }

    setIsGeneratingLogo(true);
    try {
      const svg = await generateSkillLogoSvgWithUniversalAI({
        slug: effectiveName,
        name: effectiveName,
        title: activeTitle,
        category: effectiveCategory,
        pillar: inferAgensiPillar(effectiveCategory, activeTagsList, effectiveName),
        description: activeDescMd,
        language,
      });

      setSkillLogoSvg(svg);
      onAiSuggestToast?.(t('toast_skill_logo_generated'), 'success');

      setAiUpdateRecord((prev) => ({
        timestamp: Date.now(),
        field: 'logo',
        previousScore: prev?.newScore ?? auditResult.score,
        newScore: prev?.newScore ?? auditResult.score,
        resolvedChecks: prev?.resolvedChecks ?? [],
        updatedFields: Array.from(
          new Set([...(prev?.updatedFields ?? []), isId ? 'Logo Vektor SVG' : 'Vector SVG Logo'])
        ),
        totalChecksCount: prev?.totalChecksCount ?? auditResult.totalCount,
        passedChecksCount: prev?.passedChecksCount ?? auditResult.passedCount,
      }));
    } catch (err) {
      console.error('Failed to generate skill logo:', err);
      onAiSuggestToast?.(t('toast_skill_ai_error'), 'error');
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleDownloadLogoSvg = () => {
    try {
      const blob = new Blob([effectiveLogoSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${effectiveName}-icon.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download SVG:', e);
    }
  };

  const handleCopyLogoSvg = async () => {
    await handleCopyField('logo_svg', effectiveLogoSvg);
    onAiSuggestToast?.(t('toast_skill_logo_copied'), 'success');
  };

  const handleCopyMidjourneyPrompt = async () => {
    const prompt = generateMidjourneyLogoPrompt({
      name: effectiveName,
      title: activeTitle,
      category: effectiveCategory,
      pillar: inferAgensiPillar(effectiveCategory, activeTagsList, effectiveName),
    });
    await handleCopyField('logo_mj', prompt);
    onAiSuggestToast?.(t('toast_skill_logo_mj_copied'), 'success');
  };

  const handleCopyFullListingKit = () => {
    if (onCopyListing) {
      onCopyListing(fullListingKitMarkdown);
      setCopiedKey('all_listing');
      setTimeout(() => setCopiedKey((prev) => (prev === 'all_listing' ? null : prev)), 2000);
    } else {
      void handleCopyField('all_listing', fullListingKitMarkdown);
    }
  };

  const handleAiSuggestSkill = async (
    field: 'all' | 'name' | 'title' | 'tagline' | 'tags' | 'description' | 'demoRequest' | 'demoResult'
  ) => {
    if (!isAIConfigured()) {
      onAiSuggestToast?.(t('toast_need_ai_setup'), 'info');
      onOpenAiSettings?.();
      return;
    }

    const prevScore = auditResult.score;
    const prevFailedChecks = auditResult.checks.filter((c) => !c.passed);
    const prevFailedIds = new Set(prevFailedChecks.map((c) => c.id));

    setAiSuggestingField(field);
    try {
      const res = await suggestSkillMetadataWithUniversalAI({
        skillName: effectiveName,
        frameworkName: activeTitle || effectiveName,
        compiledPrompt,
        field,
        existingTitle: activeTitle,
        existingTagline: activeTagline,
        existingDemoRequest: activeDemoRequest,
        language,
      });

      const updatedFieldLabels: string[] = [];

      let nextName = effectiveName;
      let nextTitle = activeTitle;
      let nextTagline = activeTagline;
      let nextTagsList = activeTagsList;
      let nextDescMd = activeDescMd;
      let nextDemoReq = activeDemoRequest;
      let nextDemoRes = activeDemoResult;

      if (field === 'name' && res.name) {
        nextName = res.name.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
        setEditedSkillName(nextName);
        updatedFieldLabels.push(isId ? 'Nama Slug' : 'Slug Name');
      } else if (field === 'title' && res.title) {
        nextTitle = res.title;
        setEditedTitle(nextTitle);
        updatedFieldLabels.push(isId ? 'Judul Listing' : 'Listing Title');
      } else if (field === 'tagline' && res.tagline) {
        nextTagline = res.tagline;
        setEditedTagline(nextTagline);
        updatedFieldLabels.push(isId ? 'Tagline' : 'Tagline');
      } else if (field === 'tags' && res.tags) {
        nextTagsList = res.tags;
        setEditedTagsStr(res.tags.join(', '));
        updatedFieldLabels.push(isId ? 'Tag Kategori' : 'Category Tags');
      } else if (field === 'description' && res.description) {
        nextDescMd = res.description;
        setEditedDescMd(nextDescMd);
        updatedFieldLabels.push(isId ? 'Deskripsi Markdown' : 'Description Markdown');
      } else if (field === 'demoRequest' && res.demoRequest) {
        nextDemoReq = res.demoRequest;
        setEditedDemoRequest(nextDemoReq);
        onUpdateDemoFields?.({ demoRequest: nextDemoReq });
        updatedFieldLabels.push(isId ? 'Demo Permintaan' : 'Demo Request');
      } else if (field === 'demoResult' && res.demoResult) {
        nextDemoRes = res.demoResult;
        setEditedDemoResult(nextDemoRes);
        onUpdateDemoFields?.({ demoResult: nextDemoRes });
        updatedFieldLabels.push(isId ? 'Demo Hasil' : 'Demo Result');
      } else if (field === 'all') {
        if (res.name) {
          nextName = res.name.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
          setEditedSkillName(nextName);
          updatedFieldLabels.push(isId ? 'Nama Slug' : 'Slug Name');
        }
        if (res.title) {
          nextTitle = res.title;
          setEditedTitle(nextTitle);
          updatedFieldLabels.push(isId ? 'Judul Listing' : 'Listing Title');
        }
        if (res.tagline) {
          nextTagline = res.tagline;
          setEditedTagline(nextTagline);
          updatedFieldLabels.push(isId ? 'Tagline' : 'Tagline');
        }
        if (res.tags) {
          nextTagsList = res.tags;
          setEditedTagsStr(res.tags.join(', '));
          updatedFieldLabels.push(isId ? 'Tag Kategori' : 'Category Tags');
        }
        if (res.priceUsd) {
          setEditedPriceStr(String(res.priceUsd));
          updatedFieldLabels.push(isId ? 'Harga' : 'Price');
        }
        if (res.description) {
          nextDescMd = res.description;
          setEditedDescMd(nextDescMd);
          updatedFieldLabels.push(isId ? 'Deskripsi' : 'Description');
        }
        if (res.demoRequest) {
          nextDemoReq = res.demoRequest;
          setEditedDemoRequest(nextDemoReq);
          updatedFieldLabels.push(isId ? 'Demo Permintaan' : 'Demo Request');
        }
        if (res.demoResult) {
          nextDemoRes = res.demoResult;
          setEditedDemoResult(nextDemoRes);
          updatedFieldLabels.push(isId ? 'Demo Hasil' : 'Demo Result');
        }
        onUpdateDemoFields?.({
          demoRequest: res.demoRequest,
          demoResult: res.demoResult,
        });
      }

      // Compute next audit state synchronously
      const nextSpec: AgentSkillSpec = {
        ...activeSpec,
        name: nextName,
        description: nextDescMd.slice(0, 1024),
        metadata: {
          ...activeSpec.metadata,
          framework: nextTitle,
        },
      };

      const nextAudit = auditSkillMarketReadiness(nextSpec, {
        tagline: nextTagline,
        tags: nextTagsList,
        demoRequest: nextDemoReq,
        demoResult: nextDemoRes,
      });

      const nextFailedIds = new Set(nextAudit.checks.filter((c) => !c.passed).map((c) => c.id));
      const resolvedChecks = prevFailedChecks
        .filter((c) => prevFailedIds.has(c.id) && !nextFailedIds.has(c.id))
        .map((c) => c.label);

      setAiUpdateRecord({
        timestamp: Date.now(),
        field,
        previousScore: prevScore,
        newScore: nextAudit.score,
        resolvedChecks,
        updatedFields: updatedFieldLabels,
        totalChecksCount: nextAudit.totalCount,
        passedChecksCount: nextAudit.passedCount,
      });

      const toastMsg =
        nextAudit.score === 100
          ? (isId
            ? 'Sempurna! Pembaruan AI mencapai skor 100/100 (Semua catatan kesiapan selesai).'
            : 'Perfect! AI update reached 100/100 (All readiness notes resolved).')
          : (isId
            ? `Pembaruan AI diterapkan! Skor kesiapan meningkat: ${prevScore}/100 ➔ ${nextAudit.score}/100.`
            : `AI update applied! Readiness score improved: ${prevScore}/100 ➔ ${nextAudit.score}/100.`);

      onAiSuggestToast?.(toastMsg, 'success');
    } catch (err: unknown) {
      console.error('Error suggesting skill metadata with AI:', err);
      onAiSuggestToast?.(t('toast_skill_ai_error'), 'error');
    } finally {
      setAiSuggestingField(null);
    }
  };

  // Theme tokens (WCAG AA >= 4.5:1 for both Light and Dark)
  const surfaceClass = isLightTheme
    ? 'bg-slate-50 border-slate-300 text-slate-900'
    : 'bg-[#090d16] border-slate-800 text-slate-100';
  const cardClass = isLightTheme
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#0f172a] border-slate-800 text-slate-100';
  const insetBoxClass = isLightTheme
    ? 'bg-slate-100 border-slate-200 text-slate-900'
    : 'bg-[#070b12] border-slate-800 text-slate-100';
  const inputClass = isLightTheme
    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-emerald-600'
    : 'bg-[#070b12] border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500';
  const labelTextClass = isLightTheme ? 'text-slate-800' : 'text-slate-200';
  const bodyTextClass = isLightTheme ? 'text-slate-700' : 'text-slate-300';
  const mutedTextClass = isLightTheme ? 'text-slate-600' : 'text-slate-400';
  const accentTextClass = isLightTheme ? 'text-emerald-800' : 'text-emerald-400';
  const secondaryBtnClass = isLightTheme
    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200';
  const dividerClass = isLightTheme ? 'border-slate-200' : 'border-slate-800';
  const focusRingClass =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

  const resolvedWinPath = currentRunner.windowsPath.replace(/<slug>/g, activeSpec.name);
  const resolvedUnixPath = currentRunner.unixPath.replace(/<slug>/g, activeSpec.name);
  const validateCmd = 'node scripts/validate-output.mjs templates/sample-input.json';

  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-4 space-y-4 min-w-0 overflow-hidden transition-colors ${surfaceClass}`}
    >
      {/* Top Status & Controls Bar (Stacked cleanly, zero overlap at any width) */}
      <div className={`space-y-2.5 pb-3 border-b ${dividerClass}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-700/60 bg-slate-900 flex items-center justify-center p-0.5"
                dangerouslySetInnerHTML={{ __html: effectiveLogoSvg }}
                title={effectiveTitle}
              />
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border uppercase ${isLightTheme
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                  }`}
              >
                {t('skill_universal_kit_title')}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${activeValidation.valid
                    ? isLightTheme
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                    : isLightTheme
                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                      : 'bg-rose-500/15 border-rose-500/35 text-rose-300'
                  }`}
              >
                {auditResult.score}/100
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${isLightTheme
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-slate-800/70 border-slate-700 text-slate-300'
                  }`}
              >
                {effectiveCategory}
              </span>
            </div>
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight leading-snug break-words ${isLightTheme ? 'text-slate-900' : 'text-slate-100'
                }`}
            >
              {activeTitle || effectiveTitle || activeSpec.metadata.framework || activeSpec.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className={accentTextClass} title={`${activeSpec.name}.zip`}>
                📦 {activeSpec.name}.zip
              </span>
              <span className={mutedTextClass}>•</span>
              <span className={mutedTextClass}>v{effectiveVersion}</span>
              <span className={mutedTextClass}>•</span>
              <span className={mutedTextClass}>{effectiveLicense}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowQuickGuide((prev) => !prev)}
              aria-expanded={showQuickGuide}
              className={`min-h-[36px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${focusRingClass} ${secondaryBtnClass}`}
            >
              {showQuickGuide
                ? isId
                  ? 'Tutup Panduan'
                  : 'Hide Guide'
                : isId
                  ? 'Cara Pakai'
                  : 'How It Works'}
            </button>

            {!isExpanded && onExpand && (
              <button
                type="button"
                onClick={onExpand}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors flex items-center gap-1 ${focusRingClass} ${secondaryBtnClass}`}
                title={isId ? 'Buka di layar penuh agar lebih lega' : 'Open full-screen editor'}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{isId ? 'Perbesar' : 'Expand'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Plain-Language "How It Works" Quick Guide */}
        {showQuickGuide && (
          <div className={`p-3 rounded-xl border space-y-2 text-xs leading-relaxed ${cardClass}`}>
            <p className={`font-semibold ${labelTextClass}`}>
              {isId
                ? 'Cara Kerja: Formula prompt atau paket skill di studio otomatis dibungkus menjadi produk Agent Skill siap jual (.zip) + Teks Listing Marketplace.'
                : 'How it works: Studio formulas or packaged skills are automatically bundled into sellable Agent Skill packages (.zip) plus ready-to-paste marketplace copy.'}
            </p>
            <ol className={`list-decimal pl-4 space-y-1 text-[11px] ${bodyTextClass}`}>
              <li>
                <strong className={labelTextClass}>
                  {isId ? 'Langkah 1 (Info & Demo):' : 'Step 1 (Info & Demo):'}
                </strong>{' '}
                {isId
                  ? 'Sesuaikan Nama Skill, Judul, Kategori, Harga, Deskripsi, dan Contoh Hasil (Request & Result) agar meyakinkan calon pembeli.'
                  : 'Adjust Skill Name, Title, Category, Price, Description, and a real Request + Result demo so buyers see exact value.'}
              </li>
              <li>
                <strong className={labelTextClass}>
                  {isId ? 'Langkah 2 (ZIP & Tes Lokal):' : 'Step 2 (ZIP & Local Test):'}
                </strong>{' '}
                {isId
                  ? 'Unduh arsip .zip, pasang di aplikasi agen AI Anda (Antigravity, Claude Code, Cursor, dll.), lalu uji coba singkat.'
                  : 'Download the .zip archive, drop it into your AI agent runtime (Antigravity, Claude Code, Cursor, etc.), and run a quick smoke test.'}
              </li>
              <li>
                <strong className={labelTextClass}>
                  {isId ? 'Langkah 3 (Salin & Jual):' : 'Step 3 (Copy & Sell):'}
                </strong>{' '}
                {isId
                  ? 'Unggah file .zip ke platform jualan pilihan Anda (Agensi.io, Gumroad, PromptBase, Lemon Squeezy, Payhip, Whop, atau GitHub) lalu tempel teks listingnya.'
                  : 'Upload the .zip to any marketplace (Agensi.io, Gumroad, PromptBase, Lemon Squeezy, Payhip, Whop, or GitHub) and paste the listing text.'}
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Skill Source Switcher Bar & Local Draft Controls */}
      <div className={`p-3 rounded-2xl border space-y-2.5 min-w-0 ${insetBoxClass}`}>
        {/* Top Header Row: Label + Target Counter Badge & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <label
              htmlFor="studio-skill-source-select"
              className={`text-xs font-bold flex items-center gap-1.5 shrink-0 ${labelTextClass}`}
            >
              <span>🎯</span>
              <span>{t('skill_editor_source_label')}</span>
            </label>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              {1 + flagshipPacks.length + 1} {isId ? 'Target' : 'Targets'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveDraft}
              className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm ${isLightTheme
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60'
                } ${focusRingClass}`}
              title={isId ? 'Simpan draf isian skill ini ke browser lokal' : 'Save this skill draft to local browser storage'}
            >
              <span>💾</span>
              <span>{t('skill_btn_save_draft')}</span>
            </button>

            <button
              type="button"
              onClick={handleResetDraft}
              className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${secondaryBtnClass} ${focusRingClass}`}
              title={isId ? 'Kembalikan isian draf ke nilai awal bawaan' : 'Reset draft fields to default'}
            >
              <span>↺</span>
              <span>{t('skill_btn_reset_draft')}</span>
            </button>
          </div>
        </div>

        {/* Full-Width Select Dropdown with Dedicated Focus Ring & Truncation */}
        <div className="w-full min-w-0 relative">
          <select
            id="studio-skill-source-select"
            value={activeSourceSlug}
            onChange={(e) => {
              const val = e.target.value;
              onSelectSkillSlug?.(val === 'current_formula' ? null : val);
            }}
            className={`w-full min-h-[42px] px-3 py-2 pr-9 rounded-xl border text-xs font-semibold truncate transition-colors appearance-none cursor-pointer ${inputClass} ${focusRingClass}`}
          >
            <option value="current_formula">
              ⚡ {isId ? '[Formula Aktif]' : '[Active Formula]'} {isId && selectedFrameworkName ? translateFrameworkName(selectedFrameworkName, 'id') : (selectedFrameworkName || (baseRecord.title && baseRecord.title !== 'PromptMatrix Custom Skill' ? baseRecord.title : t('skill_editor_formula_option')))}
            </option>
            <optgroup label={t('skill_editor_flagship_group')}>
              {flagshipPacks.map((pack) => {
                const localizedTitle = isId && pack.titleId ? pack.titleId : pack.title;
                return (
                  <option key={pack.slug} value={pack.slug}>
                    📦 {localizedTitle} ({pack.slug})
                  </option>
                );
              })}
            </optgroup>
            <option value="custom_new">
              ✨ {t('skill_editor_custom_option')}
            </option>
          </select>
          {/* Custom Dropdown Chevron Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Active Source Sub-Banner Pill */}
        <div className={`px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center justify-between gap-2 ${activeSourceSlug === 'current_formula'
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : activeSourceSlug === 'custom_new'
              ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300'
          }`}>
          <span className="truncate">
            {activeSourceSlug === 'current_formula'
              ? `⚡ ${isId ? 'Terhubung ke formula aktif Studio:' : 'Synced to active Studio formula:'} ${selectedFrameworkName || 'PromptMatrix'}`
              : activeSourceSlug === 'custom_new'
                ? `✨ ${isId ? 'Mode Draf Kustom Baru (Siap diekspor ke semua pasar)' : 'Custom New Draft Mode (Ready for export)'}`
                : `📦 ${isId ? 'Mengedit Flagship Skill:' : 'Editing Flagship Skill:'} ${flagshipPacks.find((p) => p.slug === activeSourceSlug)?.title || activeSourceSlug}`}
          </span>
          <span className="font-mono text-[10px] shrink-0 opacity-80 font-bold">
            {activeSourceSlug === 'current_formula' ? 'Live Sync' : activeSourceSlug === 'custom_new' ? 'New Pack' : 'Flagship'}
          </span>
        </div>
      </div>

      {/* 3-Step Switcher Navigation (Always fits cleanly without crowding) */}
      <div
        role="tablist"
        aria-label={isId ? 'Langkah pembuatan skill' : 'Skill creation steps'}
        className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${insetBoxClass}`}
      >
        {(
          [
            { id: 'info', num: '1', labelId: 'Info & Demo', labelEn: 'Info & Demo' },
            { id: 'test', num: '2', labelId: 'ZIP & Tes', labelEn: 'ZIP & Test' },
            { id: 'sell', num: '3', labelId: 'Salin & Jual', labelEn: 'Copy & Sell' },
          ] as const
        ).map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStep(step.id)}
              className={`min-h-[42px] px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 text-center leading-tight ${focusRingClass} ${isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : isLightTheme
                    ? 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold inline-flex items-center justify-center shrink-0 ${isActive
                    ? 'bg-white/20 text-white'
                    : isLightTheme
                      ? 'bg-slate-300 text-slate-800'
                      : 'bg-slate-800 text-emerald-400'
                  }`}
              >
                {step.num}
              </span>
              <span className="truncate max-w-full">
                {isId ? step.labelId : step.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Info Produk & Contoh Demo */}
      {activeStep === 'info' && (
        <div className="space-y-3.5 min-w-0">
          {/* Post-AI Update Banner (Shows score delta, resolved checks, updated fields, and readiness status) */}
          {aiUpdateRecord && (
            <div
              className={`p-3.5 rounded-xl border transition-all text-xs space-y-2.5 ${aiUpdateRecord.newScore === 100
                  ? isLightTheme
                    ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : isLightTheme
                    ? 'bg-sky-50/95 border-sky-300 text-sky-950'
                    : 'bg-sky-950/35 border-sky-500/40 text-sky-200'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {t('skill_ai_update_banner_title')}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {new Date(aiUpdateRecord.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAiUpdateRecord(null)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title={t('skill_ai_update_dismiss')}
                  aria-label={t('skill_ai_update_dismiss')}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Score Delta Display */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <span>{t('skill_ai_update_score_delta')}</span>
                  <span className="line-through opacity-70 font-mono">
                    {aiUpdateRecord.previousScore}/100
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ➔ {aiUpdateRecord.newScore}/100
                  </span>
                  {aiUpdateRecord.newScore > aiUpdateRecord.previousScore && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      +{aiUpdateRecord.newScore - aiUpdateRecord.previousScore} poin
                    </span>
                  )}
                </div>
                <span className="text-[11px] opacity-80">
                  ({aiUpdateRecord.passedChecksCount}/{aiUpdateRecord.totalChecksCount}{' '}
                  {isId ? 'cek lolos' : 'checks passed'})
                </span>
              </div>

              {/* Resolved Readiness Notes */}
              {aiUpdateRecord.resolvedChecks.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-current/10">
                  <p className="font-semibold text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {isId
                        ? `${aiUpdateRecord.resolvedChecks.length} Catatan Kesiapan Berhasil Diselesaikan:`
                        : `${aiUpdateRecord.resolvedChecks.length} Readiness Notes Resolved:`}
                    </span>
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {aiUpdateRecord.resolvedChecks.map((item, idx) => (
                      <li key={idx} className="font-medium">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Updated Fields */}
              {aiUpdateRecord.updatedFields.length > 0 && (
                <div className="text-[11px] opacity-90 flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-medium">{t('skill_ai_update_changed_fields')}</span>
                  {aiUpdateRecord.updatedFields.map((f, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {/* Final outcome status */}
              {aiUpdateRecord.newScore === 100 ? (
                <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 pt-0.5">
                  🎉 {t('skill_ai_update_all_passed')}
                </p>
              ) : (
                <p className="text-[10px] opacity-80 pt-0.5">
                  💡 {t('skill_ai_update_partial')}
                </p>
              )}
            </div>
          )}

          {/* Actionable Quality Gate Summary (with 1-Click AI Auto-Fix Button) */}
          {failedAuditChecks.length > 0 && (
            <div
              className={`p-3 rounded-xl border text-[11px] space-y-2 ${isLightTheme
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-amber-950/30 border-amber-500/35 text-amber-200'
                }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>
                    {isId
                      ? `Catatan Kesiapan (${failedAuditChecks.length} saran perbaikan):`
                      : `Readiness Notes (${failedAuditChecks.length} items to polish):`}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => handleAiSuggestSkill('all')}
                  disabled={Boolean(aiSuggestingField)}
                  className={`min-h-[30px] px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 ${focusRingClass}`}
                >
                  <svg
                    className={`w-3 h-3 ${aiSuggestingField === 'all' ? 'animate-spin' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>
                    {aiSuggestingField === 'all'
                      ? t('skill_ai_fixing_notes')
                      : t('skill_ai_fix_readiness_btn')}
                  </span>
                </button>
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                {failedAuditChecks.slice(0, 4).map((item) => (
                  <li key={item.id} className="break-words">
                    <span className="font-semibold">{item.label}:</span> {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Identity & Pricing */}
          <div className={`p-3.5 rounded-xl border space-y-3 min-w-0 ${cardClass}`}>
            {/* One-Click AI Generate Full Profile & Demo Banner */}
            <div className={`p-3 rounded-xl border flex flex-col ${isExpanded ? 'md:flex-row md:items-center' : ''} justify-between gap-2.5 ${isLightTheme
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-emerald-950/25 border-emerald-500/35 text-emerald-200'
              }`}>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{t('skill_ai_suggest_all')}</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isId
                    ? 'Otomatis susun judul, tagline, tag, deskripsi, dan contoh demo realistis dengan AI.'
                    : 'Auto-generate title, tagline, tags, description, and realistic live demo with AI.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAiSuggestSkill('all')}
                disabled={Boolean(aiSuggestingField)}
                className={`min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl font-semibold text-xs bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 ${isExpanded ? 'shrink-0' : 'w-full sm:w-auto'} ${focusRingClass}`}
              >
                <svg className={`w-3.5 h-3.5 ${aiSuggestingField === 'all' ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>
                  {aiSuggestingField === 'all'
                    ? (isId ? 'Menyusun Profil & Demo...' : 'Generating...')
                    : (isId ? 'Generate Semua dengan AI' : 'AI Generate All')}
                </span>
              </button>
            </div>

            {/* SEO & GEO Marketplace Discovery Readiness Indicator */}
            <div className={`p-3 rounded-xl border space-y-2 ${insetBoxClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                  <span>🎯</span>
                  <span>{t('skill_seo_geo_title')}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t('skill_seo_geo_badge')}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${mutedTextClass}`}>
                {t('skill_seo_geo_desc')}
              </p>
              <div className={`grid grid-cols-2 ${isExpanded ? 'sm:grid-cols-4' : ''} gap-1.5 pt-1 text-[10px] font-mono`}>
                <div className={`p-1.5 rounded-lg border text-center ${activeTitle.length >= 10 && activeTitle.length <= 60 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  Judul SEO {activeTitle.length >= 10 && activeTitle.length <= 60 ? '✓' : `(${activeTitle.length}/60)`}
                </div>
                <div className={`p-1.5 rounded-lg border text-center ${activeTagline.length >= 20 && activeTagline.length <= 120 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  Tagline GEO {activeTagline.length >= 20 && activeTagline.length <= 120 ? '✓' : `(${activeTagline.length}/120)`}
                </div>
                <div className={`p-1.5 rounded-lg border text-center ${activeTagsList.length >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  Tags Pasar {activeTagsList.length >= 3 ? '✓' : `(${activeTagsList.length}/4+)`}
                </div>
                <div className={`p-1.5 rounded-lg border text-center ${demoResultReady ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  Demo GEO {demoResultReady ? '✓' : `(${demoResultChars}/700+)`}
                </div>
              </div>
            </div>

            {/* Skill Logo & Visual Emblem Card (1:1 Vector SVG aligned with skill domain & pillar) */}
            <div className={`p-3.5 rounded-xl border space-y-3 ${insetBoxClass}`}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
                {/* SVG Visual Emblem Preview (80x80 px) */}
                <div className="relative group shrink-0">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-slate-700/60 bg-slate-900 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105"
                    dangerouslySetInnerHTML={{ __html: effectiveLogoSvg }}
                  />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30 shadow-sm">
                    128x128
                  </span>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <span>🎨</span>
                        <span>{t('skill_logo_title')}</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        SVG Vector
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateSkillLogo}
                      disabled={isGeneratingLogo}
                      className={`min-h-[32px] px-3 py-1 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 ${focusRingClass}`}
                    >
                      <svg
                        className={`w-3.5 h-3.5 ${isGeneratingLogo ? 'animate-spin' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {isGeneratingLogo
                          ? t('skill_logo_btn_generating')
                          : t('skill_logo_btn_generate')}
                      </span>
                    </button>
                  </div>

                  <p className={`text-[11px] leading-relaxed ${mutedTextClass}`}>
                    {t('skill_logo_desc')}
                  </p>

                  {/* Actions: Download SVG, Copy SVG, Copy Midjourney Prompt */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={handleDownloadLogoSvg}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${focusRingClass} ${secondaryBtnClass}`}
                      title={t('skill_logo_btn_download')}
                    >
                      <span>📥 {t('skill_logo_btn_download')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLogoSvg}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${focusRingClass} ${
                        copiedKey === 'logo_svg'
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : secondaryBtnClass
                      }`}
                      title={t('skill_logo_btn_copy_svg')}
                    >
                      <span>{copiedKey === 'logo_svg' ? `✓ ${t('copied_btn')}` : `📋 ${t('skill_logo_btn_copy_svg')}`}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyMidjourneyPrompt}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${focusRingClass} ${
                        copiedKey === 'logo_mj'
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : secondaryBtnClass
                      }`}
                      title={t('skill_logo_btn_prompt_midjourney')}
                    >
                      <span>{copiedKey === 'logo_mj' ? `✓ ${t('copied_btn')}` : `✨ ${t('skill_logo_btn_prompt_midjourney')}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h4 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass}`}>
              {isId ? 'Profil Produk & Metadata Listing' : 'Product Profile & Listing Metadata'}
            </h4>

            {/* Marketplace Identifier & YAML Spec Fields */}
            <div className="space-y-3 p-3 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-950/10">
              <label className="space-y-1 block min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                      {t('skill_field_name')}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${isNameValid
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      }`}>
                      {isNameValid ? '✓ kebab-case' : 'kebab-case required'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAiSuggestSkill('name')}
                    disabled={Boolean(aiSuggestingField)}
                    className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>✨ {aiSuggestingField === 'name' ? '...' : t('ai_suggest_btn')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={effectiveName}
                  onChange={(e) => setEditedSkillName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="contoh: code-review-architect"
                  maxLength={64}
                  className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${focusRingClass} ${inputClass}`}
                />
                <p className={`text-[10px] ${mutedTextClass}`}>
                  {t('skill_field_name_hint')} ({effectiveName.length}/64)
                </p>
              </label>

              <div className={`grid grid-cols-1 ${isExpanded ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'} gap-2.5`}>
                <label className="space-y-1 block min-w-0">
                  <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                    {t('skill_field_category')}
                  </span>
                  <input
                    type="text"
                    value={effectiveCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                    placeholder="General"
                    className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-medium ${focusRingClass} ${inputClass}`}
                  />
                </label>

                <label className="space-y-1 block min-w-0">
                  <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                    {t('skill_field_author')}
                  </span>
                  <input
                    type="text"
                    value={effectiveAuthor}
                    onChange={(e) => setEditedAuthor(e.target.value)}
                    placeholder="Sigit Adi"
                    className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-medium ${focusRingClass} ${inputClass}`}
                  />
                </label>

                <label className="space-y-1 block min-w-0">
                  <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                    {t('skill_field_version')}
                  </span>
                  <input
                    type="text"
                    value={effectiveVersion}
                    onChange={(e) => setEditedVersion(e.target.value)}
                    placeholder="1.0.0"
                    className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-mono ${focusRingClass} ${inputClass}`}
                  />
                </label>

                <div className="space-y-1 block min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                      {t('skill_field_license')}
                    </span>
                    {matchedPreset && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${matchedPreset.category === 'commercial'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : matchedPreset.category === 'open-source'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : matchedPreset.category === 'hybrid'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          }`}
                      >
                        {matchedPreset.badge}
                      </span>
                    )}
                  </div>
                  <select
                    value={matchedPreset ? matchedPreset.id : 'Custom'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Custom') {
                        if (matchedPreset && matchedPreset.id !== 'Custom') {
                          setEditedLicense('Proprietary Commercial');
                        }
                      } else {
                        setEditedLicense(val);
                      }
                    }}
                    className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${focusRingClass} ${inputClass}`}
                  >
                    {SKILL_LICENSE_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-100">
                        {preset.name}
                      </option>
                    ))}
                  </select>

                  {(!matchedPreset || matchedPreset.id === 'Custom') && (
                    <input
                      type="text"
                      value={effectiveLicense === 'Custom' ? '' : effectiveLicense}
                      onChange={(e) => setEditedLicense(e.target.value)}
                      placeholder={isId ? 'Contoh: Proprietary Commercial, Custom EULA v1.0, BSD-3-Clause' : 'e.g. Proprietary Commercial, Custom EULA v1.0, BSD-3-Clause'}
                      className={`w-full min-h-[38px] mt-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono ${focusRingClass} ${inputClass}`}
                    />
                  )}

                  {matchedPreset && (
                    <p className={`text-[10px] leading-tight mt-1 ${mutedTextClass}`}>
                      {isId ? matchedPreset.descriptionId : matchedPreset.descriptionEn}
                    </p>
                  )}
                </div>
              </div>

              <label className="space-y-1 block min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                    {t('skill_field_trigger_desc')}
                  </span>
                  <span className={`text-[10px] font-mono ${effectiveTriggerDesc.length <= 1024 ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                    {effectiveTriggerDesc.length}/1024
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={effectiveTriggerDesc}
                  onChange={(e) => setEditedTriggerDesc(e.target.value)}
                  placeholder={isId ? 'Jelaskan peran skill dan kapan agen AI harus mengaktifkannya...' : 'Describe skill role and when the AI agent should activate it...'}
                  maxLength={1024}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono leading-relaxed resize-y ${focusRingClass} ${inputClass}`}
                />
              </label>
            </div>

            <div className={isExpanded ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
              <label className="space-y-1 block min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                    {t('skill_field_title')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAiSuggestSkill('title')}
                    disabled={Boolean(aiSuggestingField)}
                    className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>✨ {aiSuggestingField === 'title' ? '...' : t('skill_ai_suggest_title')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={activeTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-medium ${focusRingClass} ${inputClass}`}
                />
              </label>

              <label className="space-y-1 block min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                    {t('skill_field_tagline')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAiSuggestSkill('tagline')}
                    disabled={Boolean(aiSuggestingField)}
                    className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>✨ {aiSuggestingField === 'tagline' ? '...' : t('skill_ai_suggest_tagline')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={activeTagline}
                  onChange={(e) => setEditedTagline(e.target.value)}
                  placeholder={
                    isId
                      ? '1 kalimat manfaat utama bagi pembeli'
                      : 'One clear sentence stating the buyer outcome'
                  }
                  className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-medium ${focusRingClass} ${inputClass}`}
                />
              </label>

              <label className="space-y-1 block min-w-0">
                <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                  {t('skill_field_price')}
                </span>
                <div className="relative">
                  <span
                    className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono ${mutedTextClass}`}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={activePriceStr}
                    onChange={(e) => setEditedPriceStr(e.target.value)}
                    className={`w-full min-h-[42px] pl-7 pr-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${focusRingClass} ${inputClass}`}
                  />
                </div>
              </label>

              <label className="space-y-1 block min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-semibold block ${labelTextClass}`}>
                    {t('skill_field_tags')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAiSuggestSkill('tags')}
                    disabled={Boolean(aiSuggestingField)}
                    className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>✨ {aiSuggestingField === 'tags' ? '...' : t('skill_ai_suggest_tags')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={activeTagsStr}
                  onChange={(e) => setEditedTagsStr(e.target.value)}
                  placeholder="agent-skill, workflow, automation"
                  className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border text-xs font-mono ${focusRingClass} ${inputClass}`}
                />
              </label>
            </div>

            <label className="space-y-1 block min-w-0 pt-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold ${labelTextClass}`}>
                    {isId ? 'Deskripsi Produk (Markdown)' : 'Product Description (Markdown)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAiSuggestSkill('description')}
                    disabled={Boolean(aiSuggestingField)}
                    className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>✨ {aiSuggestingField === 'description' ? '...' : t('skill_ai_suggest_desc')}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyField('desc', activeDescMd)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${focusRingClass} ${copiedKey === 'desc'
                      ? 'bg-emerald-700 border-emerald-600 text-white'
                      : secondaryBtnClass
                    }`}
                >
                  {copiedKey === 'desc' ? `✓ ${t('copied_btn')}` : t('skill_copy_desc_btn')}
                </button>
              </div>
              <textarea
                rows={4}
                value={activeDescMd}
                onChange={(e) => setEditedDescMd(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono leading-relaxed resize-y ${focusRingClass} ${inputClass}`}
              />
            </label>
          </div>

          {/* Demo Section (The Request + The Result) */}
          <div className={`p-3.5 rounded-xl border space-y-3 min-w-0 ${cardClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass}`}>
                  {isId ? 'Contoh Demo (See It in Action)' : 'Live Demo (See It in Action)'}
                </h4>
                <p className={`text-[11px] leading-snug mt-0.5 ${mutedTextClass}`}>
                  {isId
                    ? 'Tunjukkan contoh permintaan pembeli dan hasil lengkap yang dibuat agen.'
                    : 'Show a realistic buyer prompt and the complete result your skill produces.'}
                </p>
              </div>

              <div className={`flex items-center gap-1 p-0.5 rounded-lg border shrink-0 ${insetBoxClass}`}>
                <button
                  type="button"
                  onClick={() => setDemoViewMode('edit')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${demoViewMode === 'edit'
                      ? 'bg-emerald-700 text-white'
                      : isLightTheme
                        ? 'text-slate-700 hover:text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {isId ? 'Edit' : 'Edit'}
                </button>
                <button
                  type="button"
                  onClick={() => setDemoViewMode('preview')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${demoViewMode === 'preview'
                      ? 'bg-emerald-700 text-white'
                      : isLightTheme
                        ? 'text-slate-700 hover:text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {isId ? 'Pratinjau' : 'Preview'}
                </button>
              </div>
            </div>

            {/* The Request */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold ${labelTextClass}`}>
                    {t('skill_demo_request_label')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAiSuggestSkill('demoRequest')}
                    disabled={Boolean(aiSuggestingField)}
                    className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>✨ {aiSuggestingField === 'demoRequest' ? '...' : t('skill_ai_suggest_demo_req')}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyField('req', activeDemoRequest)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${focusRingClass} ${copiedKey === 'req'
                      ? 'bg-emerald-700 border-emerald-600 text-white'
                      : secondaryBtnClass
                    }`}
                >
                  {copiedKey === 'req' ? `✓ ${t('copied_btn')}` : t('skill_copy_request_btn')}
                </button>
              </div>
              <textarea
                rows={3}
                value={activeDemoRequest}
                onChange={(e) => {
                  setEditedDemoRequest(e.target.value);
                  onUpdateDemoFields?.({ demoRequest: e.target.value });
                }}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono leading-relaxed resize-y ${focusRingClass} ${inputClass}`}
              />
            </div>

            {/* The Result */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className={`text-[11px] font-semibold ${labelTextClass}`}>
                    {t('skill_demo_result_label')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAiSuggestSkill('demoResult')}
                    disabled={Boolean(aiSuggestingField)}
                    className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>✨ {aiSuggestingField === 'demoResult' ? '...' : t('skill_ai_suggest_demo_res')}</span>
                  </button>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${demoResultReady
                        ? isLightTheme
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                        : isLightTheme
                          ? 'bg-amber-100 border-amber-300 text-amber-950'
                          : 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                      }`}
                  >
                    {demoResultChars} char {demoResultReady ? '✓' : '/ 700+'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyField('res', activeDemoResult)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${focusRingClass} ${copiedKey === 'res'
                      ? 'bg-emerald-700 border-emerald-600 text-white'
                      : secondaryBtnClass
                    }`}
                >
                  {copiedKey === 'res' ? `✓ ${t('copied_btn')}` : t('skill_copy_result_btn')}
                </button>
              </div>

              {demoViewMode === 'edit' ? (
                <textarea
                  rows={7}
                  value={activeDemoResult}
                  onChange={(e) => {
                    setEditedDemoResult(e.target.value);
                    onUpdateDemoFields?.({ demoResult: e.target.value });
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono leading-relaxed resize-y ${focusRingClass} ${inputClass}`}
                />
              ) : (
                <div className={`p-3.5 rounded-xl border min-h-[140px] max-h-[340px] overflow-y-auto ${insetBoxClass}`}>
                  {renderSafeMarkdownPreview(activeDemoResult, isLightTheme)}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveStep('test')}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center gap-2 ${focusRingClass}`}
          >
            <span>
              {isId
                ? 'Lanjut ke Langkah 2: Unduh ZIP & Uji Lokal'
                : 'Next: Step 2 - Download ZIP & Local Test'}
            </span>
            <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      )}

      {/* STEP 2: Unduh Paket ZIP & Uji Lokal */}
      {activeStep === 'test' && (
        <div className="space-y-3.5 min-w-0">
          {/* Primary ZIP Package Download Card */}
          <div className={`p-3.5 rounded-xl border space-y-3 min-w-0 ${cardClass}`}>
            <div className="space-y-1">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass}`}>
                {isId ? '1. Unduh Paket Produk (.zip)' : '1. Download Product Archive (.zip)'}
              </h4>
              <p className={`text-xs leading-relaxed ${bodyTextClass}`}>
                {isId
                  ? 'File ZIP ini adalah produk digital yang nanti dibeli pengguna. Isinya sudah lengkap dengan 4 file standar:'
                  : 'This ZIP archive is the exact digital deliverable buyers receive. It bundles 4 standard files:'}
              </p>
            </div>

            <ul className="space-y-1.5">
              {ZIP_BUNDLE_FILES.map((fileItem) => (
                <li
                  key={fileItem.path}
                  className={`p-2.5 rounded-xl border text-[11px] space-y-0.5 ${insetBoxClass}`}
                >
                  <p className={`font-mono font-bold break-all ${accentTextClass}`}>
                    {fileItem.path}
                  </p>
                  <p className={`leading-snug ${mutedTextClass}`}>
                    {isId ? fileItem.descId : fileItem.descEn}
                  </p>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadZip}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm flex items-center justify-center gap-2 transition-colors ${focusRingClass}`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>
                  {t('skill_download_bundle_btn')} ({activeSpec.name}.zip)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyField('skill_md_copy', activeSkillMarkdown)}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${focusRingClass} ${copiedKey === 'skill_md_copy'
                    ? 'bg-emerald-700 border-emerald-600 text-white'
                    : secondaryBtnClass
                  }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copiedKey === 'skill_md_copy' ? `✓ ${t('copied_btn')}` : t('copy_skill_btn')}</span>
              </button>
            </div>
          </div>

          {/* Local Smoke Test Guide */}
          <div className={`p-3.5 rounded-xl border space-y-3 min-w-0 ${cardClass}`}>
            <div className="space-y-1">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass}`}>
                {isId
                  ? '2. Uji Coba di Agen AI Lokal (Sebelum Dijual)'
                  : '2. Test in a Local AI Agent (Before Selling)'}
              </h4>
              <p className={`text-xs leading-relaxed ${bodyTextClass}`}>
                {isId
                  ? 'Pilih aplikasi agen AI yang Anda pakai di komputer untuk melihat folder pemasangan & perintah uji:'
                  : 'Pick the AI agent runner on your machine to see the install path and check command:'}
              </p>
            </div>

            {/* Runner Selector Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {RUNNER_INSTALL_GUIDES.map((guide) => (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => setSelectedRunnerId(guide.id)}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${focusRingClass} ${selectedRunnerId === guide.id
                      ? 'bg-emerald-700 border-emerald-600 text-white'
                      : secondaryBtnClass
                    }`}
                >
                  {guide.name}
                </button>
              ))}
            </div>

            {/* Install Paths (Stacked in sidebar, 2-col when Expanded) */}
            <div className={isExpanded ? 'grid grid-cols-1 md:grid-cols-2 gap-2.5' : 'space-y-2'}>
              <div className={`p-3 rounded-xl border space-y-1.5 min-w-0 ${insetBoxClass}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono uppercase font-bold ${mutedTextClass}`}>
                    {t('skill_local_windows_path')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyField('win_path', resolvedWinPath)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${focusRingClass} ${copiedKey === 'win_path'
                        ? 'bg-emerald-700 border-emerald-600 text-white'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'win_path' ? `✓ ${t('copied_btn')}` : isId ? 'Salin' : 'Copy'}
                  </button>
                </div>
                <p className={`font-mono text-[11px] break-all select-all ${accentTextClass}`}>
                  {resolvedWinPath}
                </p>
              </div>

              <div className={`p-3 rounded-xl border space-y-1.5 min-w-0 ${insetBoxClass}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono uppercase font-bold ${mutedTextClass}`}>
                    {t('skill_local_unix_path')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyField('unix_path', resolvedUnixPath)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${focusRingClass} ${copiedKey === 'unix_path'
                        ? 'bg-emerald-700 border-emerald-600 text-white'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'unix_path' ? `✓ ${t('copied_btn')}` : isId ? 'Salin' : 'Copy'}
                  </button>
                </div>
                <p className={`font-mono text-[11px] break-all select-all ${accentTextClass}`}>
                  {resolvedUnixPath}
                </p>
              </div>
            </div>

            {/* CLI Validator Command */}
            <div className={`p-3 rounded-xl border space-y-1.5 min-w-0 ${insetBoxClass}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono uppercase font-bold ${mutedTextClass}`}>
                  {t('skill_local_validator_label')}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyField('cli_cmd', validateCmd)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${focusRingClass} ${copiedKey === 'cli_cmd'
                      ? 'bg-emerald-700 border-emerald-600 text-white'
                      : secondaryBtnClass
                    }`}
                >
                  {copiedKey === 'cli_cmd' ? `✓ ${t('copied_btn')}` : isId ? 'Salin' : 'Copy'}
                </button>
              </div>
              <p className={`font-mono text-[11px] break-all select-all ${accentTextClass}`}>
                {validateCmd}
              </p>
            </div>

            {/* 4-Step Smoke Test Checklist */}
            <div className={`pt-2 border-t space-y-1.5 text-xs ${dividerClass}`}>
              <p className={`font-bold ${labelTextClass}`}>{t('skill_local_smoke_title')}</p>
              <ol className={`list-decimal pl-4 space-y-1 text-[11px] leading-relaxed ${bodyTextClass}`}>
                <li>
                  {isId
                    ? 'Ekstrak arsip .zip ke path folder di atas agar SKILL.md berada langsung di dalam folder skill.'
                    : 'Extract the .zip into the path above so SKILL.md sits directly inside the skill folder.'}
                </li>
                <li>
                  {isId
                    ? 'Buka terminal di dalam folder skill, lalu jalankan perintah validasi CLI di atas.'
                    : 'Open a terminal inside the skill folder and run the CLI validation command above.'}
                </li>
                <li>
                  {isId
                    ? `Buka ${currentRunner.name}, lalu kirimkan contoh prompt dari Langkah 1 (The Request).`
                    : `Open ${currentRunner.name} and send the realistic prompt from Step 1 (The Request).`}
                </li>
                <li>
                  {isId
                    ? 'Cocokkan respons agen dengan standar The Result. Jika sudah akurat, skill siap dijual!'
                    : 'Verify the agent response matches your expected Result format. Once verified, you are ready to sell.'}
                </li>
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveStep('info')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${focusRingClass} ${secondaryBtnClass}`}
            >
              &lt;- {isId ? 'Kembali ke Info' : 'Back to Info'}
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('sell')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors ${focusRingClass}`}
            >
              {isId ? 'Lanjut: Salin & Jual ->' : 'Next: Copy & Sell ->'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Salin Teks Listing & Jual ke Marketplace Mana Saja */}
      {activeStep === 'sell' && (
        <div className="space-y-3.5 min-w-0">
          <div className={`p-3.5 rounded-xl border space-y-3 min-w-0 ${cardClass}`}>
            <div className="space-y-1">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${accentTextClass}`}>
                {isId ? 'Siap Unggah ke Marketplace Mana Saja' : 'Ready to Publish on Any Marketplace'}
              </h4>
              <p className={`text-xs leading-relaxed ${bodyTextClass}`}>
                {isId
                  ? 'Unggah file .zip dari Langkah 2 sebagai produk Anda di Agensi.io, PromptBase, Gumroad, Lemon Squeezy, Payhip, Whop, atau GitHub. Gunakan tombol salin cepat di bawah untuk mengisi kolom formulir jualan tanpa mengetik ulang.'
                  : 'Upload the .zip from Step 2 as your digital product on Agensi.io, PromptBase, Gumroad, Lemon Squeezy, Payhip, Whop, or GitHub. Use the copy buttons below to fill in the listing form.'}
              </p>
            </div>

            {/* Multi-Marketplace Format Switcher Tabs */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${accentTextClass}`}>
                  {isId ? 'Pilih Format Target Marketplace:' : 'Select Target Marketplace Format:'}
                </span>
                <span className={`text-[10px] font-mono ${mutedTextClass}`}>
                  7 Komersial + 1 OSS
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setMarketFormatTab('universal')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${focusRingClass} ${marketFormatTab === 'universal'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isLightTheme
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                >
                  🌐 {t('skill_market_universal')}
                </button>
                <button
                  type="button"
                  onClick={() => setMarketFormatTab('promptbase')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${focusRingClass} ${marketFormatTab === 'promptbase'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isLightTheme
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                >
                  ⚡ {t('skill_market_promptbase')}
                </button>
                <button
                  type="button"
                  onClick={() => setMarketFormatTab('storefront')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${focusRingClass} ${marketFormatTab === 'storefront'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isLightTheme
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                >
                  🛍️ {t('skill_market_storefronts')}
                </button>
                <button
                  type="button"
                  onClick={() => setMarketFormatTab('oss')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${focusRingClass} ${marketFormatTab === 'oss'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isLightTheme
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                >
                  🐙 {t('skill_market_oss')}
                </button>
                <button
                  type="button"
                  onClick={() => setMarketFormatTab('jsonld')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${focusRingClass} ${marketFormatTab === 'jsonld'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isLightTheme
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                >
                  🏷️ Schema JSON-LD
                </button>
              </div>
            </div>

            {/* Tab 1: Universal Listing (Agensi.io, Google SEO, GEO) */}
            {marketFormatTab === 'universal' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCopyFullListingKit}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm flex items-center justify-center gap-2 transition-colors ${focusRingClass}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {copiedKey === 'all_listing'
                      ? `✓ ${t('copied_btn')}`
                      : t('skill_copy_full_listing_btn')}
                  </span>
                </button>

                <div className="space-y-1.5 pt-1">
                  <p className={`text-[11px] font-semibold ${mutedTextClass}`}>
                    {isId ? 'Salin per kolom formulir listing:' : 'Copy individual listing fields:'}
                  </p>
                  <div className={isExpanded ? 'grid grid-cols-2 sm:grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}>
                    <button
                      type="button"
                      onClick={() => handleCopyField('title_tag', `${activeTitle}\n${activeTagline}`)}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'title_tag'
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : secondaryBtnClass
                        }`}
                    >
                      {copiedKey === 'title_tag'
                        ? `✓ ${t('copied_btn')}`
                        : isId
                          ? 'Judul & Tagline'
                          : 'Title & Tagline'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyField('sell_desc', activeDescMd)}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'sell_desc'
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : secondaryBtnClass
                        }`}
                    >
                      {copiedKey === 'sell_desc'
                        ? `✓ ${t('copied_btn')}`
                        : isId
                          ? 'Deskripsi'
                          : 'Description'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyField('sell_req', activeDemoRequest)}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'sell_req'
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : secondaryBtnClass
                        }`}
                    >
                      {copiedKey === 'sell_req'
                        ? `✓ ${t('copied_btn')}`
                        : isId
                          ? 'Demo Request'
                          : 'Demo Request'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyField('sell_res', activeDemoResult)}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'sell_res'
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : secondaryBtnClass
                        }`}
                    >
                      {copiedKey === 'sell_res'
                        ? `✓ ${t('copied_btn')}`
                        : isId
                          ? 'Demo Result'
                          : 'Demo Result'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyField('geo_faq', listingCopy.geoFaqMarkdown)}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'geo_faq'
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : secondaryBtnClass
                        }`}
                    >
                      {copiedKey === 'geo_faq'
                        ? `✓ ${t('copied_btn')}`
                        : isId
                          ? 'Salin FAQ GEO'
                          : 'Copy GEO FAQ'}
                    </button>

                    <button
                      type="button"
                      onClick={onCopy}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${isCopied
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : secondaryBtnClass
                        }`}
                    >
                      {isCopied ? `✓ ${t('copied_btn')}` : t('copy_skill_btn')}
                    </button>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border space-y-1.5 text-xs ${insetBoxClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <span>⚡</span>
                      <span>{t('skill_seo_geo_title')}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      Schema.org JSON-LD
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${mutedTextClass}`}>
                    {isId
                      ? 'Listing kit ini memuat Schema.org SoftwareApplication JSON-LD dan FAQ berstruktur yang memudahkan Google mengindeks harga dan rating, serta AI Answer Engine (Perplexity, ChatGPT Search) mengutip demo produk Anda.'
                      : 'This listing kit includes Schema.org SoftwareApplication JSON-LD and structured FAQs enabling Google rich snippets and AI answer engine citations.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: PromptBase (Variable-based template format, 80% payout) */}
            {marketFormatTab === 'promptbase' && (
              <div className="space-y-3">
                <div className={`p-3 rounded-xl border space-y-1.5 text-xs ${insetBoxClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>PromptBase Marketplace</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      Payout 80% | Judul &le; 40 Karakter
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${mutedTextClass}`}>
                    {isId
                      ? 'PromptBase adalah marketplace prompt terbesar di dunia dengan jutaan pencarian bulanan. Format submission mewajibkan judul singkat (maksimal 40 karakter) dan variabel dinamis dalam tanda kurung siku [VARIABLE].'
                      : 'PromptBase is the world\'s largest prompt marketplace with millions of monthly buyers. Submissions require a concise title (<= 40 chars) and bracketed [VARIABLE] placeholders.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyField(
                      'pb_full',
                      `Title: ${listingCopy.promptBase.title}\n\nDescription:\n${listingCopy.promptBase.description}\n\nPrompt Template:\n${listingCopy.promptBase.promptTemplate}\n\nTesting Instructions / Example:\n${listingCopy.promptBase.testingExample}`
                    )
                  }
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-sm flex items-center justify-center gap-2 transition-colors ${focusRingClass}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {copiedKey === 'pb_full' ? `✓ ${t('copied_btn')}` : t('skill_copy_promptbase_btn')}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyField('pb_title', listingCopy.promptBase.title)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'pb_title'
                        ? 'bg-amber-600 border-amber-500 text-slate-950'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'pb_title'
                      ? `✓ ${t('copied_btn')}`
                      : `${isId ? 'Salin Judul PB' : 'Copy PB Title'} (${listingCopy.promptBase.title.length}/40)`}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyField('pb_desc', listingCopy.promptBase.description)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'pb_desc'
                        ? 'bg-amber-600 border-amber-500 text-slate-950'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'pb_desc' ? `✓ ${t('copied_btn')}` : isId ? 'Salin Deskripsi PB' : 'Copy PB Description'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyField('pb_tpl', listingCopy.promptBase.promptTemplate)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'pb_tpl'
                        ? 'bg-amber-600 border-amber-500 text-slate-950'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'pb_tpl' ? `✓ ${t('copied_btn')}` : isId ? 'Salin Template [Variabel]' : 'Copy [Variable] Template'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyField('pb_test', listingCopy.promptBase.testingExample)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'pb_test'
                        ? 'bg-amber-600 border-amber-500 text-slate-950'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'pb_test' ? `✓ ${t('copied_btn')}` : isId ? 'Salin Contoh Pengujian' : 'Copy Test Example'}
                  </button>
                </div>

                <div className={`p-3 rounded-xl border space-y-1.5 text-xs ${insetBoxClass}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${labelTextClass}`}>
                    Pratinjau Template Prompt:
                  </span>
                  <pre className="text-[11px] font-mono leading-relaxed p-2.5 rounded-lg bg-black/40 border border-slate-800 text-emerald-300 max-h-[160px] overflow-y-auto whitespace-pre-wrap">
                    {listingCopy.promptBase.promptTemplate}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 3: Storefronts (Gumroad, Lemon Squeezy, Whop, Payhip, Creem.io) */}
            {marketFormatTab === 'storefront' && (
              <div className="space-y-3">
                <div className={`p-3 rounded-xl border space-y-1.5 text-xs ${insetBoxClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sky-400 flex items-center gap-1.5">
                      <span>🛍️</span>
                      <span>Storefront & Merchant of Record (MoR)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 border border-sky-500/30 text-sky-300">
                      Gumroad | Lemon Squeezy | Whop | Payhip | Creem
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${mutedTextClass}`}>
                    {isId
                      ? 'Format copywriting halaman landing berkonversi tinggi untuk platform MoR. Lemon Squeezy dan Gumroad menangani pajak PPN/VAT global secara otomatis, sedangkan Whop (fee 3%) dan Payhip memberikan margin keuntungan maksimal.'
                      : 'High-converting sales page copywriting for MoR platforms. Lemon Squeezy and Gumroad handle global sales tax and VAT automatically, while Whop (3% fee) and Payhip maximize margins.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyField(
                      'storefront_full',
                      `# ${listingCopy.storefront.headline}\n\n${listingCopy.storefront.bodyMarkdown}`
                    )
                  }
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm flex items-center justify-center gap-2 transition-colors ${focusRingClass}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {copiedKey === 'storefront_full'
                      ? `✓ ${t('copied_btn')}`
                      : t('skill_copy_storefront_btn')}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyField('sf_head', listingCopy.storefront.headline)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'sf_head'
                        ? 'bg-sky-600 border-sky-500 text-white'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'sf_head' ? `✓ ${t('copied_btn')}` : isId ? 'Salin Headline Penjualan' : 'Copy Sales Headline'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyField('sf_body', listingCopy.storefront.bodyMarkdown)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'sf_body'
                        ? 'bg-sky-600 border-sky-500 text-white'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'sf_body' ? `✓ ${t('copied_btn')}` : isId ? 'Salin Body Markdown' : 'Copy Body Markdown'}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Open Source Lead Magnet (GitHub, Community Hub) */}
            {marketFormatTab === 'oss' && (
              <div className="space-y-3">
                <div className={`p-3 rounded-xl border space-y-1.5 text-xs ${insetBoxClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-violet-400 flex items-center gap-1.5">
                      <span>🐙</span>
                      <span>GitHub Open-Source Lead Magnet</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/15 border border-violet-500/30 text-violet-300">
                      npx skills add | MIT License
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${mutedTextClass}`}>
                    {isId
                      ? 'Format distribusi repositori publik GitHub. Cocok untuk membangun reputasi developer, mendapatkan GitHub Stars, dan mengarahkan pengguna ke versi Pro berbayar di marketplace komersial.'
                      : 'Public GitHub repo distribution format. Ideal for building developer reputation, acquiring GitHub stars, and driving traffic to your Pro bundles.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyField(
                      'oss_full',
                      `${listingCopy.ossLeadMagnet.readmeMarkdown}\n\n## Quick Install\n\`\`\`bash\n${listingCopy.ossLeadMagnet.cliCommand}\n\`\`\``
                    )
                  }
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-sm flex items-center justify-center gap-2 transition-colors ${focusRingClass}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {copiedKey === 'oss_full' ? `✓ ${t('copied_btn')}` : t('skill_copy_oss_btn')}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyField('oss_cmd', listingCopy.ossLeadMagnet.cliCommand)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'oss_cmd'
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'oss_cmd' ? `✓ ${t('copied_btn')}` : isId ? 'Salin Perintah CLI (npx)' : 'Copy CLI Command (npx)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyField('oss_readme', listingCopy.ossLeadMagnet.readmeMarkdown)}
                    className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${focusRingClass} ${copiedKey === 'oss_readme'
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : secondaryBtnClass
                      }`}
                  >
                    {copiedKey === 'oss_readme' ? `✓ ${t('copied_btn')}` : isId ? 'Salin README.md' : 'Copy README.md'}
                  </button>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 text-xs ${insetBoxClass}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${labelTextClass}`}>
                    Perintah Instalasi CLI:
                  </span>
                  <pre className="text-[11px] font-mono leading-relaxed p-2 rounded-lg bg-black/40 border border-slate-800 text-violet-300 overflow-x-auto select-all">
                    <code>{listingCopy.ossLeadMagnet.cliCommand}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 5: Schema.org JSON-LD Structured Data */}
            {marketFormatTab === 'jsonld' && (
              <div className="space-y-3">
                <div className={`p-3 rounded-xl border space-y-1.5 text-xs ${insetBoxClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>🏷️</span>
                      <span>Schema.org SoftwareApplication JSON-LD</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      SEO & GEO Rich Snippets
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${mutedTextClass}`}>
                    {isId
                      ? 'Sematkan metadata JSON-LD ini di dalam tag <head> atau blog landing page toko Anda. Google Search akan menampilkan badge harga ($' + activePriceStr + ') dan bintang ulasan, sementara AI Search (Perplexity, ChatGPT) mengutip fitur skill secara akurat.'
                      : 'Embed this JSON-LD snippet inside your store page\'s <head>. Google will display rich pricing snippets and AI engines will cite your skill capabilities.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyField('json_ld', listingCopy.jsonLdSchema)}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm flex items-center justify-center gap-2 transition-colors ${focusRingClass}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {copiedKey === 'json_ld' ? `✓ ${t('copied_btn')}` : t('skill_copy_jsonld_btn')}
                  </span>
                </button>

                <pre className={`p-3 rounded-xl border text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[220px] select-all ${insetBoxClass}`}>
                  <code>{listingCopy.jsonLdSchema}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Collapsible Raw SKILL.md Code Inspector */}
          <details className={`rounded-xl border p-3.5 ${cardClass}`}>
            <summary
              className={`min-h-[36px] flex items-center justify-between gap-2 cursor-pointer select-none text-xs font-bold rounded-lg ${focusRingClass} ${labelTextClass}`}
            >
              <span>
                {isId ? 'Lihat Kode Mentah SKILL.md (Opsional)' : 'Inspect Raw SKILL.md Source (Optional)'}
              </span>
              <span className={`text-[10px] font-mono ${mutedTextClass}`}>
                {activeSkillMarkdown.split('\n').length} {isId ? 'baris' : 'lines'}
              </span>
            </summary>

            <pre
              className={`mt-3 p-3 rounded-xl border text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[360px] select-all ${insetBoxClass}`}
            >
              <code>{activeSkillMarkdown}</code>
            </pre>
          </details>

          <button
            type="button"
            onClick={() => setActiveStep('test')}
            className={`w-full min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${focusRingClass} ${secondaryBtnClass}`}
          >
            &lt;- {isId ? 'Kembali ke Langkah 2 (ZIP & Uji Lokal)' : 'Back to Step 2 (ZIP & Local Test)'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentSkillViewer;
