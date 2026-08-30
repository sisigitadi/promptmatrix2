import React, { useState, useEffect, useRef } from 'react';
import { PromptFrameworksType, Framework, CATEGORY_ORDER } from '../data/frameworks';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  translateCategoryName, 
  translateSubcategoryName, 
  translateFrameworkName, 
  translateFrameworkDescription 
} from '../services/localizationService';

interface NavigationPaneProps {
  frameworksData: PromptFrameworksType;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedFrameworkName: string | null;
  onSelectFramework: (category: string, subcategory: string, frameworkName: string, framework: Framework) => void;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  toolTypeFilter: string;
  onToolTypeFilterChange: (toolType: string) => void;
}

const categoryIcons: Record<string, string> = {
  "Teks & Konten": "✍️",
  "Gambar & Desain": "🎨",
  "Audio & Musik": "🎵",
  "Video & Animasi": "🎬",
  "Kode & Pengembang": "💻",
  "Prompt Ringkas": "⚡",
  "Prompt Proyek": "🚀",
  "Koleksi & Inovasi": "💡",
};

const NavigationPane: React.FC<NavigationPaneProps> = ({
  frameworksData,
  selectedCategory,
  selectedSubcategory,
  selectedFrameworkName,
  onSelectFramework,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  toolTypeFilter,
  onToolTypeFilterChange,
}) => {
  const { t, language } = useLanguage();
  const [openSubcategories, setOpenSubcategories] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSubcategory = (subcatKey: string) => {
    setOpenSubcategories(prev => ({
      ...prev,
      [subcatKey]: !prev[subcatKey]
    }));
  };

  const categories = Object.keys(frameworksData).sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a);
    const idxB = CATEGORY_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  // Calculate total frameworks count
  let totalFrameworksCount = 0;
  Object.values(frameworksData).forEach(subcats => {
    Object.values(subcats).forEach(fws => {
      totalFrameworksCount += Object.keys(fws).length;
    });
  });

  // Filter frameworks
  const filteredData: PromptFrameworksType = {};

  categories.forEach(cat => {
    if (selectedCategory && selectedCategory !== cat && !searchQuery.trim()) {
      return;
    }

    const subcats = frameworksData[cat] || {};
    const filteredSubcats: Record<string, Record<string, Framework>> = {};

    Object.entries(subcats).forEach(([subcatName, fws]) => {
      const filteredFws: Record<string, Framework> = {};

      Object.entries(fws).forEach(([fwName, fw]) => {
        const matchesToolType = !toolTypeFilter || toolTypeFilter === 'all' || fw.toolType === toolTypeFilter;
        const matchesQuery = !searchQuery.trim() || 
          fwName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subcatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (fw.description && fw.description.toLowerCase().includes(searchQuery.toLowerCase()));

        if (matchesToolType && matchesQuery) {
          filteredFws[fwName] = fw;
        }
      });

      if (Object.keys(filteredFws).length > 0) {
        filteredSubcats[subcatName] = filteredFws;
      }
    });

    if (Object.keys(filteredSubcats).length > 0) {
      filteredData[cat] = filteredSubcats;
    }
  });

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
      {/* Header with Search & Badge */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-base">🧭</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {language === 'id' ? 'Katalog Prompt' : 'Prompt Catalog'}
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-emerald-400 border border-slate-700/60">
          {totalFrameworksCount} {language === 'id' ? 'Formula' : 'Formulas'}
        </span>
      </div>

      {/* Quick Goal Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {[
          { id: 'all', label: language === 'id' ? 'Semua' : 'All' },
          { id: 'text', label: language === 'id' ? '✍️ Teks' : '✍️ Text' },
          { id: 'image-generation', label: language === 'id' ? '🎨 Gambar' : '🎨 Image' },
          { id: 'video', label: language === 'id' ? '🎬 Video' : '🎬 Video' },
          { id: 'music-composition', label: language === 'id' ? '🎵 Audio' : '🎵 Audio' },
          { id: 'code', label: language === 'id' ? '💻 Kode' : '💻 Code' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => onToolTypeFilterChange(filter.id)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all border ${
              toolTypeFilter === filter.id
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Modern Search Bar with Ctrl+K */}
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-xs text-slate-500 pointer-events-none">🔍</span>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={language === 'id' ? 'Cari kebutuhan prompt...' : 'Search prompt formulas...'}
          className="w-full pl-8 pr-14 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-2 text-xs text-slate-500 hover:text-slate-300"
          >
            ✕
          </button>
        ) : (
          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 pointer-events-none hidden sm:inline">
            Ctrl+K
          </span>
        )}
      </div>

      {/* Category Pills Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          const icon = categoryIcons[cat] || "📂";
          const subcats = frameworksData[cat] || {};
          let catCount = 0;
          Object.values(subcats).forEach(fws => catCount += Object.keys(fws).length);
          const localizedCategoryName = translateCategoryName(cat, language);

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(isSelected ? '' : cat)}
              className={`p-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/50 hover:bg-slate-800/80 border-slate-800/80 text-slate-300 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs">{icon}</span>
                <span className="truncate">{localizedCategoryName}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 ml-1">
                {catCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Accordion / List of Subcategories & Frameworks */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {Object.entries(filteredData).length > 0 ? (
          Object.entries(filteredData).map(([catName, subcats]) => {
            const localizedCatName = translateCategoryName(catName, language);

            return (
              <div key={catName} className="space-y-1.5">
                {/* Category Header */}
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pt-1 flex items-center gap-1.5">
                  <span className="text-xs">{categoryIcons[catName] || "📁"}</span>
                  <span>{localizedCatName}</span>
                </div>

                {/* Subcategories */}
                {Object.entries(subcats).map(([subcatName, fws]) => {
                  const subcatKey = `${catName}_${subcatName}`;
                  const isOpen = openSubcategories[subcatKey] !== false; // Default open
                  const fwCount = Object.keys(fws).length;
                  const localizedSubcatName = translateSubcategoryName(subcatName, language);

                  return (
                    <div key={subcatKey} className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
                      {/* Subcategory Toggle Header */}
                      <button
                        onClick={() => toggleSubcategory(subcatKey)}
                        className="w-full px-3 py-2 bg-slate-900/60 hover:bg-slate-800/60 flex items-center justify-between text-left text-xs font-semibold text-slate-300 transition-colors"
                      >
                        <span className="truncate">{localizedSubcatName}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                          <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">{fwCount}</span>
                          <span className="text-[9px]">{isOpen ? '▼' : '▶'}</span>
                        </div>
                      </button>

                      {/* Frameworks in this Subcategory */}
                      {isOpen && (
                        <div className="p-1.5 space-y-1 bg-slate-950/30">
                          {Object.entries(fws).map(([fwName, fw]) => {
                            const isSelected = selectedFrameworkName === fwName;
                            const localizedFwName = translateFrameworkName(fwName, language);
                            const localizedFwDesc = translateFrameworkDescription(fw.description || '', language, fwName);

                            return (
                              <button
                                key={fwName}
                                onClick={() => onSelectFramework(catName, subcatName, fwName, fw)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs flex flex-col gap-0.5 border ${
                                  isSelected
                                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-sm'
                                    : 'bg-slate-900/40 hover:bg-slate-800/60 border-transparent text-slate-300 hover:text-slate-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                                    {localizedFwName}
                                  </span>
                                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-950 rounded text-slate-400 border border-slate-800/80">
                                    {fw.toolType || 'general'}
                                  </span>
                                </div>
                                {localizedFwDesc && (
                                  <p className="text-[11px] text-slate-400 line-clamp-1">
                                    {localizedFwDesc}
                                  </p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            {t('no_framework_found')}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationPane;

