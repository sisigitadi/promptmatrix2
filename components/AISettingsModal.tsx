import React, { useState, useEffect } from 'react';
import {
  AIProviderId,
  AI_PROVIDER_PRESETS,
  AISettings,
  getStoredAISettings,
  saveAISettings,
  removeAISettings,
  sanitizeApiKey,
  detectKeyProviderMismatch,
  inferProviderFromUrlAndModel,
} from '../services/aiSettingsService';
import { testAIConnection, fetchModelsFromEndpoint, resolveAIEndpoint } from '../services/universalAIService';
import { useLanguage } from '../contexts/LanguageContext';

export interface AISettingsModalProps {
  show: boolean;
  onHide: () => void;
  onSettingsSaved: () => void;
}

const FLAGSHIP_QUICK_CHIPS: readonly string[] = [
  'intern-s2',
  'Sage-S2.1-Flash',
  'Agents-A1',
  'Atria-Dawn',
  'Sage-A1.5',
  'Sage-A1.5-Taiyi',
  'deepseek-v4.1-flash-1017',
  'kimi-k3.1-pro',
  'qwen3.8-27b',
  'glm-5.3',
  'intern-decision-4b',
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

const AISettingsModal: React.FC<AISettingsModalProps> = ({
  show,
  onHide,
  onSettingsSaved,
}) => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<AISettings>(getStoredAISettings());
  const [showKey, setShowKey] = useState(false);
  const [customModelInput, setCustomModelInput] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchedModelsList, setFetchedModelsList] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; isQuotaExceeded?: boolean; isAuthError?: boolean } | null>(null);

  useEffect(() => {
    if (show) {
      const current = getStoredAISettings();
      setSettings(current);
      setTestResult(null);
      setFetchedModelsList([]);
      const preset = AI_PROVIDER_PRESETS[current.provider];
      const hasModel = preset?.models?.some((m) => m.id === current.model);
      setCustomModelInput(!hasModel);
    }
  }, [show]);

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

  const handleProviderChange = (providerId: AIProviderId) => {
    const preset = AI_PROVIDER_PRESETS[providerId];
    const cleanCurrentKey = sanitizeApiKey(settings.apiKey);

    const updatedKeys: Partial<Record<AIProviderId, string>> = {
      ...(settings.providerKeys || {}),
      ...(cleanCurrentKey ? { [settings.provider]: cleanCurrentKey } : {})
    };

    const nextKey = updatedKeys[providerId] || '';

    setSettings((prev) => ({
      ...prev,
      provider: providerId,
      baseUrl: preset.defaultBaseUrl,
      model: preset.defaultModel,
      apiKey: nextKey,
      providerKeys: updatedKeys,
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
        const isInternAi = settings.baseUrl.includes('intern-ai.org.cn') || settings.provider === 'internai';
        setTestResult({
          success: true,
          message:
            isInternAi
              ? (language === 'id'
                ? `Berhasil memuat ${models.length} model aktif dari endpoint Intern-Discovery (书生·端砚 - Shanghai AI Lab)! Model disetel ke: ${models[0]}`
                : `Fetched ${models.length} active models from Intern-Discovery gateway! Model set to: ${models[0]}`)
              : (language === 'id'
                ? `Berhasil mengambil ${models.length} model aktif dari server! Model otomatis disetel ke: ${models[0]}`
                : `Fetched ${models.length} active models from endpoint! Model set to: ${models[0]}`),
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
    if (!settings.model || !settings.model.trim()) {
      setTestResult({
        success: false,
        message:
          language === 'id'
            ? 'Harap ketik nama model AI pada kolom input sebelum melakukan uji coba koneksi.'
            : 'Please enter an AI model name in the input field before testing connection.',
      });
      return;
    }
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
    const cleanKey = sanitizeApiKey(settings.apiKey);
    const updated: AISettings = {
      ...settings,
      apiKey: cleanKey,
      providerKeys: {
        ...(settings.providerKeys || {}),
        [settings.provider]: cleanKey,
      }
    };
    saveAISettings(updated);
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-provider-modal-title"
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
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 id="ai-provider-modal-title" className="text-sm sm:text-base font-bold text-slate-100 font-sans">
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
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#090d16] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-semibold flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={t('close_btn')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* AI Provider Settings Form */}
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
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 min-h-[58px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50 shadow-sm'
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

          {/* Provider Details & Documentation Link Banner */}
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
                className="text-emerald-400 hover:text-emerald-300 text-[11px] underline flex items-center gap-0.5 whitespace-nowrap ml-2 font-medium"
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
                className="min-h-[44px] px-2 text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-medium disabled:opacity-50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title={
                  language === 'id'
                    ? 'Kueri endpoint /models di server Anda untuk mendapatkan daftar model yang tersedia'
                    : 'Query /models endpoint on your server for available models'
                }
              >
                <svg className={`w-3.5 h-3.5 ${isFetchingModels ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isFetchingModels ? t('fetching_models') : t('btn_fetch_models')}</span>
              </button>
            </div>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => {
                const newUrl = e.target.value;
                const detected = inferProviderFromUrlAndModel(settings.provider, newUrl, settings.model);
                if (detected !== settings.provider) {
                  const preset = AI_PROVIDER_PRESETS[detected];
                  setSettings((prev) => ({
                    ...prev,
                    provider: detected,
                    baseUrl: newUrl,
                    model: prev.model && prev.model !== 'gemini-4-carbon' ? prev.model : preset.defaultModel,
                  }));
                } else {
                  setSettings({ ...settings, baseUrl: newUrl });
                }
              }}
              placeholder={currentPreset.defaultBaseUrl || 'https://api.openai.com/v1'}
              className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
            {settings.baseUrl.includes('intern-ai.org.cn') && (
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between gap-2">
                <span>✨ Terdeteksi endpoint Intern-Discovery (书生·端砚 - Shanghai AI Lab). Provider: <strong>{currentPreset.name}</strong>. 11 model riset resmi aktif.</span>
                <button
                  type="button"
                  onClick={handleFetchServerModels}
                  className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[10px] shrink-0"
                >
                  Muat Model
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-400">
              {t('step2_baseurl_hint')} ({language === 'id' ? 'contoh:' : 'e.g.:'} {currentPreset.defaultBaseUrl})
            </p>
            <p className="text-[10px] text-slate-400 font-mono break-all">
              {language === 'id' ? 'Endpoint aktif: ' : 'Active endpoint: '}
              <span className="text-emerald-300">{resolveAIEndpoint(settings.baseUrl, settings.provider).chatUrl}</span>
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>{t('step3_apikey')}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${currentPreset.requiresApiKey
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                >
                  {currentPreset.requiresApiKey ? t('step3_apikey_required') : t('step3_apikey_optional')}
                </span>
                {settings.apiKey ? (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({sanitizeApiKey(settings.apiKey).length} {language === 'id' ? 'karakter' : 'chars'})
                  </span>
                ) : null}
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="min-h-[44px] px-2 text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span>{showKey ? t('hide_key_btn') : t('show_key_btn')}</span>
              </button>
            </div>
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => {
                const cleaned = sanitizeApiKey(e.target.value);
                setSettings({ ...settings, apiKey: cleaned });
              }}
              placeholder={currentPreset.requiresApiKey ? (currentPreset.placeholderKey || 'sk-...') : '(Tidak diperlukan untuk server lokal offline)'}
              className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
            {(() => {
              const mismatch = detectKeyProviderMismatch(settings.apiKey, settings.provider);
              if (mismatch) {
                return (
                  <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-600/50 text-[11px] text-amber-300 flex items-start gap-1.5 mt-1">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>{mismatch}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Target Model Input / Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200">
                {t('step4_model')}
              </label>
              <button
                type="button"
                onClick={() => setCustomModelInput(!customModelInput)}
                className="min-h-[44px] px-2 text-[11px] text-emerald-400 hover:underline rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {customModelInput ? t('btn_select_preset') : t('btn_custom_model')}
              </button>
            </div>

            {customModelInput ? (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={settings.model}
                    onChange={(e) => {
                      const val = e.target.value;
                      const detected = inferProviderFromUrlAndModel(settings.provider, settings.baseUrl, val);
                      if (detected !== settings.provider && val.trim().length > 3) {
                        setSettings((prev) => ({
                          ...prev,
                          provider: detected,
                          model: val,
                        }));
                      } else {
                        setSettings({ ...settings, model: val });
                      }
                    }}
                    placeholder={
                      language === 'id'
                        ? 'Ketik nama model AI (misal: Agents-A1, Sage-S2.1-Flash, intern-s2)'
                        : 'Type AI model name (e.g. Agents-A1, Sage-S2.1-Flash, intern-s2)'
                    }
                    className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-2 pr-24 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    autoFocus
                  />
                  {settings.model ? (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, model: '' })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 font-semibold transition-colors"
                      title={language === 'id' ? 'Kosongkan input model' : 'Clear model input'}
                    >
                      ✕ {language === 'id' ? 'Kosongkan' : 'Clear'}
                    </button>
                  ) : (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-400 font-mono pointer-events-none">
                      {language === 'id' ? '(Model Kosong)' : '(Empty Model)'}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'id' ? 'Chip Cepat Flagship:' : 'Flagship Quick Chips:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, model: '' })}
                      className="text-[10px] text-amber-400 hover:underline font-medium"
                    >
                      {language === 'id' ? '✍️ Kosongkan (Input Baru)' : '✍️ Clear (New Input)'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, model: '' })}
                      className={`min-h-[38px] sm:min-h-[30px] px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-colors ${
                        settings.model === ''
                          ? 'bg-amber-600 text-white border-amber-500 font-semibold'
                          : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
                      }`}
                      title={language === 'id' ? 'Kosongkan input untuk ketik model baru' : 'Clear input to type a new model'}
                    >
                      ✍️ {language === 'id' ? 'Kosong (Input Sendiri)' : 'Empty (Type Custom)'}
                    </button>
                    {FLAGSHIP_QUICK_CHIPS.map((chip) => (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => {
                          const detected = inferProviderFromUrlAndModel(settings.provider, settings.baseUrl, chip);
                          if (detected !== settings.provider) {
                            setSettings((prev) => ({
                              ...prev,
                              provider: detected,
                              model: chip,
                            }));
                          } else {
                            setSettings((prev) => ({ ...prev, model: chip }));
                          }
                        }}
                        className={`min-h-[38px] sm:min-h-[30px] px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-colors ${
                          settings.model === chip
                            ? 'bg-emerald-700 text-white border-emerald-600 font-semibold'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={settings.model || '__custom_empty__'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__custom_empty__') {
                      setCustomModelInput(true);
                      setSettings({ ...settings, model: '' });
                      return;
                    }
                    const detected = inferProviderFromUrlAndModel(settings.provider, settings.baseUrl, val);
                    if (detected !== settings.provider) {
                      setSettings((prev) => ({
                        ...prev,
                        provider: detected,
                        model: val,
                      }));
                    } else {
                      setSettings((prev) => ({ ...prev, model: val }));
                    }
                  }}
                  className="w-full min-h-[44px] sm:min-h-[38px] px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <optgroup label={language === 'id' ? 'Pilihan Kustom / Manual' : 'Custom / Manual Option'}>
                    <option value="__custom_empty__">
                      ✍️ {language === 'id' ? '+ Input Model Kustom Sendiri (Kosong)...' : '+ Enter Custom Model Name (Empty)...'}
                    </option>
                  </optgroup>
                  {fetchedModelsList.length > 0 && (
                    <optgroup label={language === 'id' ? 'Model dari Server Endpoint' : 'Models from Server Endpoint'}>
                      {fetchedModelsList.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label={language === 'id' ? 'Model Bawaan Terkurasi' : 'Curated Preset Models'}>
                    {currentPreset.models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.id})
                      </option>
                    ))}
                  </optgroup>
                </select>

                {(() => {
                  const activeModelObj = currentPreset.models.find((m) => m.id === settings.model);
                  if (activeModelObj?.description) {
                    return (
                      <p className="text-[11px] text-emerald-300 bg-[#090d16] px-2.5 py-1.5 rounded-xl border border-slate-800">
                        <strong>{language === 'id' ? 'Karakteristik:' : 'Characteristics:'}</strong> {activeModelObj.description}
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
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                  : testResult.isQuotaExceeded || testResult.message.includes('429') || testResult.message.toLowerCase().includes('quota')
                    ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                    : testResult.isAuthError || testResult.message.includes('401') || testResult.message.includes('403')
                      ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                      : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
              }`}
            >
              <span className="text-base shrink-0 mt-0.5">
                {testResult.success
                  ? '✅'
                  : testResult.isQuotaExceeded || testResult.message.includes('429') || testResult.message.toLowerCase().includes('quota')
                    ? '⚠️'
                    : testResult.isAuthError || testResult.message.includes('401') || testResult.message.includes('403')
                      ? '🔑'
                      : '❌'}
              </span>
              <div className="flex-1 space-y-1">
                <span className="font-bold block">
                  {testResult.success
                    ? (language === 'id' ? 'Tes Koneksi Berhasil' : 'Connection Successful')
                    : testResult.isQuotaExceeded || testResult.message.includes('429') || testResult.message.toLowerCase().includes('quota')
                      ? (language === 'id' ? 'Otentikasi Berhasil - Kuota Akun Habis (HTTP 429)' : 'Authentication Succeeded - Account Quota Exceeded (HTTP 429)')
                      : testResult.isAuthError || testResult.message.includes('401') || testResult.message.includes('403')
                        ? (language === 'id' ? 'Otentikasi Gagal - API Key Ditolak' : 'Authentication Failed - API Key Rejected')
                        : (language === 'id' ? 'Tes Koneksi Gagal' : 'Connection Failed')}
                </span>
                <p className="whitespace-pre-line">{testResult.message}</p>
                {(testResult.isQuotaExceeded || testResult.message.includes('429') || testResult.message.toLowerCase().includes('quota')) && (
                  <div className="pt-2 border-t border-amber-800/60 flex flex-wrap items-center gap-2 mt-2">
                    {currentPreset.docUrl && (
                      <a
                        href={currentPreset.docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-semibold text-[11px] inline-flex items-center gap-1"
                      >
                        <span>{language === 'id' ? 'Cek Saldo Kuota di Dashboard' : 'Check Balance on Dashboard'}</span>
                        <span>↗</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSettings((prev) => ({ ...prev, model: 'Agents-A1' }));
                        setTestResult(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-amber-600/40"
                    >
                      {language === 'id' ? 'Coba Model Hemat: Agents-A1 (4 Kredit)' : 'Try Low-Cost Model: Agents-A1 (4 Credits)'}
                    </button>
                  </div>
                )}
                {(testResult.isAuthError || (!testResult.success && (testResult.message.includes('401') || testResult.message.includes('403')))) && (
                  <div className="pt-2 border-t border-rose-800/60 flex flex-wrap items-center gap-2 mt-2">
                    {currentPreset.docUrl && (
                      <a
                        href={currentPreset.docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-semibold text-[11px] inline-flex items-center gap-1"
                      >
                        <span>{language === 'id' ? 'Buka Dashboard API Key' : 'Open API Key Dashboard'}</span>
                        <span>↗</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSettings((prev) => ({ ...prev, apiKey: '' }));
                        setTestResult(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-[11px] border border-rose-600/40"
                    >
                      {language === 'id' ? 'Hapus & Isi Ulang API Key' : 'Clear & Re-enter API Key'}
                    </button>
                  </div>
                )}
                {!testResult.success && testResult.message.includes('No available channel') && (
                  <p className="text-[11px] text-amber-300 border-t border-rose-800/80 pt-1 mt-1">
                    <strong>{t('router_tip_title')}</strong> {t('router_tip_desc')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="min-h-[44px] px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span>{isTesting ? t('testing_connection') : t('test_connection_btn')}</span>
            </button>

            <div className="flex-1" />

            {settings.apiKey && (
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[44px] px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded-xl text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {t('remove_settings_btn')}
              </button>
            )}

            <button
              type="submit"
              className="min-h-[44px] px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold text-xs transition-colors shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {t('save_settings_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISettingsModal;
