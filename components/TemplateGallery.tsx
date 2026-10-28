import React, { useState, useMemo, useEffect } from 'react';
import { PromptFrameworksType, Framework, CATEGORY_ORDER } from '../data/frameworks';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  translateCategoryName, 
  translateSubcategoryName, 
  translateFrameworkName, 
  translateFrameworkDescription 
} from '../services/localizationService';

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

// Recommended quick search tags matching actual database formulas
const QUICK_SEARCH_TAGS = [
  { id: 'aida', label_id: 'AIDA Copywriting', label_en: 'AIDA Copywriting', query: 'AIDA' },
  { id: 'reasoning', label_id: 'Reasoning (GCC)', label_en: 'Reasoning (GCC)', query: 'GCC' },
  { id: 'rtf', label_id: 'RTF Framework', label_en: 'RTF Framework', query: 'RTF' },
  { id: 'costar', label_id: 'CO-STAR Framework', label_en: 'CO-STAR Framework', query: 'CO-STAR' },
  { id: 'starr', label_id: 'S-T-A-R-R Method', label_en: 'S-T-A-R-R Method', query: 'S-T-A-R-R' },
  { id: 'hso', label_id: 'Hook Video (HSO)', label_en: 'Short Video Hook (HSO)', query: 'Hook-Story-Offer' },
  { id: 'tiktoklive', label_id: 'TikTok Live Stream', label_en: 'TikTok Live Stream', query: 'TikTok Shop' },
  { id: 'shopee', label_id: 'Deskripsi Shopee', label_en: 'Marketplace Description', query: 'Deskripsi Produk' },
  { id: 'wa', label_id: 'Closing WhatsApp', label_en: 'WhatsApp Sales Closing', query: 'Closing Sales' },
  { id: 'midjourney', label_id: 'Midjourney & Flux', label_en: 'Midjourney & Flux', query: 'Midjourney' },
  { id: 'kling', label_id: 'Kling & Runway Video', label_en: 'Kling & Runway Video', query: 'Kling' },
  { id: 'suno', label_id: 'Suno AI Musik', label_en: 'Suno AI Music', query: 'Suno' },
  { id: 'codingrules', label_id: 'Cursor & MCP Server', label_en: 'Cursor & MCP Server', query: 'cursorrules' },
  { id: 'rag', label_id: 'RAG Pipeline Dev', label_en: 'RAG Pipeline Dev', query: 'RAG' },
  { id: 'lpdp', label_id: 'Esai LPDP Beasiswa', label_en: 'LPDP Scholarship Essay', query: 'LPDP' },
  { id: 'mock', label_id: 'Wawancara Kerja', label_en: 'Mock Job Interview', query: 'Mock Interviewer' },
  { id: 'itin', label_id: 'Itinerary Liburan', label_en: 'Travel Itinerary', query: 'Itinerary' },
  { id: 'resep', label_id: 'Resep Masak Kulkas', label_en: 'Fridge Meal Recipe', query: 'Perencana Menu' },
  { id: 'feynman', label_id: 'Feynman Explainer', label_en: 'Feynman Explainer', query: 'Feynman' },
  { id: 'seo', label_id: 'Artikel Pilar SEO', label_en: 'SEO Pillar Article', query: 'SEO' }
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

  const PAGE_SIZE = 24;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Auto-reset visible count to initial batch when filter or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchQuery, selectedToolType]);

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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Banner (Clean, Human, Zero AI Cliché) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#090d16] border border-slate-800 p-5 sm:p-8 md:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-semibold">
            <span>PromptMatrix 2.0</span>
            <span>•</span>
            <span>{allTemplates.length} {language === 'id' ? 'Template Formula AI' : 'AI Formula Templates'}</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-sans leading-tight">
            {language === 'id'
              ? 'Mau meracik prompt formula apa hari ini?'
              : 'What prompt formula would you like to build?'}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl font-sans">
            {language === 'id'
              ? 'Pilih formula prompt terstruktur di bawah ini (misal: RTF, AIDA, STAR, SEO, Midjourney), isi variabel sederhana atau gunakan contoh 1-klik, dan hasilkan prompt berkualitas tinggi.'
              : 'Choose any structured prompt formula below (e.g. RTF, AIDA, STAR, SEO, Midjourney), fill in simple inputs or use 1-click samples, and generate high-precision prompts.'}
          </p>

          {/* Natural Search Bar */}
          <div className="pt-2 max-w-2xl space-y-2.5">
            <div className="relative">
              <svg className="absolute left-3.5 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari formula atau topik: RTF, CO-STAR, SEO, Copywriting, Midjourney, Coding...' : 'Search formula or topic: RTF, CO-STAR, SEO, Copywriting, Midjourney, Coding...'}
                className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3.5 bg-slate-950/90 border border-slate-700/80 focus:border-emerald-500 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2.5 sm:top-3 text-xs sm:text-sm text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Search Chips matching real formulas */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-500 font-sans mr-1">{language === 'id' ? 'Pencarian cepat:' : 'Quick search:'}</span>
              {QUICK_SEARCH_TAGS.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag.query);
                    setSelectedCategory('all');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                    searchQuery === tag.query
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950/70 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  {language === 'id' ? tag.label_id : tag.label_en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Category Grid Filter (Neat, Non-Scrolling Responsive Grid - Zero Swipe/Geser) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 font-sans">
            {language === 'id' ? 'Kategori Kebutuhan' : 'Explore by Category'}
          </h2>
          <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
            {filteredTemplates.length > PAGE_SIZE
              ? (language === 'id' 
                  ? `Menampilkan ${Math.min(visibleCount, filteredTemplates.length)} dari ${filteredTemplates.length} formula` 
                  : `Showing ${Math.min(visibleCount, filteredTemplates.length)} of ${filteredTemplates.length} formulas`)
              : `${filteredTemplates.length} ${language === 'id' ? 'template ditemukan' : 'templates found'}`
            }
          </span>
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

      {/* Template Cards Grid (High Readability, Modern & Elegant) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredTemplates.slice(0, visibleCount).map(item => {
          const localizedFwName = translateFrameworkName(item.frameworkName, language);
          const localizedFwDesc = translateFrameworkDescription(item.framework.description || '', language, item.frameworkName);
          const localizedCatName = translateCategoryName(item.category, language);
          const localizedSubcatName = translateSubcategoryName(item.subcategory, language);
          const isSelected = selectedFrameworkName === item.frameworkName;

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
                {/* Header Tag / Category */}
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-400 font-medium truncate flex-1" title={`${localizedCatName} ❯ ${localizedSubcatName}`}>
                    {localizedCatName} ❯ {localizedSubcatName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 font-mono text-[9px] sm:text-[10px] text-slate-400 uppercase shrink-0">
                    {getLocalizedToolType(item.framework.toolType, language)}
                  </span>
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
          );
        })}
      </div>

      {/* Load More Pagination Controls (Eliminating Infinite Scroll & Boosting Performance) */}
      {filteredTemplates.length > visibleCount && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-950/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            <span>
              {language === 'id'
                ? `Muat Lebih Banyak (+${Math.min(PAGE_SIZE, filteredTemplates.length - visibleCount)})`
                : `Load More (+${Math.min(PAGE_SIZE, filteredTemplates.length - visibleCount)})`}
            </span>
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setVisibleCount(filteredTemplates.length)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-medium transition-all"
          >
            {language === 'id' ? `Tampilkan Semua (${filteredTemplates.length})` : `Show All (${filteredTemplates.length})`}
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
