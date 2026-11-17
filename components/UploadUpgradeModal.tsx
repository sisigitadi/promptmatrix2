import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BlankCanvasTargetMode } from '../types';
import { detectUploadedContentKind } from '../services/blankCanvasService';
import { UploadedContentUpgradeResult } from '../services/universalAIService';
import { toKebabCaseSkillName } from '../services/agentSkillService';
import { useLanguage } from '../contexts/LanguageContext';

export interface UploadUpgradeModalProps {
  show: boolean;
  onClose: () => void;
  onAnalyzeAndUpgrade: (
    rawContent: string,
    targetKind: 'auto' | BlankCanvasTargetMode,
    upgradeGoal: string
  ) => Promise<void>;
  isAnalyzing: boolean;
  error: string | null;
  onClearError: () => void;
  result: UploadedContentUpgradeResult | null;
  onResetResult: () => void;
  onApplyUpgradedToCanvas: (upgraded: UploadedContentUpgradeResult) => void;
  onLoadOriginalToCanvas: (rawContent: string, filename?: string) => void;
  onCopyText: (text: string, customToast?: string) => void;
  onOpenAiSettings: () => void;
  isLightTheme?: boolean;
}

type PreviewTab = 'upgraded' | 'original' | 'compare';

const ACCEPTED_FILE_EXTENSIONS = '.md,.txt,.json,.markdown,.yaml,.yml';

const readFileAsText = async (file: File): Promise<string> => {
  if (typeof file.text === 'function') {
    return file.text();
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('Failed to read file.'));
    };
    reader.readAsText(file, 'utf-8');
  });
};

