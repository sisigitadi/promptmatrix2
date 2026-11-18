import React, { useState, useEffect } from 'react';
import {
  AIProviderId,
  AI_PROVIDER_PRESETS,
  AISettings,
  getStoredAISettings,
  saveAISettings,
  removeAISettings,
} from '../services/aiSettingsService';
import { testAIConnection, fetchModelsFromEndpoint } from '../services/universalAIService';
import { useLanguage } from '../contexts/LanguageContext';
import {
  AGENSI_CONFIG,
  AgensiSkillPackItem,
  AgensiUrlOverrides,
  getEffectiveAgensiUrls,
  getStoredAgensiUrlOverrides,
  hasSecondaryMarketplaceUrls,
  saveAgensiUrlOverrides,
} from '../config/agensiConfig';
import { AgentSkillSpec, SkillValidationResult } from '../services/agentSkillService';
import { buildAgensiListingCopy } from '../services/skillZipService';

export type AISettingsTab = 'provider' | 'skills';

export interface AISettingsModalProps {
  show: boolean;
  onHide: () => void;
  onSettingsSaved: () => void;
  initialTab?: AISettingsTab;
  activeSkillSpec?: AgentSkillSpec | null;
  activeSkillMarkdown?: string;
  activeSkillValidation?: SkillValidationResult | null;
  hasActivePrompt?: boolean;
  onCopyActiveSkill?: () => void;
  onDownloadActiveSkill?: () => void;
  onOpenSkillInStudio?: () => void;
  onAgensiUrlsSaved?: () => void;
}

const FLAGSHIP_QUICK_CHIPS: readonly string[] = [
  'gemini-4-carbon',
  'gemini-4-argon',
  'gemini-4-hydrogen',
  'gemini-3.8-flash',
  'gpt-6-astra',
  'gpt-6.1-sol',
  'claude-sonnet-5-5',
  'claude-opus-5-5',
  'claude-fable-5-2',
  'deepseek-v4-pro',
  'deepseek-reasoner',
  'grok-4.7',
  'local-model',
];

type SecondaryAgensiUrlFieldKey =
  | 'lemonSqueezyBundleUrl'
  | 'creemBundleUrl'
  | 'gumroadBundleUrl'
  | 'promptBaseStoreUrl';

interface SecondaryChannelField {
  readonly key: SecondaryAgensiUrlFieldKey;
  readonly labelKey:
    | 'secondary_ls_label'
    | 'secondary_creem_label'
    | 'secondary_gumroad_label'
    | 'secondary_promptbase_label';
  readonly placeholder: string;
}

const SECONDARY_CHANNEL_FIELDS: readonly SecondaryChannelField[] = [
  {
    key: 'lemonSqueezyBundleUrl',
    labelKey: 'secondary_ls_label',
    placeholder: 'https://store.lemonsqueezy.com/buy/...',
  },
  {
    key: 'creemBundleUrl',
    labelKey: 'secondary_creem_label',
    placeholder: 'https://www.creem.io/payment/...',
  },
  {
    key: 'gumroadBundleUrl',
    labelKey: 'secondary_gumroad_label',
    placeholder: 'https://gumroad.com/l/...',
  },
  {
    key: 'promptBaseStoreUrl',
    labelKey: 'secondary_promptbase_label',
    placeholder: 'https://promptbase.com/profile/...',
  },
];

const normalizeAgensiUrlOverrides = (overrides: AgensiUrlOverrides): AgensiUrlOverrides => ({
  affiliateUrl: overrides.affiliateUrl || '',
  creatorStoreUrl: overrides.creatorStoreUrl || '',
  affiliateRefCode: overrides.affiliateRefCode || '',
  lemonSqueezyBundleUrl: overrides.lemonSqueezyBundleUrl || '',
  creemBundleUrl: overrides.creemBundleUrl || '',
  gumroadBundleUrl: overrides.gumroadBundleUrl || '',
  promptBaseStoreUrl: overrides.promptBaseStoreUrl || '',
});

