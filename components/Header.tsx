import React from 'react';
import { getStoredAISettings, AI_PROVIDER_PRESETS, isAIConfigured } from '../services/aiSettingsService';
import { useLanguage } from '../contexts/LanguageContext';
import { AGENSI_CONFIG } from '../config/agensiConfig';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface HeaderProps {
  onLogoClick?: () => void;
  onShowHelp: () => void;
  onShowStash: () => void;
  onOpenApiKeyModal: () => void;
  onOpenUploadUpgrade?: () => void;
  onOpenAgensiCatalog?: () => void;
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
  onOpenUploadUpgrade,
  onOpenAgensiCatalog,
  savedPromptsCount,
  isLightTheme,
  onToggleTheme,
  activeMode = 'gallery',
  onSelectMode = () => {},
  showAIFeatures = false,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const aiSettings = getStoredAISettings();
  const preset = AI_PROVIDER_PRESETS[aiSettings.provider] || AI_PROVIDER_PRESETS.custom;
  const isConfigured = isAIConfigured();

  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);
  const settingsMenuRef = React.useRef<HTMLDivElement>(null);

  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = React.useState<boolean>(false);
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  React.useEffect(() => {
    if (!isSettingsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsSettingsOpen(false);
    }
  };

  const focusRingClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 lg:px-6 pt-2 sm:pt-3 pointer-events-none transition-all duration-200">
      <div
        className={`max-w-7xl mx-auto rounded-2xl sm:rounded-3xl border shadow-lg backdrop-blur-md px-2 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-4 min-w-0 pointer-events-auto transition-all duration-200 ${
          isScrolled
            ? isLightTheme
              ? 'border-emerald-400/80 bg-white/95 text-slate-900 shadow-xl shadow-slate-300/60 ring-1 ring-emerald-500/20'
              : 'border-emerald-500/40 bg-[#090d16]/95 text-slate-100 shadow-2xl shadow-black/90 ring-1 ring-emerald-500/20'
            : isLightTheme
            ? 'border-slate-200/90 bg-white/90 text-slate-900 shadow-lg shadow-slate-200/60'
            : 'border-slate-800/80 bg-[#090d16]/90 text-slate-100 shadow-lg shadow-black/50'
        }`}
      >
        {/* Left: Brand & 9-Tap Logo Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="PromptMatrix 2.0"
            className={`min-h-[44px] px-1 py-1 rounded-xl flex items-center gap-1.5 sm:gap-2 select-none group transition-colors min-w-0 ${focusRingClass} ${
              isLightTheme ? 'hover:bg-slate-100' : 'hover:bg-slate-900/70'
            }`}
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shadow-sm transition-colors shrink-0 ${
                isLightTheme
                  ? 'bg-emerald-50 border-emerald-300 group-hover:border-emerald-500'
                  : 'bg-slate-900 border-emerald-500/40 group-hover:border-emerald-400'
              }`}
            >
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex items-center gap-1.5">
              <span className={`text-[11px] sm:text-base font-bold tracking-tight font-sans truncate ${
                isLightTheme ? 'text-slate-900' : 'text-slate-100'
              }`}>
                PromptMatrix
              </span>
              <span
                className={`hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded-md border font-semibold shrink-0 ${
                  isLightTheme
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                2.0
              </span>
            </div>
          </button>

          {/* Desktop Portfolio Link */}
          <div
            className={`hidden xl:flex items-center gap-1.5 text-[11px] font-sans border-l pl-2.5 ${
              isLightTheme ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}
          >
            <span>{language === 'id' ? 'Generator Prompt AI' : 'AI Prompt Generator'}</span>
            <span className={isLightTheme ? 'text-slate-400' : 'text-slate-600'} aria-hidden="true">·</span>
            <a
              href="https://sigitadi.id/"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium inline-flex items-center gap-1 hover:underline rounded px-1 py-0.5 transition-colors ${focusRingClass} ${
                isLightTheme
                  ? 'text-emerald-800 hover:text-emerald-900'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
              title={language === 'id' ? 'Portfolio Web Sigit Adi' : "Sigit Adi's Portfolio"}
            >
              <img
                src="/sa-logo.png"
                alt="SA Logo"
                className="w-3.5 h-3.5 rounded object-cover inline-block border border-emerald-500/40"
              />
              <span>sigitadi.id</span>
            </a>
          </div>
        </div>

        {/* Center: Mode Switcher (Galeri | Studio) */}
        <div
          role="tablist"
          aria-label={language === 'id' ? 'Mode tampilan' : 'Workspace mode'}
          className={`flex items-center p-0.5 sm:p-1 rounded-xl border shrink-0 ${
            isLightTheme
              ? 'bg-slate-100 border-slate-300'
              : 'bg-[#070b12] border-slate-800'
          }`}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'gallery'}
            onClick={() => onSelectMode('gallery')}
            className={`min-h-[38px] sm:min-h-[42px] px-2 sm:px-3.5 py-1 rounded-lg font-semibold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 ${focusRingClass} ${
              activeMode === 'gallery'
                ? isLightTheme
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-300'
                  : 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700'
                : isLightTheme
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-300 hover:text-white'
            }`}
          >
            <svg className="hidden sm:block w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>{language === 'id' ? 'Galeri' : 'Explore'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'studio'}
            onClick={() => onSelectMode('studio')}
            className={`min-h-[38px] sm:min-h-[42px] px-2 sm:px-3.5 py-1 rounded-lg font-semibold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 ${focusRingClass} ${
              activeMode === 'studio'
                ? isLightTheme
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-300'
                  : 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700'
                : isLightTheme
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-300 hover:text-white'
            }`}
          >
            <svg className="hidden sm:block w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Studio</span>
          </button>
        </div>

        {/* Right: Exactly 3 Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 1. Stash (Koleksi) Button */}
          <button
            type="button"
            onClick={onShowStash}
            className={`min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] px-2 sm:px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] ${focusRingClass} ${
              isLightTheme
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
            title={`${t('stash_btn')} (${savedPromptsCount})`}
            aria-label={`${t('stash_btn')} (${savedPromptsCount})`}
          >
            <svg
              className={`w-3.5 h-3.5 shrink-0 ${isLightTheme ? 'text-slate-700' : 'text-slate-300'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className="hidden md:inline font-semibold text-xs">
              {language === 'id' ? 'Koleksi' : 'Stash'}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                isLightTheme
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
              }`}
            >
              {savedPromptsCount}
            </span>
          </button>

          {/* 2. Help (Panduan) Button */}
          <button
            type="button"
            onClick={onShowHelp}
            className={`min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] px-2 sm:px-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] ${focusRingClass} ${
              isLightTheme
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
            title={t('help_btn')}
            aria-label={t('help_btn')}
          >
            <svg
              className={`w-4 h-4 shrink-0 ${isLightTheme ? 'text-slate-700' : 'text-slate-300'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden lg:inline">{language === 'id' ? 'Panduan' : 'Guide'}</span>
          </button>

          {/* 3. Settings Menu Popover Trigger */}
          <div className="relative" ref={settingsMenuRef}>
            <button
              type="button"
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              aria-expanded={isSettingsOpen}
              aria-haspopup="true"
              aria-label={t('settings_menu_btn')}
              title={t('settings_menu_btn')}
              className={`min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] px-2 sm:px-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] ${focusRingClass} ${
                isSettingsOpen
                  ? isLightTheme
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-slate-800 border-emerald-500/60 text-emerald-300'
                  : isLightTheme
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showAIFeatures && isConfigured && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
              )}
            </button>

            {/* Consolidated Settings Popover Dropdown */}
            {isSettingsOpen && (
              <div
                role="menu"
                className={`absolute right-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl backdrop-blur-md z-50 transition-all ${
                  isLightTheme
                    ? 'bg-white/98 border-slate-200 text-slate-900'
                    : 'bg-[#0f172a]/98 border-slate-800 text-slate-100'
                }`}
              >
                <div className="space-y-1">
                  {/* Theme Toggle Item */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onToggleTheme();
                    }}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${focusRingClass} ${
                      isLightTheme ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isLightTheme ? (
                        <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                      <span>{t('menu_theme_label')}</span>
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${
                      isLightTheme ? 'text-emerald-800' : 'text-emerald-400'
                    }`}>
                      {isLightTheme ? t('theme_light') : t('theme_dark')}
                    </span>
                  </button>

                  {/* Language Toggle Item */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setLanguage(language === 'id' ? 'en' : 'id');
                    }}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${focusRingClass} ${
                      isLightTheme ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span>{t('menu_lang_label')}</span>
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${
                      isLightTheme ? 'text-emerald-800' : 'text-emerald-400'
                    }`}>
                      {language === 'id' ? 'ID (Bahasa)' : 'EN (English)'}
                    </span>
                  </button>

                  {/* Private Mode Only: AI Provider & Model Settings */}
                  {showAIFeatures && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onOpenApiKeyModal();
                      }}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${focusRingClass} ${
                        isLightTheme ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{t('menu_ai_label')}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isConfigured ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                          {isConfigured ? preset.name.split(' ')[0] : 'Setup'}
                        </span>
                      </span>
                    </button>
                  )}

                  {/* Private Mode Only: Reference Skills Library */}
                  {showAIFeatures && onOpenAgensiCatalog && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onOpenAgensiCatalog();
                      }}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${focusRingClass} ${
                        isLightTheme ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>{t('menu_samples_label')}</span>
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                          isLightTheme
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {AGENSI_CONFIG.bundledSkillPacks.length}
                      </span>
                    </button>
                  )}

                  {/* Private Mode Only: Upload / Upgrade Prompt */}
                  {showAIFeatures && onOpenUploadUpgrade && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onOpenUploadUpgrade();
                      }}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${focusRingClass} ${
                        isLightTheme ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{t('upload_upgrade_menu_btn')}</span>
                      </span>
                    </button>
                  )}

                  {/* Install PWA Button (if available) */}
                  {isInstallable && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleInstallPWA}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${focusRingClass} ${
                        isLightTheme
                          ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                          : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>{t('menu_pwa_label')}</span>
                      </span>
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">PWA</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
