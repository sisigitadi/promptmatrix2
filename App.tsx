import React, { useState, useEffect, useRef } from 'react';
import { PROMPT_FRAMEWORKS, Framework } from './data/frameworks';
import FrameworkPane from './components/FrameworkPane';
import TemplateGallery from './components/TemplateGallery';
import Header from './components/Header';
import Footer from './components/Footer';
import HelpModal from './components/HelpModal';
import AISettingsModal from './components/AISettingsModal';
import { useLanguage } from './contexts/LanguageContext';
import { 
  addPromptToDB, 
  getAllPromptsFromDB, 
  deletePromptFromDB, 
  updatePromptInDB,
  exportPromptsToJSONFile,
  exportPromptsToPlainTextFile,
  importPromptsFromJSONFile 
} from './db';
import { isAIConfigured } from './services/aiSettingsService';
import { 
  enhancePromptWithUniversalAI, 
  suggestFieldContentWithUniversalAI, 
  analyzePromptQualityWithUniversalAI, 
  PromptAnalysisResult 
} from './services/universalAIService';
import { slugifyFormula } from './services/urlHelper';
import { 
  COMMON_LABELS_TRANSLATIONS,
  AI_LOGICS_MAP,
  translateComponentLabel,
  translateInfo,
  translateOption,
  translateFrameworkName
} from './services/localizationService';
import { VisualPromptPreview } from './components/VisualPromptPreview';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToolLauncher {
  name: string;
  url: string;
  category: 'all' | 'chat' | 'image' | 'video' | 'audio' | 'code';
  badge?: string;
  icon: string;
}