const AISettingsModal: React.FC<AISettingsModalProps> = ({
  show,
  onHide,
  onSettingsSaved,
  initialTab = 'provider',
  activeSkillSpec = null,
  activeSkillMarkdown = '',
  activeSkillValidation = null,
  hasActivePrompt = false,
  onCopyActiveSkill,
  onDownloadActiveSkill,
  onOpenSkillInStudio,
  onAgensiUrlsSaved,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AISettingsTab>(initialTab);
  const [settings, setSettings] = useState<AISettings>(getStoredAISettings());
  const [showKey, setShowKey] = useState(false);
  const [customModelInput, setCustomModelInput] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchedModelsList, setFetchedModelsList] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedPackSlug, setCopiedPackSlug] = useState<string | null>(null);
  const [copiedListingSlug, setCopiedListingSlug] = useState<string | null>(null);
  const [agensiUrls, setAgensiUrls] = useState<AgensiUrlOverrides>(() =>
    normalizeAgensiUrlOverrides(getStoredAgensiUrlOverrides())
  );
  const [agensiSavedNotice, setAgensiSavedNotice] = useState(false);

  useEffect(() => {
    if (show) {
      setActiveTab(initialTab);
      const current = getStoredAISettings();
      setSettings(current);
      setTestResult(null);
      setFetchedModelsList([]);
      setCopiedPackSlug(null);
      setCopiedListingSlug(null);
      setAgensiUrls(normalizeAgensiUrlOverrides(getStoredAgensiUrlOverrides()));
      setAgensiSavedNotice(false);
      const preset = AI_PROVIDER_PRESETS[current.provider];
      const hasModel = preset?.models?.some((m) => m.id === current.model);
      setCustomModelInput(!hasModel);
    }
  }, [show, initialTab]);

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onHide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, onHide]);

  if (!show) return null;

  const currentPreset = AI_PROVIDER_PRESETS[settings.provider] || AI_PROVIDER_PRESETS.custom;
  const effectiveAgensiUrls = getEffectiveAgensiUrls();
  const activeStoreUrl = effectiveAgensiUrls.activeUrl;
  const hasSecondaryChannels = hasSecondaryMarketplaceUrls(effectiveAgensiUrls);

  const handleProviderChange = (providerId: AIProviderId) => {
    const preset = AI_PROVIDER_PRESETS[providerId];
    setSettings((prev) => ({
      ...prev,
      provider: providerId,
      baseUrl: preset.defaultBaseUrl,
      model: preset.defaultModel,
    }));
    setCustomModelInput(false);
    setTestResult(null);
    setFetchedModelsList([]);
  };

  const handleFetchServerModels = async () => {
    if (!settings.baseUrl) {
      setTestResult({
        success: false,
        message: language === 'id' ? 'Harap isi Base API URL terlebih dahulu.' : 'Please enter Base API URL first.',
      });
      return;
    }
    if (currentPreset.requiresApiKey && !settings.apiKey.trim()) {
      setTestResult({
        success: false,
        message:
          language === 'id'
            ? `Harap isi API Key untuk ${currentPreset.name} terlebih dahulu.`
            : `Please enter API Key for ${currentPreset.name} first.`,
      });
      return;
    }
    setIsFetchingModels(true);
    setTestResult(null);
    try {
      const models = await fetchModelsFromEndpoint(settings.baseUrl, settings.apiKey, settings.provider);
      if (models.length > 0) {
        setFetchedModelsList(models);
        setSettings((prev) => ({ ...prev, model: models[0] }));
        setCustomModelInput(false);
        setTestResult({
          success: true,
          message:
            language === 'id'
              ? `Berhasil mengambil ${models.length} model aktif dari server! Model otomatis disetel ke: ${models[0]}`
              : `Fetched ${models.length} active models from endpoint! Model set to: ${models[0]}`,
        });
      } else {
        setTestResult({
          success: false,
          message: language === 'id' ? 'Server mengembalikan daftar model kosong.' : 'Server returned an empty model list.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        success: false,
        message: msg || (language === 'id' ? 'Gagal mengambil daftar model dari endpoint /models.' : 'Failed to fetch models from /models endpoint.'),
      });
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAIConnection(settings);
      setTestResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        success: false,
        message: msg || (language === 'id' ? 'Gagal terhubung ke endpoint AI.' : 'Failed to connect to AI endpoint.'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveAISettings(settings);
    onSettingsSaved();
    onHide();
  };

  const handleReset = () => {
    removeAISettings();
    const def = getStoredAISettings();
    setSettings(def);
    onSettingsSaved();
    onHide();
  };

  const handleCopyPackCommand = async (slug: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedPackSlug(slug);
      setTimeout(() => setCopiedPackSlug(null), 1800);
    } catch {
      setCopiedPackSlug(null);
    }
  };

  const handleCopyListingCopy = async (pack: AgensiSkillPackItem) => {
    const summary = language === 'id' ? pack.summaryId : pack.summaryEn;
    const listing = buildAgensiListingCopy({
      slug: pack.slug,
      title: pack.title,
      description: summary,
      category: pack.matchedCategories[0] || 'General',
      priceUsd: pack.priceUsd,
      includedFiles: pack.includedFiles,
      language,
    });
    try {
      await navigator.clipboard.writeText(listing.fullMarkdown);
      setCopiedListingSlug(pack.slug);
      setTimeout(() => setCopiedListingSlug(null), 1800);
    } catch {
      setCopiedListingSlug(null);
    }
  };

  const handleSaveAgensiUrls = () => {
    saveAgensiUrlOverrides(agensiUrls);
    setAgensiUrls(normalizeAgensiUrlOverrides(getStoredAgensiUrlOverrides()));
    setAgensiSavedNotice(true);
    onAgensiUrlsSaved?.();
    setTimeout(() => setAgensiSavedNotice(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onHide();
        }
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 font-sans">
                {t('ai_modal_title')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                {t('ai_modal_subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onHide}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={t('close_btn')}
          >
            ✕
          </button>
        </div>

        {/* Private Mode Unified Switcher: AI Provider Settings + Paket Skill */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-sans">
          <button
            type="button"
            onClick={() => setActiveTab('provider')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              activeTab === 'provider'
                ? 'bg-emerald-600/90 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>⚙️</span>
            <span>{language === 'id' ? 'Provider & Model AI' : 'AI Provider & Models'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              activeTab === 'skills'
                ? 'bg-emerald-600/90 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>🧩</span>
            <span>{t('ai_modal_skill_tab')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-900/80 text-emerald-300 border border-emerald-500/30">
              {AGENSI_CONFIG.bundledSkillPacks.length}
            </span>
          </button>
        </div>

        {activeTab === 'provider' ? (
          /* Form Body */
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* Provider Grid Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200 block">
                {t('step1_provider')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(Object.keys(AI_PROVIDER_PRESETS) as AIProviderId[]).map((id) => {
                  const preset = AI_PROVIDER_PRESETS[id];
                  const isSelected = settings.provider === id;
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => handleProviderChange(id)}
                      className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 min-h-[58px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                        isSelected
                          ? 'bg-teal-950/80 border-teal-500 text-teal-200 ring-1 ring-teal-500/50 shadow-sm'
                          : 'bg-slate-900/70 hover:bg-slate-850 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{preset.icon}</span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tight">
                          {preset.badge || id}
                        </span>
                      </div>
                      <span className="font-semibold text-[11px] truncate" title={preset.name}>
                        {preset.shortLabel || preset.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider Details & Quick Tips Banner */}
            <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{currentPreset.icon}</span>
                <div>
                  <span className="font-bold text-slate-200">{currentPreset.name}</span>
                  <p className="text-[11px] text-slate-400">
                    {currentPreset.requiresApiKey ? t('requires_api_key_badge') : t('free_offline_badge')}
                  </p>
                </div>
              </div>
              {currentPreset.docUrl && (
                <a
                  href={currentPreset.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 hover:text-teal-300 text-[11px] underline flex items-center gap-0.5 whitespace-nowrap ml-2 font-medium"
                >
                  <span>Docs / Keys</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            {/* Base API URL Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200">
                  {t('step2_baseurl')}
                </label>
                <button
                  type="button"
                  onClick={handleFetchServerModels}
                  disabled={isFetchingModels}
                  className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
                  title={
                    language === 'id'
                      ? 'Ambil daftar model aktif langsung dari endpoint /models'
                      : 'Fetch active models directly from /models endpoint'
                  }
                >
                  <span>{isFetchingModels ? '⏳' : '🔄'}</span>
                  <span>{isFetchingModels ? t('fetching_models') : t('btn_fetch_models')}</span>
                </button>
              </div>
              <input
                type="text"
                value={settings.baseUrl}
                onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                placeholder={
                  language === 'id'
                    ? 'Contoh: https://api.openai.com/v1 atau https://openrouter.ai/api/v1'
                    : 'Example: https://api.openai.com/v1 or https://openrouter.ai/api/v1'
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              />
            </div>

            {/* API Key Input */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-200 flex items-center justify-between">
                <span>{t('step3_apikey')}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {currentPreset.requiresApiKey ? t('step3_apikey_required') : t('step3_apikey_optional')}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder={currentPreset.placeholderKey}
                  className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 text-xs"
                  title={showKey ? (language === 'id' ? 'Sembunyikan' : 'Hide') : (language === 'id' ? 'Tampilkan' : 'Show')}
                >
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>🔒</span>
                <span>{t('stored_locally_note')}</span>
              </p>
            </div>

            {/* Model Name Selector & Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span>{t('step4_model')}</span>
                  {customModelInput && (
                    <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-500/40 px-1.5 py-0.2 rounded font-mono font-normal">
                      Mode Kustom Aktif
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setCustomModelInput(!customModelInput)}
                  className="text-[11px] text-teal-400 hover:underline font-medium flex items-center gap-1"
                >
                  <span>
                    {customModelInput
                      ? '📋 ' + (language === 'id' ? 'Gunakan Daftar Preset' : 'Use Preset List')
                      : '✏️ ' + (language === 'id' ? 'Ketik Model Sendiri' : 'Enter Custom Model')}
                  </span>
                </button>
              </div>

              {customModelInput ? (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={settings.model}
                      onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                      placeholder={t('custom_model_placeholder')}
                      className="w-full px-3 py-2 bg-slate-950 border border-teal-500 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ring-1 ring-teal-500/30"
                      autoFocus
                    />
                    {settings.model && (
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, model: '' })}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 text-xs"
                        title={language === 'id' ? 'Hapus teks' : 'Clear text'}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Compatibility Helper Note */}
                  <div className="p-2.5 bg-slate-900/90 border border-teal-500/30 rounded-xl text-[11px] text-slate-300 space-y-1.5">
                    <p className="flex items-center gap-1.5 font-semibold text-teal-300">
                      <span>✨</span>
                      <span>{language === 'id' ? 'Kompatibilitas Fleksibel Sepenuhnya' : 'Full Custom Flexibility'}</span>
                    </p>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {language === 'id'
                        ? 'Anda dapat memasukkan nama/ID model versi terbaru, preview model, fine-tuned model, atau model open-source lokal apa pun yang didukung oleh API key / Base URL Anda.'
                        : 'You can enter any model ID, newest release, preview model, fine-tuned model, or local open-source model supported by your API key / Base URL.'}
                    </p>

                    {/* Quick suggestion chips */}
                    <div className="pt-1 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-slate-400 mr-1">
                        {language === 'id' ? 'Flagship cepat:' : 'Flagship presets:'}
                      </span>
                      {FLAGSHIP_QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setSettings({ ...settings, model: chip })}
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-teal-950/60 hover:text-teal-300 border border-slate-700 hover:border-teal-500/40 text-[10px] font-mono text-slate-300 transition-all"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <select
                    value={settings.model}
                    onChange={(e) => {
                      if (e.target.value === '__custom_model_input__') {
                        setCustomModelInput(true);
                      } else {
                        setSettings({ ...settings, model: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 font-mono"
                  >
                    {fetchedModelsList.length > 0 ? (
                      <>
                        <optgroup label={language === 'id' ? '── Model Aktif dari Server ──' : '── Active Server Models ──'}>
                          {fetchedModelsList.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label={language === 'id' ? '── Preset Rekomendasi ──' : '── Recommended Presets ──'}>
                          {(currentPreset.models || []).map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.label} ({m.id})
                            </option>
                          ))}
                        </optgroup>
                      </>
                    ) : (
                      (currentPreset.models || []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label} ({m.id})
                        </option>
                      ))
                    )}
                    <option value="__custom_model_input__" className="font-bold text-teal-400">
                      ➕ {language === 'id' ? 'Kustom: Ketik Model Lain yang Belum Ada di Daftar...' : 'Custom: Enter Another Model Not in List...'}
                    </option>
                  </select>

                  {/* Active Model Description */}
                  {(() => {
                    const activeModelObj = currentPreset.models.find((m) => m.id === settings.model);
                    if (activeModelObj?.description) {
                      return (
                        <p className="text-[11px] text-teal-300/90 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                          💡 <strong>{language === 'id' ? 'Karakteristik:' : 'Characteristics:'}</strong> {activeModelObj.description}
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>

            {/* Connection Test Result Box */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                    : 'bg-red-950/80 border-red-500 text-red-200'
                }`}
              >
                <span className="text-sm">{testResult.success ? '✅' : '⚠️'}</span>
                <div className="flex-1 space-y-1">
                  <p>{testResult.message}</p>
                  {!testResult.success && testResult.message.includes('No available channel') && (
                    <p className="text-[11px] text-amber-300 border-t border-red-800/80 pt-1 mt-1">
                      👉 <strong>{t('router_tip_title')}</strong> {t('router_tip_desc')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-700 flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <span>{isTesting ? '⏳' : '⚡'}</span>
                <span>{isTesting ? t('testing_connection') : t('test_connection_btn')}</span>
              </button>

              <div className="flex-1" />

              {settings.apiKey && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-xs transition-colors"
                >
                  {t('remove_settings_btn')}
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold text-xs transition-colors shadow"
              >
                {t('save_settings_btn')}
              </button>
            </div>
          </form>
        ) : (
          /* Paket Skill (SKILL.md & Agensi.io) Private Workspace */
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* Active Formula SKILL.md Export Card */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>
                      {language === 'id'
                        ? 'Ekspor SKILL.md dari Studio Aktif'
                        : 'Active Studio Formula SKILL.md Export'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {hasActivePrompt && activeSkillSpec
                      ? `${activeSkillSpec.name}-SKILL.md (${activeSkillMarkdown.split('\n').length} lines)`
                      : language === 'id'
                        ? 'Pilih formula di Galeri/Studio untuk mengompilasi dokumen SKILL.md siap ekspor.'
                        : 'Select any formula in Gallery/Studio to compile an export-ready SKILL.md document.'}
                    </p>
                </div>

                {hasActivePrompt && activeSkillValidation && (
                  <span
                    className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] font-semibold ${
                      activeSkillValidation.valid
                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/35 text-rose-300'
                    }`}
                  >
                    {activeSkillValidation.valid ? t('skill_valid_badge') : t('skill_invalid_badge')} • name{' '}
                    {activeSkillValidation.nameLength}/64
                  </span>
                )}
              </div>

              {hasActivePrompt && activeSkillSpec && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {onCopyActiveSkill && (
                    <button
                      type="button"
                      onClick={onCopyActiveSkill}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-[11px] transition-colors"
                    >
                      📋 {t('copy_skill_btn')}
                    </button>
                  )}
                  {onDownloadActiveSkill && (
                    <button
                      type="button"
                      onClick={onDownloadActiveSkill}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                    >
                      ⬇ {t('download_skill_btn')}
                    </button>
                  )}
                  {onOpenSkillInStudio && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSkillInStudio();
                        onHide();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-semibold text-[11px] transition-colors"
                    >
                      {language === 'id' ? 'Buka Tab SKILL.md di Studio →' : 'Open SKILL.md Tab in Studio →'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Agensi.io Affiliate & Creator Store URLs Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-slate-100 text-xs">
                  {t('agensi_urls_title')}
                </h4>
                {agensiSavedNotice && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                    ✓ {t('agensi_urls_saved')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="space-y-1 block">
                  <span className="text-[11px] font-medium text-slate-300 block">
                    {t('agensi_affiliate_label')}
                  </span>
                  <input
                    type="url"
                    value={agensiUrls.affiliateUrl}
                    onChange={(e) => {
                      setAgensiSavedNotice(false);
                      setAgensiUrls((prev) => ({ ...prev, affiliateUrl: e.target.value }));
                    }}
                    placeholder="https://agensi.io/?ref=yourhandle"
                    className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </label>

                <label className="space-y-1 block">
                  <span className="text-[11px] font-medium text-slate-300 block">
                    {t('agensi_store_label')}
                  </span>
                  <input
                    type="url"
                    value={agensiUrls.creatorStoreUrl}
                    onChange={(e) => {
                      setAgensiSavedNotice(false);
                      setAgensiUrls((prev) => ({ ...prev, creatorStoreUrl: e.target.value }));
                    }}
                    placeholder="https://agensi.io/@yourhandle"
                    className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </label>
              </div>

              <details className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2">
                <summary className="min-h-[44px] sm:min-h-[38px] flex items-center justify-between gap-2 cursor-pointer select-none text-[11px] font-semibold text-slate-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                  <span>{t('secondary_channels_title')}</span>
                  {hasSecondaryChannels && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10px] font-mono">
                      ✓
                    </span>
                  )}
                </summary>

                <div className="pt-2.5 pb-1 space-y-2.5 border-t border-slate-800/80 mt-1">
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {t('secondary_channels_hint')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SECONDARY_CHANNEL_FIELDS.map((field) => (
                      <label key={field.key} className="space-y-1 block">
                        <span className="text-[11px] font-medium text-slate-300 block">
                          {t(field.labelKey)}
                        </span>
                        <input
                          type="url"
                          value={agensiUrls[field.key]}
                          onChange={(e) => {
                            setAgensiSavedNotice(false);
                            setAgensiUrls((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }));
                          }}
                          placeholder={field.placeholder}
                          className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-400 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </details>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
                <label className="space-y-1 block flex-1">
                  <span className="text-[11px] font-medium text-slate-300 block">
                    {t('agensi_ref_label')}
                  </span>
                  <input
                    type="text"
                    value={agensiUrls.affiliateRefCode}
                    onChange={(e) => {
                      setAgensiSavedNotice(false);
                      setAgensiUrls((prev) => ({ ...prev, affiliateRefCode: e.target.value }));
                    }}
                    placeholder="sigitadi"
                    className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSaveAgensiUrls}
                  className="min-h-[44px] sm:min-h-[38px] px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {t('save_settings_btn')}
                </button>
              </div>
            </div>

            {/* Bundled 10 Open Agent Skills Catalog (agensi-skills/) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-200">
                  {language === 'id'
                    ? `${AGENSI_CONFIG.bundledSkillPacks.length} Paket Open Agent Skills (agensi-skills/)`
                    : `${AGENSI_CONFIG.bundledSkillPacks.length} Bundled Open Agent Skills (agensi-skills/)`}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {AGENSI_CONFIG.supportedAgents.length} {language === 'id' ? 'runtime agen' : 'agent runtimes'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AGENSI_CONFIG.bundledSkillPacks.map((pack) => {
                  const isCopied = copiedPackSlug === pack.slug;
                  const isListingCopied = copiedListingSlug === pack.slug;
                  return (
                    <div
                      key={pack.slug}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 space-y-2 flex flex-col justify-between min-w-0"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="font-bold text-slate-100 text-[11px] leading-snug break-words min-w-0">
                            {pack.title}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                                pack.tier === 'lead-magnet'
                                  ? 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
                                  : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                              }`}
                            >
                              {pack.tier === 'lead-magnet' ? 'Free Starter' : 'Flagship'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-950 border border-slate-700 text-slate-200">
                              {pack.priceLabel}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] font-mono text-emerald-400/90 truncate">{pack.slug}</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {language === 'id' ? pack.summaryId : pack.summaryEn}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <p className="text-[10px] font-mono text-slate-400 truncate" title={pack.folderPath}>
                          {pack.folderPath}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyPackCommand(pack.slug, pack.validatorScript || pack.folderPath)
                            }
                            className="min-h-[44px] sm:min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-mono text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            title={pack.validatorScript || pack.folderPath}
                          >
                            {isCopied ? '✓ Copied' : pack.validatorScript ? 'Copy Check' : 'Copy Path'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyListingCopy(pack)}
                            className={`min-h-[44px] sm:min-h-[32px] px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                              isListingCopied
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'bg-cyan-950/70 hover:bg-cyan-900/80 border-cyan-500/40 text-cyan-200'
                            }`}
                            title="Agensi.io/sell"
                          >
                            {isListingCopied ? `✓ ${t('copied_btn')}` : t('copy_listing_btn')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agensi.io Private Store Readiness Footer */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-emerald-400">
                  {t('skill_agensi_ready_title')}
                </p>
                <p className="text-[10px] text-slate-300">
                  {language === 'id'
                    ? `${AGENSI_CONFIG.commissionInfo.standardSharePercent}% bagian kreator (${AGENSI_CONFIG.commissionInfo.affiliateNewBuyerSharePercent}% via afiliasi, ${AGENSI_CONFIG.commissionInfo.listingModel}).`
                    : `${AGENSI_CONFIG.commissionInfo.standardSharePercent}% creator share (${AGENSI_CONFIG.commissionInfo.affiliateNewBuyerSharePercent}% via affiliate, ${AGENSI_CONFIG.commissionInfo.listingModel}).`}
                </p>
                {!activeStoreUrl && (
                  <p className="text-[10px] text-slate-400">{t('skill_agensi_setup_hint')}</p>
                )}
              </div>

              {activeStoreUrl && (
                <a
                  href={activeStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] sm:min-h-[36px] inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold shrink-0 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {t('skill_agensi_visit_btn')} ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISettingsModal;
