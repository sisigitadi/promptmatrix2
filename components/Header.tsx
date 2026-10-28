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

  // PWA Install Prompt Listener
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand & Subtitle */}
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0" 
          onClick={onLogoClick}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-lg group-hover:border-emerald-400 transition-all shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <h1 className="text-xs sm:text-base font-bold text-slate-100 tracking-tight flex items-center gap-1 font-sans">
                <span className="whitespace-nowrap">PromptMatrix</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">2.0</span>
              </h1>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 sm:gap-1.5 font-sans">
              <span className="hidden md:inline">{language === 'id' ? 'Generator Prompt AI Berpemandu' : 'Guided AI Prompt Generator'}</span>
              <span className="hidden md:inline text-slate-600">·</span>
              <a
                href="https://sigitadi.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400/90 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1 hover:underline"
                title={language === 'id' ? 'Portfolio Web Sigit Adi' : "Sigit Adi's Portfolio"}
              >
                <img 
                  src="/sa-logo.png" 
                  alt="SA Logo" 
                  className="w-3.5 h-3.5 rounded object-cover inline-block border border-emerald-500/40 shadow-xs" 
                />
                <span>sigitadi.id</span>
              </a>
            </div>
          </div>
        </div>

        {/* Center Mode Switcher Tabs (Gallery vs Studio) - Visible on tablet/desktop */}
        <div className="hidden sm:flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-950 border border-slate-800/80 shrink-0">
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
            <span>{language === 'id' ? 'Galeri' : 'Explore'}</span>
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
            <span>{language === 'id' ? 'Studio' : 'Studio'}</span>
          </button>
        </div>

        {/* Right Action Controls - Guaranteed 100% visible on mobile with clear icons & labels */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Universal AI Provider Settings Button (Only visible when AI features are activated) */}
          {showAIFeatures && (
            <button
              onClick={onOpenApiKeyModal}
              className={`h-8 px-2 sm:h-9 sm:px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isConfigured 
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-950/60 shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                  : 'bg-slate-900/90 border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white'
              }`}
              title={`${t('ai_settings_btn')}: ${preset.name} (${aiSettings.model})`}
              aria-label={t('ai_settings_btn')}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${isConfigured ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse' : 'bg-amber-400'}`}></span>
              {/* AI Sparkle Icon */}
              <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-bold text-[11px] sm:text-xs">
                <span className="sm:hidden">AI</span>
                <span className="hidden sm:inline">{isConfigured ? preset.name.split(' ')[0] : (language === 'id' ? 'Atur AI' : 'Setup AI')}</span>
              </span>
            </button>
          )}

          {/* Interactive PWA Install Button */}
          {isInstallable && (
            <button
              onClick={handleInstallPWA}
              className="h-8 px-2 sm:h-9 sm:px-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 animate-pulse"
              title={language === 'id' ? 'Pasang Aplikasi PWA di Perangkat Anda' : 'Install PWA App on your device'}
              aria-label="Install PWA"
            >
              <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden md:inline font-bold text-[11px] sm:text-xs">
                {language === 'id' ? 'Pasang' : 'Install'}
              </span>
            </button>
          )}

          {/* Language Switcher - High-visibility bilingual toggle with Globe icon */}
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="h-8 px-2 sm:h-9 sm:px-2.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-200 transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
            title={language === 'id' ? 'Ganti Bahasa ke English (EN)' : 'Switch Language to Bahasa Indonesia (ID)'}
            aria-label="Switch Language"
          >
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="font-mono text-[11px] sm:text-xs font-bold text-emerald-400">
              {language === 'id' ? 'ID' : 'EN'}
            </span>
          </button>

          {/* Stash Button */}
          <button
            onClick={onShowStash}
            className="h-8 px-2 sm:h-9 sm:px-3 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all flex items-center justify-center gap-1.5"
            title={t('stash_btn')}
            aria-label={t('stash_btn')}
          >
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="hidden lg:inline">{language === 'id' ? 'Koleksi' : 'Stash'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/20">
              {savedPromptsCount}
            </span>
          </button>

          {/* Help Button */}
          <button
            onClick={onShowHelp}
            className="w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all flex items-center justify-center gap-1.5"
            title={t('help_btn')}
            aria-label={t('help_btn')}
          >
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden lg:inline">{language === 'id' ? 'Panduan' : 'Guide'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;



