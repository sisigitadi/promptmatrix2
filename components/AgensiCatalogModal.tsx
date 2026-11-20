import React, { useEffect, useMemo, useState } from 'react';
import {
  AGENSI_CONFIG,
  AgensiSkillPackItem,
  AgensiUrlOverrides,
  SUITE_BUNDLE_INFO,
  buildAgensiPackCtaUrl,
  buildSuiteBundleAgensiUrl,
  getEffectiveAgensiUrls,
  getStoredAgensiUrlOverrides,
  hasSecondaryMarketplaceUrls,
  saveAgensiUrlOverrides,
} from '../config/agensiConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { buildAgensiListingCopy } from '../services/skillZipService';
import { AgentSkillSpec, SkillValidationResult } from '../services/agentSkillService';
import { SKILL_LISTING_DEMOS } from '../data/skillListingDemos';
import {
  suggestSkillMetadataWithUniversalAI,
  generatePackPitchWithUniversalAI,
  SkillAiSuggestionOutput,
} from '../services/universalAIService';
import { isAIConfigured } from '../services/aiSettingsService';

export type SkillModalTab = 'catalog' | 'export' | 'store' | 'guide';
export type CatalogFilter = 'all' | 'lead-magnet' | 'flagship';

export interface AgensiCatalogModalProps {
  show: boolean;
  onClose: () => void;
  isCreatorMode?: boolean;
  isLightTheme?: boolean;
  initialTab?: SkillModalTab;
  agensiUrlVersion?: number;
  onAgensiUrlsSaved?: () => void;
  activeSkillSpec?: AgentSkillSpec | null;
  activeSkillMarkdown?: string;
  activeSkillValidation?: SkillValidationResult | null;
  hasActivePrompt?: boolean;
  onCopyActiveSkill?: () => void;
  onDownloadActiveSkill?: () => void;
  onOpenSkillInStudio?: (slug?: string) => void;
  onCopyText?: (text: string, toastMessage?: string) => void | Promise<void>;
  onOpenAiSettings?: () => void;
}

type SecondaryAgensiUrlFieldKey =
  | 'lemonSqueezyBundleUrl'
  | 'creemBundleUrl'
  | 'gumroadBundleUrl'
  | 'promptBaseStoreUrl'
  | 'whopBundleUrl'
  | 'payhipBundleUrl';

interface SecondaryChannelField {
  readonly key: SecondaryAgensiUrlFieldKey;
  readonly labelKey:
    | 'secondary_ls_label'
    | 'secondary_creem_label'
    | 'secondary_gumroad_label'
    | 'secondary_promptbase_label'
    | 'secondary_whop_label'
    | 'secondary_payhip_label';
  readonly labelId: string;
  readonly labelEn: string;
  readonly placeholder: string;
}

const SECONDARY_CHANNEL_FIELDS: readonly SecondaryChannelField[] = [
  {
    key: 'lemonSqueezyBundleUrl',
    labelKey: 'secondary_ls_label',
    labelId: 'URL Bundel Lemon Squeezy',
    labelEn: 'Lemon Squeezy Bundle URL',
    placeholder: 'https://store.lemonsqueezy.com/buy/...',
  },
  {
    key: 'creemBundleUrl',
    labelKey: 'secondary_creem_label',
    labelId: 'URL Bundel Creem.io',
    labelEn: 'Creem.io Bundle URL',
    placeholder: 'https://www.creem.io/payment/...',
  },
  {
    key: 'gumroadBundleUrl',
    labelKey: 'secondary_gumroad_label',
    labelId: 'URL Bundel Gumroad',
    labelEn: 'Gumroad Bundle URL',
    placeholder: 'https://gumroad.com/l/...',
  },
  {
    key: 'promptBaseStoreUrl',
    labelKey: 'secondary_promptbase_label',
    labelId: 'URL Profil Toko PromptBase',
    labelEn: 'PromptBase Store URL',
    placeholder: 'https://promptbase.com/profile/...',
  },
  {
    key: 'whopBundleUrl',
    labelKey: 'secondary_whop_label',
    labelId: 'URL Bundel Whop',
    labelEn: 'Whop Bundle URL',
    placeholder: 'https://whop.com/...',
  },
  {
    key: 'payhipBundleUrl',
    labelKey: 'secondary_payhip_label',
    labelId: 'URL Bundel Payhip',
    labelEn: 'Payhip Bundle URL',
    placeholder: 'https://payhip.com/b/...',
  },
];

const normalizeAgensiUrlOverrides = (overrides: AgensiUrlOverrides): AgensiUrlOverrides => ({
  affiliateUrl: overrides.affiliateUrl || '',
  creatorStoreUrl: overrides.creatorStoreUrl || '',
  affiliateRefCode: overrides.affiliateRefCode || '',
  lemonSqueezyBundleUrl: overrides.lemonSqueezyBundleUrl || '',
  creemBundleUrl: overrides.creemBundleUrl || '',
  gumroadBundleUrl: overrides.gumroadBundleUrl || '',
  promptBaseStoreUrl: overrides.promptBaseStoreUrl || '',
  whopBundleUrl: overrides.whopBundleUrl || '',
  payhipBundleUrl: overrides.payhipBundleUrl || '',
});

