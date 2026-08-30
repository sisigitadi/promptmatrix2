import React from 'react';
import { getStoredAISettings, AI_PROVIDER_PRESETS, isAIConfigured } from '../services/aiSettingsService';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onLogoClick?: () => void;
  onShowHelp: () => void;
  onShowStash: () => void;
  onOpenApiKeyModal: () => void;
  savedPromptsCount: number;
  isLightTheme: boolean;
  onToggleTheme: () => void;
  activeMode?: 'gallery' | 'studio';
  onSelectMode?: (mode: 'gallery' | 'studio') => void;
  showAIFeatures?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onLogoClick,
  onShowHelp,
  onShowStash,
  onOpenApiKeyModal,
  savedPromptsCount,
  activeMode = 'gallery',
  onSelectMode = () => {},
  showAIFeatures = false,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const aiSettings = getStoredAISettings();
  const preset = AI_PROVIDER_PRESETS[aiSettings.provider] || AI_PROVIDER_PRESETS.custom;
  const isConfigured = isAIConfigured();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Subtitle */}
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0" 
          onClick={onLogoClick}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-lg group-hover:border-emerald-400 transition-all">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight flex items-center gap-1 font-sans">
                <span className="whitespace-nowrap">PromptMatrix</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">2.0</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block font-sans">
              {language === 'id' ? 'Generator Prompt AI Berpemandu' : 'Guided AI Prompt Generator'}
            </p>
          </div>
        </div>

        {/* Center Mode Switcher Tabs (Gallery vs Studio) */}
        <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-950 border border-slate-800/80 shrink-0">
          <button
            onClick={() => onSelectMode('gallery')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 ${
              activeMode === 'gallery'
                ? 'bg-slate-850 text-emerald-400 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="hidden xs:inline">{language === 'id' ? 'Galeri' : 'Explore'}</span>
          </button>

          <button
            onClick={() => onSelectMode('studio')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 ${
              activeMode === 'studio'
                ? 'bg-slate-850 text-emerald-400 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden xs:inline">{language === 'id' ? 'Studio' : 'Studio'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Help Button */}
          <button
            onClick={onShowHelp}
            className="w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all flex items-center justify-center gap-1.5"
            title={t('help_btn')}
            aria-label={t('help_btn')}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden lg:inline">{language === 'id' ? 'Panduan' : 'Guide'}</span>
          </button>

          {/* Stash Button */}
          <button
            onClick={onShowStash}
            className="h-8 px-2 sm:h-9 sm:px-3 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all flex items-center justify-center gap-1.5"
            title={t('stash_btn')}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="hidden lg:inline">{language === 'id' ? 'Koleksi' : 'Stash'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/20">
              {savedPromptsCount}
            </span>
          </button>

          {/* Universal AI Provider Settings Button */}
          {showAIFeatures && (
            <button
              onClick={onOpenApiKeyModal}
              className={`h-8 px-2 sm:h-9 sm:px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                isConfigured 
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300 hover:bg-emerald-950/40' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={`${t('ai_settings_btn')}: ${preset.name} (${aiSettings.model})`}
            >
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></span>
              <span className="hidden sm:inline">
                {isConfigured ? preset.name.split(' ')[0] : (language === 'id' ? 'Atur AI' : 'Setup AI')}
              </span>
              <svg className="w-3.5 h-3.5 text-slate-400 hidden xs:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="w-8 h-8 sm:w-auto sm:h-9 sm:px-2.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all flex items-center justify-center gap-1"
            title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            <span className="font-mono text-[10px] sm:text-[11px] text-emerald-400 font-bold">{language === 'id' ? 'ID' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;



