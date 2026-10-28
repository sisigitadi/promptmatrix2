import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PromptFrameworksType, Framework, CATEGORY_ORDER } from '../data/frameworks';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  translateCategoryName, 
  translateSubcategoryName, 
  translateFrameworkName, 
  translateFrameworkDescription 
} from '../services/localizationService';
import { createFormulaShareUrl } from '../services/urlHelper';

// 15 Master & Popular Frameworks for Quick Guidance & Badging
export const POPULAR_FRAMEWORK_NAMES = new Set([
  'RTF Framework',
  'CO-STAR Framework',
  'AIDA Copywriting',
  'S-T-A-R-R Method',
  'Goal-Constraint-Context (GCC)',
  'Hook-Story-Offer (HSO)',
  'Midjourney v6.1 Masterclass',
  'FLUX.1 Photorealistic Studio',
  'Cursor & Windsurf AI Agent Rules',
  'TikTok Shop Live Stream Script',
  'LPDP & Beasiswa Master Architect',
  'SEO Pillar Article Architect',
  'Chain-of-Thought (CoT)',
  'Feynman Technique Explainer',
  'Suno v4 Hit Song Architect'
]);

export type SortOption = 'default' | 'popular' | 'alpha-asc' | 'alpha-desc' | 'fields-desc' | 'fields-asc';

interface TemplateGalleryProps {
  frameworksData: PromptFrameworksType;
  onSelectFramework: (category: string, subcategory: string, frameworkName: string, framework: Framework) => void;
  selectedFrameworkName: string | null;
}