export const AgensiCatalogModal: React.FC<AgensiCatalogModalProps> = ({
  show,
  onClose,
  isCreatorMode = false,
  isLightTheme = false,
  initialTab = 'catalog',
  agensiUrlVersion = 0,
  onAgensiUrlsSaved,
  activeSkillSpec = null,
  activeSkillMarkdown = '',
  activeSkillValidation = null,
  hasActivePrompt = false,
  onCopyActiveSkill,
  onDownloadActiveSkill,
  onOpenSkillInStudio,
  onCopyText,
  onOpenAiSettings,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SkillModalTab>(initialTab);
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedDemoSlug, setCopiedDemoSlug] = useState<string | null>(null);
  const [copiedPackCommand, setCopiedPackCommand] = useState<string | null>(null);
  const [pitchingSlug, setPitchingSlug] = useState<string | null>(null);
  const [copiedPitchSlug, setCopiedPitchSlug] = useState<string | null>(null);
  const [isAiSuggestingActiveSkill, setIsAiSuggestingActiveSkill] = useState<boolean>(false);
  const [activeSkillAiSuggestion, setActiveSkillAiSuggestion] = useState<SkillAiSuggestionOutput | null>(null);
  const [aiOptimizerNotice, setAiOptimizerNotice] = useState<string | null>(null);
  const [agensiUrls, setAgensiUrls] = useState<AgensiUrlOverrides>(() =>
    normalizeAgensiUrlOverrides(getStoredAgensiUrlOverrides())
  );
  const [agensiSavedNotice, setAgensiSavedNotice] = useState(false);

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose]);

  useEffect(() => {
    if (show) {
      setActiveTab(initialTab);
      setCopiedSlug(null);
      setCopiedDemoSlug(null);
      setCopiedPackCommand(null);
      setPitchingSlug(null);
      setCopiedPitchSlug(null);
      setAiOptimizerNotice(null);
      setAgensiUrls(normalizeAgensiUrlOverrides(getStoredAgensiUrlOverrides()));
      setAgensiSavedNotice(false);
    }
  }, [show, initialTab]);

  const effectiveUrls = useMemo(() => {
    void agensiUrlVersion;
    return getEffectiveAgensiUrls();
  }, [agensiUrlVersion]);

  const counts = useMemo(() => {
    const all = AGENSI_CONFIG.bundledSkillPacks.length;
    const free = AGENSI_CONFIG.bundledSkillPacks.filter((p) => p.tier === 'lead-magnet').length;
    const paid = AGENSI_CONFIG.bundledSkillPacks.filter((p) => p.tier === 'flagship').length;
    return { all, free, paid };
  }, []);

  const filteredPacks = useMemo(() => {
    if (activeFilter === 'all') {
      return AGENSI_CONFIG.bundledSkillPacks;
    }
    return AGENSI_CONFIG.bundledSkillPacks.filter((pack) => pack.tier === activeFilter);
  }, [activeFilter]);

  if (!show) return null;

  const supportedAgentsCount = AGENSI_CONFIG.supportedAgents.length;
  const hasConfiguredStoreUrl = Boolean(effectiveUrls.activeUrl);
  const primarySuiteAgensiUrl = buildSuiteBundleAgensiUrl();
  const primarySuiteCtaLabel =
    effectiveUrls.creatorStoreUrl.trim() || effectiveUrls.affiliateUrl.trim()
      ? t('catalog_cta_agensi')
      : 'Agensi.io';
  const secondaryCheckoutChannels: ReadonlyArray<{
    readonly id: string;
    readonly url: string;
    readonly label: string;
  }> = [
    {
      id: 'lemonsqueezy',
      url: effectiveUrls.lemonSqueezyBundleUrl.trim(),
      label: t('suite_cta_lemonsqueezy'),
    },
    {
      id: 'creem',
      url: effectiveUrls.creemBundleUrl.trim(),
      label: t('suite_cta_creem'),
    },
    {
      id: 'gumroad',
      url: effectiveUrls.gumroadBundleUrl.trim(),
      label: t('suite_cta_gumroad'),
    },
    {
      id: 'promptbase',
      url: effectiveUrls.promptBaseStoreUrl.trim(),
      label: t('suite_cta_promptbase'),
    },
    {
      id: 'whop',
      url: (effectiveUrls.whopBundleUrl || '').trim(),
      label: language === 'id' ? 'Beli Suite di Whop' : 'Buy Suite on Whop',
    },
    {
      id: 'payhip',
      url: (effectiveUrls.payhipBundleUrl || '').trim(),
      label: language === 'id' ? 'Beli Suite di Payhip' : 'Buy Suite on Payhip',
    },
  ].filter((channel) => channel.url.length > 0);
  const showSecondaryChannels =
    hasSecondaryMarketplaceUrls(effectiveUrls) && secondaryCheckoutChannels.length > 0;

  const handleCopyListingCopy = async (pack: AgensiSkillPackItem) => {
    const summary = language === 'id' ? pack.summaryId : pack.summaryEn;
    const listing = buildAgensiListingCopy({
      slug: pack.slug,
      title: pack.title,
      description: summary,
      category: pack.matchedCategories[0] || 'General',
      priceUsd: pack.priceUsd,
      includedFiles: pack.includedFiles,
      language,
    });

    let copySucceeded = false;
    if (onCopyText) {
      try {
        await Promise.resolve(onCopyText(listing.fullMarkdown, t('toast_listing_copied')));
        copySucceeded = true;
      } catch {
        copySucceeded = false;
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(listing.fullMarkdown);
        copySucceeded = true;
      } catch {
        copySucceeded = false;
      }
    }

    if (copySucceeded) {
      setCopiedSlug(pack.slug);
      setTimeout(() => {
        setCopiedSlug((prev) => (prev === pack.slug ? null : prev));
      }, 1800);
    }
  };

  const handleCopyPackDemo = async (pack: AgensiSkillPackItem) => {
    const demo = SKILL_LISTING_DEMOS[pack.slug];
    if (!demo) return;
    const demoText = `### The Request\n${demo.demoRequest}\n\n### The Result\n${demo.demoResult}\n`;

    let copySucceeded = false;
    if (onCopyText) {
      try {
        await Promise.resolve(onCopyText(demoText, t('toast_step3_demo_copied')));
        copySucceeded = true;
      } catch {
        copySucceeded = false;
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(demoText);
        copySucceeded = true;
      } catch {
        copySucceeded = false;
      }
    }

    if (copySucceeded) {
      setCopiedDemoSlug(pack.slug);
      setTimeout(() => {
        setCopiedDemoSlug((prev) => (prev === pack.slug ? null : prev));
      }, 1800);
    }
  };

  const handleCopyPackCommand = async (slug: string, textToCopy: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopiedPackCommand(slug);
        setTimeout(() => setCopiedPackCommand(null), 1800);
      }
    } catch {
      setCopiedPackCommand(null);
    }
  };

  const handleGeneratePackPitch = async (pack: AgensiSkillPackItem) => {
    if (!isAIConfigured()) {
      if (onOpenAiSettings) {
        onOpenAiSettings();
      }
      return;
    }

    const summary = language === 'id' ? pack.summaryId : pack.summaryEn;
    setPitchingSlug(pack.slug);
    try {
      const pitchText = await generatePackPitchWithUniversalAI(pack.title, summary, language);
      let copied = false;
      if (onCopyText) {
        await Promise.resolve(onCopyText(pitchText, t('toast_skill_ai_pitch_copied')));
        copied = true;
      } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pitchText);
        copied = true;
      }
      if (copied) {
        setCopiedPitchSlug(pack.slug);
        setTimeout(() => {
          setCopiedPitchSlug((prev) => (prev === pack.slug ? null : prev));
        }, 1800);
      }
    } catch {
      // handled silently
    } finally {
      setPitchingSlug(null);
    }
  };

  const handleAiSuggestActiveSkill = async () => {
    if (!activeSkillSpec || !hasActivePrompt) return;
    if (!isAIConfigured()) {
      if (onOpenAiSettings) {
        onOpenAiSettings();
      } else {
        setAiOptimizerNotice(
          language === 'id'
            ? 'Konfigurasi provider AI terlebih dahulu pada modal Pengaturan AI.'
            : 'Configure an AI provider first in AI Settings.'
        );
      }
      return;
    }

    setIsAiSuggestingActiveSkill(true);
    setAiOptimizerNotice(null);
    try {
      const suggestion = await suggestSkillMetadataWithUniversalAI({
        skillName: activeSkillSpec.name,
        compiledPrompt: activeSkillMarkdown,
        field: 'all',
        language,
      });
      setActiveSkillAiSuggestion(suggestion);
      setAiOptimizerNotice(t('toast_skill_ai_suggested'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAiOptimizerNotice(`${t('toast_skill_ai_error')}: ${msg}`);
    } finally {
      setIsAiSuggestingActiveSkill(false);
    }
  };

  const handleSaveAgensiUrls = () => {
    saveAgensiUrlOverrides(agensiUrls);
    setAgensiUrls(normalizeAgensiUrlOverrides(getStoredAgensiUrlOverrides()));
    setAgensiSavedNotice(true);
    onAgensiUrlsSaved?.();
    setTimeout(() => setAgensiSavedNotice(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-packs-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
    >
      <div
        className={`rounded-2xl sm:rounded-3xl border max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ${
          isLightTheme
            ? 'bg-white border-slate-300 text-slate-900'
            : 'bg-[#0f172a] border-slate-800 text-slate-100'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-start justify-between gap-3 ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-[#090d16] border-slate-800'
          }`}
        >
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="skill-packs-modal-title"
                className={`text-base sm:text-lg font-bold leading-snug ${
                  isLightTheme ? 'text-slate-900' : 'text-slate-100'
                }`}
              >
                {isCreatorMode ? t('catalog_title_creator') : t('catalog_title')}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                  isLightTheme
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                }`}
              >
                {supportedAgentsCount} {t('catalog_agents_label')}
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isLightTheme ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {isCreatorMode ? t('catalog_subtitle_creator') : t('catalog_subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('close_btn')}
            className={`min-h-[44px] min-w-[44px] rounded-xl text-sm font-bold flex items-center justify-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isLightTheme
                ? 'bg-white hover:bg-slate-200 border border-slate-300 text-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Creator Mode Navigation Tabs */}
        {isCreatorMode && (
          <div className="flex items-center gap-1.5 p-2 bg-[#070b12] border-b border-slate-800 text-xs font-sans overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === 'catalog'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{t('skill_tab_catalog')}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#090d16] text-emerald-300 border border-emerald-500/30">
                {AGENSI_CONFIG.bundledSkillPacks.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className={`min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === 'export'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{t('skill_tab_export')}</span>
              {hasActivePrompt && activeSkillValidation && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeSkillValidation.valid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {activeSkillValidation.valid ? '✓ Siap' : '! Cek'}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={`min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === 'store'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{t('skill_tab_store')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeTab === 'guide'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{t('skill_tab_guide')}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#090d16] text-amber-300 border border-amber-500/30">
                3 Pilar
              </span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* TAB 1: CATALOG */}
          {(!isCreatorMode || activeTab === 'catalog') && (
            <>
              {/* Suite Bundle Hero Promo */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isLightTheme
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-slate-900'
                    : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 text-slate-100'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                      {t('suite_bundle_badge')}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-emerald-400">
                      {SUITE_BUNDLE_INFO.flagshipCount} Flagship · {SUITE_BUNDLE_INFO.savingsPercent}% {language === 'id' ? 'Hemat' : 'Off'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    {t('suite_bundle_title')}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {t('suite_bundle_desc')}
                  </p>
                  <p className="text-xs font-mono font-semibold text-emerald-300 pt-0.5">
                    {SUITE_BUNDLE_INFO.bundlePriceLabel}{' '}
                    <span className="line-through text-slate-500 text-[11px]">${SUITE_BUNDLE_INFO.individualTotalUsd.toFixed(2)}</span>
                  </p>
                </div>

                <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0">
                  <a
                    href={primarySuiteAgensiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <span>{primarySuiteCtaLabel}</span>
                    <span>↗</span>
                  </a>

                  {showSecondaryChannels &&
                    secondaryCheckoutChannels.map((channel) => (
                      <a
                        key={channel.id}
                        href={channel.url}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[44px] px-3 py-1.5 rounded-xl font-medium text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        <span>{channel.label}</span>
                        <span>↗</span>
                      </a>
                    ))}

                  {isCreatorMode && !showSecondaryChannels && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('store')}
                      className="min-h-[44px] px-3 py-1.5 rounded-xl font-medium text-xs bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-dashed border-emerald-500/40 flex items-center justify-center gap-1 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <span>⚙️ {language === 'id' ? 'Atur 6 Pasar Lainnya' : 'Connect 6 Other Markets'}</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-sans">
                {[
                  { id: 'all', label: `${t('catalog_filter_all')} (${counts.all})` },
                  { id: 'lead-magnet', label: `${t('catalog_filter_free')} (${counts.free})` },
                  { id: 'flagship', label: `${t('catalog_filter_paid')} (${counts.paid})` },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveFilter(item.id as CatalogFilter)}
                    className={`min-h-[44px] sm:min-h-[34px] px-3.5 py-1 rounded-xl font-semibold border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      activeFilter === item.id
                        ? isLightTheme
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                        : isLightTheme
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Skill Packs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredPacks.map((pack) => {
                  const summary = language === 'id' ? pack.summaryId : pack.summaryEn;
                  const packCtaUrl = buildAgensiPackCtaUrl(pack);
                  const isCopied = copiedSlug === pack.slug;
                  const isDemoCopied = copiedDemoSlug === pack.slug;
                  const isCommandCopied = copiedPackCommand === pack.slug;

                  return (
                    <div
                      key={pack.slug}
                      className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 min-w-0 transition-colors ${
                        isLightTheme
                          ? 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
                          : 'bg-[#0b1120] border-slate-800/90 shadow-md hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span
                              className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${
                                pack.tier === 'lead-magnet'
                                  ? isLightTheme
                                    ? 'bg-slate-100 text-slate-800 border-slate-300'
                                    : 'bg-slate-900 text-slate-300 border-slate-700'
                                  : isLightTheme
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              {pack.tier === 'lead-magnet' ? 'Free Starter' : 'Flagship'}
                            </span>
                            <h4
                              className={`text-sm font-bold leading-snug mt-1 break-words ${
                                isLightTheme ? 'text-slate-900' : 'text-slate-100'
                              }`}
                            >
                              {pack.title}
                            </h4>
                          </div>
                          <span
                            className={`text-sm font-bold font-mono px-2 py-1 rounded-lg shrink-0 border ${
                              isLightTheme
                                ? 'bg-slate-100 text-slate-900 border-slate-300'
                                : 'bg-slate-900 text-emerald-400 border-slate-800'
                            }`}
                          >
                            {pack.priceLabel}
                          </span>
                        </div>

                        <p
                          className={`text-xs leading-relaxed line-clamp-3 ${
                            isLightTheme ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {summary}
                        </p>

                        {/* Included files */}
                        <div className="pt-1 space-y-1">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                            isLightTheme ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {t('catalog_included_files')}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {pack.includedFiles.map((file, fIdx) => (
                              <span
                                key={fIdx}
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                  isLightTheme
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : 'bg-slate-900/90 text-slate-300 border-slate-800'
                                }`}
                              >
                                {file}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                        {isCreatorMode ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyPackCommand(pack.slug, pack.validatorScript || pack.folderPath)
                              }
                              className="min-h-[44px] sm:min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                              title={pack.validatorScript || pack.folderPath}
                            >
                              {isCommandCopied ? '✓ Copied' : pack.validatorScript ? 'Copy Check' : 'Copy Path'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyListingCopy(pack)}
                              className={`min-h-[44px] sm:min-h-[34px] px-3 py-1 rounded-lg font-semibold text-xs border transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                                isCopied
                                  ? 'bg-emerald-700 border-emerald-600 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-emerald-300'
                              }`}
                            >
                              <span>{isCopied ? `✓ ${t('copied_btn')}` : t('copy_listing_btn')}</span>
                            </button>

                            {onOpenSkillInStudio && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSkillInStudio(pack.slug);
                                  onClose();
                                }}
                                className="min-h-[44px] sm:min-h-[34px] px-2.5 py-1 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                title={language === 'id' ? 'Buka dan edit paket ini di Studio' : 'Open and edit this pack in Studio'}
                              >
                                <span>✏️</span>
                                <span>{t('edit_in_studio_btn')}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleCopyPackDemo(pack)}
                              className={`min-h-[44px] sm:min-h-[34px] px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                                isDemoCopied
                                  ? 'bg-emerald-700 border-emerald-600 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                              }`}
                              title="Copy Step 3 Demo (Request & Result)"
                            >
                              {isDemoCopied ? `✓ ${t('copied_btn')}` : language === 'id' ? 'Demo Step 3' : 'Step 3 Demo'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleGeneratePackPitch(pack)}
                              disabled={pitchingSlug === pack.slug}
                              className={`min-h-[44px] sm:min-h-[34px] px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center gap-1 disabled:opacity-50 ${
                                copiedPitchSlug === pack.slug
                                  ? 'bg-emerald-700 border-emerald-600 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                              }`}
                              title={language === 'id' ? 'Buat draf promosi media sosial dengan AI' : 'Generate AI promotional pitch for social media'}
                            >
                              <span className={pitchingSlug === pack.slug ? 'animate-spin' : ''}>✨</span>
                              <span>
                                {pitchingSlug === pack.slug
                                  ? (language === 'id' ? 'Menyusun...' : 'Drafting...')
                                  : copiedPitchSlug === pack.slug
                                  ? `✓ ${t('copied_btn')}`
                                  : t('skill_ai_pitch_btn')}
                              </span>
                            </button>

                            <div className="flex-1" />

                            <a
                              href={packCtaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="min-h-[44px] sm:min-h-[34px] px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            >
                              <span>Preview ↗</span>
                            </a>
                          </>
                        ) : (
                          <div className="flex flex-col gap-1.5 w-full">
                            <a
                              href={packCtaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="min-h-[44px] sm:min-h-[36px] w-full px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            >
                              <span>{hasConfiguredStoreUrl ? t('catalog_cta_agensi') : 'Agensi.io'}</span>
                              <span>↗</span>
                            </a>
                            {showSecondaryChannels && (
                              <div className="flex items-center gap-1 overflow-x-auto text-[10px] pb-0.5 scrollbar-thin">
                                {secondaryCheckoutChannels.map((channel) => (
                                  <a
                                    key={channel.id}
                                    href={channel.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap"
                                  >
                                    {channel.id === 'lemonsqueezy'
                                      ? 'Lemon Squeezy'
                                      : channel.id === 'gumroad'
                                      ? 'Gumroad'
                                      : channel.id === 'promptbase'
                                      ? 'PromptBase'
                                      : channel.id === 'whop'
                                      ? 'Whop'
                                      : channel.id === 'payhip'
                                      ? 'Payhip'
                                      : channel.id === 'creem'
                                      ? 'Creem.io'
                                      : channel.id} ↗
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 2: ACTIVE FORMULA EXPORT (Creator Mode) */}
          {isCreatorMode && activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Open Agent Skill Compiler
                    </span>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>{language === 'id' ? 'Ekspor Formula Aktif ke SKILL.md & ZIP' : 'Active Formula SKILL.md & ZIP Export'}</span>
                    </h3>
                  </div>

                  {hasActivePrompt && activeSkillValidation && (
                    <span
                      className={`px-2.5 py-1 rounded-xl border font-mono text-xs font-semibold ${
                        activeSkillValidation.valid
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      {activeSkillValidation.valid ? t('skill_valid_badge') : t('skill_invalid_badge')} • name{' '}
                      {activeSkillValidation.nameLength}/64
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {hasActivePrompt && activeSkillSpec ? (
                      <>
                        <strong className="text-slate-100">Nama Skill:</strong>{' '}
                        <code className="text-emerald-400 font-mono">{activeSkillSpec.name}</code> (
                        {activeSkillMarkdown.split('\n').length} baris Markdown/YAML)
                      </>
                    ) : (
                      language === 'id'
                        ? 'Pilih formula apa saja di Galeri atau Studio untuk mengompilasi dokumen SKILL.md siap pakai.'
                        : 'Select any formula in Gallery or Studio to compile an export-ready SKILL.md document.'
                    )}
                  </p>
                  {activeSkillSpec && (
                    <p className="text-[11px] text-slate-400 font-mono truncate" title={activeSkillSpec.description}>
                      <strong>Deskripsi:</strong> {activeSkillSpec.description}
                    </p>
                  )}
                </div>

                {hasActivePrompt && activeSkillSpec && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {onCopyActiveSkill && (
                      <button
                        type="button"
                        onClick={onCopyActiveSkill}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        {t('copy_skill_btn')}
                      </button>
                    )}
                    {onDownloadActiveSkill && (
                      <button
                        type="button"
                        onClick={onDownloadActiveSkill}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        {t('download_skill_btn')}
                      </button>
                    )}
                    {onOpenSkillInStudio && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSkillInStudio();
                          onClose();
                        }}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        {language === 'id' ? 'Buka Tab SKILL.md di Studio →' : 'Open SKILL.md Tab in Studio →'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* AI Skill Listing & Demo Optimizer Card */}
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span>✨</span>
                        <span>{language === 'id' ? 'Asisten Kreator AI' : 'AI Creator Assistant'}</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">
                      {t('skill_ai_optimizer_title')}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                      {t('skill_ai_optimizer_desc')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAiSuggestActiveSkill}
                    disabled={isAiSuggestingActiveSkill || !hasActivePrompt}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <span className={isAiSuggestingActiveSkill ? 'animate-spin' : ''}>✨</span>
                    <span>
                      {isAiSuggestingActiveSkill
                        ? (language === 'id' ? 'Menyusun Profil & Demo...' : 'Generating Listing...')
                        : t('skill_ai_optimizer_btn')}
                    </span>
                  </button>
                </div>

                {aiOptimizerNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                    {aiOptimizerNotice}
                  </div>
                )}

                {activeSkillAiSuggestion && (
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeSkillAiSuggestion.title && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                            {t('skill_field_title')}
                          </span>
                          <p className="font-semibold text-slate-200">{activeSkillAiSuggestion.title}</p>
                        </div>
                      )}
                      {activeSkillAiSuggestion.tagline && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                            {t('skill_field_tagline')}
                          </span>
                          <p className="text-slate-300">{activeSkillAiSuggestion.tagline}</p>
                        </div>
                      )}
                    </div>

                    {activeSkillAiSuggestion.tags && activeSkillAiSuggestion.tags.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          {t('skill_field_tags')}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeSkillAiSuggestion.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-emerald-300 border border-slate-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSkillAiSuggestion.demoRequest && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {t('skill_demo_request_label')}
                        </span>
                        <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                          {activeSkillAiSuggestion.demoRequest}
                        </pre>
                      </div>
                    )}

                    {activeSkillAiSuggestion.demoResult && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {t('skill_demo_result_label')}
                        </span>
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
                          {activeSkillAiSuggestion.demoResult}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                      {activeSkillAiSuggestion.demoRequest && activeSkillAiSuggestion.demoResult && (
                        <button
                          type="button"
                          onClick={() => {
                            const demoText = `### The Request\n${activeSkillAiSuggestion.demoRequest}\n\n### The Result\n${activeSkillAiSuggestion.demoResult}\n`;
                            if (onCopyText) {
                              onCopyText(demoText, t('toast_step3_demo_copied'));
                            } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                              navigator.clipboard.writeText(demoText);
                            }
                          }}
                          className="min-h-[44px] sm:min-h-[34px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          📋 {language === 'id' ? 'Salin Demo Step 3' : 'Copy Step 3 Demo'}
                        </button>
                      )}

                      {activeSkillSpec && (
                        <button
                          type="button"
                          onClick={() => {
                            const jsonLd = JSON.stringify({
                              '@context': 'https://schema.org',
                              '@type': 'SoftwareApplication',
                              name: activeSkillAiSuggestion.title || activeSkillSpec.name,
                              description: activeSkillAiSuggestion.tagline || activeSkillSpec.description,
                              applicationCategory: 'DeveloperApplication',
                              operatingSystem: 'Cross-platform',
                              offers: {
                                '@type': 'Offer',
                                price: (activeSkillAiSuggestion.priceUsd || 14.99).toFixed(2),
                                priceCurrency: 'USD',
                              },
                              keywords: (activeSkillAiSuggestion.tags || ['open-agent-skills', 'agent-skill', 'ai-agent']).join(', '),
                            }, null, 2);
                            if (onCopyText) {
                              onCopyText(jsonLd, t('toast_jsonld_copied'));
                            } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                              navigator.clipboard.writeText(jsonLd);
                            }
                          }}
                          className="min-h-[44px] sm:min-h-[34px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          ⚡ {t('skill_copy_jsonld_btn')}
                        </button>
                      )}

                      {onOpenSkillInStudio && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenSkillInStudio();
                            onClose();
                          }}
                          className="min-h-[44px] sm:min-h-[34px] px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          🛠️ {language === 'id' ? 'Buka di Studio SKILL.md untuk Menyunting' : 'Open in Studio SKILL.md to Edit'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 8 CLI Runner Testing Guide Card */}
              <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-4 space-y-2.5">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    {language === 'id'
                      ? 'Panduan Uji Coba Cepat 8 CLI Runner'
                      : '8 CLI Runner Rapid Testing Guide'}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {language === 'id'
                    ? 'Ekstrak file ZIP hasil unduhan ke folder root proyek Anda. File SKILL.md akan otomatis dideteksi oleh Antigravity, Gemini CLI, Claude Code, Cursor, Copilot, OpenCode, Codex, dan Aider.'
                    : 'Extract the downloaded ZIP archive into your project root. The SKILL.md file will be automatically recognized by Antigravity, Gemini CLI, Claude Code, Cursor, Copilot, OpenCode, Codex, and Aider.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: 7 TOKO & MARKETPLACE INTEGRATION DASHBOARD (Creator Mode) */}
          {isCreatorMode && activeTab === 'store' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                      <span>🛍️</span>
                      <span>
                        {language === 'id'
                          ? 'Dashboard Integrasi 7 Toko & Marketplace'
                          : '7 Storefront & Marketplace Integration Dashboard'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'id'
                        ? 'Kelola tautan toko dan checkout produk digital Anda di 7 platform utama tanpa monopoli. Pengaturan disimpan 100% lokal di browser Anda.'
                        : 'Manage your storefront and checkout links across 7 major commercial platforms without monopoly. Stored 100% locally.'}
                    </p>
                  </div>
                  {agensiSavedNotice && (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                      ✓ {t('agensi_urls_saved')}
                    </span>
                  )}
                </div>

                {/* 7 Commercial Marketplace Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* 1. Gumroad */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🌸</span>
                        <span className="font-bold text-slate-100 text-xs">Gumroad</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500/15 border border-pink-500/30 text-pink-300">
                          Fee 10% Flat
                        </span>
                        <a
                          href="https://gumroad.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Situs ↗
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'id'
                        ? 'Storefront universal ramah pemula. Mendukung kartu kredit global, PayPal, dan payout transfer bank IDR langsung.'
                        : 'Universal creator storefront. Supports global cards, PayPal, and direct IDR bank transfer payouts.'}
                    </p>
                    <label className="space-y-1 block">
                      <span className="text-[11px] font-medium text-slate-300 block">
                        URL Bundel Gumroad
                      </span>
                      <input
                        type="url"
                        value={agensiUrls.gumroadBundleUrl || ''}
                        onChange={(e) => {
                          setAgensiSavedNotice(false);
                          setAgensiUrls((prev) => ({ ...prev, gumroadBundleUrl: e.target.value }));
                        }}
                        placeholder="https://gumroad.com/l/your-bundle"
                        className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </label>
                  </div>

                  {/* 2. Lemon Squeezy */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🍋</span>
                        <span className="font-bold text-slate-100 text-xs">Lemon Squeezy</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-300">
                          Fee 5% + $0.50 (MoR)
                        </span>
                        <a
                          href="https://lemonsqueezy.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Situs ↗
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'id'
                        ? 'Merchant of Record resmi. Pajak PPN/VAT global ditangani otomatis. Payout langsung ke rekening bank Indonesia (~1% fee).'
                        : 'Official Merchant of Record. Handles global VAT/sales tax automatically. Direct IDR bank payout (~1% fee).'}
                    </p>
                    <label className="space-y-1 block">
                      <span className="text-[11px] font-medium text-slate-300 block">
                        URL Bundel Lemon Squeezy
                      </span>
                      <input
                        type="url"
                        value={agensiUrls.lemonSqueezyBundleUrl || ''}
                        onChange={(e) => {
                          setAgensiSavedNotice(false);
                          setAgensiUrls((prev) => ({ ...prev, lemonSqueezyBundleUrl: e.target.value }));
                        }}
                        placeholder="https://store.lemonsqueezy.com/buy/..."
                        className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </label>
                  </div>

                  {/* 3. PromptBase */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">⚡</span>
                        <span className="font-bold text-slate-100 text-xs">PromptBase</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
                          Payout 80% (0% via Ref)
                        </span>
                        <a
                          href="https://promptbase.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Situs ↗
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'id'
                        ? 'Pasar prompt nomor 1 dunia dengan jutaan pencari prompt. Payout harian via Zoneless USDC Solana ke dompet kripto.'
                        : 'World\'s #1 prompt marketplace with millions of active buyers. Daily payout via Zoneless USDC Solana.'}
                    </p>
                    <label className="space-y-1 block">
                      <span className="text-[11px] font-medium text-slate-300 block">
                        URL Profil Toko PromptBase
                      </span>
                      <input
                        type="url"
                        value={agensiUrls.promptBaseStoreUrl || ''}
                        onChange={(e) => {
                          setAgensiSavedNotice(false);
                          setAgensiUrls((prev) => ({ ...prev, promptBaseStoreUrl: e.target.value }));
                        }}
                        placeholder="https://promptbase.com/profile/yourhandle"
                        className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </label>
                  </div>

                  {/* 4. Whop */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🚀</span>
                        <span className="font-bold text-slate-100 text-xs">Whop</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/15 border border-orange-500/30 text-orange-300">
                          Fee 3% Rendah
                        </span>
                        <a
                          href="https://whop.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Situs ↗
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'id'
                        ? 'Marketplace software dan komunitas AI modern dengan potongan terendah (3%). Payout via Stripe Express dan Crypto.'
                        : 'Modern AI software and community marketplace with ultra-low 3% fee. Payout via Stripe Express and Crypto.'}
                    </p>
                    <label className="space-y-1 block">
                      <span className="text-[11px] font-medium text-slate-300 block">
                        URL Bundel Whop
                      </span>
                      <input
                        type="url"
                        value={agensiUrls.whopBundleUrl || ''}
                        onChange={(e) => {
                          setAgensiSavedNotice(false);
                          setAgensiUrls((prev) => ({ ...prev, whopBundleUrl: e.target.value }));
                        }}
                        placeholder="https://whop.com/your-product"
                        className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </label>
                  </div>

                  {/* 5. Creem.io */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🍦</span>
                        <span className="font-bold text-slate-100 text-xs">Creem.io</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 border border-purple-500/30 text-purple-300">
                          MoR AI & USDC ~2%
                        </span>
                        <a
                          href="https://www.creem.io"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Situs ↗
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'id'
                        ? 'MoR ramah kreator AI dengan penyelesaian instan via USDC Polygon (hampir 0 biaya transaksi) atau rekening bank lokal.'
                        : 'AI creator MoR with instant settlement via USDC Polygon (near-zero fee) or local bank accounts.'}
                    </p>
                    <label className="space-y-1 block">
                      <span className="text-[11px] font-medium text-slate-300 block">
                        URL Bundel Creem.io
                      </span>
                      <input
                        type="url"
                        value={agensiUrls.creemBundleUrl || ''}
                        onChange={(e) => {
                          setAgensiSavedNotice(false);
                          setAgensiUrls((prev) => ({ ...prev, creemBundleUrl: e.target.value }));
                        }}
                        placeholder="https://www.creem.io/payment/..."
                        className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </label>
                  </div>

                  {/* 6. Payhip */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🛒</span>
                        <span className="font-bold text-slate-100 text-xs">Payhip</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/15 border border-teal-500/30 text-teal-300">
                          Fee 0% - 5%
                        </span>
                        <a
                          href="https://payhip.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Situs ↗
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'id'
                        ? 'Storefront digital bersih tanpa biaya bulanan. Pembayaran langsung masuk ke akun PayPal atau Stripe Anda.'
                        : 'Clean digital storefront with zero monthly fee. Payments land instantly into your PayPal or Stripe account.'}
                    </p>
                    <label className="space-y-1 block">
                      <span className="text-[11px] font-medium text-slate-300 block">
                        URL Bundel Payhip
                      </span>
                      <input
                        type="url"
                        value={agensiUrls.payhipBundleUrl || ''}
                        onChange={(e) => {
                          setAgensiSavedNotice(false);
                          setAgensiUrls((prev) => ({ ...prev, payhipBundleUrl: e.target.value }));
                        }}
                        placeholder="https://payhip.com/b/your-product"
                        className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </label>
                  </div>

                  {/* 7. Agensi.io */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🤖</span>
                        <span className="font-bold text-slate-100 text-xs">Agensi.io</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          Pasar Khusus Skill Agen AI (70-80% Payout)
                        </span>
                        <a
                          href="https://agensi.io"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Situs ↗
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'id'
                        ? 'Marketplace spesialis ekosistem agen AI otonom. Mendukung listing paket .zip skill dan payout via Zoneless USDC Solana.'
                        : 'Specialized autonomous AI agent marketplace. Supports skill .zip packages and payouts via Zoneless USDC Solana.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <label className="space-y-1 block">
                        <span className="text-[11px] font-medium text-slate-300 block">
                          URL Toko Kreator Agensi.io
                        </span>
                        <input
                          type="url"
                          value={agensiUrls.creatorStoreUrl || ''}
                          onChange={(e) => {
                            setAgensiSavedNotice(false);
                            setAgensiUrls((prev) => ({ ...prev, creatorStoreUrl: e.target.value }));
                          }}
                          placeholder="https://agensi.io/@yourhandle"
                          className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        />
                      </label>
                      <label className="space-y-1 block">
                        <span className="text-[11px] font-medium text-slate-300 block">
                          URL Afiliasi Agensi.io
                        </span>
                        <input
                          type="url"
                          value={agensiUrls.affiliateUrl || ''}
                          onChange={(e) => {
                            setAgensiSavedNotice(false);
                            setAgensiUrls((prev) => ({ ...prev, affiliateUrl: e.target.value }));
                          }}
                          placeholder="https://agensi.io/?ref=yourhandle"
                          className="w-full min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2 border-t border-slate-800">
                  <label className="space-y-1 block flex-1">
                    <span className="text-xs font-semibold text-slate-200 block">
                      Kode Referral / Handle Kreator Global
                    </span>
                    <input
                      type="text"
                      value={agensiUrls.affiliateRefCode}
                      onChange={(e) => {
                        setAgensiSavedNotice(false);
                        setAgensiUrls((prev) => ({ ...prev, affiliateRefCode: e.target.value }));
                      }}
                      placeholder="sigitadi"
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSaveAgensiUrls}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Simpan Semua URL Toko
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DISTRIBUTION & PAYOUT GUIDE (Creator Mode) */}
          {isCreatorMode && activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    <span>📚</span>
                    <span>
                      {language === 'id'
                        ? 'Matriks Komparasi 8 Marketplace & Panduan Payout'
                        : '8-Marketplace Comparison Matrix & Payout Guide'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'id'
                      ? 'Strategi distribusi multi-pasar mandiri untuk memaksimalkan pendapatan tanpa ketergantungan pada satu platform.'
                      : 'Independent multi-market distribution strategy to maximize revenue without platform lock-in.'}
                  </p>
                </div>

                {/* 8-Marketplace Comparison Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs font-sans min-w-[620px]">
                    <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Platform</th>
                        <th className="p-2.5">Model Bisnis</th>
                        <th className="p-2.5">Biaya (Fee)</th>
                        <th className="p-2.5">Payout Indonesia</th>
                        <th className="p-2.5">Format Deliverable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>🌸</span> Gumroad
                        </td>
                        <td className="p-2.5">Direct Storefront</td>
                        <td className="p-2.5 text-amber-300 font-mono">10% Flat</td>
                        <td className="p-2.5">Direct IDR Bank / PayPal</td>
                        <td className="p-2.5 font-mono text-[10px]">ZIP Bundle Lengkap</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>🍋</span> Lemon Squeezy
                        </td>
                        <td className="p-2.5">Merchant of Record (MoR)</td>
                        <td className="p-2.5 text-amber-300 font-mono">5% + $0.50</td>
                        <td className="p-2.5 text-emerald-300">Direct IDR Bank (~1%)</td>
                        <td className="p-2.5 font-mono text-[10px]">ZIP Bundle Lengkap</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>⚡</span> PromptBase
                        </td>
                        <td className="p-2.5">Prompt Marketplace</td>
                        <td className="p-2.5 text-amber-300 font-mono">20% (Kreator 80%)</td>
                        <td className="p-2.5 text-emerald-300">Zoneless USDC Solana</td>
                        <td className="p-2.5 font-mono text-[10px]">Template [Variabel]</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>🚀</span> Whop
                        </td>
                        <td className="p-2.5">Komunitas & Software</td>
                        <td className="p-2.5 text-emerald-400 font-mono">3% Flat</td>
                        <td className="p-2.5">Stripe Express / Crypto</td>
                        <td className="p-2.5 font-mono text-[10px]">Akses File / Repo</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>🍦</span> Creem.io
                        </td>
                        <td className="p-2.5">AI Creator MoR</td>
                        <td className="p-2.5 text-purple-300 font-mono">~2% USDC / 4% Fiat</td>
                        <td className="p-2.5 text-emerald-300">USDC Polygon Instan</td>
                        <td className="p-2.5 font-mono text-[10px]">ZIP Bundle Lengkap</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>🛒</span> Payhip
                        </td>
                        <td className="p-2.5">Digital Storefront</td>
                        <td className="p-2.5 text-teal-300 font-mono">0% (5% / trxn)</td>
                        <td className="p-2.5">Instant PayPal / Stripe</td>
                        <td className="p-2.5 font-mono text-[10px]">ZIP Bundle Lengkap</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>🤖</span> Agensi.io
                        </td>
                        <td className="p-2.5">AI Agent Skills Hub</td>
                        <td className="p-2.5 text-amber-300 font-mono">20% - 30%</td>
                        <td className="p-2.5 text-emerald-300">Zoneless USDC / Bank</td>
                        <td className="p-2.5 font-mono text-[10px]">Paket Skill .ZIP</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 bg-slate-950/40">
                        <td className="p-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                          <span>🐙</span> GitHub OSS
                        </td>
                        <td className="p-2.5">Open Source Lead Magnet</td>
                        <td className="p-2.5 text-emerald-400 font-mono">0% (Gratis)</td>
                        <td className="p-2.5 text-slate-400">Reputasi & Lead Corong</td>
                        <td className="p-2.5 font-mono text-[10px]">npx skills add / Repo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4 Pillars Omnichannel Strategy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <p className="font-bold text-cyan-300 text-xs">
                      1. Lead Magnet OSS
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Bagikan 1 skill gratis di GitHub, skills.sh, dan Product Hunt. Bangun reputasi developer dan arahkan pengguna ke paket berbayar.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <p className="font-bold text-emerald-300 text-xs">
                      2. Global MoR Storefront
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Jual bundel flagship di Lemon Squeezy dan Gumroad. Biarkan MoR menangani pajak global (PPN/VAT) dan terima payout ke bank lokal.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <p className="font-bold text-yellow-300 text-xs">
                      3. Pasar Prompt Tertarget
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Unggah format variabel ke PromptBase dan paket skill ke Agensi.io untuk menjangkau jutaan pengguna yang siap membeli langsung.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <p className="font-bold text-purple-300 text-xs">
                      4. SEO & GEO AI Engine
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Sematkan Schema.org JSON-LD dan FAQ berstruktur agar produk Anda muncul di Google Rich Snippets dan kutipan Perplexity AI.
                    </p>
                  </div>
                </div>

                {/* Indonesia Payout Advisory */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Rekomendasi Jalur Payout Kreator Indonesia:</span>
                  </div>
                  <p>
                    Hindari menggunakan saldo akun USD Wise Indonesia untuk penampungan dana bisnis karena pembatasan regulasi perbankan. Gunakan jalur yang telah teruji:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-amber-100/90">
                    <li><strong>Direct IDR Bank:</strong> Lemon Squeezy dan Gumroad mentransfer langsung ke rekening BCA/Mandiri/BRI Anda dengan potongan kurs rendah (~1%).</li>
                    <li><strong>USDC Polygon:</strong> Creem.io mengirimkan stablecoin instan dengan biaya gas transaksi hampir Rp 0, dapat dicairkan langsung di Pintu/Indodax.</li>
                    <li><strong>Zoneless USDC Solana:</strong> PromptBase dan Agensi.io mendukung penarikan USDC harian dengan biaya transaksi sangat minim.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-3.5 sm:p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-[#090d16] border-slate-800'
          }`}
        >
          <div className="space-y-0.5">
            <p className="font-semibold text-emerald-400">
              {t('skill_agensi_ready_title')}
            </p>
            <p className="text-[11px] text-slate-400">
              {language === 'id'
                ? `${AGENSI_CONFIG.commissionInfo.standardSharePercent}% bagian kreator (${AGENSI_CONFIG.commissionInfo.affiliateNewBuyerSharePercent}% via afiliasi, ${AGENSI_CONFIG.commissionInfo.listingModel}).`
                : `${AGENSI_CONFIG.commissionInfo.standardSharePercent}% creator share (${AGENSI_CONFIG.commissionInfo.affiliateNewBuyerSharePercent}% via affiliate, ${AGENSI_CONFIG.commissionInfo.listingModel}).`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {t('close_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgensiCatalogModal;
