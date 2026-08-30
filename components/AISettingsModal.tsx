import React, { useState, useEffect } from 'react';
import { 
  AIProviderId, 
  AI_PROVIDER_PRESETS, 
  AISettings, 
  getStoredAISettings, 
  saveAISettings, 
  removeAISettings 
} from '../services/aiSettingsService';
import { testAIConnection, fetchModelsFromEndpoint } from '../services/universalAIService';
import { useLanguage } from '../contexts/LanguageContext';

interface AISettingsModalProps {
  show: boolean;
  onHide: () => void;
  onSettingsSaved: () => void;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({
  show,
  onHide,
  onSettingsSaved
}) => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<AISettings>(getStoredAISettings());
  const [showKey, setShowKey] = useState(false);
  const [customModelInput, setCustomModelInput] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchedModelsList, setFetchedModelsList] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (show) {
      const current = getStoredAISettings();
      setSettings(current);
      setTestResult(null);
      setFetchedModelsList([]);
      const preset = AI_PROVIDER_PRESETS[current.provider];
      const hasModel = preset?.models?.some(m => m.id === current.model);
      setCustomModelInput(!hasModel);
    }
  }, [show]);

  if (!show) return null;

  const currentPreset = AI_PROVIDER_PRESETS[settings.provider] || AI_PROVIDER_PRESETS.custom;

  const handleProviderChange = (providerId: AIProviderId) => {
    const preset = AI_PROVIDER_PRESETS[providerId];
    setSettings(prev => ({
      ...prev,
      provider: providerId,
      baseUrl: preset.defaultBaseUrl,
      model: preset.defaultModel
    }));
    setCustomModelInput(false);
    setTestResult(null);
    setFetchedModelsList([]);
  };

  const handleFetchServerModels = async () => {
    if (!settings.baseUrl) {
      setTestResult({ success: false, message: 'Harap isi Base API URL terlebih dahulu.' });
      return;
    }
    setIsFetchingModels(true);
    setTestResult(null);
    try {
      const models = await fetchModelsFromEndpoint(settings.baseUrl, settings.apiKey);
      if (models.length > 0) {
        setFetchedModelsList(models);
        setSettings(prev => ({ ...prev, model: models[0] }));
        setCustomModelInput(false);
        setTestResult({ 
          success: true, 
          message: `Berhasil mengambil ${models.length} model aktif dari server router! Model otomatis disetel ke: ${models[0]}` 
        });
      } else {
        setTestResult({ success: false, message: 'Server mengembalikan daftar model kosong.' });
      }
    } catch (err: any) {
      setTestResult({ 
        success: false, 
        message: err.message || 'Gagal mengambil daftar model dari endpoint /models.' 
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
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Gagal terhubung ke endpoint AI.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
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
            onClick={onHide}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">

          
          {/* Provider Grid Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 block">
              {t('step1_provider')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {(Object.keys(AI_PROVIDER_PRESETS) as AIProviderId[]).map(id => {
                const preset = AI_PROVIDER_PRESETS[id];
                const isSelected = settings.provider === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => handleProviderChange(id)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-teal-950/80 border-teal-500 text-teal-200 ring-1 ring-teal-500/50 shadow-sm'
                        : 'bg-slate-900/70 hover:bg-slate-850 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-[9px] text-slate-500 font-mono uppercase">{id}</span>
                    </div>
                    <span className="font-semibold text-[11px] truncate">{preset.name.split(' ')[0]}</span>
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
              {settings.provider !== 'gemini' && (
                <button
                  type="button"
                  onClick={handleFetchServerModels}
                  disabled={isFetchingModels}
                  className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
                  title={language === 'id' ? 'Ambil daftar model yang aktif di server router ini' : 'Fetch active models from this router server'}
                >
                  <span>{isFetchingModels ? '⏳' : '🔄'}</span>
                  <span>{isFetchingModels ? t('fetching_models') : t('btn_fetch_models')}</span>
                </button>
              )}
            </div>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
              placeholder={language === 'id' ? 'Contoh: https://router.juan.web.id/v1 atau https://api.openai.com/v1' : 'Example: https://router.juan.web.id/v1 or https://api.openai.com/v1'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 font-mono focus:outline-none"
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
                className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 font-mono focus:outline-none"
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
                <span>{customModelInput ? '📋 ' + (language === 'id' ? 'Gunakan Daftar Preset' : 'Use Preset List') : '✏️ ' + (language === 'id' ? 'Ketik Model Sendiri' : 'Enter Custom Model')}</span>
              </button>
            </div>

            {customModelInput ? (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={settings.model}
                    onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                    placeholder={language === 'id' ? 'Ketik nama / ID model (misal: gemini-3.7-flash, gpt-4.5-preview, claude-3-7-sonnet...)' : 'Enter model name / ID (e.g. gemini-3.7-flash, gpt-4.5-preview...)'}
                    className="w-full px-3 py-2 bg-slate-950 border border-teal-500 rounded-lg text-xs text-slate-100 font-mono focus:outline-none ring-1 ring-teal-500/30"
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
                    <span className="text-[10px] text-slate-500 mr-1">{language === 'id' ? 'Contoh cepat:' : 'Quick suggestions:'}</span>
                    {[
                      'gemini-3.7-flash',
                      'gemini-3.1-pro',
                      'gemini-3.5-flash-lite',
                      'gpt-4.5-preview',
                      'o3-mini',
                      'claude-3-7-sonnet-20250219',
                      'deepseek-reasoner',
                      'grok-4.6',
                      'llama-3.3-70b-versatile',
                      'qwen-3-32b'
                    ].map(chip => (
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 focus:outline-none font-mono"
                >
                  {fetchedModelsList.length > 0 ? (
                    fetchedModelsList.map(m => (
                      <option key={m} value={m}>
                        {m} ({language === 'id' ? 'Model Server Aktif' : 'Active Server Model'})
                      </option>
                    ))
                  ) : (
                    (currentPreset.models || []).map(m => (
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
                  const activeModelObj = currentPreset.models.find(m => m.id === settings.model);
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
            <div className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
              testResult.success 
                ? 'bg-teal-950/80 border-teal-500 text-teal-200' 
                : 'bg-red-950/80 border-red-500 text-red-200'
            }`}>
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
      </div>
    </div>
  );
};

export default AISettingsModal;
