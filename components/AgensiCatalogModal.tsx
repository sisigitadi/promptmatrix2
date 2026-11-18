import React, { useEffect, useMemo, useState } from 'react';
import {
  AGENSI_CONFIG,
  AgensiSkillPackItem,
  SUITE_BUNDLE_INFO,
  buildAgensiPackCtaUrl,
  getEffectiveAgensiUrls,
  hasSecondaryMarketplaceUrls,
} from '../config/agensiConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { buildAgensiListingCopy } from '../services/skillZipService';

export interface AgensiCatalogModalProps {
  show: boolean;
  onClose: () => void;
  isCreatorMode?: boolean;
  isLightTheme?: boolean;
  onOpenCreatorSettings?: () => void;
  onCopyText?: (text: string, toastMessage?: string) => void;
  agensiUrlVersion?: number;
}

type CatalogFilter = 'all' | 'lead-magnet' | 'flagship';

export const AgensiCatalogModal: React.FC<AgensiCatalogModalProps> = ({
  show,
  onClose,
  isCreatorMode = false,
  isLightTheme = false,
  onOpenCreatorSettings,
  onCopyText,
  agensiUrlVersion = 0,
}) => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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
      setCopiedSlug(null);
    }
  }, [show]);

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
  const primarySuiteAgensiUrl =
    effectiveUrls.creatorStoreUrl.trim() ||
    effectiveUrls.affiliateUrl.trim() ||
    AGENSI_CONFIG.marketplaceBaseUrl;
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

    if (onCopyText) {
      onCopyText(listing.fullMarkdown, t('toast_listing_copied'));
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(listing.fullMarkdown);
      } catch {
        // Ignore clipboard errors gracefully
      }
    }

    setCopiedSlug(pack.slug);
    setTimeout(() => {
      setCopiedSlug((prev) => (prev === pack.slug ? null : prev));
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agensi-catalog-modal-title"
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
                id="agensi-catalog-modal-title"
                className={`text-base sm:text-lg font-bold leading-snug ${
                  isLightTheme ? 'text-slate-900' : 'text-slate-100'
                }`}
              >
                {t('catalog_title')}
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
              {t('catalog_subtitle')}
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
            ✕
          </button>
        </div>

        {/* Creator Mode Bar */}
        {isCreatorMode && (
          <div
            className={`px-4 sm:px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
              isLightTheme
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 shrink-0">
                Creator Mode
              </span>
              <span className="leading-snug">
                {language === 'id'
                  ? 'Salin listing copy Agensi.io siap tempel atau kelola URL afiliasi & toko.'
                  : 'Copy ready-to-paste Agensi.io listing copy or configure your affiliate and storefront URLs.'}
              </span>
            </div>

            {onOpenCreatorSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCreatorSettings();
                }}
                className={`min-h-[44px] px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isLightTheme
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {t('agensi_urls_title')}
              </button>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div
          className={`px-4 sm:px-5 py-3 border-b flex flex-wrap items-center gap-2 ${
            isLightTheme ? 'bg-white border-slate-200' : 'bg-[#0f172a] border-slate-800'
          }`}
        >
          {(
            [
              { id: 'all', label: `${t('catalog_filter_all')} (${counts.all})` },
              { id: 'lead-magnet', label: `${t('catalog_filter_free')} (${counts.free})` },
              { id: 'flagship', label: `${t('catalog_filter_paid')} (${counts.paid})` },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isActive
                    ? isLightTheme
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'bg-emerald-600 border-emerald-500 text-white'
                    : isLightTheme
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-[#090d16] hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Suite Bundle & Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Suite Bundle & Multi-Channel Checkout Section */}
          <section
            aria-labelledby="suite-bundle-heading"
            className={`rounded-2xl border p-4 space-y-3 ${
              isLightTheme
                ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                : 'bg-[#090d16] border-emerald-500/35 text-slate-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                      isLightTheme
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {t('suite_bundle_badge')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono border break-all ${
                      isLightTheme
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-slate-900 border-slate-700 text-slate-200'
                    }`}
                  >
                    {SUITE_BUNDLE_INFO.zipFilename}
                  </span>
                </div>

                <h3
                  id="suite-bundle-heading"
                  className={`text-sm sm:text-base font-bold leading-snug break-words ${
                    isLightTheme ? 'text-slate-900' : 'text-slate-100'
                  }`}
                >
                  {t('suite_bundle_title')}
                </h3>

                <p
                  className={`text-xs leading-relaxed break-words ${
                    isLightTheme ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {t('suite_bundle_desc')}
                </p>
              </div>

              <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-1.5 shrink-0">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-lg font-mono font-bold ${
                      isLightTheme ? 'text-slate-900' : 'text-slate-100'
                    }`}
                  >
                    {SUITE_BUNDLE_INFO.bundlePriceLabel}
                  </span>
                  <span
                    className={`text-xs font-mono line-through ${
                      isLightTheme ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    ${SUITE_BUNDLE_INFO.individualTotalUsd.toFixed(2)}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                    isLightTheme
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {language === 'id'
                    ? `${SUITE_BUNDLE_INFO.flagshipCount} Flagship · Hemat $${SUITE_BUNDLE_INFO.savingsUsd.toFixed(2)} (${SUITE_BUNDLE_INFO.savingsPercent}%)`
                    : `${SUITE_BUNDLE_INFO.flagshipCount} Flagship · Save $${SUITE_BUNDLE_INFO.savingsUsd.toFixed(2)} (${SUITE_BUNDLE_INFO.savingsPercent}%)`}
                </span>
              </div>
            </div>

            <div
              className={`pt-3 border-t flex flex-wrap items-center gap-2 ${
                isLightTheme ? 'border-emerald-200' : 'border-slate-800'
              }`}
            >
              <a
                href={primarySuiteAgensiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isLightTheme
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                <span>{primarySuiteCtaLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>

              {showSecondaryChannels &&
                secondaryCheckoutChannels.map((channel) => (
                  <a
                    key={channel.id}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isLightTheme
                        ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100'
                    }`}
                  >
                    <span>{channel.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPacks.map((pack) => {
              const isFreeStarter = pack.tier === 'lead-magnet';
              const summary = language === 'id' ? pack.summaryId : pack.summaryEn;
              const packCtaUrl = buildAgensiPackCtaUrl(pack);
              const isCopied = copiedSlug === pack.slug;

              return (
                <article
                  key={pack.slug}
                  className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 min-w-0 ${
                    isLightTheme
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-[#090d16] border-slate-800 text-slate-100'
                  }`}
                >
                  <div className="space-y-2.5 min-w-0">
                    {/* Title, Tier, Price */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                              isFreeStarter
                                ? isLightTheme
                                  ? 'bg-cyan-100 border-cyan-300 text-cyan-900'
                                  : 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300'
                                : isLightTheme
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                                  : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                            }`}
                          >
                            {isFreeStarter ? 'Lead Magnet' : 'Flagship'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                              isLightTheme
                                ? 'bg-white border-slate-300 text-slate-700'
                                : 'bg-slate-900 border-slate-700 text-slate-300'
                            }`}
                          >
                            {supportedAgentsCount} agents
                          </span>
                        </div>
                        <h3
                          className={`text-sm font-bold leading-snug break-words ${
                            isLightTheme ? 'text-slate-900' : 'text-slate-100'
                          }`}
                        >
                          {pack.title}
                        </h3>
                        <p
                          className={`text-[11px] font-mono truncate ${
                            isLightTheme ? 'text-emerald-800' : 'text-emerald-400'
                          }`}
                        >
                          {pack.slug}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border shrink-0 ${
                          isFreeStarter
                            ? isLightTheme
                              ? 'bg-cyan-100 border-cyan-300 text-cyan-900'
                              : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                            : isLightTheme
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        {pack.priceLabel}
                      </span>
                    </div>

                    {/* Summary */}
                    <p
                      className={`text-xs leading-relaxed break-words ${
                        isLightTheme ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {summary}
                    </p>

                    {/* Included Files */}
                    <div className="space-y-1">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide block ${
                          isLightTheme ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        {t('catalog_included_files')}
                      </span>
                      <ul className="flex flex-wrap gap-1.5">
                        {pack.includedFiles.map((filePath) => (
                          <li
                            key={filePath}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono border max-w-full truncate ${
                              isLightTheme
                                ? 'bg-white border-slate-300 text-slate-800'
                                : 'bg-slate-900 border-slate-700 text-slate-200'
                            }`}
                            title={filePath}
                          >
                            {filePath}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div
                    className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                      isLightTheme ? 'border-slate-200' : 'border-slate-800'
                    }`}
                  >
                    {isCreatorMode ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyListingCopy(pack)}
                          className={`min-h-[44px] flex-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                            isCopied
                              ? isLightTheme
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-500 text-slate-950'
                              : isLightTheme
                                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                          }`}
                        >
                          <span>{isCopied ? `✓ ${t('copied_btn')}` : t('copy_listing_btn')}</span>
                        </button>

                        {hasConfiguredStoreUrl && packCtaUrl && (
                          <a
                            href={packCtaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                              isLightTheme
                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            <span>{t('catalog_cta_agensi')}</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </>
                    ) : hasConfiguredStoreUrl && packCtaUrl ? (
                      <a
                        href={packCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`min-h-[44px] w-full px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                          isLightTheme
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <span>{t('catalog_cta_agensi')}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <div className="w-full flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-[11px] leading-snug ${
                            isLightTheme ? 'text-slate-700' : 'text-slate-300'
                          }`}
                        >
                          {language === 'id'
                            ? 'Tersedia di marketplace Agensi.io (tautan kreator belum diatur).'
                            : 'Available on Agensi.io marketplace (creator storefront URL not yet configured).'}
                        </span>
                        <a
                          href={AGENSI_CONFIG.marketplaceBaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                            isLightTheme
                              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
                              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
                          }`}
                        >
                          <span>Agensi.io</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgensiCatalogModal;
