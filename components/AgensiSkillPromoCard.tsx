import React, { useMemo } from 'react';
import {
  AGENSI_CONFIG,
  AgensiSkillPackItem,
  buildAgensiPackCtaUrl,
  getContextualSkillPacksForCategory,
  getEffectiveAgensiUrls,
} from '../config/agensiConfig';
import { useLanguage } from '../contexts/LanguageContext';

export interface AgensiSkillPromoCardProps {
  categoryName?: string | null;
  onOpenCatalog: () => void;
  isLightTheme?: boolean;
  agensiUrlVersion?: number;
}

export const AgensiSkillPromoCard: React.FC<AgensiSkillPromoCardProps> = ({
  categoryName,
  onOpenCatalog,
  isLightTheme = false,
  agensiUrlVersion = 0,
}) => {
  const { t, language } = useLanguage();

  const contextualPacks = useMemo(
    () => getContextualSkillPacksForCategory(categoryName),
    [categoryName]
  );

  const effectiveUrls = useMemo(() => {
    void agensiUrlVersion;
    return getEffectiveAgensiUrls();
  }, [agensiUrlVersion]);

  const primaryPack: AgensiSkillPackItem | undefined = contextualPacks[0];
  const primaryCtaUrl = useMemo(() => {
    void agensiUrlVersion;
    return primaryPack ? buildAgensiPackCtaUrl(primaryPack) : '';
  }, [primaryPack, agensiUrlVersion]);

  const hasActiveStoreUrl = Boolean(effectiveUrls.activeUrl && primaryCtaUrl);
  const totalPackCount = AGENSI_CONFIG.bundledSkillPacks.length;
  const supportedAgentsCount = AGENSI_CONFIG.supportedAgents.length;

  return (
    <section
      aria-label={t('promo_card_badge')}
      className={`rounded-2xl border p-4 sm:p-5 transition-colors min-w-0 overflow-hidden ${
        isLightTheme
          ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
          : 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-lg'
      }`}
    >
      {/* Top Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isLightTheme
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
            }`}
          >
            <span>{t('promo_card_badge')}</span>
          </span>
          {categoryName && (
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono border truncate max-w-full ${
                isLightTheme
                  ? 'bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-[#090d16] border-slate-800 text-slate-300'
              }`}
            >
              {categoryName}
            </span>
          )}
        </div>

        <span
          className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border shrink-0 ${
            isLightTheme
              ? 'bg-slate-50 border-slate-300 text-slate-700'
              : 'bg-[#090d16] border-slate-800 text-slate-300'
          }`}
        >
          {supportedAgentsCount}+ {language === 'id' ? 'runtime agen' : 'agent runtimes'}
        </span>
      </div>

      {/* Heading */}
      <h3
        className={`text-sm sm:text-base font-bold leading-snug mb-3 break-words ${
          isLightTheme ? 'text-slate-900' : 'text-slate-100'
        }`}
      >
        {t('promo_card_title')}
      </h3>

      {/* Contextual Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
        {contextualPacks.map((pack) => {
          const isFreeStarter = pack.tier === 'lead-magnet';
          const summary = language === 'id' ? pack.summaryId : pack.summaryEn;
          const packUrl = buildAgensiPackCtaUrl(pack);

          return (
            <article
              key={pack.slug}
              className={`rounded-xl border p-3 flex flex-col justify-between gap-2.5 min-w-0 ${
                isLightTheme
                  ? isFreeStarter
                    ? 'bg-cyan-50/70 border-cyan-300 text-slate-900'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                  : isFreeStarter
                    ? 'bg-[#090d16] border-cyan-500/35 text-slate-100'
                    : 'bg-[#090d16] border-slate-800 text-slate-100'
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4
                      className={`text-xs sm:text-sm font-bold leading-snug break-words ${
                        isLightTheme ? 'text-slate-900' : 'text-slate-100'
                      }`}
                    >
                      {pack.title}
                    </h4>
                    <p
                      className={`text-[11px] font-mono truncate ${
                        isLightTheme ? 'text-emerald-800' : 'text-emerald-400'
                      }`}
                    >
                      {pack.slug}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border shrink-0 ${
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

                <p
                  className={`text-xs leading-relaxed break-words ${
                    isLightTheme ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {summary}
                </p>
              </div>

              {/* Included Files Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {pack.includedFiles.map((filePath) => (
                  <span
                    key={filePath}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono border max-w-full truncate ${
                      isLightTheme
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-slate-900 border-slate-700 text-slate-200'
                    }`}
                    title={filePath}
                  >
                    {filePath}
                  </span>
                ))}
              </div>

              {effectiveUrls.activeUrl && packUrl && (
                <div className="pt-1">
                  <a
                    href={packUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded ${
                      isLightTheme ? 'text-emerald-800' : 'text-emerald-300'
                    }`}
                  >
                    <span>{t('catalog_cta_agensi')}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/30">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onOpenCatalog}
            className={`min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isLightTheme
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <span>
              {t('promo_card_cta_catalog')} ({totalPackCount})
            </span>
          </button>

          {hasActiveStoreUrl && (
            <a
              href={primaryCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isLightTheme
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span>{t('promo_card_cta_agensi')}</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        {!hasActiveStoreUrl && (
          <span
            className={`text-[11px] leading-snug ${
              isLightTheme ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {t('catalog_cta_unconfigured')}
          </span>
        )}
      </div>
    </section>
  );
};

export default AgensiSkillPromoCard;
