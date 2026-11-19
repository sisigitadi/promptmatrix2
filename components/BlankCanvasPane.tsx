import React, { useMemo, useState } from 'react';
import {
  BlankCanvasState,
  BlankCanvasTargetMode,
  CanvasBlock,
  CanvasBlockType,
} from '../types';
import {
  CANVAS_BLOCK_PRESETS,
  CanvasBlockPreset,
  createCanvasBlock,
  hasBlankCanvasContent,
} from '../services/blankCanvasService';
import { toKebabCaseSkillName } from '../services/agentSkillService';
import { useLanguage } from '../contexts/LanguageContext';

export interface BlankCanvasPaneProps {
  state: BlankCanvasState;
  onChange: (updater: (prev: BlankCanvasState) => BlankCanvasState) => void;
  onClearCanvas: () => void;
  onBackToGallery: () => void;
  showAIFeatures: boolean;
  onAiDraftFromIdea: (idea: string) => Promise<void>;
  isAiDrafting: boolean;
  aiDraftError: string | null;
  onClearAiDraftError: () => void;
  onOpenAiSettings: () => void;
  onAiSuggestBlock: (blockId: string, blockLabel: string) => Promise<void>;
  onAiSuggestFewShot: (
    field: '__few_shot_input' | '__few_shot_output',
    label: string
  ) => Promise<void>;
  loadingBlockId: string | null;
  onApplyEnhancedToScratchpad?: () => void;
  hasUnappliedEnhancedPrompt?: boolean;
  onOpenUploadUpgrade?: () => void;
  isLightTheme?: boolean;
}

const MAX_SKILL_NAME_LENGTH = 64;
const MAX_SKILL_DESCRIPTION_LENGTH = 1024;

const getPresetByType = (type: CanvasBlockType): CanvasBlockPreset => {
  const found = CANVAS_BLOCK_PRESETS.find((preset) => preset.type === type);
  return found ?? CANVAS_BLOCK_PRESETS[CANVAS_BLOCK_PRESETS.length - 1];
};