const AI_TOOL_LAUNCHERS: ToolLauncher[] = [
  // 💬 Chat & Reasoning
  { name: 'ChatGPT', url: 'https://chatgpt.com/', category: 'chat', icon: '🟢', badge: 'GPT-4o' },
  { name: 'Claude', url: 'https://claude.ai/new', category: 'chat', icon: '🟧', badge: '3.7 Sonnet' },
  { name: 'Google Gemini', url: 'https://gemini.google.com/app', category: 'chat', icon: '✨', badge: '2.5 Flash' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com/', category: 'chat', icon: '🔵', badge: 'R1 Reasoning' },
  { name: 'Perplexity AI', url: 'https://www.perplexity.ai/', category: 'chat', icon: '🌐', badge: 'Search & Cite' },
  { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/', category: 'chat', icon: '🪟', badge: 'Web Pro' },
  { name: 'Grok (xAI)', url: 'https://x.com/i/grok', category: 'chat', icon: '🖤', badge: 'Realtime X' },
  { name: 'Poe by Quora', url: 'https://poe.com/', category: 'chat', icon: '🤖', badge: 'Multi-Bot' },
  { name: 'HuggingChat', url: 'https://huggingface.co/chat/', category: 'chat', icon: '🤗', badge: 'Open Models' },
  
  // 🎨 Image & Design AI
  { name: 'Midjourney', url: 'https://www.midjourney.com/explore', category: 'image', icon: '🎨', badge: 'v6.1' },
  { name: 'DALL-E 3', url: 'https://chatgpt.com/g/g-2fkYVsCas-dall-e', category: 'image', icon: '🖼️', badge: 'OpenAI' },
  { name: 'Leonardo.Ai', url: 'https://app.leonardo.ai/', category: 'image', icon: '🦁', badge: 'Phoenix & Flux' },
  { name: 'Flux.1 (Fal)', url: 'https://fal.ai/models/fal-ai/flux/dev', category: 'image', icon: '⚡', badge: 'Hyper-Real' },
  { name: 'Ideogram AI', url: 'https://ideogram.ai/', category: 'image', icon: '🔤', badge: 'Text In Image' },
  { name: 'Recraft.ai', url: 'https://www.recraft.ai/', category: 'image', icon: '📐', badge: 'Vector & 3D' },
  { name: 'Canva Magic', url: 'https://www.canva.com/ai-image-generator/', category: 'image', icon: '🪄', badge: 'Design Studio' },
  { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/', category: 'image', icon: '🪶', badge: 'Commercial' },

  // 🎬 Video & Animation AI
  { name: 'Runway Gen-3', url: 'https://app.runwayml.com/', category: 'video', icon: '🎬', badge: 'Alpha Video' },
  { name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine', category: 'video', icon: '🔮', badge: 'Cinematic' },
  { name: 'Kling AI', url: 'https://klingai.com/', category: 'video', icon: '🎥', badge: 'High Motion' },
  { name: 'Pika Labs', url: 'https://pika.art/', category: 'video', icon: '⚡', badge: 'Pika 2.0' },
  { name: 'Hailuo AI (Minimax)', url: 'https://hailuoai.video/', category: 'video', icon: '📹', badge: 'Expressive' },

  // 🎵 Audio, Voice & Music AI
  { name: 'Suno AI', url: 'https://suno.com/', category: 'audio', icon: '🎵', badge: 'v4 Full Song' },
  { name: 'Udio Music', url: 'https://www.udio.com/', category: 'audio', icon: '🎸', badge: 'Studio Audio' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io/app/speech-synthesis', category: 'audio', icon: '🎙️', badge: 'Voice Clone' },

  // 💻 Coding & Developer AI
  { name: 'v0 by Vercel', url: 'https://v0.dev/', category: 'code', icon: '▲', badge: 'React/Tailwind' },
  { name: 'Bolt.new', url: 'https://bolt.new/', category: 'code', icon: '⚡', badge: 'Fullstack App' },
  { name: 'Lovable.dev', url: 'https://lovable.dev/', category: 'code', icon: '❤️', badge: 'Full App' },
  { name: 'Cursor IDE', url: 'https://www.cursor.com/', category: 'code', icon: '💻', badge: 'AI Editor' },
  { name: 'Phind for Devs', url: 'https://www.phind.com/', category: 'code', icon: '🔍', badge: 'Dev Search' },
];

const App: React.FC = () => {
  const { language, t } = useLanguage();

  // App Navigation Mode: 'gallery' (Visual template cards) or 'studio' (2-column prompt builder)
  const [viewMode, setViewMode] = useState<'gallery' | 'studio'>('gallery');
  const [launcherCategory, setLauncherCategory] = useState<'all' | 'chat' | 'image' | 'video' | 'audio' | 'code'>('all');

  // Theme & Modals
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);

  // Navigation & Framework Selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedFrameworkName, setSelectedFrameworkName] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);

  // Form State
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [customOtherValues, setCustomOtherValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toolTypeFilter, setToolTypeFilter] = useState<string>('all');

  // Stash Management
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
  const [showStash, setShowStash] = useState(false);
  const [stashSearch, setStashSearch] = useState('');
  const [editingPromptId, setEditingPromptId] = useState<number | null>(null);
  const [editNameInput, setEditNameInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Toast & Copy State
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Preview Reader & Fullscreen Review Modal State
  const [previewViewMode, setPreviewViewMode] = useState<'structured' | 'raw'>('structured');
  const [showExpandReviewModal, setShowExpandReviewModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [compareAlternativePrompt, setCompareAlternativePrompt] = useState<string>('');
  const [expandedStashPromptId, setExpandedStashPromptId] = useState<number | null>(null);

  // Hidden AI Features State & 9-Tap Logo Unlock
  const [showAIFeatures, setShowAIFeatures] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pm_ai_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const logoClickTimeoutRef = useRef<any>(null);

  const handleLogoTap = () => {
    setViewMode('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 9) {
        setShowAIFeatures(current => {
          const updated = !current;
          try {
            localStorage.setItem('pm_ai_unlocked', String(updated));
          } catch (e) {
            console.error(e);
          }
          showToast(
            updated
              ? (language === 'id' ? '⚡ Fitur AI Pro Berhasil Diaktifkan!' : '⚡ AI Pro Features Unlocked!')
              : (language === 'id' ? '🔒 Fitur AI Telah Disembunyikan' : '🔒 AI Features Hidden'),
            'success'
          );
          return updated;
        });
        return 0;
      }
      return next;
    });

    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
    }
    logoClickTimeoutRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 4000);
  };

  // AI Operation States
  const [loadingFieldId, setLoadingFieldId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PromptAnalysisResult | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Floating Scroll to top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadSavedPrompts();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadSavedPrompts = async () => {
    try {
      const prompts = await getAllPromptsFromDB();
      setSavedPrompts(prompts);
    } catch (error) {
      console.error('Error loading saved prompts:', error);
    }
  };

  // Re-compile prompt when language changes
  useEffect(() => {
    if (selectedFramework && selectedFrameworkName) {
      const prompt = compilePrompt(selectedFramework, selectedFrameworkName, formValues, customOtherValues);
      setGeneratedPrompt(prompt);
    }
  }, [language]);

  const compilePrompt = (
    fw?: Framework | null,
    fwName?: string | null,
    values: Record<string, any> = {},
    otherValues: Record<string, string> = {}
  ): string => {
    if (!fw || !fwName) return '';
    const lines: string[] = [];

    // 1. AI Persona / Persona AI (Unified across banner and prompt output)
    let rawLogic = fw.ai_logic_description || fw.logika_ai;
    if (rawLogic) {
      if (language === 'en') {
        const enPersona = AI_LOGICS_MAP[fwName] || `AI Persona: ${translateInfo(rawLogic.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i, ''), 'en')}`;
        lines.push(enPersona);
      } else {
        const idClean = rawLogic.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i, '').trim();
        lines.push(`Persona AI: ${idClean}`);
      }
      lines.push('');
    }

    // 2. Components
    let comps = fw.components || [];
    if (comps.length === 0 && fw.komponen_prompt?.["VARIABEL INPUT"]) {
      comps = Object.entries(fw.komponen_prompt["VARIABEL INPUT"]).map(([k, v]) => ({
        name: k,
        ...v
      }));
    }

    // Dynamic extra components if any
    let dynamicExtra: any[] = [];
    if (fw.dynamicSubcomponents) {
      const trigger = fw.dynamicSubcomponents.trigger;
      const triggerVal = values[trigger];
      if (triggerVal && fw.dynamicSubcomponents.options[triggerVal]) {
        dynamicExtra = fw.dynamicSubcomponents.options[triggerVal];
      }
    }

    const allComps = [...comps, ...dynamicExtra];

    allComps.forEach(comp => {
      let val = values[comp.name];
      if (val === 'Lainnya...' || val === 'Other...') {
        val = otherValues[comp.name] ? `${val} (${otherValues[comp.name]})` : val;
      }
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const labelToDisplay = language === 'en' 
          ? translateComponentLabel(comp.label || comp.name, 'en')
          : (comp.label || comp.name);
        const valToDisplay = typeof val === 'string' && language === 'en' ? translateOption(val, 'en') : val;
        lines.push(`${labelToDisplay}: ${valToDisplay}`);
        lines.push(''); // Baris kosong antar parameter agar lega dan mudah dibaca
      }
    });

    // 3. Additional Context / Instructions from SOP
    if (fw.konteks_tambahan_instruksi_khusus) {
      const additionalInstruction = language === 'en'
        ? translateInfo(fw.konteks_tambahan_instruksi_khusus, 'en')
        : fw.konteks_tambahan_instruksi_khusus;
      lines.push(`${language === 'id' ? 'Instruksi Tambahan' : 'Additional Instructions'}: ${additionalInstruction}`);
      lines.push('');
    }

    // 4. Few-Shot Reference Examples (Optionally populated by user)
    const fewShotInput = values['__few_shot_input'];
    const fewShotOutput = values['__few_shot_output'];
    if (fewShotInput || fewShotOutput) {
      const fewShotHeader = language === 'id' ? 'Contoh Acuan (Few-Shot Reference Example)' : 'Few-Shot Reference Example';
      let fewShotContent = '';
      if (fewShotInput) {
        fewShotContent += `${language === 'id' ? '[Contoh Masukan]' : '[Sample Input]'}:\n${fewShotInput}\n\n`;
      }
      if (fewShotOutput) {
        fewShotContent += `${language === 'id' ? '[Contoh Keluaran yang Diharapkan]' : '[Expected Output]'}:\n${fewShotOutput}`;
      }
      lines.push(`${fewShotHeader}:\n${fewShotContent.trim()}`);
      lines.push('');
    }

    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  // Helper to render prompt paragraphs in a clean, structured, and visually spacious format
  const renderStructuredContent = (text: string) => {
    if (!text) return null;
    const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

    return (
      <div className="flex flex-col gap-3">
        {blocks.map((block, idx) => {
          const colonMatch = block.match(/^([A-Za-z0-9\s()&/._-]{2,45}):\s*([\s\S]*)$/);
          const tagMatch = block.match(/^(\[[^\]]+\])\s*([\s\S]*)$/);

          if (colonMatch) {
            const label = colonMatch[1];
            const content = colonMatch[2];
            return (
              <div 
                key={idx} 
                className="bg-slate-900/70 rounded-xl p-3 sm:p-3.5 border border-slate-800/80 hover:border-slate-700/80 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>{label}</span>
                </div>
                <div className="text-xs sm:text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                  {content}
                </div>
              </div>
            );
          }

          if (tagMatch) {
            const tag = tagMatch[1];
            const content = tagMatch[2];
            return (
              <div 
                key={idx} 
                className="bg-slate-900/70 rounded-xl p-3 sm:p-3.5 border border-slate-800/80 hover:border-slate-700/80 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-cyan-400 tracking-wider mb-1.5 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                  <span>{tag}</span>
                </div>
                {content && (
                  <div className="text-xs sm:text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                    {content}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div 
              key={idx} 
              className="bg-slate-900/50 rounded-xl p-3 sm:p-3.5 border border-slate-800/70 text-xs sm:text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap font-sans"
            >
              {block}
            </div>
          );
        })}
      </div>
    );
  };

  const handleSelectFramework = (
    catName: string,
    subcatName: string,
    fwName: string,
    fw: Framework
  ) => {
    setSelectedCategory(catName);
    setSelectedSubcategory(subcatName);
    setSelectedFrameworkName(fwName);
    setSelectedFramework(fw);

    // Save to recently used (Section B7)
    try {
      const raw = localStorage.getItem('pm_recent_templates');
      const list: Array<{ category: string; subcategory: string; frameworkName: string }> = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(item => item.frameworkName !== fwName);
      const updated = [{ category: catName, subcategory: subcatName, frameworkName: fwName }, ...filtered].slice(0, 6);
      localStorage.setItem('pm_recent_templates', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving recent template:', e);
    }

    const initialValues: Record<string, any> = {};
    const initialOther: Record<string, string> = {};
    setFormValues(initialValues);
    setCustomOtherValues(initialOther);

    const prompt = compilePrompt(fw, fwName, initialValues, initialOther);
    setGeneratedPrompt(prompt);
    setAnalysisResult(null);
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check deep link URL on initial mount (Section B12 - Clean Slugs without %20)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const targetQuery = params.get('f') || params.get('formula') || params.get('template');
      if (targetQuery) {
        const querySlug = slugifyFormula(targetQuery);
        for (const [catName, subcats] of Object.entries(PROMPT_FRAMEWORKS)) {
          for (const [subcatName, fws] of Object.entries(subcats)) {
            for (const [fwName, fw] of Object.entries(fws)) {
              const currentFwSlug = slugifyFormula(fwName);
              if (
                currentFwSlug === querySlug ||
                (querySlug.length >= 3 && currentFwSlug.includes(querySlug)) ||
                (querySlug.length >= 3 && querySlug.includes(currentFwSlug))
              ) {
                handleSelectFramework(catName, subcatName, fwName, fw);
                return;
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Error parsing deep link query:', e);
    }
  }, []);

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prev => {
      const updatedValues = { ...prev, [name]: value };
      if (selectedFramework && selectedFrameworkName) {
        const prompt = compilePrompt(selectedFramework, selectedFrameworkName, updatedValues, customOtherValues);
        setGeneratedPrompt(prompt);
      }
      return updatedValues;
    });
  };

  const handleBatchInputChange = (newValues: Record<string, any>) => {
    setFormValues(prev => {
      const updatedValues = { ...prev, ...newValues };
      if (selectedFramework && selectedFrameworkName) {
        const prompt = compilePrompt(selectedFramework, selectedFrameworkName, updatedValues, customOtherValues);
        setGeneratedPrompt(prompt);
      }
      return updatedValues;
    });
  };

  const handleCustomOtherChange = (name: string, value: string) => {
    const updatedOther = { ...customOtherValues, [name]: value };
    setCustomOtherValues(updatedOther);

    if (selectedFramework && selectedFrameworkName) {
      const prompt = compilePrompt(selectedFramework, selectedFrameworkName, formValues, updatedOther);
      setGeneratedPrompt(prompt);
    }
  };

  const handleClearFields = () => {
    setFormValues({});
    setCustomOtherValues({});
    if (selectedFramework && selectedFrameworkName) {
      const prompt = compilePrompt(selectedFramework, selectedFrameworkName, {}, {});
      setGeneratedPrompt(prompt);
    }
    setAnalysisResult(null);
  };

  const handleSavePrompt = async () => {
    if (!selectedFramework || !selectedFrameworkName || !generatedPrompt) return;

    try {
      const promptToSave = {
        name: `${selectedFrameworkName} - ${new Date().toLocaleDateString()}`,
        frameworkId: selectedFrameworkName,
        category: (selectedCategory || 'text') as any,
        promptComponents: [],
        interactiveFormValues: formValues,
        otherInputValues: customOtherValues,
        userDefinedInteraction: '',
        generatedPrompt,
        promptToCopy: generatedPrompt,
        language: language,
        selectedFrameworkName: selectedFrameworkName
      };

      await addPromptToDB(promptToSave);
      await loadSavedPrompts();
      showToast(t('toast_saved'), 'success');
    } catch (error) {
      console.error('Error saving prompt:', error);
      showToast(language === 'id' ? 'Gagal menyimpan prompt' : 'Error saving prompt', 'error');
    }
  };

  const handleLoadPrompt = (prompt: any) => {
    try {
      let foundFw: Framework | null = null;
      let foundCat: string | null = null;
      let foundSubcat: string | null = null;
      let foundName = prompt.selectedFrameworkName || prompt.frameworkId;

      // Find in PROMPT_FRAMEWORKS
      Object.entries(PROMPT_FRAMEWORKS).forEach(([cat, subcats]) => {
        Object.entries(subcats).forEach(([subcat, fws]) => {
          if (fws[foundName]) {
            foundFw = fws[foundName];
            foundCat = cat;
            foundSubcat = subcat;
          }
        });
      });

      if (foundFw && foundCat && foundSubcat) {
        setSelectedCategory(foundCat);
        setSelectedSubcategory(foundSubcat);
        setSelectedFrameworkName(foundName);
        setSelectedFramework(foundFw);
        setFormValues(prompt.interactiveFormValues || {});
        setCustomOtherValues(prompt.otherInputValues || {});
        setGeneratedPrompt(prompt.generatedPrompt || '');
        showToast(t('toast_loaded'), 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setGeneratedPrompt(prompt.generatedPrompt || '');
        showToast(t('toast_loaded'), 'success');
      }
    } catch (err) {
      console.error('Error loading prompt:', err);
    }
  };

  const handleDeletePrompt = async (id: number) => {
    if (window.confirm(t('delete_confirm'))) {
      try {
        await deletePromptFromDB(id);
        await loadSavedPrompts();
        showToast(t('toast_deleted'), 'info');
      } catch (error) {
        console.error('Error deleting prompt:', error);
      }
    }
  };

  const handleStartRename = (prompt: any) => {
    setEditingPromptId(prompt.id);
    setEditNameInput(prompt.name);
  };

  const handleSaveRename = async (prompt: any) => {
    if (editNameInput.trim()) {
      try {
        await updatePromptInDB({
          ...prompt,
          name: editNameInput.trim()
        });
        await loadSavedPrompts();
        setEditingPromptId(null);
        showToast(t('toast_renamed'), 'success');
      } catch (err) {
        console.error('Error renaming prompt:', err);
      }
    }
  };

  const handleExportStash = () => {
    if (savedPrompts.length === 0) {
      showToast(t('no_saved_prompts'), 'info');
      return;
    }
    exportPromptsToJSONFile(savedPrompts);
    showToast(t('toast_exported'), 'success');
  };

  const handleExportStashMarkdown = () => {
    if (savedPrompts.length === 0) {
      showToast(t('no_saved_prompts'), 'info');
      return;
    }
    const lines = [
      '# Koleksi Prompt - PromptMatrix 2.0',
      `Diekspor pada: ${new Date().toLocaleString()}`,
      `Total Prompt: ${savedPrompts.length}`,
      '',
      '---',
      ''
    ];
    savedPrompts.forEach((p, idx) => {
      lines.push(`## ${idx + 1}. ${p.name}`);
      lines.push(`- **Framework:** ${p.selectedFrameworkName || p.frameworkId || '-'}`);
      lines.push(`- **Tanggal Simpan:** ${new Date(p.timestamp).toLocaleString()}`);
      lines.push('');
      lines.push('```');
      lines.push(p.generatedPrompt);
      lines.push('```');
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PromptMatrix_Stash_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(language === 'id' ? 'Berhasil ekspor ke Markdown (.md)' : 'Exported to Markdown (.md)', 'success');
  };

  const handleImportStashFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await importPromptsFromJSONFile(file);
      await loadSavedPrompts();
      showToast(`${t('toast_imported')} (${count} ${language === 'id' ? 'item' : 'items'})`, 'success');
    } catch (err: any) {
      console.error('Error importing file:', err);
      showToast(err.message || (language === 'id' ? 'Gagal mengimpor file JSON' : 'Failed to import JSON file'), 'error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      showToast(t('toast_copied'), 'success');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      showToast(t('toast_copied'), 'success');
    }
  };


  // --- UNIVERSAL AI ACTIONS ---
  const checkAIConfiguredOrPrompt = (): boolean => {
    if (!isAIConfigured()) {
      showToast(t('toast_need_ai_setup'), 'info');
      setShowAISettingsModal(true);
      return false;
    }
    return true;
  };

  const handleAiSuggestField = async (fieldName: string, fieldLabel: string) => {
    if (!checkAIConfiguredOrPrompt() || !selectedFrameworkName) return;

    setLoadingFieldId(fieldName);
    try {
      const otherContext = Object.entries(formValues)
        .filter(([k, v]) => k !== fieldName && v)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');

      const suggestion = await suggestFieldContentWithUniversalAI(
        fieldLabel,
        selectedFrameworkName,
        otherContext,
        language
      );

      if (suggestion) {
        handleInputChange(fieldName, suggestion);
        showToast(t('toast_suggested'), 'success');
      }
    } catch (err: any) {
      console.error('Error generating AI suggestion:', err);
      showToast(err.message || (language === 'id' ? 'Saran AI gagal' : 'AI Suggestion failed'), 'error');
    } finally {
      setLoadingFieldId(null);
    }
  };

  const handleAiEnhancePrompt = async () => {
    if (!checkAIConfiguredOrPrompt() || !selectedFrameworkName || !generatedPrompt) return;

    setIsEnhancing(true);
    try {
      const enhanced = await enhancePromptWithUniversalAI(
        generatedPrompt,
        selectedFrameworkName,
        language
      );

      if (enhanced) {
        setGeneratedPrompt(enhanced);
        showToast(t('toast_enhanced'), 'success');
      }
    } catch (err: any) {
      console.error('Error enhancing prompt with AI:', err);
      showToast(err.message || (language === 'id' ? 'Penyempurnaan AI gagal' : 'AI Enhancement failed'), 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAiAnalyzePrompt = async () => {
    if (!checkAIConfiguredOrPrompt() || !selectedFrameworkName || !generatedPrompt) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzePromptQualityWithUniversalAI(
        generatedPrompt,
        selectedFrameworkName,
        language
      );

      setAnalysisResult(result);
      setShowAnalysisModal(true);
    } catch (err: any) {
      console.error('Error analyzing prompt with AI:', err);
      showToast(err.message || (language === 'id' ? 'Analisis kualitas AI gagal' : 'AI Analysis failed'), 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter stash prompts
  const displayedSavedPrompts = savedPrompts.filter(prompt => {
    const matchesQuery = !stashSearch.trim() || 
      prompt.name.toLowerCase().includes(stashSearch.toLowerCase()) ||
      prompt.generatedPrompt.toLowerCase().includes(stashSearch.toLowerCase()) ||
      (prompt.selectedFrameworkName && prompt.selectedFrameworkName.toLowerCase().includes(stashSearch.toLowerCase()));
    return matchesQuery;
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isLightTheme 
        ? 'bg-slate-50 text-slate-800 selection:bg-teal-200 selection:text-teal-900' 
        : 'bg-slate-900 text-slate-100 selection:bg-teal-700 selection:text-white'
    }`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2 text-sm font-medium ${
            toast.type === 'success' 
              ? 'bg-teal-900 border-teal-500 text-teal-100' 
              : toast.type === 'error'
              ? 'bg-red-900 border-red-500 text-red-100'
              : 'bg-slate-800 border-slate-600 text-slate-100'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hidden File Input for JSON Restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportStashFile}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Reusable Header Component with Universal Provider Status and Mode Switcher */}
      <Header
        onLogoClick={handleLogoTap}
        onShowHelp={() => setShowHelpModal(true)}
        onShowStash={() => setShowStash(!showStash)}
        onOpenApiKeyModal={() => setShowAISettingsModal(true)}
        savedPromptsCount={savedPrompts.length}
        isLightTheme={isLightTheme}
        onToggleTheme={() => setIsLightTheme(!isLightTheme)}
        activeMode={viewMode}
        showAIFeatures={showAIFeatures}
        onSelectMode={(mode) => {
          setViewMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 pb-28 sm:pb-32 lg:pb-8 space-y-6">
        {viewMode === 'gallery' ? (
          /* Mode 1: Human-Centric Template Gallery */
          <TemplateGallery
            frameworksData={PROMPT_FRAMEWORKS}
            onSelectFramework={handleSelectFramework}
            selectedFrameworkName={selectedFrameworkName}
          />
        ) : (
          /* Mode 2: Spacious 2-Column Studio (55% Editor, 45% Live Output) */
          <div className="space-y-6 animate-fade-in">
            {/* Top Back & Quick Step Bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
              <button
                type="button"
                onClick={() => setViewMode('gallery')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{language === 'id' ? 'Kembali ke Galeri Template' : 'Back to Template Gallery'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{language === 'id' ? 'Mode Studio Aktif' : 'Studio Mode Active'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form Editor (Spacious 7 cols / ~58%) */}
              <div className="lg:col-span-7">
                {selectedFramework && selectedFrameworkName ? (
                  <FrameworkPane
                    categoryName={selectedCategory || ''}
                    subcategoryName={selectedSubcategory || ''}
                    frameworkName={selectedFrameworkName}
                    framework={selectedFramework}
                    formValues={formValues}
                    customOtherValues={customOtherValues}
                    onInputChange={handleInputChange}
                    onBatchInputChange={handleBatchInputChange}
                    onCustomOtherChange={handleCustomOtherChange}
                    onClearFields={handleClearFields}
                    onAiSuggest={handleAiSuggestField}
                    loadingFieldId={loadingFieldId}
                    onBackToGallery={() => setViewMode('gallery')}
                    showAIFeatures={showAIFeatures}
                  />
                ) : (
                  <div className="bg-[#0f172a]/95 border border-slate-800/90 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center justify-center min-h-[380px] shadow-2xl space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-200">
                        {language === 'id' ? 'Belum Ada Template yang Dipilih' : 'No Template Selected Yet'}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {language === 'id' 
                          ? 'Buka galeri template untuk memilih kebutuhan prompt Anda.'
                          : 'Open the template gallery to choose your prompt template.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setViewMode('gallery')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      {language === 'id' ? 'Buka Galeri Template' : 'Explore Templates'}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Monolithic Studio Output Card (5 cols / ~42%) */}
              <div id="prompt-output-card" className="lg:col-span-5 flex flex-col gap-4 sticky top-20">
                {/* Live Output Box */}
                <div className="bg-[#0f172a]/95 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
                  <div className="flex flex-col gap-2.5 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-sans">
                          {t('prompt_preview')}
                        </h2>
                      </div>
                      {generatedPrompt && (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-850 text-emerald-400 font-medium">
                            {generatedPrompt.length} {t('chars_count')}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-400">
                            ~{Math.round(generatedPrompt.length / 4)} tokens
                          </span>
                          {/* Tombol Bandingkan Side-by-Side */}
                          <button
                            type="button"
                            onClick={() => {
                              setCompareAlternativePrompt(generatedPrompt);
                              setShowCompareModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors"
                            title={language === 'id' ? 'Bandingkan Prompt Berdampingan' : 'Compare Prompts Side-by-Side'}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </button>
                          {/* Tombol Perbesar / Layar Penuh */}
                          <button
                            type="button"
                            onClick={() => setShowExpandReviewModal(true)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors ml-0.5"
                            title={t('expand_review_btn')}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mode Tampilan Pratinjau (Terstruktur vs Teks Polos) */}
                    {generatedPrompt && (
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex bg-slate-950/90 border border-slate-800/90 rounded-xl p-0.5 text-[11px] font-sans">
                          <button
                            type="button"
                            onClick={() => setPreviewViewMode('structured')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                              previewViewMode === 'structured'
                                ? 'bg-emerald-600/90 text-white font-semibold shadow-sm shadow-emerald-950'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <span>{t('preview_structured')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewViewMode('raw')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                              previewViewMode === 'raw'
                                ? 'bg-emerald-600/90 text-white font-semibold shadow-sm shadow-emerald-950'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <span>{t('preview_raw')}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {generatedPrompt ? (
                    <div className="flex flex-col gap-4">
                      {/* Visual Mockup & Contoh Hasil Terkurasi (Selaras Isian Contoh) */}
                      <VisualPromptPreview
                        promptText={generatedPrompt}
                        framework={selectedFramework}
                        frameworkName={selectedFrameworkName}
                        category={selectedCategory}
                        isLightTheme={isLightTheme}
                      />

                      {/* Kontainer Teks Pratinjau Terbaca */}
                      {previewViewMode === 'structured' ? (
                        <div className="bg-[#070b12] border border-slate-800/90 rounded-2xl p-4 sm:p-5 min-h-[220px] max-h-[460px] overflow-y-auto selection:bg-emerald-900/60 shadow-inner">
                          {renderStructuredContent(generatedPrompt)}
                        </div>
                      ) : (
                        <div className="bg-[#070b12] border border-slate-800/90 rounded-2xl p-4 sm:p-5 min-h-[220px] max-h-[460px] overflow-y-auto text-xs sm:text-[13px] leading-[1.85] font-mono text-slate-200 whitespace-pre-wrap break-words selection:bg-emerald-900/60 shadow-inner">
                          {generatedPrompt}
                        </div>
                      )}

                      {/* AI Enhancement & Quality Actions (Hidden by default, unlocked via 9-tap logo) */}
                      {showAIFeatures && (
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          <button
                            onClick={handleAiEnhancePrompt}
                            disabled={isEnhancing}
                            className="h-9 px-2.5 sm:px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-600/50 text-purple-300 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all disabled:opacity-50"
                            title={language === 'id' ? 'Sempurnakan prompt dengan AI' : 'Enhance prompt with AI'}
                          >
                            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="truncate">{isEnhancing ? t('ai_enhancing') : t('ai_enhance_btn')}</span>
                          </button>
                          <button
                            onClick={handleAiAnalyzePrompt}
                            disabled={isAnalyzing}
                            className="h-9 px-2.5 sm:px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-600/50 text-indigo-300 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all disabled:opacity-50"
                            title={language === 'id' ? 'Analisis kualitas prompt' : 'Analyze prompt quality'}
                          >
                            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="truncate">{isAnalyzing ? t('ai_analyzing') : t('ai_analyze_btn')}</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Copy & Save Action Buttons */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => copyToClipboard(generatedPrompt)}
                          className={`w-full h-11 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
                            isCopied 
                              ? 'bg-emerald-400 text-slate-950 scale-[1.01] shadow-emerald-500/30' 
                              : 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white shadow-emerald-950/50'
                          }`}
                        >
                          {isCopied ? (
                            <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                          <span>
                            {isCopied 
                              ? (language === 'id' ? 'Tersalin ke Clipboard!' : 'Copied to Clipboard!') 
                              : t('copy_prompt_btn')}
                          </span>
                        </button>
                        <button
                          onClick={handleSavePrompt}
                          className="w-full h-9 px-4 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all border border-slate-800 hover:border-slate-700"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          <span>{t('save_stash_btn')}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#090d16]/80 border border-dashed border-slate-800/90 rounded-2xl p-8 sm:p-10 text-center text-slate-500 text-xs flex flex-col items-center justify-center min-h-[180px] sm:min-h-[220px]">
                      <svg className="w-8 h-8 text-slate-600 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p className="max-w-xs">{t('prompt_placeholder_hint')}</p>
                    </div>
                  )}
                </div>

                {/* Direct AI Tool Launchers Section */}
                <div className="bg-[#0f172a]/95 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-sans">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>{t('popular_tools_title')}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
                        {AI_TOOL_LAUNCHERS.filter(t => launcherCategory === 'all' || t.category === launcherCategory).length}
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-sans">{language === 'id' ? 'Auto-salin ke clipboard' : 'Auto-copies prompt'}</span>
                  </div>

                  {/* Launcher Category Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-medium">
                    {[
                      { id: 'all', label: language === 'id' ? 'Semua' : 'All' },
                      { id: 'chat', label: language === 'id' ? '💬 Chat & Teks' : '💬 Chat & Text' },
                      { id: 'image', label: language === 'id' ? '🎨 Gambar AI' : '🎨 Image AI' },
                      { id: 'video', label: language === 'id' ? '🎬 Video AI' : '🎬 Video AI' },
                      { id: 'audio', label: language === 'id' ? '🎵 Audio AI' : '🎵 Audio AI' },
                      { id: 'code', label: language === 'id' ? '💻 Coding AI' : '💻 Coding AI' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setLauncherCategory(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-sans ${
                          launcherCategory === cat.id
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                            : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Launcher Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {AI_TOOL_LAUNCHERS
                      .filter(tool => launcherCategory === 'all' || tool.category === launcherCategory)
                      .map((tool, idx) => (
                        <a
                          key={idx}
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            if (generatedPrompt) {
                              copyToClipboard(generatedPrompt);
                            }
                          }}
                          className="p-2.5 bg-slate-900/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-xs font-medium text-slate-300 hover:text-emerald-200 transition-all flex items-center justify-between group truncate"
                          title={language === 'id' ? `Buka ${tool.name} (Otomatis menyalin prompt)` : `Open ${tool.name} (Auto-copies prompt)`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-sm shrink-0">{tool.icon}</span>
                            <div className="truncate flex flex-col items-start leading-tight">
                              <span className="truncate font-semibold text-slate-200 group-hover:text-emerald-300">{tool.name}</span>
                              {tool.badge && (
                                <span className="text-[9px] text-slate-500 font-mono">{tool.badge}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 ml-1 shrink-0">↗</span>
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Floating Quick Action Dock */}
            {generatedPrompt && (
              <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800 z-30 flex items-center justify-between gap-3 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setShowExpandReviewModal(true)}
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{language === 'id' ? 'Tinjau Lengkap' : 'Full Review'}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(generatedPrompt)}
                  className={`flex-1 h-10 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isCopied
                      ? 'bg-emerald-400 text-slate-950 font-bold'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isCopied ? (
                    <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                  <span>
                    {isCopied
                      ? (language === 'id' ? 'Tersalin!' : 'Copied!')
                      : (language === 'id' ? 'Salin Prompt' : 'Copy Prompt')}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}




        {/* Saved Prompts Stash Drawer/Panel */}
        {showStash && (
          <div className="mt-8 bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-md animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                  <span>{t('saved_prompts_title')}</span>
                </h2>
                <span className="text-xs bg-slate-900 border border-slate-700 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  {savedPrompts.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportStash}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  title={language === 'id' ? 'Ekspor prompt ke file cadangan JSON' : 'Export prompts to JSON backup file'}
                >
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>JSON</span>
                </button>
                <button
                  onClick={handleExportStashMarkdown}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  title={language === 'id' ? 'Ekspor prompt ke format Markdown (.md)' : 'Export prompts to Markdown (.md) file'}
                >
                  <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Markdown (.md)</span>
                </button>
                <button
                  onClick={() => {
                    if (savedPrompts.length === 0) {
                      showToast(t('no_saved_prompts'), 'info');
                      return;
                    }
                    exportPromptsToPlainTextFile(savedPrompts);
                    showToast(language === 'id' ? 'Berhasil ekspor ke Plain Text (.txt)' : 'Exported to Plain Text (.txt)', 'success');
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  title={language === 'id' ? 'Ekspor prompt ke format Teks Polos (.txt)' : 'Export prompts to Plain Text (.txt) file'}
                >
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Text (.txt)</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  title={language === 'id' ? 'Impor prompt dari file cadangan JSON' : 'Import prompts from JSON backup file'}
                >
                  <svg className="w-3.5 h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{t('import_stash_btn')}</span>
                </button>
                <button
                  onClick={() => setShowStash(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-xl bg-slate-900 border border-slate-700 ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Search Input */}
            {savedPrompts.length > 0 && (
              <div className="relative w-full max-w-sm mb-5">
                <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={stashSearch}
                  onChange={(e) => setStashSearch(e.target.value)}
                  placeholder={t('search_stash_placeholder')}
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>
            )}

            {/* Prompts Cards Grid */}
            {displayedSavedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedSavedPrompts.map(prompt => (
                  <div 
                    key={prompt.id} 
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                  >
                    <div>
                      {/* Card Title / Rename Form */}
                      <div className="flex justify-between items-start mb-2">
                        {editingPromptId === prompt.id ? (
                          <div className="flex items-center gap-1.5 w-full mr-2">
                            <input
                              type="text"
                              value={editNameInput}
                              onChange={(e) => setEditNameInput(e.target.value)}
                              className="flex-1 px-2.5 py-1 bg-slate-950 border border-emerald-500 rounded-lg text-xs text-slate-100 focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRename(prompt)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingPromptId(null)}
                              className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg text-[11px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 truncate max-w-[210px] group">
                            <h3 className="font-semibold text-xs text-emerald-400 truncate" title={prompt.name}>
                              {prompt.name}
                            </h3>
                            <button
                              onClick={() => handleStartRename(prompt)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-300 transition-opacity p-0.5"
                              title={t('rename_tooltip')}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md font-mono border border-slate-800 whitespace-nowrap ml-1">
                          {new Date(prompt.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      {expandedStashPromptId === prompt.id ? (
                        <div className="mb-3 space-y-1.5">
                          <div className="text-xs text-slate-200 font-mono whitespace-pre-wrap max-h-56 overflow-y-auto bg-slate-950/95 p-3 rounded-xl border border-emerald-500/30 leading-relaxed shadow-inner">
                            {prompt.generatedPrompt}
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedStashPromptId(null)}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                          >
                            <span>{language === 'id' ? '▲ Tutup Pratinjau' : '▲ Collapse Preview'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="mb-3 space-y-1.5">
                          <p 
                            onClick={() => setExpandedStashPromptId(prompt.id)}
                            className="text-xs text-slate-300 font-mono line-clamp-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed cursor-pointer hover:border-slate-700 transition-colors"
                            title={language === 'id' ? 'Klik untuk membaca selengkapnya' : 'Click to expand and read full prompt'}
                          >
                            {prompt.generatedPrompt}
                          </p>
                          <button
                            type="button"
                            onClick={() => setExpandedStashPromptId(prompt.id)}
                            className="text-[11px] text-slate-400 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors"
                          >
                            <span>{language === 'id' ? '▼ Baca Selengkapnya' : '▼ Read Full Prompt'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleLoadPrompt(prompt)}
                        className="flex-1 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{t('load_btn')}</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(prompt.generatedPrompt)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs transition-colors"
                        title={t('copy_btn')}
                      >
                        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-300 rounded-xl text-xs transition-colors"
                        title={t('delete_btn')}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-10 text-xs">{t('no_saved_prompts')}</p>
            )}
          </div>
        )}
      </main>

      {/* Help Modal */}
      <HelpModal
        show={showHelpModal}
        onHide={() => setShowHelpModal(false)}
        showAIFeatures={showAIFeatures}
      />

      {/* Universal Multi-Provider AI Settings Modal */}
      <AISettingsModal
        show={showAISettingsModal}
        onHide={() => setShowAISettingsModal(false)}
        onSettingsSaved={() => {
          showToast(t('toast_settings_saved'), 'success');
        }}
      />

      {/* AI Analysis Quality Modal */}
      {showAnalysisModal && analysisResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h3 className="text-lg font-bold text-slate-100">{t('ai_analysis_title')}</h3>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Score Indicators Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/80 border border-slate-700 p-3 rounded-xl">
                <div className="text-2xl font-bold text-teal-400">{analysisResult.clarityScore}%</div>
                <div className="text-[11px] text-slate-400 mt-1">{t('score_clarity')}</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-700 p-3 rounded-xl">
                <div className="text-2xl font-bold text-purple-400">{analysisResult.specificityScore}%</div>
                <div className="text-[11px] text-slate-400 mt-1">{t('score_specificity')}</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-700 p-3 rounded-xl">
                <div className="text-2xl font-bold text-emerald-400">{analysisResult.overallScore}%</div>
                <div className="text-[11px] text-slate-400 mt-1">{t('score_overall')}</div>
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="bg-slate-900/60 border border-slate-700/80 p-3.5 rounded-xl space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <span>💡</span>
                <span>{t('feedback_title')}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisResult.feedback}
              </p>
            </div>

            {/* Actionable Suggestions */}
            {analysisResult.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🚀</span>
                  <span>{t('suggestions_title')}</span>
                </h4>
                <ul className="space-y-1.5">
                  {analysisResult.suggestions.map((sug, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                      <span className="text-teal-400 mt-0.5">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowAnalysisModal(false)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {t('close_btn')}
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Spacious Review & Copy Modal */}
      {showExpandReviewModal && generatedPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-[#0b101b] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-[#0e1424] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                    {t('review_modal_title')}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    {selectedFrameworkName && (
                      <span className="text-emerald-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                        {translateFrameworkName(selectedFrameworkName, language)}
                      </span>
                    )}
                    <span>•</span>
                    <span>{generatedPrompt.length} {t('chars_count')}</span>
                    <span>•</span>
                    <span>~{Math.round(generatedPrompt.length / 4)} tokens</span>
                  </div>
                </div>
              </div>

              {/* Mode Switcher & Close */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setPreviewViewMode('structured')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      previewViewMode === 'structured'
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="hidden sm:inline">{t('preview_structured')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewMode('raw')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      previewViewMode === 'raw'
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="hidden sm:inline">{t('preview_raw')}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowExpandReviewModal(false)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                  title={t('close_btn')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Spacious & Comfortable Reading Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070b13] space-y-4">
              {/* Visual Mockup & Contoh Hasil in Expanded Modal */}
              <div className="max-w-3xl mx-auto">
                <VisualPromptPreview
                  promptText={generatedPrompt}
                  framework={selectedFramework}
                  frameworkName={selectedFrameworkName}
                  category={selectedCategory}
                  isLightTheme={isLightTheme}
                />
              </div>

              {previewViewMode === 'structured' ? (
                <div className="max-w-3xl mx-auto">
                  {renderStructuredContent(generatedPrompt)}
                </div>
              ) : (
                <div className="max-w-3xl mx-auto bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm leading-loose font-mono text-slate-200 whitespace-pre-wrap break-words selection:bg-emerald-900/60 shadow-inner">
                  {generatedPrompt}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-slate-800 bg-[#0e1424] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSavePrompt}
                className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>{t('save_stash_btn')}</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowExpandReviewModal(false)}
                  className="h-10 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                >
                  {t('close_btn')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(generatedPrompt);
                  }}
                  className={`h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                    isCopied
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-900/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-950/50'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t('copied_btn')}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>{t('copy_prompt_btn')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Prompt Comparison Modal */}
      {showCompareModal && generatedPrompt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-[#0b101b] border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-[#0e1424] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    {language === 'id' ? 'Komparasi Prompt Berdampingan (Side-by-Side)' : 'Side-by-Side Prompt Comparison'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === 'id' ? 'Bandingkan prompt aktif dengan variasi alternatif secara langsung' : 'Compare active prompt with alternative variations side-by-side'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                title={t('close_btn')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Two Columns Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070b13] grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Column A: Active Form Prompt */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{language === 'id' ? 'Versi A (Hasil Formulir)' : 'Version A (Active Form Prompt)'}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      ~{Math.round(generatedPrompt.length / 4)} tokens
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(generatedPrompt);
                        showToast(t('copied_btn'), 'success');
                      }}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
                    >
                      {t('copy_btn')}
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-h-[300px] bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap overflow-y-auto leading-relaxed shadow-inner">
                  {generatedPrompt}
                </div>
              </div>

              {/* Column B: Editable Alternative / Variation */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{language === 'id' ? 'Versi B (Dapat Diedit / Variasi)' : 'Version B (Editable Variation)'}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      ~{Math.round(compareAlternativePrompt.length / 4)} tokens
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(compareAlternativePrompt);
                        showToast(t('copied_btn'), 'success');
                      }}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
                    >
                      {t('copy_btn')}
                    </button>
                  </div>
                </div>
                <textarea
                  value={compareAlternativePrompt}
                  onChange={(e) => setCompareAlternativePrompt(e.target.value)}
                  placeholder={language === 'id' ? 'Ketik atau tempelkan variasi prompt pembanding di sini...' : 'Type or paste alternative prompt variation here...'}
                  className="flex-1 min-h-[300px] bg-slate-950/90 border border-slate-800/90 focus:border-cyan-500 rounded-2xl p-4 text-xs font-mono text-slate-200 resize-none leading-relaxed focus:outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-[#0e1424] flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-sans hidden sm:inline">
                {language === 'id' ? '💡 Tip: Anda dapat mengedit Versi B langsung untuk menguji variasi instruksi.' : '💡 Tip: You can edit Version B directly to experiment with different prompt variations.'}
              </span>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="h-9 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium ml-auto transition-colors"
              >
                {t('close_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll-to-Top Floating Action Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={language === 'id' ? 'Kembali ke atas' : 'Scroll to top'}
          title={language === 'id' ? 'Kembali ke atas' : 'Scroll to top'}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-slate-900/90 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-slate-950/80 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 group"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Reusable Footer Component with Social Links & Copyright */}
      <Footer isLightTheme={isLightTheme} />
    </div>
  );
};

export default App;