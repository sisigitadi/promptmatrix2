import React, { useMemo, useState } from 'react';
import { AGENSI_CONFIG, getEffectiveAgensiUrls } from '../config/agensiConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { AgentSkillSpec, SkillValidationResult } from '../services/agentSkillService';
import {
  buildAgensiListingCopy,
  buildFormulaSkillZipBundle,
  triggerZipDownload,
} from '../services/skillZipService';

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
}

const ZIP_BUNDLE_FILE_TREE: readonly string[] = [
  'SKILL.md',
  'references/framework-guide.md',
  'templates/sample-input.json',
  'scripts/validate-output.mjs',
];

export const AgentSkillViewer: React.FC<AgentSkillViewerProps> = ({
  skillSpec,
  skillMarkdown,
  validation,
  onCopy,
  onDownload,
  isCopied,
  isLightTheme = false,
  formValues = {},
  customOtherValues = {},
  compiledPrompt = '',
  onZipDownloaded,
  onCopyListing,
}) => {
  const { t, language } = useLanguage();
  const [isListingCopied, setIsListingCopied] = useState(false);
  const [showListingPreview, setShowListingPreview] = useState(false);

  const lines = useMemo(() => skillMarkdown.split('\n'), [skillMarkdown]);
  const featuredAgents = useMemo(
    () => AGENSI_CONFIG.supportedAgents.filter((agent) => agent.featured),
    []
  );
  const extraAgentCount = Math.max(0, AGENSI_CONFIG.supportedAgents.length - featuredAgents.length);

  const effectiveUrls = getEffectiveAgensiUrls();
  const activeStoreUrl = effectiveUrls.activeUrl;
  const hasConfiguredStoreUrl = activeStoreUrl.length > 0;

  const listingCopy = useMemo(
    () =>
      buildAgensiListingCopy({
        slug: skillSpec.name,
        title: skillSpec.metadata.framework || skillSpec.name,
        description: skillSpec.description,
        category: skillSpec.metadata.category || 'General',
        includedFiles: ZIP_BUNDLE_FILE_TREE,
        language,
      }),
    [skillSpec, language]
  );

  const handleDownloadSkill = () => {
    const filename = `${skillSpec.name || 'promptmatrix-skill'}-SKILL.md`;
    const blob = new Blob([skillMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  const handleDownloadZip = () => {
    const bundle = buildFormulaSkillZipBundle({
      skillSpec,
      skillMarkdown,
      formValues,
      customOtherValues,
      compiledPrompt,
    });
    triggerZipDownload(bundle.filename, bundle.archiveBytes);
    onZipDownloaded?.(bundle.filename);
  };

  const handleCopyListing = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(listingCopy.fullMarkdown);
      } catch {
        // Ignore clipboard permission errors when parent handles fallback
      }
    }
    onCopyListing?.(listingCopy.fullMarkdown);
    setIsListingCopied(true);
    setTimeout(() => setIsListingCopied(false), 1800);
  };

  // Track YAML frontmatter boundaries so YAML keys and Markdown headings highlight cleanly
  const frontmatterEndIndex = useMemo(() => {
    if (lines[0]?.trim() !== '---') return -1;
    for (let i = 1; i < lines.length; i += 1) {
      if (lines[i].trim() === '---') return i;
    }
    return -1;
  }, [lines]);

  const renderHighlightedLine = (line: string, index: number): React.ReactNode => {
    const trimmed = line.trim();
    const inFrontmatter =
      frontmatterEndIndex > 0 && index >= 0 && index <= frontmatterEndIndex;

    if (inFrontmatter) {
      if (trimmed === '---') {
        return (
          <span
            className={
              isLightTheme
                ? 'text-slate-500 font-semibold font-mono'
                : 'text-slate-400 font-semibold font-mono'
            }
          >
            {line}
          </span>
        );
      }

      const yamlMatch = line.match(/^(\s*)([a-zA-Z0-9_-]+)(\s*:\s*)([\s\S]*)$/);
      if (yamlMatch) {
        const [, indent, keyToken, colonToken, valueToken] = yamlMatch;
        return (
          <span>
            <span className="font-mono">{indent}</span>
            <span
              className={
                isLightTheme
                  ? 'text-cyan-800 font-semibold font-mono'
                  : 'text-cyan-400 font-semibold font-mono'
              }
            >
              {keyToken}
            </span>
            <span className={isLightTheme ? 'text-slate-600 font-mono' : 'text-slate-400 font-mono'}>
              {colonToken}
            </span>
            <span
              className={
                isLightTheme ? 'text-emerald-800 font-mono' : 'text-emerald-300 font-mono'
              }
            >
              {valueToken}
            </span>
          </span>
        );
      }
    }

    if (trimmed.startsWith('# ')) {
      return (
        <span
          className={
            isLightTheme
              ? 'text-emerald-800 font-bold font-mono'
              : 'text-emerald-400 font-bold font-mono'
          }
        >
          {line}
        </span>
      );
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      return (
        <span
          className={
            isLightTheme
              ? 'text-cyan-800 font-semibold font-mono'
              : 'text-cyan-300 font-semibold font-mono'
          }
        >
          {line}
        </span>
      );
    }

    if (trimmed.startsWith('```')) {
      return (
        <span
          className={
            isLightTheme
              ? 'text-purple-700 font-semibold font-mono'
              : 'text-purple-400 font-semibold font-mono'
          }
        >
          {line}
        </span>
      );
    }

    const bulletMatch = line.match(/^(\s*(?:- \[[ xX]\]|-|\d+\.)\s+)(\*\*[^*]+\*\*)(.*)$/);
    if (bulletMatch) {
      const [, prefix, boldLabel, rest] = bulletMatch;
      return (
        <span>
          <span className={isLightTheme ? 'text-amber-800 font-mono' : 'text-amber-300 font-mono'}>
            {prefix}
          </span>
          <span
            className={
              isLightTheme
                ? 'text-slate-900 font-semibold font-mono'
                : 'text-slate-100 font-semibold font-mono'
            }
          >
            {boldLabel}
          </span>
          <span className={isLightTheme ? 'text-slate-800 font-mono' : 'text-slate-300 font-mono'}>
            {rest}
          </span>
        </span>
      );
    }

    if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      return (
        <span className={isLightTheme ? 'text-slate-800 font-mono' : 'text-slate-200 font-mono'}>
          {line}
        </span>
      );
    }

    return (
      <span className={isLightTheme ? 'text-slate-900 font-mono' : 'text-slate-200 font-mono'}>
        {line}
      </span>
    );
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isLightTheme
          ? 'bg-slate-50 border-slate-300 text-slate-900 shadow-sm'
          : 'bg-[#070b12] border-slate-800/90 text-slate-100 shadow-inner'
      }`}
    >
      {/* Top Action & Validation Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-b text-xs ${
          isLightTheme
            ? 'bg-slate-100 border-slate-300 text-slate-800'
            : 'bg-slate-950/80 border-slate-800/80 text-slate-200'
        }`}
      >
        {/* Left: Validation Pill & Limits */}
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          {validation.valid ? (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-mono text-[11px] font-semibold ${
                isLightTheme
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
              }`}
            >
              <svg
                className="w-3 h-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('skill_valid_badge')}</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-mono text-[11px] font-semibold ${
                isLightTheme
                  ? 'bg-rose-100 border-rose-300 text-rose-900'
                  : 'bg-rose-500/15 border-rose-500/35 text-rose-300'
              }`}
            >
              <span>{t('skill_invalid_badge')}</span>
            </span>
          )}

          <span
            className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] ${
              isLightTheme
                ? 'bg-white border-slate-300 text-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
            title="Skill name length (max 64)"
          >
            name {validation.nameLength}/64
          </span>
          <span
            className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] ${
              isLightTheme
                ? 'bg-white border-slate-300 text-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
            title="Skill description length (max 1024)"
          >
            desc {validation.descriptionLength}/1024
          </span>
        </div>

        {/* Right: Copy & Download Actions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onCopy}
            className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isCopied
                ? isLightTheme
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-400 text-slate-950'
                : isLightTheme
                  ? 'bg-white hover:bg-slate-200 text-slate-900 border border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
            }`}
            title={t('copy_skill_btn')}
          >
            {isCopied ? (
              <>
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('copied_btn')}</span>
              </>
            ) : (
              <>
                <svg
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isLightTheme ? 'text-cyan-700' : 'text-cyan-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>{t('copy_skill_btn')}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadSkill}
            className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isLightTheme
                ? 'bg-white hover:bg-slate-200 text-slate-900 border border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
            }`}
            title={`${skillSpec.name}-SKILL.md`}
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>{t('download_skill_btn')}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadZip}
            className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isLightTheme
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title={`${skillSpec.name}.zip`}
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>{t('download_zip_btn')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyListing}
            className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isListingCopied
                ? isLightTheme
                  ? 'bg-cyan-700 text-white'
                  : 'bg-cyan-500 text-slate-950'
                : isLightTheme
                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-200 border border-cyan-500/40'
            }`}
            title="Agensi.io/sell"
          >
            <span>{isListingCopied ? t('copied_btn') : t('copy_listing_btn')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowListingPreview((prev) => !prev)}
            aria-expanded={showListingPreview}
            className={`min-h-[44px] sm:min-h-[36px] px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isLightTheme
                ? 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title={t('listing_copy_title')}
          >
            <span>{t('listing_copy_title')}</span>
            <span aria-hidden="true">{showListingPreview ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* Validation Errors Banner (only shown when invalid) */}
      {!validation.valid && validation.errors.length > 0 && (
        <div
          className={`px-3.5 py-2 border-b text-[11px] space-y-1 ${
            isLightTheme
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-rose-950/40 border-rose-900/60 text-rose-200'
          }`}
        >
          {validation.errors.map((err, idx) => (
            <div key={idx} className="font-mono">
              • {err}
            </div>
          ))}
        </div>
      )}

      {/* Supported Agents Strip */}
      <div
        className={`px-3.5 py-2 border-b flex flex-wrap items-center gap-1.5 text-[10px] ${
          isLightTheme
            ? 'bg-slate-100/70 border-slate-200 text-slate-700'
            : 'bg-slate-900/50 border-slate-800/80 text-slate-300'
        }`}
      >
        <span className="font-semibold mr-0.5">{t('skill_supported_agents')}</span>
        {featuredAgents.map((agent) => (
          <span
            key={agent.id}
            className={`px-2 py-0.5 rounded-md border font-mono ${
              isLightTheme
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}
          >
            {agent.name}
          </span>
        ))}
        {extraAgentCount > 0 && (
          <span
            className={`px-2 py-0.5 rounded-md border font-mono font-semibold ${
              isLightTheme
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            +{extraAgentCount} {language === 'id' ? 'agen lainnya' : 'more agents'}
          </span>
        )}
      </div>

      {/* ZIP Bundle Archive File Tree Strip */}
      <div
        className={`px-3.5 py-2 border-b flex flex-wrap items-center gap-1.5 text-[10px] ${
          isLightTheme
            ? 'bg-white border-slate-200 text-slate-700'
            : 'bg-[#090d16] border-slate-800/80 text-slate-300'
        }`}
      >
        <span className="font-semibold mr-0.5">
          {language === 'id' ? 'Struktur Arsip .zip:' : '.zip Bundle Structure:'}
        </span>
        {ZIP_BUNDLE_FILE_TREE.map((entryPath) => (
          <span
            key={entryPath}
            className={`px-2 py-0.5 rounded-md border font-mono ${
              isLightTheme
                ? 'bg-slate-50 border-slate-300 text-slate-800'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            {entryPath}
          </span>
        ))}
      </div>

      {/* Collapsible Agensi.io/sell Listing Copy Preview */}
      {showListingPreview && (
        <div
          className={`px-3.5 py-3 border-b space-y-2 ${
            isLightTheme
              ? 'bg-cyan-50/60 border-slate-300 text-slate-900'
              : 'bg-slate-950/90 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-xs font-bold">{t('listing_copy_title')} (Agensi.io/sell)</span>
              <span
                className={`px-2 py-0.5 rounded-md border font-mono text-[10px] font-semibold ${
                  isLightTheme
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                }`}
              >
                ${listingCopy.recommendedPriceUsd.toFixed(2)} USD
              </span>
              {listingCopy.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                    isLightTheme
                      ? 'bg-white border-slate-300 text-slate-700'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyListing}
              className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-lg text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isLightTheme
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isListingCopied ? t('copied_btn') : t('copy_listing_btn')}
            </button>
          </div>

          <pre
            className={`p-3 rounded-xl border text-[11px] font-mono whitespace-pre-wrap break-words max-h-[220px] overflow-auto ${
              isLightTheme
                ? 'bg-white border-slate-300 text-slate-900'
                : 'bg-[#070b12] border-slate-800 text-slate-200'
            }`}
          >
            {listingCopy.fullMarkdown}
          </pre>
        </div>
      )}

      {/* Monospace Syntax-Highlighted SKILL.md Preview */}
      <div
        className={`p-3 sm:p-4 min-h-[220px] max-h-[420px] overflow-auto font-mono text-xs sm:text-[12.5px] leading-relaxed ${
          isLightTheme
            ? 'bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950'
            : 'bg-[#070b12] text-slate-200 selection:bg-emerald-900/60'
        }`}
      >
        <div className="inline-block min-w-full">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`table-row ${
                isLightTheme ? 'hover:bg-slate-200/60' : 'hover:bg-slate-900/40'
              }`}
            >
              <span
                className={`table-cell select-none pr-3 text-right font-mono text-[11px] w-8 ${
                  isLightTheme ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {idx + 1}
              </span>
              <span className="table-cell whitespace-pre font-mono">
                {renderHighlightedLine(line, idx)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Agensi.io Ready Footer Note */}
      <div
        className={`px-3.5 py-2.5 border-t flex flex-col gap-2 text-[11px] ${
          isLightTheme
            ? 'bg-slate-100 border-slate-300 text-slate-800'
            : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
        }`}
      >
        <div className="space-y-1 min-w-0">
          <p className="leading-relaxed text-[11px]">
            <strong
              className={`font-semibold mr-1.5 ${
                isLightTheme ? 'text-emerald-800' : 'text-emerald-400'
              }`}
            >
              {t('skill_agensi_ready_title')}:
            </strong>
            <span>
              {language === 'id'
                ? `${AGENSI_CONFIG.commissionInfo.standardSharePercent}% bagian kreator (${AGENSI_CONFIG.commissionInfo.affiliateNewBuyerSharePercent}% via tautan afiliasi, ${AGENSI_CONFIG.commissionInfo.listingModel}).`
                : `${AGENSI_CONFIG.commissionInfo.standardSharePercent}% creator share (${AGENSI_CONFIG.commissionInfo.affiliateNewBuyerSharePercent}% via affiliate link, ${AGENSI_CONFIG.commissionInfo.listingModel}).`}
            </span>
          </p>
          {!hasConfiguredStoreUrl && (
            <p className={`leading-relaxed ${isLightTheme ? 'text-slate-700 text-[10px]' : 'text-slate-400 text-[10px]'}`}>
              {t('skill_agensi_setup_hint')}
            </p>
          )}
        </div>

        <div
          className={`flex items-center justify-between gap-2 pt-1.5 border-t min-w-0 ${
            isLightTheme ? 'border-slate-300/80' : 'border-slate-800/60'
          }`}
        >
          <span
            className={`font-mono text-[10px] truncate min-w-0 ${
              isLightTheme ? 'text-slate-600' : 'text-slate-400'
            }`}
            title={`${lines.length} lines • ${skillSpec.name}-SKILL.md`}
          >
            {lines.length} lines • {skillSpec.name}-SKILL.md
          </span>
          {hasConfiguredStoreUrl && (
            <a
              href={activeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 min-h-[44px] sm:min-h-[28px] px-2.5 rounded-lg text-[11px] font-semibold shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isLightTheme
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span>{t('skill_agensi_visit_btn')}</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