// Clean SVG Category Icons (Senior Developer Standard, Zero Emoji Clutter)
const CategoryIcons: Record<string, React.ReactNode> = {
  "Teks & Konten": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  "Gambar & Desain": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  "Audio & Musik": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  "Video & Animasi": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  "Kode & Pengembang": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "Prompt Ringkas": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  "Prompt Proyek": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  "Koleksi & Inovasi": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

// Practical keyword/intent aliases mapping to ensure everyday user terms accurately match prompt formulas
const INTENT_KEYWORD_MAP: Record<string, string[]> = {
  "copywriting": ["aida", "pas-e", "bab", "acca", "4p", "ad copy", "iklan", "penjualan", "persuasi", "pemasaran", "email marketing", "copywriting"],
  "iklan": ["ad copy", "copywriting", "aida", "pas-e", "pemasaran", "penjualan", "iklan", "penulis teks iklan"],
  "caption": ["thread", "media sosial", "sosmed", "konten", "penulisan", "instagram", "tiktok"],
  "instagram": ["thread", "media sosial", "skrip video", "reels", "konten", "gambar", "sosmed"],
  "tiktok": ["tiktok shop", "skrip video", "video pendek", "reels", "konten", "media sosial", "hook-story-offer", "live streaming"],
  "youtube": ["skrip video", "video", "perencanaan video", "konten", "voiceover storytelling"],
  "video": ["kling", "runway", "video", "animasi", "skrip", "sora", "pika", "visual", "hailuo"],
  "artikel": ["artikel", "blog", "seo", "studi kasus", "penulisan", "pillar article"],
  "blog": ["blog post", "artikel", "seo", "penulisan"],
  "seo": ["artikel seo", "penulisan", "blog", "konten", "pillar article", "meta deskripsi"],
  "gambar": ["gambar", "desain", "text-to-image", "midjourney", "dall-e", "foto", "visual", "flux"],
  "logo": ["branding", "identitas", "desain", "gambar", "nama", "icon", "brand style guide"],
  "desain": ["desain", "gambar", "visual", "branding", "platform", "illustration"],
  "midjourney": ["midjourney", "cref", "sref", "gambar", "text-to-image", "desain", "flux.1", "photorealistic portrait"],
  "flux": ["flux.1", "photorealistic descriptive studio", "leica", "hasselblad", "fotorealistik", "midjourney"],
  "analisis": ["gcc", "reasoning", "analisis", "data", "chain-of-thought", "tree-of-thoughts", "berpikir", "pemikiran", "swot"],
  "reasoning": ["gcc", "deepseek-r1", "claude 3.7", "o1/o3", "goal-constraint-context", "pemikiran terstruktur", "first principles"],
  "ide": ["ideasi", "brainstorming", "scamper", "inovasi", "kreatif", "blue ocean"],
  "inovasi": ["inovasi", "scamper", "design thinking", "blue ocean", "koleksi", "triz"],
  "koding": ["cursorrules", "windsurf", "mcp", "kode", "pengembang", "developer", "koding", "script", "utilitas", "coding", "rag", "refactoring", "api"],
  "coding": ["cursorrules", "windsurf", "mcp", "kode", "pengembang", "developer", "koding", "script", "utilitas", "coding", "rag", "refactoring", "api"],
  "agent": ["cursorrules", "mcp", "model context protocol", "crewai", "autogen", "multi-agent", "autonomous"],
  "mcp": ["model context protocol", "mcp server", "cursor", "claude desktop"],
  "interview": ["mock interviewer", "simulasi wawancara", "wawancara kerja", "s-t-a-r-r", "c-a-r"],
  "wawancara": ["mock interviewer", "simulasi wawancara", "wawancara kerja", "s-t-a-r-r"],
  "edukasi": ["lpdp", "beasiswa", "akademis", "edukasi", "pendidikan", "pembelajaran", "belajar", "feynman"],
  "beasiswa": ["lpdp", "chevening", "beasiswa kontribusi", "esai akademik", "studi pasca"],
  "lpdp": ["lpdp & beasiswa", "kontribusi indonesia", "rencana studi", "roadmap kontribusi"],
  "ringkasan": ["ringkas", "ekstraksi", "utilitas", "penulisan", "tldr", "pdf"],
  "email": ["email", "komunikasi profesional", "marketing", "penjualan", "cold email", "drip sequence"],
  "rtf": ["rtf", "role-task-format", "terstruktur"],
  "aida": ["aida", "pas-e", "bab", "acca", "4p", "ad copy", "copywriting", "persuasi"],
  "co-star": ["co-star", "context-objective-style-tone-audience-response"],
  "star": ["s-t-a-r-r", "c-a-r", "achievement bullets"],
  "musik": ["suno", "udio", "lagu", "audio", "genre musik", "hit song"],
  "music": ["suno", "udio", "song", "audio", "melody", "hit song"]
};

// Recommended quick search tags matching actual database formulas (6 Curated Tags)
const QUICK_SEARCH_TAGS = [
  { id: 'reasoning', label_id: 'Reasoning (GCC)', label_en: 'Reasoning (GCC)', query: 'GCC' },
  { id: 'aida', label_id: 'AIDA Copywriting', label_en: 'AIDA Copywriting', query: 'AIDA' },
  { id: 'midjourney', label_id: 'Midjourney & Flux', label_en: 'Midjourney & Flux', query: 'Midjourney' },
  { id: 'cursor', label_id: 'Cursor & Windsurf', label_en: 'Cursor & Windsurf', query: 'cursorrules' },
  { id: 'tiktoklive', label_id: 'TikTok Shop & Video', label_en: 'TikTok Shop & Video', query: 'TikTok Shop' },
  { id: 'suno', label_id: 'Suno Musik', label_en: 'Suno Music', query: 'Suno' },
];

const getLocalizedToolType = (toolType: string | undefined, lang: 'id' | 'en'): string => {
  if (!toolType || toolType.toLowerCase() === 'general') {
    return lang === 'id' ? 'Umum' : 'General';
  }
  const map: Record<string, { id: string; en: string }> = {
    text: { id: 'Teks', en: 'Text' },
    code: { id: 'Kode', en: 'Code' },
    image: { id: 'Gambar', en: 'Image' },
    video: { id: 'Video', en: 'Video' },
    audio: { id: 'Audio', en: 'Audio' },
    'music / audio': { id: 'Audio & Musik', en: 'Music / Audio' },
    planning: { id: 'Perencanaan', en: 'Planning' },
  };
  const match = map[toolType.toLowerCase()];
  return match ? match[lang] : toolType;
};

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  frameworksData,
  onSelectFramework,
  selectedFrameworkName,
}) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolType, setSelectedToolType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [copiedLinkFw, setCopiedLinkFw] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Recently used templates state
  const [recentTemplates, setRecentTemplates] = useState<Array<{
    category: string;
    subcategory: string;
    frameworkName: string;
  }>>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pm_recent_templates');
      if (raw) {
        setRecentTemplates(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('pm_recent_templates');
      setRecentTemplates([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectRecent = (recent: { category: string; subcategory: string; frameworkName: string }) => {
    const fw = frameworksData[recent.category]?.[recent.subcategory]?.[recent.frameworkName];
    if (fw) {
      onSelectFramework(recent.category, recent.subcategory, recent.frameworkName, fw);
    }
  };

  // Keyboard shortcut Ctrl+K to search and Esc to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          setSearchQuery('');
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyShare = (fwName: string) => {
    const url = createFormulaShareUrl(fwName);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedLinkFw(fwName);
    setTimeout(() => setCopiedLinkFw(null), 2500);
  };

  const PAGE_SIZE = 24;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);

  // Auto-reset visible count & trigger quick skeleton transition on filter change (Section A6)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingTransition(true);
    const timer = setTimeout(() => {
      setIsLoadingTransition(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, selectedToolType, sortBy]);

  const categories = Object.keys(frameworksData).sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a);
    const idxB = CATEGORY_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  // Flatten templates for easy filtering and high-performance search
  const allTemplates = useMemo(() => {
    const list: Array<{
      category: string;
      subcategory: string;
      frameworkName: string;
      framework: Framework;
      fieldCount: number;
    }> = [];

    categories.forEach(catName => {
      const subcats = frameworksData[catName] || {};
      Object.entries(subcats).forEach(([subcatName, fws]) => {
        Object.entries(fws).forEach(([fwName, fw]) => {
          let fieldCount = fw.components?.length || 0;
          if (fieldCount === 0 && fw.komponen_prompt?.["VARIABEL INPUT"]) {
            fieldCount = Object.keys(fw.komponen_prompt["VARIABEL INPUT"]).length;
          }
          list.push({
            category: catName,
            subcategory: subcatName,
            frameworkName: fwName,
            framework: fw,
            fieldCount: fieldCount || 3
          });
        });
      });
    });

    return list;
  }, [frameworksData, categories]);

  // Filtered Templates with Intent Aliasing & Deep Multi-Field Search
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Tool type filter
      if (selectedToolType !== 'all' && item.framework.toolType !== selectedToolType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const localizedFwName = translateFrameworkName(item.frameworkName, language).toLowerCase();
        const localizedCatName = translateCategoryName(item.category, language).toLowerCase();
        const localizedSubcatName = translateSubcategoryName(item.subcategory, language).toLowerCase();
        const desc = (item.framework.description || '').toLowerCase();
        const rawFwName = item.frameworkName.toLowerCase();

        // 1. Direct matching on names, categories, and descriptions
        const isDirectMatch = (
          localizedFwName.includes(q) ||
          rawFwName.includes(q) ||
          localizedCatName.includes(q) ||
          item.category.toLowerCase().includes(q) ||
          localizedSubcatName.includes(q) ||
          item.subcategory.toLowerCase().includes(q) ||
          desc.includes(q)
        );

        if (isDirectMatch) return true;

        // 2. Intent / Synonym alias matching
        for (const [intentKey, aliases] of Object.entries(INTENT_KEYWORD_MAP)) {
          if (q.includes(intentKey) || intentKey.includes(q)) {
            const aliasMatches = aliases.some(alias => 
              localizedFwName.includes(alias) || 
              rawFwName.includes(alias) || 
              localizedCatName.includes(alias) || 
              localizedSubcatName.includes(alias) ||
              desc.includes(alias)
            );
            if (aliasMatches) return true;
          }
        }

        return false;
      }
      return true;
    });
  }, [allTemplates, selectedCategory, selectedToolType, searchQuery, language]);

  // Sorted Templates based on User Selection (Default, Popular, Alpha, Inputs)
  const sortedTemplates = useMemo(() => {
    let list = [...filteredTemplates];
    if (sortBy === 'popular') {
      list.sort((a, b) => {
        const aPop = POPULAR_FRAMEWORK_NAMES.has(a.frameworkName) ? 1 : 0;
        const bPop = POPULAR_FRAMEWORK_NAMES.has(b.frameworkName) ? 1 : 0;
        return bPop - aPop;
      });
    } else if (sortBy === 'alpha-asc') {
      list.sort((a, b) => {
        const nameA = translateFrameworkName(a.frameworkName, language);
        const nameB = translateFrameworkName(b.frameworkName, language);
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === 'alpha-desc') {
      list.sort((a, b) => {
        const nameA = translateFrameworkName(a.frameworkName, language);
        const nameB = translateFrameworkName(b.frameworkName, language);
        return nameB.localeCompare(nameA);
      });
    } else if (sortBy === 'fields-desc') {
      list.sort((a, b) => b.fieldCount - a.fieldCount);
    } else if (sortBy === 'fields-asc') {
      list.sort((a, b) => a.fieldCount - b.fieldCount);
    }
    return list;
  }, [filteredTemplates, sortBy, language]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Banner (Compact, Cybernetic Neural Studio Image Background with Dark Overlay) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl bg-[#090d16]">
        {/* Background Image with Controlled Opacity & Dark Mesh */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity scale-105 pointer-events-none transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        {/* Dark Radial & Linear Overlay Gradients for 100% WCAG AAA Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#090e18]/95 to-[#090d16]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#070b12]/90 pointer-events-none" />

        {/* Hero Content Container - Compact & Space-Efficient */}
        <div className="relative z-10 p-4 sm:py-5 sm:px-7 md:py-6 md:px-8 max-w-3xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] sm:text-xs font-semibold backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PromptMatrix 2.0</span>
            <span>•</span>
            <span>{allTemplates.length} {language === 'id' ? 'Formula AI Terverifikasi' : 'Verified AI Formulas'}</span>
          </div>

          <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white font-sans leading-snug">
            {language === 'id'
              ? 'Racik 360 Formula Prompt AI Presisi Tinggi'
              : 'Craft 360 High-Precision AI Prompt Formulas'}
          </h1>
          
          <p className="text-xs sm:text-[13px] text-slate-300/90 leading-relaxed max-w-2xl font-sans hidden sm:block">
            {language === 'id'
              ? 'Panduan visual terstruktur untuk ChatGPT, Claude, Gemini, DeepSeek, Cursor & Midjourney.'
              : 'Structured visual framework for ChatGPT, Claude, Gemini, DeepSeek, Cursor & Midjourney.'}
          </p>

          {/* Context-Aware Search Bar with Keyboard Shortcut Indicator */}
          <div className="pt-0.5 max-w-2xl space-y-1.5">
            <div className="relative">
              <svg className="absolute left-3.5 top-2.5 sm:top-3 w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari 360 formula AI: GCC, AIDA, Cursorrules, Midjourney, LPDP...' : 'Search 360 AI formulas: GCC, AIDA, Cursorrules, Midjourney, LPDP...'}
                className="w-full pl-9 sm:pl-11 pr-16 sm:pr-20 py-2 sm:py-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 focus:border-emerald-500 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2 sm:top-2.5 text-xs sm:text-sm text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              ) : (
                <div className="absolute right-3.5 top-2 sm:top-2.5 hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 rounded-md pointer-events-none">
                  <span>Ctrl</span>
                  <span>K</span>
                </div>
              )}
            </div>

            {/* Quick Search Chips - 6 Curated High-Value Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-slate-400 font-sans mr-1">{language === 'id' ? 'Pencarian cepat:' : 'Quick search:'}</span>
              {QUICK_SEARCH_TAGS.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag.query);
                    setSelectedCategory('all');
                  }}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all border ${
                    searchQuery === tag.query
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                      : 'bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800/80 backdrop-blur-xs'
                  }`}
                >
                  {language === 'id' ? tag.label_id : tag.label_en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Used Bar (Section B7) */}
      {recentTemplates.length > 0 && !searchQuery.trim() && (
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-sans">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{language === 'id' ? 'Terakhir Digunakan' : 'Recently Used'}</span>
            </div>
            <button
              type="button"
              onClick={handleClearRecent}
              className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              {language === 'id' ? 'Hapus Riwayat' : 'Clear History'}
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {recentTemplates.map(r => (
              <button
                key={r.frameworkName}
                onClick={() => handleSelectRecent(r)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span className="text-emerald-400 font-bold">⚡</span>
                <span className="truncate max-w-[170px]">{translateFrameworkName(r.frameworkName, language)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Grid Filter & Sort Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 font-sans">
              {language === 'id' ? 'Kategori Kebutuhan' : 'Explore by Category'}
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
              ({filteredTemplates.length} {language === 'id' ? 'formula' : 'formulas'})
            </span>
          </div>

          {/* Sort Selector (Section B9) */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] hidden sm:inline">{language === 'id' ? 'Urutkan:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="default">{language === 'id' ? 'Default (Kategori)' : 'Default (Category)'}</option>
              <option value="popular">{language === 'id' ? '🔥 Populer Teratas' : '🔥 Popular First'}</option>
              <option value="alpha-asc">{language === 'id' ? 'Nama (A-Z)' : 'Name (A-Z)'}</option>
              <option value="alpha-desc">{language === 'id' ? 'Nama (Z-A)' : 'Name (Z-A)'}</option>
              <option value="fields-desc">{language === 'id' ? 'Input Terbanyak' : 'Most Inputs'}</option>
              <option value="fields-asc">{language === 'id' ? 'Input Tersedikit' : 'Fewest Inputs'}</option>
            </select>
          </div>
        </div>

        {/* 2-Column on Mobile (with 'All' spanning top) and balanced 3x3 Grid on Tablet & Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`col-span-2 sm:col-span-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="truncate">{language === 'id' ? 'Semua Kategori' : 'All Categories'}</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 shrink-0 ml-1.5">
              {allTemplates.length}
            </span>
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const icon = CategoryIcons[cat];
            const localizedCatName = translateCategoryName(cat, language);
            const count = allTemplates.filter(t => t.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border shadow-sm ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-400 shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>
                  <span className="truncate">{localizedCatName}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 shrink-0 ml-1.5">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Category Quick Nav (Section A4) - Always reachable on scroll */}
      <div className="sticky top-16 z-30 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 py-2 bg-[#090d16]/95 backdrop-blur-md border-y border-slate-800/80 shadow-md flex items-center justify-between gap-2 overflow-x-auto scrollbar-none transition-all">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/90 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            <span>{language === 'id' ? 'Semua' : 'All'}</span>
            <span className="text-[10px] font-mono text-slate-500">({allTemplates.length})</span>
          </button>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = allTemplates.filter(t => t.category === cat).length;
            return (
              <button
                key={`sticky-${cat}`}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/90 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span>{translateCategoryName(cat, language)}</span>
                <span className="text-[10px] font-mono text-slate-500">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skeleton Loading Cards (Section A6) while changing filter / sort */}
      {isLoadingTransition ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 animate-fade-in">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-2xl p-4 sm:p-5 border border-slate-800/80 bg-slate-900/50 flex flex-col justify-between gap-4 animate-pulse min-h-[190px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-3.5 bg-slate-800 rounded w-16"></div>
                </div>
                <div className="h-5 bg-slate-800 rounded w-3/4"></div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 bg-slate-800/70 rounded w-full"></div>
                  <div className="h-3 bg-slate-800/70 rounded w-5/6"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <div className="h-3 bg-slate-800 rounded w-16"></div>
                <div className="h-7 bg-slate-800 rounded-xl w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Template Cards Grid (High Readability, Modern & Elegant) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {sortedTemplates.slice(0, visibleCount).map(item => {
            const localizedFwName = translateFrameworkName(item.frameworkName, language);
            const localizedFwDesc = translateFrameworkDescription(item.framework.description || '', language, item.frameworkName);
            const localizedCatName = translateCategoryName(item.category, language);
            const localizedSubcatName = translateSubcategoryName(item.subcategory, language);
            const isSelected = selectedFrameworkName === item.frameworkName;
            const isPopular = POPULAR_FRAMEWORK_NAMES.has(item.frameworkName);

            return (
              <div
                key={item.frameworkName}
                onClick={() => onSelectFramework(item.category, item.subcategory, item.frameworkName, item.framework)}
                className={`group cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between gap-3 sm:gap-4 ${
                  isSelected
                    ? 'bg-slate-900/90 border-emerald-500 ring-1 ring-emerald-500/50 shadow-xl'
                    : 'bg-[#0f172a]/80 hover:bg-[#0f172a] border-slate-800/90 hover:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-2">
                  {/* Header Tag / Category & Badges */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-400 font-medium truncate flex-1" title={`${localizedCatName} ❯ ${localizedSubcatName}`}>
                      {localizedCatName} ❯ {localizedSubcatName}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPopular && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[9px] font-semibold flex items-center gap-0.5">
                          <span>🔥</span>
                          <span>{language === 'id' ? 'Populer' : 'Popular'}</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 font-mono text-[9px] sm:text-[10px] text-slate-400 uppercase">
                        {getLocalizedToolType(item.framework.toolType, language)}
                      </span>
                    </div>
                  </div>

                  {/* Template Name */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug min-h-[2.5rem] flex items-center">
                    {localizedFwName}
                  </h3>

                  {/* Template Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[2rem]">
                    {localizedFwDesc || (language === 'id' ? 'Template prompt terstruktur untuk hasil AI optimal.' : 'Structured prompt template for optimal AI outputs.')}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                    {item.fieldCount} {language === 'id' ? 'kolom isian' : 'inputs'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Share Deep Link Button (Section B12) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyShare(item.frameworkName);
                      }}
                      title={language === 'id' ? 'Salin link langsung formula ini' : 'Copy link to this formula'}
                      className="h-7 px-2 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-slate-700 text-[10px] font-medium transition-all flex items-center gap-1"
                    >
                      {copiedLinkFw === item.frameworkName ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-emerald-400 font-semibold">{language === 'id' ? 'Disalin!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          <span className="hidden sm:inline">{language === 'id' ? 'Share' : 'Share'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-slate-950 font-semibold text-xs transition-all flex items-center gap-1 sm:gap-1.5"
                    >
                      <span>{language === 'id' ? 'Gunakan' : 'Use'}</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Pagination Controls (Eliminating Infinite Scroll & Boosting Performance) */}
      {sortedTemplates.length > visibleCount && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-950/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            <span>
              {language === 'id'
                ? `Muat Lebih Banyak (+${Math.min(PAGE_SIZE, sortedTemplates.length - visibleCount)})`
                : `Load More (+${Math.min(PAGE_SIZE, sortedTemplates.length - visibleCount)})`}
            </span>
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setVisibleCount(sortedTemplates.length)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-medium transition-all"
          >
            {language === 'id' ? `Tampilkan Semua (${sortedTemplates.length})` : `Show All (${sortedTemplates.length})`}
          </button>
        </div>
      )}


      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <p className="text-base font-medium text-slate-300">
            {language === 'id' ? 'Tidak ada template yang cocok dengan pencarian Anda' : 'No templates match your search query'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            {language === 'id' ? 'Reset Pencarian' : 'Reset Search'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
