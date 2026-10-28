import React, { useState, useEffect, useMemo } from 'react';
import { Framework } from '../data/frameworks';
import { useLanguage } from '../contexts/LanguageContext';
import {
  AspectRatioType,
  detectAspectRatioFromPrompt,
  getVisualBenchmarkForFramework,
  VisualBenchmarkData
} from '../services/visualBenchmarkService';

interface VisualPromptPreviewProps {
  promptText: string;
  framework: Framework | null;
  frameworkName?: string | null;
  category?: string | null;
  isLightTheme?: boolean;
}

export const VisualPromptPreview: React.FC<VisualPromptPreviewProps> = ({
  promptText,
  framework,
  frameworkName,
  category,
  isLightTheme = false
}) => {
  const { t, language } = useLanguage();

  // Accordion Collapse State
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Lightbox Modal State
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  // 1. Detect Aspect Ratio dynamically from prompt or benchmark
  const detectedAspectRatio: AspectRatioType = useMemo(() => {
    return detectAspectRatioFromPrompt(promptText);
  }, [promptText]);

  // 2. Fetch curated visual mockup aligned with sample data
  const benchmark: VisualBenchmarkData = useMemo(() => {
    return getVisualBenchmarkForFramework(framework, frameworkName, category);
  }, [framework, frameworkName, category]);

  // Aspect ratio CSS class mapping for container
  const getAspectRatioClass = (ar: AspectRatioType): string => {
    switch (ar) {
      case '16:9':
        return 'aspect-video';
      case '9:16':
        return 'aspect-[9/16] max-h-[360px] mx-auto';
      case '4:5':
        return 'aspect-[4/5] max-h-[320px] mx-auto';
      case '21:9':
        return 'aspect-[21/9]';
      case '1:1':
      default:
        return 'aspect-square max-h-[290px] mx-auto';
    }
  };

  // Download Image Helper
  const handleDownloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLightbox) {
        setShowLightbox(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isLightTheme 
        ? 'bg-white border-slate-200 shadow-sm' 
        : 'bg-[#090d16] border-slate-800/90 shadow-md'
    }`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-200 tracking-tight">
            {t('visual_preview_title')}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {benchmark.aspectRatio || detectedAspectRatio}
          </span>
        </div>

        {/* Accordion Collapse Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded"
          title={isCollapsed ? t('toggle_visual_show') : t('toggle_visual_hide')}
        >
          <span className="text-[11px] hidden sm:inline">
            {isCollapsed ? t('toggle_visual_show') : t('toggle_visual_hide')}
          </span>
          <svg 
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-3 sm:p-3.5 flex flex-col gap-3">
          {/* Status Badge: Curated & Aligned with Sample */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{t('benchmark_badge')}</span>
            </div>
            <div className="text-[10px] text-emerald-400/90 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              ✓ {t('align_sample_badge')}
            </div>
          </div>

          {/* Image Frame with Aspect Ratio */}
          <div 
            onClick={() => {
              setLightboxImage({
                url: benchmark.imageUrl,
                title: benchmark.title,
                subtitle: `${benchmark.styleCategory} • ${benchmark.authorOrModel}`
              });
              setShowLightbox(true);
            }}
            className={`relative w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer group shadow-inner ${getAspectRatioClass(benchmark.aspectRatio)}`}
          >
            <img
              src={benchmark.imageUrl}
              alt={benchmark.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover Overlay Hint */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-medium border border-slate-700/80 shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <span>{t('zoom_click_hint')}</span>
              </span>
            </div>

            {/* Bottom Title Bar Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end justify-between">
              <div className="truncate pr-2">
                <p className="text-xs font-semibold text-white drop-shadow truncate">
                  {benchmark.title}
                </p>
                <p className="text-[10px] text-slate-300 drop-shadow truncate">
                  {benchmark.styleCategory} • {benchmark.authorOrModel}
                </p>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-slate-300 border border-white/10 shrink-0">
                {benchmark.aspectRatio}
              </span>
            </div>
          </div>

          {/* Key Visual Parameter Badges */}
          {benchmark.keyParameters && benchmark.keyParameters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-slate-400 font-medium">
                {t('key_params_label')}
              </span>
              {benchmark.keyParameters.map((param, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/80 border border-slate-700/60 text-slate-300 font-sans"
                >
                  <span className="text-slate-400">{param.label}:</span> <span className="text-emerald-300 font-medium">{param.value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Benchmark Description & Sample Alignment Note */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-1.5">
            <p className="text-[11px] text-slate-300 leading-relaxed italic">
              &ldquo;{benchmark.description}&rdquo;
            </p>
            {benchmark.sampleScenarioLink && (
              <p className="text-[10px] text-emerald-400/90 flex items-center gap-1">
                <span className="text-emerald-500">🎯</span>
                <span>{benchmark.sampleScenarioLink}</span>
              </p>
            )}
          </div>

          {/* Quick Action: Download Image Button */}
          <div className="flex items-center justify-end pt-0.5">
            <button
              type="button"
              onClick={() => handleDownloadImage(benchmark.imageUrl, `promptmatrix-${benchmark.id}`)}
              className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title={t('download_image')}
            >
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{t('download_image')}</span>
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {showLightbox && lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setShowLightbox(false)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/90 bg-slate-900/60">
              <div className="truncate pr-3">
                <h4 className="text-sm font-semibold text-white truncate">
                  {lightboxImage.title}
                </h4>
                {lightboxImage.subtitle && (
                  <p className="text-xs text-slate-400 truncate">
                    {lightboxImage.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowLightbox(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title={t('close_lightbox')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-2">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800/80 bg-slate-900/80 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                PromptMatrix 2.0 Visual Engine
              </span>
              <button
                type="button"
                onClick={() => handleDownloadImage(lightboxImage.url, `promptmatrix-sample-${Date.now()}`)}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{t('download_image')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
