import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HelpModalProps {
  show: boolean;
  onHide: () => void;
  showAIFeatures?: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ show, onHide, showAIFeatures = false }) => {
  const { t, language } = useLanguage();
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  if (!show) return null;

  const loadMarkdown = async (filePath: string, title: string) => {
    setIsLoadingDoc(true);
    try {
      const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
      const response = await fetch(cleanPath);
      if (!response.ok) {
        const relativeRes = await fetch(`./docs/${filePath.split('/').pop()}`);
        if (!relativeRes.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await relativeRes.text();
        setMarkdownContent(text);
        setDocumentTitle(title);
        return;
      }
      const text = await response.text();
      setMarkdownContent(text);
      setDocumentTitle(title);
    } catch (error: any) {
      console.error("Failed to load markdown file:", error);
      setMarkdownContent(language === 'id' ? `Gagal memuat dokumen: ${error.message || String(error)}` : `Failed to load document: ${error.message || String(error)}`);
      setDocumentTitle(title || (language === 'id' ? "Dokumen" : "Document"));
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handleBackToHelp = () => {
    setMarkdownContent(null);
    setDocumentTitle(null);
  };

  // Simple Markdown renderer for headings, lists, bold, and paragraphs
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-3 text-xs leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          // Headings
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-base font-bold text-teal-300 border-b border-slate-700 pb-1 pt-2">
                {trimmed.replace(/^#\s+/, '')}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-sm font-bold text-teal-400 border-b border-slate-800 pb-1 pt-2">
                {trimmed.replace(/^##\s+/, '')}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xs font-bold text-purple-300 pt-1.5">
                {trimmed.replace(/^###\s+/, '')}
              </h3>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-xs font-semibold text-slate-100">
                {trimmed.replace(/^####\s+/, '')}
              </h4>
            );
          }

          // Lists
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-slate-300">
                {trimmed.replace(/^[-*]\s+/, '')}
              </li>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <li key={idx} className="ml-4 list-decimal text-slate-300">
                {trimmed.replace(/^\d+\.\s+/, '')}
              </li>
            );
          }

          // Code blocks
          if (trimmed.startsWith('```')) {
            return (
              <div key={idx} className="font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800 text-teal-300">
                {trimmed}
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={idx} className="text-slate-300 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-sans">
              {documentTitle || t('help_title')}
            </h3>
          </div>
          <button
            onClick={onHide}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-1 font-sans">
          {isLoadingDoc ? (
            <div className="py-16 text-center text-emerald-400 space-y-2">
              <div className="text-2xl animate-spin">⏳</div>
              <p>{language === 'id' ? 'Memuat dokumen bantuan...' : 'Loading help document...'}</p>
            </div>
          ) : markdownContent ? (
            <div className="space-y-4">
              <button
                onClick={handleBackToHelp}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>←</span>
                <span>{t('back_to_help')}</span>
              </button>
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                {renderFormattedMarkdown(markdownContent)}
              </div>
            </div>
          ) : (
            <>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/40 p-4 rounded-2xl">
                <h4 className="text-sm font-bold text-emerald-300 mb-1">{t('welcome_title')}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('welcome_desc')}
                </p>
              </div>

              {/* Interactive Quick Doc Buttons */}
              <div className={`grid grid-cols-1 ${showAIFeatures ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
                <button
                  onClick={() => loadMarkdown("/docs/PanduanPenggunaanInteraktif.md", t('btn_interactive_guide'))}
                  className="p-3.5 bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 rounded-2xl font-semibold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{t('btn_interactive_guide')}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{t('btn_interactive_guide_sub')}</span>
                </button>

                <button
                  onClick={() => loadMarkdown("/docs/FAQ.md", t('btn_faq'))}
                  className="p-3.5 bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 rounded-2xl font-semibold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('btn_faq')}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{t('btn_faq_sub')}</span>
                </button>

                <button
                  onClick={() => loadMarkdown("/docs/DaftarKerangkaKerja.md", t('btn_frameworks'))}
                  className="p-3.5 bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 rounded-2xl font-semibold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>{t('btn_frameworks')}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{t('btn_frameworks_sub')}</span>
                </button>

                {showAIFeatures && (
                  <button
                    onClick={() => loadMarkdown("/docs/PanduanAIPro.md", language === 'id' ? '⚡ Panduan Fitur AI Pro & API' : '⚡ AI Pro & API Guide')}
                    className="p-3.5 bg-gradient-to-br from-purple-950/60 to-slate-900 hover:from-purple-900/60 hover:to-slate-850 border border-purple-700/60 hover:border-purple-500/80 text-purple-200 hover:text-white rounded-2xl font-semibold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all animate-fade-in"
                  >
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-center">{language === 'id' ? '⚡ Fitur AI Pro' : '⚡ AI Pro Guide'}</span>
                    <span className="text-[10px] text-purple-300/70 font-normal">{language === 'id' ? 'Setup & Aksi' : 'Setup & Actions'}</span>
                  </button>
                )}
              </div>

              {/* Exclusive AI Pro Active Banner (Only if AI is unlocked) */}
              {showAIFeatures && (
                <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-800/50 p-4 rounded-2xl space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-purple-300 text-xs flex items-center gap-1.5 font-sans">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                      <span>{language === 'id' ? '⚡ Mode AI Pro Aktif' : '⚡ AI Pro Mode Active'}</span>
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-200 border border-purple-700/50">Unlocked</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {language === 'id'
                      ? 'Fitur AI Suggest (Bantu Ide), AI Enhance (Sempurnakan), AI Quality Analysis, dan tombol Atur Provider API kini terbuka. Untuk menyembunyikannya kembali, ketuk logo aplikasi sebanyak 9 kali.'
                      : 'AI Suggest, AI Enhance, AI Quality Analysis, and API Provider setup are now unlocked. To hide them again, tap the app logo 9 times.'}
                  </p>
                </div>
              )}

              {/* Basic Workflow Section */}
              <div className="space-y-2">
                <h5 className="font-semibold text-slate-100 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>{t('basic_workflow_title')}</span>
                </h5>
                <ol className="space-y-2 list-decimal list-inside bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/80">
                  <li>
                    <strong className="text-slate-100">{t('workflow_step1').split(':')[0]}:</strong> {t('workflow_step1').split(':')[1]}
                  </li>
                  <li>
                    <strong className="text-slate-100">{t('workflow_step2').split(':')[0]}:</strong> {t('workflow_step2').split(':')[1]}
                  </li>
                  <li>
                    <strong className="text-slate-100">{t('workflow_step3').split(':')[0]}:</strong> {t('workflow_step3').split(':')[1]}
                  </li>
                  <li>
                    <strong className="text-slate-100">{t('workflow_step4').split(':')[0]}:</strong> {t('workflow_step4').split(':')[1]}
                  </li>
                </ol>
              </div>

              {/* Additional Features */}
              <div className="space-y-2">
                <h5 className="font-semibold text-slate-100 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span>🗂️</span>
                  <span>{t('additional_features_title')}</span>
                </h5>
                <ul className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/80">
                  <li>
                    <strong className="text-teal-300">• {t('saved_prompts_title')}:</strong> {language === 'id' ? 'Simpan, muat kembali, ubah nama, hapus, serta cadangkan seluruh prompt ke file JSON (Export/Import).' : 'Save, reload, rename, delete, and backup all your prompts to JSON (Export/Import).'}
                  </li>
                  <li>
                    <strong className="text-teal-300">• {language === 'id' ? 'Opsi Kustom "Lainnya..."' : 'Custom "Other..." Option'}:</strong> {language === 'id' ? 'Dropdown secara dinamis membuka kolom input baru jika Anda memilih "Lainnya...".' : 'Dropdowns dynamically open a new text input when you select "Other...".'}
                  </li>
                </ul>
              </div>

              {/* Prompt Engineering Quality Principles */}
              <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/80">
                <h5 className="font-semibold text-teal-300 text-xs">{t('principles_title')}</h5>
                <p className="text-slate-300 leading-relaxed">
                  {language === 'id'
                    ? 'Setiap kerangka kerja di PromptMatrix 2.0 dirancang untuk menjadi Komprehensif, Dinamis, Relevan, Detail, memiliki Logika AI, dan mengutamakan Perspektif Pengguna.'
                    : 'Every framework in PromptMatrix 2.0 is designed to be Comprehensive, Dynamic, Relevant, Detailed, AI Logic-driven, and User-centric.'}
                </p>
                <p className="text-slate-400 pt-2 border-t border-slate-800">
                  {language === 'id' ? 'Untuk informasi lebih lanjut, hubungi pengembang di ' : 'For more information, contact the author at '}
                  <a href="mailto:si.sigitadi@gmail.com" className="text-teal-400 hover:underline font-semibold">
                    si.sigitadi@gmail.com
                  </a>.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-700 pt-3 flex justify-end">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            {t('close_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