const BlankCanvasPane: React.FC<BlankCanvasPaneProps> = ({
  state,
  onChange,
  onClearCanvas,
  onBackToGallery,
  showAIFeatures,
  onAiDraftFromIdea,
  isAiDrafting,
  aiDraftError,
  onClearAiDraftError,
  onOpenAiSettings,
  onAiSuggestBlock,
  onAiSuggestFewShot,
  loadingBlockId,
  onApplyEnhancedToScratchpad,
  hasUnappliedEnhancedPrompt = false,
  onOpenUploadUpgrade,
  isLightTheme = false,
}) => {
  const { t, language } = useLanguage();
  const [ideaInput, setIdeaInput] = useState<string>('');
  const [emptyIdeaNotice, setEmptyIdeaNotice] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showFewShot, setShowFewShot] = useState<boolean>(
    Boolean(state.fewShotInput.trim() || state.fewShotOutput.trim())
  );
  const [showMarketProfile, setShowMarketProfile] = useState<boolean>(
    Boolean(
      (state.skillTagline || '').trim() ||
      typeof state.skillPriceUsd === 'number' ||
      (state.skillTags || '').trim() ||
      (state.skillDemoRequest || '').trim() ||
      (state.skillDemoResult || '').trim()
    )
  );

  const demoResultChars = (state.skillDemoResult || '').trim().length;
  const demoResultHasSummary = /^##\s+Summary\b/im.test(state.skillDemoResult || '');
  const demoResultReady = demoResultChars >= 700 && demoResultHasSummary;

  const hasContent = useMemo(() => hasBlankCanvasContent(state), [state]);

  const resolvedSkillSlug = useMemo(() => {
    const rawSource = state.skillName.trim() || state.title.trim() || 'custom-agent-skill';
    return toKebabCaseSkillName(rawSource);
  }, [state.skillName, state.title]);

  const rawSkillNameOverLimit = useMemo(() => {
    const raw = state.skillName.trim();
    return raw.length > MAX_SKILL_NAME_LENGTH;
  }, [state.skillName]);

  const skillDescLength = state.skillDescription.length;
  const skillDescOverLimit = skillDescLength > MAX_SKILL_DESCRIPTION_LENGTH;

  // Theme tokens verified for WCAG AA >= 4.5:1 contrast
  const surfaceClass = isLightTheme
    ? 'bg-white border-slate-200 text-slate-900 shadow-lg'
    : 'bg-[#0f172a] border-slate-800/90 text-slate-100 shadow-2xl';
  const panelClass = isLightTheme
    ? 'bg-slate-50 border-slate-200'
    : 'bg-[#090d16] border-slate-800/90';
  const inputClass = isLightTheme
    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-emerald-600'
    : 'bg-[#070b12] border-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500';
  const headingTextClass = isLightTheme ? 'text-slate-900' : 'text-slate-100';
  const labelTextClass = isLightTheme ? 'text-slate-800' : 'text-slate-200';
  const secondaryTextClass = isLightTheme ? 'text-slate-600' : 'text-slate-300';
  const mutedTextClass = isLightTheme ? 'text-slate-600' : 'text-slate-400';
  const focusRingClass =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

  const handleModeChange = (mode: BlankCanvasTargetMode) => {
    onChange((prev) => ({
      ...prev,
      targetMode: mode,
      updatedAt: Date.now(),
    }));
  };

  const handleAddBlock = (type: CanvasBlockType) => {
    const nextBlock = createCanvasBlock(type, language);
    onChange((prev) => ({
      ...prev,
      blocks: [...prev.blocks, nextBlock],
      updatedAt: Date.now(),
    }));
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= state.blocks.length) return;
    onChange((prev) => {
      const updated = [...prev.blocks];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      return {
        ...prev,
        blocks: updated,
        updatedAt: Date.now(),
      };
    });
  };

  const handleRemoveBlock = (blockId: string) => {
    onChange((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== blockId),
      updatedAt: Date.now(),
    }));
  };

  const handleUpdateBlock = (blockId: string, patch: Partial<CanvasBlock>) => {
    onChange((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === blockId ? { ...block, ...patch } : block
      ),
      updatedAt: Date.now(),
    }));
  };

  const handleDraftSubmit = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed) {
      setEmptyIdeaNotice(true);
      await onAiDraftFromIdea('');
      return;
    }
    setEmptyIdeaNotice(false);
    await onAiDraftFromIdea(trimmed);
  };

  const handleConfirmClear = () => {
    setShowClearConfirm(false);
    setIdeaInput('');
    setEmptyIdeaNotice(false);
    onClearCanvas();
  };

  const renderSuggestIcon = () => (
    <svg
      className="w-3.5 h-3.5 shrink-0"
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
  );

  return (
    <section
      aria-label={t('blank_canvas_title')}
      className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 space-y-5 sm:space-y-6 transition-colors duration-200 ${surfaceClass}`}
    >
      {/* 1. Header Breadcrumb & Clear Action */}
      <div
        className={`border-b pb-4 sm:pb-5 space-y-3 ${isLightTheme ? 'border-slate-200' : 'border-slate-800/80'
          }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onBackToGallery}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-[0.98] ${focusRingClass} ${isLightTheme
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-[#090d16] hover:bg-slate-800 text-slate-200 border-slate-800'
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>{t('blank_canvas_breadcrumb_gallery')}</span>
            </button>

            <span className={mutedTextClass} aria-hidden="true">
              /
            </span>

            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${isLightTheme
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </span>
              <span className={`text-xs font-semibold truncate ${labelTextClass}`}>
                {t('blank_canvas_title')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Local Auto-Saved Status */}
            <div
              className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${hasContent
                ? isLightTheme
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/50 border-emerald-800/70 text-emerald-300'
                : isLightTheme
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-[#090d16] border-slate-800 text-slate-300'
                }`}
            >
              <svg
                className={`w-3.5 h-3.5 shrink-0 ${hasContent
                  ? isLightTheme
                    ? 'text-emerald-700'
                    : 'text-emerald-400'
                  : mutedTextClass
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('blank_canvas_autosaved')}</span>
            </div>

            {/* Clear Canvas Button */}
            {!showClearConfirm && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                disabled={!hasContent}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-[0.98] ${focusRingClass} ${hasContent
                  ? isLightTheme
                    ? 'bg-white hover:bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300'
                    : 'bg-[#090d16] hover:bg-rose-950/40 text-rose-300 border-slate-800 hover:border-rose-700/60'
                  : isLightTheme
                    ? 'bg-slate-100 text-slate-600 border-slate-200 cursor-not-allowed'
                    : 'bg-[#090d16] text-slate-400 border-slate-800/60 cursor-not-allowed'
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>{t('blank_canvas_clear_btn')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Clear Confirmation */}
        {showClearConfirm && (
          <div
            role="alertdialog"
            aria-label={t('blank_canvas_clear_confirm')}
            className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isLightTheme
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-rose-950/35 border-rose-800/70 text-rose-100'
              }`}
          >
            <span className="text-xs font-medium">{t('blank_canvas_clear_confirm')}</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmClear}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] ${focusRingClass} ${isLightTheme
                  ? 'bg-rose-700 hover:bg-rose-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
              >
                {t('blank_canvas_confirm_yes')}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-medium transition-all active:scale-[0.98] ${focusRingClass} ${isLightTheme
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-[#090d16] hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
              >
                {t('cancel_btn')}
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className={`text-xl font-bold tracking-tight font-sans ${headingTextClass}`}>
            {t('blank_canvas_title')}
          </h2>
          <p className={`text-xs mt-1.5 leading-relaxed font-sans max-w-2xl ${mutedTextClass}`}>
            {t('blank_canvas_subtitle')}
          </p>
        </div>
      </div>

      {/* 2. AI Features Zone (Strictly hidden when showAIFeatures === false) */}
      {showAIFeatures && (
        <div className="space-y-4">
          {/* Target Mode Switch: Prompt vs Agent Skill (SKILL.md) */}
          <div className={`rounded-2xl border p-4 space-y-3 ${panelClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className={`text-xs font-semibold font-sans ${labelTextClass}`}>
                {t('blank_canvas_mode_label')}
              </span>

              <div
                role="radiogroup"
                aria-label={t('blank_canvas_mode_label')}
                className={`grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 rounded-xl border ${isLightTheme
                  ? 'bg-white border-slate-200'
                  : 'bg-[#070b12] border-slate-800'
                  }`}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={state.targetMode === 'prompt'}
                  onClick={() => handleModeChange('prompt')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${focusRingClass} ${state.targetMode === 'prompt'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isLightTheme
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-800/80'
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
                      d="M4 6h16M4 12h16M4 18h10"
                    />
                  </svg>
                  <span>{t('blank_canvas_mode_prompt')}</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={state.targetMode === 'skill'}
                  onClick={() => handleModeChange('skill')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${focusRingClass} ${state.targetMode === 'skill'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isLightTheme
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-800/80'
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
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <span>{t('blank_canvas_mode_skill')}</span>
                </button>
              </div>
            </div>

            {/* Clean YAML Metadata Sub-Panel when targetMode === 'skill' */}
            {state.targetMode === 'skill' && (
              <div
                className={`pt-3 mt-1 border-t space-y-3 ${isLightTheme ? 'border-slate-200' : 'border-slate-800/80'
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-xs font-bold uppercase tracking-wider font-sans ${secondaryTextClass}`}>
                    {t('blank_canvas_skill_meta_title')}
                  </h3>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border ${isLightTheme
                      ? 'bg-white border-slate-200 text-slate-700'
                      : 'bg-[#070b12] border-slate-800 text-teal-400'
                      }`}
                  >
                    SKILL.md YAML
                  </span>
                </div>

                {/* skillName with live kebab-case preview + /64 count */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="canvas-skill-name"
                      className={`text-xs font-semibold ${labelTextClass}`}
                    >
                      {t('blank_canvas_skill_name')}
                    </label>
                    <span
                      className={`text-[11px] font-mono ${rawSkillNameOverLimit
                        ? isLightTheme
                          ? 'text-amber-700 font-semibold'
                          : 'text-amber-400 font-semibold'
                        : mutedTextClass
                        }`}
                    >
                      {resolvedSkillSlug.length}/{MAX_SKILL_NAME_LENGTH}
                    </span>
                  </div>
                  <input
                    id="canvas-skill-name"
                    type="text"
                    value={state.skillName}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        skillName: e.target.value,
                        updatedAt: Date.now(),
                      }))
                    }
                    placeholder={t('blank_canvas_skill_name_placeholder')}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 border rounded-xl text-xs font-mono transition-colors ${focusRingClass} ${inputClass}`}
                  />
                  <p className={`text-[11px] font-mono break-all ${mutedTextClass}`}>
                    name: <span className={isLightTheme ? 'text-emerald-700 font-semibold' : 'text-teal-400 font-semibold'}>{resolvedSkillSlug}</span>
                  </p>
                </div>

                {/* skillDescription trigger cue + /1024 count */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="canvas-skill-desc"
                      className={`text-xs font-semibold ${labelTextClass}`}
                    >
                      {t('blank_canvas_skill_desc')}
                    </label>
                    <span
                      className={`text-[11px] font-mono ${skillDescOverLimit
                        ? isLightTheme
                          ? 'text-rose-700 font-semibold'
                          : 'text-rose-400 font-semibold'
                        : mutedTextClass
                        }`}
                    >
                      {skillDescLength}/{MAX_SKILL_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="canvas-skill-desc"
                    rows={2}
                    value={state.skillDescription}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        skillDescription: e.target.value,
                        updatedAt: Date.now(),
                      }))
                    }
                    placeholder={t('blank_canvas_skill_desc_placeholder')}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs leading-relaxed resize-y transition-colors ${focusRingClass} ${inputClass}`}
                  />
                </div>

                {/* skillCompatibility */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="canvas-skill-compat"
                    className={`text-xs font-semibold block ${labelTextClass}`}
                  >
                    {t('blank_canvas_skill_compat')}
                  </label>
                  <input
                    id="canvas-skill-compat"
                    type="text"
                    value={state.skillCompatibility}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        skillCompatibility: e.target.value,
                        updatedAt: Date.now(),
                      }))
                    }
                    className={`w-full min-h-[44px] px-3.5 py-2.5 border rounded-xl text-xs font-mono transition-colors ${focusRingClass} ${inputClass}`}
                  />
                </div>

                {/* Collapsible Market Listing Profile & Step 3 Demo */}
                <div
                  className={`rounded-xl border overflow-hidden transition-colors ${isLightTheme
                    ? 'bg-white border-slate-200'
                    : 'bg-[#070b12] border-slate-800/90'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => setShowMarketProfile((prev) => !prev)}
                    aria-expanded={showMarketProfile}
                    aria-controls="canvas-skill-market-panel"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-left transition-colors ${focusRingClass} ${isLightTheme ? 'hover:bg-slate-50' : 'hover:bg-slate-900/60'
                      }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className={`text-xs font-bold ${labelTextClass}`}>
                        {language === 'id'
                          ? 'Profil Market & Demo Step 3'
                          : 'Market Profile & Step 3 Demo'}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border ${demoResultReady
                          ? isLightTheme
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                            : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                          : isLightTheme
                            ? 'bg-slate-100 border-slate-300 text-slate-700'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                          }`}
                      >
                        {demoResultChars >= 700
                          ? `${demoResultChars} chars (>= 700)`
                          : `${demoResultChars}/700 chars`}
                      </span>
                    </div>

                    <svg
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${mutedTextClass} ${showMarketProfile ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMarketProfile && (
                    <div
                      id="canvas-skill-market-panel"
                      className={`p-3.5 pt-3 border-t space-y-3 ${isLightTheme ? 'border-slate-200' : 'border-slate-800/80'
                        }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1 sm:col-span-2">
                          <label
                            htmlFor="canvas-skill-tagline"
                            className={`text-xs font-semibold block ${labelTextClass}`}
                          >
                            {language === 'id'
                              ? 'Tagline Market (1 kalimat)'
                              : 'Marketplace Tagline (1 sentence)'}
                          </label>
                          <input
                            id="canvas-skill-tagline"
                            type="text"
                            value={state.skillTagline ?? ''}
                            onChange={(e) =>
                              onChange((prev) => ({
                                ...prev,
                                skillTagline: e.target.value,
                                updatedAt: Date.now(),
                              }))
                            }
                            placeholder={
                              language === 'id'
                                ? 'Contoh: Ubah input produk mentah menjadi kontrak JSON RFC 8259 yang teruji.'
                                : 'e.g. Compile rough specs into validated RFC 8259 JSON contracts.'
                            }
                            className={`w-full min-h-[44px] px-3 py-2 border rounded-xl text-xs transition-colors ${focusRingClass} ${inputClass}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="canvas-skill-price"
                            className={`text-xs font-semibold block ${labelTextClass}`}
                          >
                            {language === 'id' ? 'Harga (USD)' : 'Price (USD)'}
                          </label>
                          <input
                            id="canvas-skill-price"
                            type="number"
                            min={0}
                            step="0.01"
                            value={
                              typeof state.skillPriceUsd === 'number' &&
                                Number.isFinite(state.skillPriceUsd)
                                ? String(state.skillPriceUsd)
                                : ''
                            }
                            onChange={(e) => {
                              const raw = e.target.value;
                              if (raw.trim() === '') {
                                onChange((prev) => ({
                                  ...prev,
                                  skillPriceUsd: undefined,
                                  updatedAt: Date.now(),
                                }));
                                return;
                              }
                              const parsed = Number.parseFloat(raw);
                              if (Number.isFinite(parsed) && parsed >= 0) {
                                onChange((prev) => ({
                                  ...prev,
                                  skillPriceUsd: parsed,
                                  updatedAt: Date.now(),
                                }));
                              }
                            }}
                            placeholder="12.00"
                            className={`w-full min-h-[44px] px-3 py-2 border rounded-xl text-xs font-mono transition-colors ${focusRingClass} ${inputClass}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="canvas-skill-tags"
                          className={`text-xs font-semibold block ${labelTextClass}`}
                        >
                          {language === 'id'
                            ? 'Tags (3-7 tag kebab-case, pisahkan koma, tanpa #)'
                            : 'Tags (3-7 kebab-case tags, comma-separated, without #)'}
                        </label>
                        <input
                          id="canvas-skill-tags"
                          type="text"
                          value={state.skillTags ?? ''}
                          onChange={(e) =>
                            onChange((prev) => ({
                              ...prev,
                              skillTags: e.target.value,
                              updatedAt: Date.now(),
                            }))
                          }
                          placeholder="prompt-engineering, json-schema, automation"
                          className={`w-full min-h-[44px] px-3 py-2 border rounded-xl text-xs font-mono transition-colors ${focusRingClass} ${inputClass}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor="canvas-skill-demo-request"
                            className={`text-xs font-semibold ${labelTextClass}`}
                          >
                            {language === 'id'
                              ? 'Demo Step 3: The Request (Prompt Pembeli)'
                              : 'Step 3 Demo: The Request (Buyer Prompt)'}
                          </label>
                          <span className={`text-[11px] font-mono ${mutedTextClass}`}>
                            {(state.skillDemoRequest ?? '').trim().length} chars
                          </span>
                        </div>
                        <textarea
                          id="canvas-skill-demo-request"
                          rows={3}
                          value={state.skillDemoRequest ?? ''}
                          onChange={(e) =>
                            onChange((prev) => ({
                              ...prev,
                              skillDemoRequest: e.target.value,
                              updatedAt: Date.now(),
                            }))
                          }
                          placeholder={
                            language === 'id'
                              ? 'Tulis contoh permintaan nyata pembeli untuk menguji skill ini (>= 25 karakter)...'
                              : 'Write a concrete buyer request to test this skill (>= 25 chars)...'
                          }
                          className={`w-full px-3 py-2 border rounded-xl text-xs leading-relaxed resize-y transition-colors ${focusRingClass} ${inputClass}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor="canvas-skill-demo-result"
                            className={`text-xs font-semibold ${labelTextClass}`}
                          >
                            {language === 'id'
                              ? 'Demo Step 3: The Result (Hasil Agen >= 700 karakter)'
                              : 'Step 3 Demo: The Result (Agent Output >= 700 chars)'}
                          </label>
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border font-semibold ${demoResultReady
                              ? isLightTheme
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                                : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                              : isLightTheme
                                ? 'bg-amber-100 border-amber-300 text-amber-900'
                                : 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                              }`}
                          >
                            {demoResultChars} / 700+ chars
                            {!demoResultHasSummary
                              ? language === 'id'
                                ? ' (butuh ## Summary)'
                                : ' (needs ## Summary)'
                              : ''}
                          </span>
                        </div>
                        <textarea
                          id="canvas-skill-demo-result"
                          rows={6}
                          value={state.skillDemoResult ?? ''}
                          onChange={(e) =>
                            onChange((prev) => ({
                              ...prev,
                              skillDemoResult: e.target.value,
                              updatedAt: Date.now(),
                            }))
                          }
                          placeholder={
                            language === 'id'
                              ? 'Tempel hasil keluaran agen nyata lengkap dengan heading ## Summary, tabel/kode, dan langkah lanjut (>= 700 karakter)...'
                              : 'Paste verified real-agent output starting with ## Summary, concrete table/code, and next steps (>= 700 chars)...'
                          }
                          className={`w-full px-3 py-2.5 border rounded-xl text-xs font-mono leading-relaxed resize-y transition-colors ${focusRingClass} ${inputClass}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Co-Pilot "Buat dari Ide" Panel */}
          <div className={`rounded-2xl border p-4 space-y-3 ${panelClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 shrink-0 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h3 className={`text-xs font-bold font-sans ${labelTextClass}`}>
                  {t('blank_canvas_copilot_title')}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onOpenUploadUpgrade && (
                  <button
                    type="button"
                    onClick={onOpenUploadUpgrade}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98] ${focusRingClass} ${isLightTheme
                      ? 'bg-white hover:bg-emerald-50 text-emerald-800 border-slate-300 hover:border-emerald-400'
                      : 'bg-[#070b12] hover:bg-slate-800 text-emerald-300 border-slate-800 hover:border-emerald-600/60'
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
                    <span>
                      {language === 'id'
                        ? 'Upload & Upgrade Prompt / Skill'
                        : 'Upload & Upgrade Prompt / Skill'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onOpenAiSettings}
                  className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${focusRingClass} ${isLightTheme
                    ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    : 'bg-[#070b12] hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  <span>{t('blank_canvas_copilot_setup_btn')}</span>
                </button>
              </div>
            </div>

            <textarea
              id="canvas-copilot-idea"
              aria-label={t('blank_canvas_copilot_title')}
              rows={2}
              value={ideaInput}
              onChange={(e) => {
                setIdeaInput(e.target.value);
                if (emptyIdeaNotice && e.target.value.trim()) {
                  setEmptyIdeaNotice(false);
                }
              }}
              placeholder={t('blank_canvas_copilot_placeholder')}
              disabled={isAiDrafting}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs leading-relaxed resize-y transition-colors ${focusRingClass} ${inputClass}`}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleDraftSubmit}
                disabled={isAiDrafting}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${focusRingClass} ${isAiDrafting
                  ? isLightTheme
                    ? 'bg-emerald-200 text-emerald-950 cursor-wait'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700 cursor-wait'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                  }`}
              >
                {renderSuggestIcon()}
                <span>
                  {isAiDrafting
                    ? t('blank_canvas_copilot_loading')
                    : t('blank_canvas_copilot_cta')}
                </span>
              </button>

              {/* Explicit Empty / Idle Helper State */}
              {!isAiDrafting && !aiDraftError && (
                <p className={`text-[11px] font-sans ${emptyIdeaNotice ? (isLightTheme ? 'text-amber-800 font-medium' : 'text-amber-300 font-medium') : mutedTextClass}`}>
                  {emptyIdeaNotice
                    ? t('toast_canvas_need_idea')
                    : language === 'id'
                      ? 'Draft AI akan mengisi judul, blok relevan, dan scratchpad secara otomatis.'
                      : 'AI draft will populate the title, relevant blocks, and scratchpad automatically.'}
                </p>
              )}
            </div>

            {/* Explicit Loading State */}
            {isAiDrafting && (
              <div
                role="status"
                aria-live="polite"
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${isLightTheme
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
                <span>{t('blank_canvas_copilot_loading')}</span>
              </div>
            )}

            {/* Explicit Error Alert Box */}
            {aiDraftError && (
              <div
                role="alert"
                className={`p-3.5 rounded-xl border space-y-2.5 ${isLightTheme
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <svg
                      className={`w-4 h-4 shrink-0 mt-0.5 ${isLightTheme ? 'text-rose-700' : 'text-rose-300'
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
                    <p className="text-xs leading-relaxed break-words">{aiDraftError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClearAiDraftError}
                    aria-label={t('close_btn')}
                    title={t('close_btn')}
                    className={`min-h-[44px] min-w-[44px] -my-2 -mr-2 rounded-xl flex items-center justify-center transition-colors shrink-0 ${focusRingClass} ${isLightTheme
                      ? 'text-rose-700 hover:bg-rose-100'
                      : 'text-rose-300 hover:bg-rose-900/50'
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenAiSettings}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${focusRingClass} ${isLightTheme
                      ? 'bg-white hover:bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-[#090d16] hover:bg-rose-900/40 text-rose-200 border-rose-700/70'
                      }`}
                  >
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    <span>{t('blank_canvas_copilot_setup_btn')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Title & Short Description */}
      <div className={`rounded-2xl border p-4 space-y-3.5 ${panelClass}`}>
        <div className="space-y-1.5">
          <label
            htmlFor="canvas-title-input"
            className={`text-xs font-semibold block ${labelTextClass}`}
          >
            {t('blank_canvas_title_label')}
          </label>
          <input
            id="canvas-title-input"
            type="text"
            value={state.title}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                title: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            placeholder={t('blank_canvas_title_placeholder')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 border rounded-xl text-xs font-sans transition-colors ${focusRingClass} ${inputClass}`}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="canvas-desc-input"
            className={`text-xs font-semibold block ${labelTextClass}`}
          >
            {t('blank_canvas_desc_label')}
          </label>
          <input
            id="canvas-desc-input"
            type="text"
            value={state.description}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                description: e.target.value,
                updatedAt: Date.now(),
              }))
            }
            placeholder={t('blank_canvas_desc_placeholder')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 border rounded-xl text-xs font-sans transition-colors ${focusRingClass} ${inputClass}`}
          />
        </div>
      </div>

      {/* 4. Optional Modular Blocks */}
      <div className="space-y-3.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 shrink-0 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'
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
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
            <h3 className={`text-sm font-bold font-sans ${headingTextClass}`}>
              {t('blank_canvas_blocks_title')}
            </h3>
          </div>
          <p className={`text-xs font-sans leading-relaxed ${mutedTextClass}`}>
            {t('blank_canvas_blocks_hint')}
          </p>
        </div>

        {/* Quick-Add Block Chips */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('blank_canvas_add_block')}>
          {CANVAS_BLOCK_PRESETS.map((preset) => {
            const chipLabel = language === 'id' ? preset.labelId : preset.labelEn;
            return (
              <button
                key={preset.type}
                type="button"
                onClick={() => handleAddBlock(preset.type)}
                className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-[0.98] ${focusRingClass} ${isLightTheme
                  ? 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border-slate-300 hover:border-emerald-400'
                  : 'bg-[#090d16] hover:bg-emerald-950/40 text-slate-200 hover:text-emerald-300 border-slate-800 hover:border-emerald-600/60'
                  }`}
              >
                <svg
                  className={`w-3.5 h-3.5 shrink-0 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>{chipLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Ordered Blocks List or Empty State */}
        {state.blocks.length === 0 ? (
          <div
            className={`rounded-2xl border border-dashed p-4 text-center text-xs leading-relaxed ${isLightTheme
              ? 'bg-slate-50/70 border-slate-300 text-slate-600'
              : 'bg-[#090d16]/60 border-slate-800 text-slate-400'
              }`}
          >
            {language === 'id'
              ? 'Belum ada blok modular ditambahkan. Pilih salah satu tombol blok di atas jika ingin struktur terpandu, atau langsung tulis di Scratchpad di bawah.'
              : 'No modular blocks added yet. Choose any block button above for guided sections, or write directly in the Scratchpad below.'}
          </div>
        ) : (
          <div className="space-y-3">
            {state.blocks.map((block, index) => {
              const preset = getPresetByType(block.type);
              const placeholder =
                language === 'id' ? preset.placeholderId : preset.placeholderEn;
              const hint = language === 'id' ? preset.hintId : preset.hintEn;
              const isSuggesting = loadingBlockId === block.id;

              return (
                <div
                  key={block.id}
                  className={`rounded-2xl border p-4 space-y-2.5 transition-colors ${panelClass}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span
                        className={`text-[11px] font-mono px-2 py-1 rounded-lg border shrink-0 ${isLightTheme
                          ? 'bg-white border-slate-200 text-slate-700'
                          : 'bg-[#070b12] border-slate-800 text-slate-300'
                          }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {block.isCustomLabel ? (
                        <input
                          type="text"
                          aria-label={t('blank_canvas_custom_label_placeholder')}
                          value={block.label}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { label: e.target.value })
                          }
                          placeholder={t('blank_canvas_custom_label_placeholder')}
                          className={`flex-1 min-w-[140px] min-h-[44px] px-3 py-2 border rounded-xl text-xs font-semibold transition-colors ${focusRingClass} ${inputClass}`}
                        />
                      ) : (
                        <label
                          htmlFor={`canvas-block-${block.id}`}
                          className={`text-xs font-semibold truncate ${labelTextClass}`}
                        >
                          {block.label}
                        </label>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      {showAIFeatures && (
                        <button
                          type="button"
                          onClick={() => onAiSuggestBlock(block.id, block.label)}
                          disabled={isSuggesting}
                          className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${focusRingClass} ${isSuggesting
                            ? isLightTheme
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 cursor-wait'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700 cursor-wait'
                            : isLightTheme
                              ? 'bg-white hover:bg-emerald-50 text-emerald-800 border-slate-300 hover:border-emerald-400'
                              : 'bg-[#070b12] hover:bg-slate-800 text-emerald-300 border-slate-800 hover:border-emerald-600/60'
                            }`}
                        >
                          {renderSuggestIcon()}
                          <span>
                            {isSuggesting ? t('ai_suggesting') : t('ai_suggest_btn')}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleMoveBlock(index, -1)}
                        disabled={index === 0}
                        aria-label={t('blank_canvas_move_up')}
                        title={t('blank_canvas_move_up')}
                        className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-colors ${focusRingClass} ${index === 0
                          ? isLightTheme
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-[#070b12] text-slate-600 border-slate-800/50 cursor-not-allowed'
                          : isLightTheme
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-[#070b12] hover:bg-slate-800 text-slate-200 border-slate-800'
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveBlock(index, 1)}
                        disabled={index === state.blocks.length - 1}
                        aria-label={t('blank_canvas_move_down')}
                        title={t('blank_canvas_move_down')}
                        className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-colors ${focusRingClass} ${index === state.blocks.length - 1
                          ? isLightTheme
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-[#070b12] text-slate-600 border-slate-800/50 cursor-not-allowed'
                          : isLightTheme
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-[#070b12] hover:bg-slate-800 text-slate-200 border-slate-800'
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(block.id)}
                        aria-label={t('blank_canvas_remove_block')}
                        title={t('blank_canvas_remove_block')}
                        className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-colors ${focusRingClass} ${isLightTheme
                          ? 'bg-white hover:bg-rose-50 text-rose-700 border-slate-300 hover:border-rose-300'
                          : 'bg-[#070b12] hover:bg-rose-950/50 text-rose-300 border-slate-800 hover:border-rose-700/60'
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <textarea
                    id={`canvas-block-${block.id}`}
                    rows={3}
                    value={block.value}
                    onChange={(e) =>
                      handleUpdateBlock(block.id, { value: e.target.value })
                    }
                    placeholder={placeholder}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs leading-relaxed resize-y transition-colors ${focusRingClass} ${inputClass}`}
                  />

                  <p className={`text-[11px] font-sans leading-relaxed ${mutedTextClass}`}>
                    {hint}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Freeform Scratchpad */}
      <div className={`rounded-2xl border p-4 space-y-3 ${panelClass}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="canvas-scratchpad-textarea"
            className={`text-xs font-bold font-sans ${labelTextClass}`}
          >
            {t('blank_canvas_scratchpad_label')}
          </label>
          <span className={`text-[11px] font-mono ${mutedTextClass}`}>
            {state.scratchpad.length} chars
          </span>
        </div>

        {hasUnappliedEnhancedPrompt && onApplyEnhancedToScratchpad && (
          <div
            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${isLightTheme
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-emerald-950/35 border-emerald-700/60 text-emerald-200'
              }`}
          >
            <span className="text-xs font-medium">
              {language === 'id'
                ? 'Tersedia versi hasil AI Enhance. Tarik ke Scratchpad untuk mengedit lebih lanjut.'
                : 'An AI Enhanced version is available. Pull it into the Scratchpad to keep editing.'}
            </span>
            <button
              type="button"
              onClick={onApplyEnhancedToScratchpad}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-[0.98] ${focusRingClass}`}
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
              <span>{t('blank_canvas_apply_enhanced')}</span>
            </button>
          </div>
        )}

        <textarea
          id="canvas-scratchpad-textarea"
          rows={6}
          value={state.scratchpad}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              scratchpad: e.target.value,
              updatedAt: Date.now(),
            }))
          }
          placeholder={t('blank_canvas_scratchpad_placeholder')}
          className={`w-full px-3.5 py-3 border rounded-xl text-xs leading-relaxed resize-y font-mono transition-colors ${focusRingClass} ${inputClass}`}
        />
      </div>

      {/* 6. Collapsible Few-Shot Reference Examples Accordion */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${panelClass}`}>
        <button
          type="button"
          onClick={() => setShowFewShot((prev) => !prev)}
          aria-expanded={showFewShot}
          aria-controls="canvas-fewshot-panel"
          className={`w-full min-h-[44px] px-4 py-3 flex items-center justify-between gap-2 text-left transition-colors ${focusRingClass} ${isLightTheme ? 'hover:bg-slate-100' : 'hover:bg-slate-900/60'
            }`}
        >
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <svg
              className={`w-4 h-4 shrink-0 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z"
              />
            </svg>
            <span className={`text-xs font-bold ${labelTextClass}`}>
              {t('blank_canvas_fewshot_title')}
            </span>
            {(state.fewShotInput.trim() || state.fewShotOutput.trim()) && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-lg border font-mono ${isLightTheme
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  }`}
              >
                {language === 'id' ? 'Aktif' : 'Active'}
              </span>
            )}
          </div>

          <svg
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${mutedTextClass} ${showFewShot ? 'rotate-180' : ''
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showFewShot && (
          <div
            id="canvas-fewshot-panel"
            className={`p-4 pt-3 border-t space-y-3.5 ${isLightTheme ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-[#080c14]'
              }`}
          >
            {/* Few-Shot Input */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="canvas-fewshot-input"
                  className={`text-xs font-semibold ${labelTextClass}`}
                >
                  {t('blank_canvas_fewshot_input')}
                </label>
                {showAIFeatures && (
                  <button
                    type="button"
                    onClick={() =>
                      onAiSuggestFewShot('__few_shot_input', t('blank_canvas_fewshot_input'))
                    }
                    disabled={loadingBlockId === '__few_shot_input'}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${focusRingClass} ${loadingBlockId === '__few_shot_input'
                      ? isLightTheme
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 cursor-wait'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-700 cursor-wait'
                      : isLightTheme
                        ? 'bg-slate-50 hover:bg-emerald-50 text-emerald-800 border-slate-300 hover:border-emerald-400'
                        : 'bg-[#090d16] hover:bg-slate-800 text-emerald-300 border-slate-800 hover:border-emerald-600/60'
                      }`}
                  >
                    {renderSuggestIcon()}
                    <span>
                      {loadingBlockId === '__few_shot_input'
                        ? t('ai_suggesting')
                        : t('ai_suggest_btn')}
                    </span>
                  </button>
                )}
              </div>
              <textarea
                id="canvas-fewshot-input"
                rows={3}
                value={state.fewShotInput}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    fewShotInput: e.target.value,
                    updatedAt: Date.now(),
                  }))
                }
                placeholder={
                  language === 'id'
                    ? 'Contoh data mentah, pertanyaan pengguna, atau konteks input...'
                    : 'Example raw data, user prompt, or input context...'
                }
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs leading-relaxed resize-y font-mono transition-colors ${focusRingClass} ${inputClass}`}
              />
            </div>

            {/* Few-Shot Output */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="canvas-fewshot-output"
                  className={`text-xs font-semibold ${labelTextClass}`}
                >
                  {t('blank_canvas_fewshot_output')}
                </label>
                {showAIFeatures && (
                  <button
                    type="button"
                    onClick={() =>
                      onAiSuggestFewShot('__few_shot_output', t('blank_canvas_fewshot_output'))
                    }
                    disabled={loadingBlockId === '__few_shot_output'}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${focusRingClass} ${loadingBlockId === '__few_shot_output'
                      ? isLightTheme
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 cursor-wait'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-700 cursor-wait'
                      : isLightTheme
                        ? 'bg-slate-50 hover:bg-emerald-50 text-emerald-800 border-slate-300 hover:border-emerald-400'
                        : 'bg-[#090d16] hover:bg-slate-800 text-emerald-300 border-slate-800 hover:border-emerald-600/60'
                      }`}
                  >
                    {renderSuggestIcon()}
                    <span>
                      {loadingBlockId === '__few_shot_output'
                        ? t('ai_suggesting')
                        : t('ai_suggest_btn')}
                    </span>
                  </button>
                )}
              </div>
              <textarea
                id="canvas-fewshot-output"
                rows={3}
                value={state.fewShotOutput}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    fewShotOutput: e.target.value,
                    updatedAt: Date.now(),
                  }))
                }
                placeholder={
                  language === 'id'
                    ? 'Contoh jawaban terstruktur sesuai format yang Anda harapkan...'
                    : 'Example structured response matching your expected format...'
                }
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs leading-relaxed resize-y font-mono transition-colors ${focusRingClass} ${inputClass}`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlankCanvasPane;
