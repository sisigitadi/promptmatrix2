import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AGENSI_CONFIG } from '../config/agensiConfig';

export interface AgensiSkillPromoCardProps {
  categoryName?: string | null;
  onOpenCatalog: () => void;
  onOpenSkillCreator?: () => void;
  isLightTheme?: boolean;
  agensiUrlVersion?: number;
  showAIFeatures?: boolean;
}

export const AgensiSkillPromoCard: React.FC<AgensiSkillPromoCardProps> = ({
  categoryName,
  onOpenCatalog,
  onOpenSkillCreator,
  isLightTheme = false,
  showAIFeatures = false,
}) => {
  const { t, language } = useLanguage();

  // If not in 9-tap unlocked Creator Mode, DO NOT display to public visitors
  if (!showAIFeatures) {
    return null;
  }

  const focusRingClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

  return (
    <section
      aria-label={t('skill_cta_create_title')}
      className={`rounded-2xl border p-4 sm:p-5 transition-colors min-w-0 overflow-hidden ${
        isLightTheme
          ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
          : 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-lg'
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border ${
                isLightTheme
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {language === 'id' ? 'Kreator Skill Siap Jual' : 'Skill Creator Mode'}
            </span>
            {categoryName && (
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border truncate max-w-full ${
                  isLightTheme
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-[#090d16] border-slate-800 text-slate-400'
                }`}
              >
                {categoryName}
              </span>
            )}
          </div>
          <h3 className={`text-sm font-bold leading-snug break-words ${
            isLightTheme ? 'text-slate-900' : 'text-slate-100'
          }`}>
            {t('skill_cta_create_title')}
          </h3>
          <p className={`text-xs leading-relaxed break-words ${
            isLightTheme ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t('skill_cta_create_desc')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {onOpenSkillCreator && (
            <button
              type="button"
              onClick={onOpenSkillCreator}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm flex items-center gap-1.5 transition-colors ${focusRingClass}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{t('skill_cta_create_btn')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCatalog}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${focusRingClass} ${
              isLightTheme
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <span>{language === 'id' ? 'Contoh Referensi' : 'View Examples'}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold border ${
                isLightTheme
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {AGENSI_CONFIG.bundledSkillPacks.length}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AgensiSkillPromoCard;