export const UploadUpgradeModal: React.FC<UploadUpgradeModalProps> = ({
  show,
  onClose,
  onAnalyzeAndUpgrade,
  isAnalyzing,
  error,
  onClearError,
  result,
  onResetResult,
  onApplyUpgradedToCanvas,
  onLoadOriginalToCanvas,
  onCopyText,
  onOpenAiSettings,
  isLightTheme = false,
}) => {
  const { t, language } = useLanguage();
  const [rawContent, setRawContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [targetKind, setTargetKind] = useState<'auto' | BlankCanvasTargetMode>('auto');
  const [upgradeGoal, setUpgradeGoal] = useState<string>('');
  const [emptyValidationError, setEmptyValidationError] = useState<boolean>(false);
  const [fileReadError, setFileReadError] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<PreviewTab>('upgraded');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  useEffect(() => {
    if (show) {
      setEmptyValidationError(false);
      setFileReadError(null);
    }
  }, [show]);

  useEffect(() => {
    if (result) {
      setPreviewTab('upgraded');
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const detectedKind = useMemo<BlankCanvasTargetMode | null>(() => {
    if (!rawContent.trim()) return null;
    return detectUploadedContentKind(rawContent, fileName || undefined);
  }, [rawContent, fileName]);

  if (!show) return null;

  const focusRingClass =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
  const modalSurfaceClass = isLightTheme
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#0f172a] border-slate-800 text-slate-100';
  const panelClass = isLightTheme
    ? 'bg-slate-50 border-slate-200'
    : 'bg-[#090d16] border-slate-800/90';
  const codePanelClass = isLightTheme
    ? 'bg-white border-slate-300 text-slate-900'
    : 'bg-[#070b12] border-slate-800 text-slate-100';
  const inputClass = isLightTheme
    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-emerald-600'
    : 'bg-[#070b12] border-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500';
  const headingClass = isLightTheme ? 'text-slate-900' : 'text-slate-100';
  const labelClass = isLightTheme ? 'text-slate-800' : 'text-slate-200';
  const secondaryTextClass = isLightTheme ? 'text-slate-600' : 'text-slate-300';
  const mutedTextClass = isLightTheme ? 'text-slate-600' : 'text-slate-400';

  const handleLoadedFile = async (file: File) => {
    setFileReadError(null);
    setEmptyValidationError(false);
    try {
      const content = await readFileAsText(file);
      if (!content.trim()) {
        setFileReadError(
          language === 'id'
            ? `File "${file.name}" kosong. Pilih file lain atau tempel teks secara langsung.`
            : `File "${file.name}" is empty. Choose another file or paste text directly.`
        );
        return;
      }
      setFileName(file.name);
      setRawContent(content);
      if (result) {
        onResetResult();
      }
      if (error) {
        onClearError();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setFileReadError(
        msg ||
          (language === 'id'
            ? `Gagal membaca file "${file.name}".`
            : `Failed to read file "${file.name}".`)
      );
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleLoadedFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleLoadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClearInput = () => {
    setRawContent('');
    setFileName('');
    setUpgradeGoal('');
    setEmptyValidationError(false);
    setFileReadError(null);
    onResetResult();
    if (error) {
      onClearError();
    }
  };

  const handleSubmitAnalyze = async () => {
    if (!rawContent.trim()) {
      setEmptyValidationError(true);
      return;
    }
    setEmptyValidationError(false);
    setFileReadError(null);
    await onAnalyzeAndUpgrade(rawContent, targetKind, upgradeGoal.trim());
  };

  const handleLoadOriginal = () => {
    if (!rawContent.trim()) {
      setEmptyValidationError(true);
      return;
    }
    setEmptyValidationError(false);
    onLoadOriginalToCanvas(rawContent, fileName || undefined);
  };

  const handleDownloadSkill = () => {
    if (!result) return;
    const baseName =
      result.upgradedDraft.skillName ||
      result.upgradedDraft.title ||
      fileName.replace(/\.[^.]+$/, '') ||
      'upgraded-skill';
    const slug = toKebabCaseSkillName(baseName);
    const filename = `${slug}-SKILL.md`;
    const blob = new Blob([result.upgradedFullText], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const targetOptions: ReadonlyArray<{
    value: 'auto' | BlankCanvasTargetMode;
    label: string;
  }> = [
    { value: 'auto', label: t('upload_upgrade_target_auto') },
    { value: 'prompt', label: t('upload_upgrade_target_prompt') },
    { value: 'skill', label: t('upload_upgrade_target_skill') },
  ];

  const scoreBadgeClass = (score: number): string => {
    if (score >= 80) {
      return isLightTheme
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-300';
    }
    if (score >= 60) {
      return isLightTheme
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-amber-950/40 border-amber-800/70 text-amber-300';
    }
    return isLightTheme
      ? 'bg-rose-50 border-rose-200 text-rose-800'
      : 'bg-rose-950/40 border-rose-800/70 text-rose-300';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-upgrade-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`border rounded-2xl sm:rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden ${modalSurfaceClass}`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between gap-3 border-b pb-3.5 sm:pb-4 shrink-0 ${
            isLightTheme ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                isLightTheme
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-[#090d16] border-emerald-500/40 text-emerald-400'
              }`}
              aria-hidden="true"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h2
                id="upload-upgrade-modal-title"
                className={`text-base sm:text-lg font-bold tracking-tight font-sans ${headingClass}`}
              >
                {t('upload_upgrade_title')}
              </h2>
              <p className={`text-xs mt-0.5 leading-relaxed font-sans ${mutedTextClass}`}>
                {t('upload_upgrade_subtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('close_btn')}
            title={t('close_btn')}
            className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-colors shrink-0 ${focusRingClass} ${
              isLightTheme
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-[#090d16] hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-slate-100'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* 1. File Upload / Drag & Drop Zone */}
          <div className={`rounded-2xl border p-4 space-y-3.5 ${panelClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`text-xs font-semibold font-sans ${labelClass}`}>
                {t('upload_upgrade_file_label')}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {detectedKind && (
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold ${
                      detectedKind === 'skill'
                        ? isLightTheme
                          ? 'bg-teal-50 border-teal-300 text-teal-800'
                          : 'bg-teal-950/60 border-teal-700/70 text-teal-300'
                        : isLightTheme
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300'
                    }`}
                  >
                    {language === 'id' ? 'Terdeteksi:' : 'Detected:'}{' '}
                    {detectedKind === 'skill' ? 'SKILL.md' : 'Prompt'}
                  </span>
                )}

                {(rawContent.length > 0 || fileName) && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    disabled={isAnalyzing}
                    className={`min-h-[44px] px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${focusRingClass} ${
                      isLightTheme
                        ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        : 'bg-[#070b12] hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {language === 'id' ? 'Bersihkan' : 'Clear'}
                  </button>
                )}
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border border-dashed p-4 transition-colors ${
                isDragging
                  ? isLightTheme
                    ? 'bg-emerald-50 border-emerald-500'
                    : 'bg-emerald-950/40 border-emerald-500'
                  : isLightTheme
                  ? 'bg-white border-slate-300'
                  : 'bg-[#070b12] border-slate-700'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_EXTENSIONS}
                onChange={handleFileInputChange}
                className="hidden"
                aria-label={t('upload_upgrade_file_label')}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                      isLightTheme
                        ? 'bg-slate-100 border-slate-300 text-slate-700'
                        : 'bg-slate-900 border-slate-700 text-emerald-400'
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className={`text-xs font-semibold break-all ${labelClass}`}>
                      {fileName
                        ? fileName
                        : language === 'id'
                        ? 'Seret file ke area ini atau pilih file dari perangkat'
                        : 'Drag a file here or pick a file from your device'}
                    </p>
                    <p className={`text-[11px] font-sans ${mutedTextClass}`}>
                      {t('upload_upgrade_file_hint')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 shrink-0 transition-all active:scale-[0.98] ${focusRingClass} ${
                    isLightTheme
                      ? 'bg-slate-100 hover:bg-emerald-50 text-slate-800 border-slate-300 hover:border-emerald-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/60'
                  }`}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span>{language === 'id' ? 'Pilih File' : 'Choose File'}</span>
                </button>
              </div>
            </div>

            {fileReadError && (
              <div
                role="alert"
                className={`p-3 rounded-xl border text-xs ${
                  isLightTheme
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                }`}
              >
                {fileReadError}
              </div>
            )}

            {/* Raw Content Textarea */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="upload-upgrade-raw-textarea"
                  className={`text-xs font-semibold ${labelClass}`}
                >
                  {t('upload_upgrade_paste_label')}
                </label>
                <span className={`text-[11px] font-mono ${mutedTextClass}`}>
                  {rawContent.length} {t('chars_count')}
                </span>
              </div>

              <textarea
                id="upload-upgrade-raw-textarea"
                rows={7}
                value={rawContent}
                onChange={(e) => {
                  setRawContent(e.target.value);
                  if (emptyValidationError && e.target.value.trim()) {
                    setEmptyValidationError(false);
                  }
                }}
                placeholder={t('upload_upgrade_paste_placeholder')}
                disabled={isAnalyzing}
                className={`w-full px-3.5 py-3 border rounded-xl text-xs leading-relaxed resize-y font-mono transition-colors ${focusRingClass} ${inputClass}`}
              />
            </div>

            {/* Target Kind Radio Group & Optional Upgrade Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <span className={`text-xs font-semibold block ${labelClass}`}>
                  {t('upload_upgrade_target_label')}
                </span>
                <div
                  role="radiogroup"
                  aria-label={t('upload_upgrade_target_label')}
                  className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
                    isLightTheme
                      ? 'bg-white border-slate-200'
                      : 'bg-[#070b12] border-slate-800'
                  }`}
                >
                  {targetOptions.map((option) => {
                    const active = targetKind === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTargetKind(option.value)}
                        disabled={isAnalyzing}
                        className={`min-h-[44px] px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${focusRingClass} ${
                          active
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : isLightTheme
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="upload-upgrade-goal-input"
                  className={`text-xs font-semibold block ${labelClass}`}
                >
                  {t('upload_upgrade_goal_label')}
                </label>
                <input
                  id="upload-upgrade-goal-input"
                  type="text"
                  value={upgradeGoal}
                  onChange={(e) => setUpgradeGoal(e.target.value)}
                  placeholder={t('upload_upgrade_goal_placeholder')}
                  disabled={isAnalyzing}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 border rounded-xl text-xs font-sans transition-colors ${focusRingClass} ${inputClass}`}
                />
              </div>
            </div>

            {/* Explicit Empty / Inline Validation State */}
            {emptyValidationError ? (
              <div
                role="alert"
                className={`p-3 rounded-xl border text-xs font-medium ${
                  isLightTheme
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-amber-950/40 border-amber-700/70 text-amber-200'
                }`}
              >
                {language === 'id'
                  ? 'Konten prompt atau skill belum diisi. Unggah file atau tempel teks terlebih dahulu.'
                  : 'Prompt or skill content is empty. Upload a file or paste text first.'}
              </div>
            ) : (
              !rawContent.trim() && (
                <p className={`text-[11px] font-sans ${mutedTextClass}`}>
                  {language === 'id'
                    ? 'Mendukung format Markdown (.md, SKILL.md), teks polos (.txt), JSON, dan YAML.'
                    : 'Supports Markdown (.md, SKILL.md), plain text (.txt), JSON, and YAML files.'}
                </p>
              )
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleSubmitAnalyze}
                disabled={isAnalyzing}
                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${focusRingClass} ${
                  isAnalyzing
                    ? isLightTheme
                      ? 'bg-emerald-200 text-emerald-950 cursor-wait'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-700 cursor-wait'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                }`}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span>
                  {isAnalyzing
                    ? t('upload_upgrade_analyzing')
                    : t('upload_upgrade_analyze_btn')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLoadOriginal}
                disabled={isAnalyzing}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${focusRingClass} ${
                  isLightTheme
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    : 'bg-[#070b12] hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>{t('upload_upgrade_load_original_btn')}</span>
              </button>
            </div>
          </div>

          {/* 2. Loading State */}
          {isAnalyzing && (
            <div
              role="status"
              aria-live="polite"
              className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs font-medium ${
                isLightTheme
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-emerald-950/40 border-emerald-800/70 text-emerald-300'
              }`}
            >
              <svg
                className="w-4 h-4 animate-spin shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>{t('upload_upgrade_analyzing')}</span>
            </div>
          )}

          {/* 3. Error Alert State */}
          {error && (
            <div
              role="alert"
              className={`p-4 rounded-2xl border space-y-3 ${
                isLightTheme
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <svg
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isLightTheme ? 'text-rose-700' : 'text-rose-300'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.65 18h16.7a1 1 0 00.86-1.5l-7.5-13a1 1 0 00-1.72 0z"
                  />
                </svg>
                <p className="text-xs leading-relaxed break-words flex-1">{error}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenAiSettings}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${focusRingClass} ${
                    isLightTheme
                      ? 'bg-white hover:bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-[#090d16] hover:bg-rose-900/40 text-rose-200 border-rose-700/70'
                  }`}
                >
                  <span>{language === 'id' ? 'Atur AI' : 'Setup AI'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClearError}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${focusRingClass} ${
                    isLightTheme
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      : 'bg-[#090d16] hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {language === 'id' ? 'Tutup' : 'Dismiss'}
                </button>
              </div>
            </div>
          )}

          {/* 4. Analysis & Upgrade Results */}
          {result && (
            <div ref={resultsSectionRef} className="space-y-4">
              {/* Scores + Summary */}
              <div className={`rounded-2xl border p-4 space-y-3.5 ${panelClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className={`text-sm font-bold font-sans ${headingClass}`}>
                    {t('upload_upgrade_scores_title')}
                  </h3>
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold ${
                      result.detectedKind === 'skill'
                        ? isLightTheme
                          ? 'bg-teal-50 border-teal-300 text-teal-800'
                          : 'bg-teal-950/60 border-teal-700/70 text-teal-300'
                        : isLightTheme
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300'
                    }`}
                  >
                    {result.detectedKind === 'skill' ? 'Agent Skill (SKILL.md)' : 'Prompt'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div
                    className={`rounded-xl border p-3 space-y-1 ${scoreBadgeClass(
                      result.scores.clarity
                    )}`}
                  >
                    <span className="text-[11px] font-medium block">
                      {t('upload_upgrade_score_clarity')}
                    </span>
                    <span className="text-lg font-bold font-mono block">
                      {result.scores.clarity}
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </span>
                  </div>

                  <div
                    className={`rounded-xl border p-3 space-y-1 ${scoreBadgeClass(
                      result.scores.specificity
                    )}`}
                  >
                    <span className="text-[11px] font-medium block">
                      {t('upload_upgrade_score_specificity')}
                    </span>
                    <span className="text-lg font-bold font-mono block">
                      {result.scores.specificity}
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </span>
                  </div>

                  <div
                    className={`rounded-xl border p-3 space-y-1 ${scoreBadgeClass(
                      result.scores.structure
                    )}`}
                  >
                    <span className="text-[11px] font-medium block">
                      {t('upload_upgrade_score_structure')}
                    </span>
                    <span className="text-lg font-bold font-mono block">
                      {result.scores.structure}
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </span>
                  </div>

                  <div
                    className={`rounded-xl border p-3 space-y-1 ${scoreBadgeClass(
                      result.scores.overall
                    )}`}
                  >
                    <span className="text-[11px] font-medium block">
                      {t('upload_upgrade_score_overall')}
                    </span>
                    <span className="text-lg font-bold font-mono block">
                      {result.scores.overall}
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </span>
                  </div>
                </div>

                {result.upgradeSummary && (
                  <div className={`rounded-xl border p-3 space-y-1 ${codePanelClass}`}>
                    <span className={`text-[11px] font-semibold block ${mutedTextClass}`}>
                      {t('upload_upgrade_summary')}
                    </span>
                    <p className={`text-xs leading-relaxed ${secondaryTextClass}`}>
                      {result.upgradeSummary}
                    </p>
                  </div>
                )}
              </div>

              {/* Strengths & Weaknesses Diagnosis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`rounded-2xl border p-4 space-y-2.5 ${panelClass}`}>
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 shrink-0 ${
                        isLightTheme ? 'text-emerald-700' : 'text-emerald-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h4 className={`text-xs font-bold ${labelClass}`}>
                      {t('upload_upgrade_strengths')}
                    </h4>
                  </div>

                  {result.strengths.length > 0 ? (
                    <ul className="space-y-1.5 text-xs leading-relaxed">
                      {result.strengths.map((item, idx) => (
                        <li key={idx} className={`flex items-start gap-2 ${secondaryTextClass}`}>
                          <span
                            className={`font-mono shrink-0 ${
                              isLightTheme ? 'text-emerald-700' : 'text-emerald-400'
                            }`}
                          >
                            +
                          </span>
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-xs ${mutedTextClass}`}>
                      {language === 'id'
                        ? 'Tidak ada catatan kekuatan khusus.'
                        : 'No specific strengths noted.'}
                    </p>
                  )}
                </div>

                <div className={`rounded-2xl border p-4 space-y-2.5 ${panelClass}`}>
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 shrink-0 ${
                        isLightTheme ? 'text-amber-700' : 'text-amber-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <h4 className={`text-xs font-bold ${labelClass}`}>
                      {t('upload_upgrade_weaknesses')}
                    </h4>
                  </div>

                  {result.weaknesses.length > 0 ? (
                    <ul className="space-y-1.5 text-xs leading-relaxed">
                      {result.weaknesses.map((item, idx) => (
                        <li key={idx} className={`flex items-start gap-2 ${secondaryTextClass}`}>
                          <span
                            className={`font-mono shrink-0 ${
                              isLightTheme ? 'text-amber-700' : 'text-amber-400'
                            }`}
                          >
                            !
                          </span>
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-xs ${mutedTextClass}`}>
                      {language === 'id'
                        ? 'Tidak ada celah struktural yang ditemukan.'
                        : 'No structural gaps identified.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Preview Tabs: Hasil Upgrade | Teks Asli | Bandingkan */}
              <div className={`rounded-2xl border p-4 space-y-3 ${panelClass}`}>
                <div
                  role="tablist"
                  aria-label={
                    language === 'id' ? 'Mode pratinjau hasil' : 'Result preview modes'
                  }
                  className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
                    isLightTheme
                      ? 'bg-white border-slate-200'
                      : 'bg-[#070b12] border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={previewTab === 'upgraded'}
                    onClick={() => setPreviewTab('upgraded')}
                    className={`min-h-[44px] px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${focusRingClass} ${
                      previewTab === 'upgraded'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : isLightTheme
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    {t('upload_upgrade_tab_upgraded')}
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={previewTab === 'original'}
                    onClick={() => setPreviewTab('original')}
                    className={`min-h-[44px] px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${focusRingClass} ${
                      previewTab === 'original'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : isLightTheme
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    {t('upload_upgrade_tab_original')}
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={previewTab === 'compare'}
                    onClick={() => setPreviewTab('compare')}
                    className={`min-h-[44px] px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${focusRingClass} ${
                      previewTab === 'compare'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : isLightTheme
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    {t('upload_upgrade_tab_compare')}
                  </button>
                </div>

                {previewTab === 'upgraded' && (
                  <div
                    role="tabpanel"
                    className={`rounded-xl border p-3.5 max-h-[320px] overflow-y-auto overflow-x-hidden font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${codePanelClass}`}
                  >
                    {result.upgradedFullText}
                  </div>
                )}

                {previewTab === 'original' && (
                  <div
                    role="tabpanel"
                    className={`rounded-xl border p-3.5 max-h-[320px] overflow-y-auto overflow-x-hidden font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${codePanelClass}`}
                  >
                    {rawContent}
                  </div>
                )}

                {previewTab === 'compare' && (
                  <div role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <span className={`text-[11px] font-semibold block ${mutedTextClass}`}>
                        {t('upload_upgrade_tab_original')}
                      </span>
                      <div
                        className={`rounded-xl border p-3 max-h-[300px] overflow-y-auto overflow-x-hidden font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${codePanelClass}`}
                      >
                        {rawContent}
                      </div>
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <span
                        className={`text-[11px] font-semibold block ${
                          isLightTheme ? 'text-emerald-700' : 'text-emerald-400'
                        }`}
                      >
                        {t('upload_upgrade_tab_upgraded')}
                      </span>
                      <div
                        className={`rounded-xl border p-3 max-h-[300px] overflow-y-auto overflow-x-hidden font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${codePanelClass}`}
                      >
                        {result.upgradedFullText}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {result && (
          <div
            className={`border-t pt-3.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0 ${
              isLightTheme ? 'border-slate-200' : 'border-slate-800/80'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onCopyText(result.upgradedFullText, t('toast_upload_upgraded'))
                }
                className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] ${focusRingClass} ${
                  isLightTheme
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    : 'bg-[#090d16] hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>{t('upload_upgrade_copy_btn')}</span>
              </button>

              {result.detectedKind === 'skill' && (
                <button
                  type="button"
                  onClick={handleDownloadSkill}
                  className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] ${focusRingClass} ${
                    isLightTheme
                      ? 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300'
                      : 'bg-teal-950/50 hover:bg-teal-900/60 text-teal-300 border-teal-700/70'
                  }`}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>{t('upload_upgrade_download_skill_btn')}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onApplyUpgradedToCanvas(result)}
              className={`min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${focusRingClass}`}
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('upload_upgrade_apply_canvas_btn')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadUpgradeModal;
