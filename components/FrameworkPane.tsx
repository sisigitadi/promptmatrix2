import React from 'react';
import { Framework, FrameworkComponent } from '../data/frameworks';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  translateCategoryName, 
  translateSubcategoryName, 
  getLocalizedFramework, 
  translateComponentLabel, 
  translateOption,
  translatePlaceholder,
  translateInfo
} from '../services/localizationService';

import { getRealisticSampleForComponent } from '../services/sampleDataService';

interface FrameworkPaneProps {
  categoryName: string;
  subcategoryName: string;
  frameworkName: string;
  framework: Framework;
  formValues: Record<string, any>;
  customOtherValues: Record<string, string>;
  onInputChange: (name: string, value: any) => void;
  onCustomOtherChange: (name: string, value: string) => void;
  onClearFields: () => void;
  onAiSuggest: (name: string, label: string) => void;
  loadingFieldId: string | null;
  onBackToGallery?: () => void;
  showAIFeatures?: boolean;
}

const FrameworkPane: React.FC<FrameworkPaneProps> = ({
  categoryName,
  subcategoryName,
  frameworkName,
  framework,
  formValues,
  customOtherValues,
  onInputChange,
  onCustomOtherChange,
  onClearFields,
  onAiSuggest,
  loadingFieldId,
  onBackToGallery,
  showAIFeatures = false,
}) => {
  const { t, language } = useLanguage();

  const localizedFw = getLocalizedFramework(frameworkName, framework, language);

  // Components from standard components or SOP komponen_prompt
  let allComponents: FrameworkComponent[] = localizedFw?.components || [];

  // Check dynamic subcomponents based on current trigger value
  let dynamicExtraComponents: FrameworkComponent[] = [];
  if (framework?.dynamicSubcomponents) {
    const triggerField = framework.dynamicSubcomponents.trigger;
    const triggerValue = formValues[triggerField];
    if (triggerValue && framework.dynamicSubcomponents.options[triggerValue]) {
      dynamicExtraComponents = framework.dynamicSubcomponents.options[triggerValue].map(c => ({
        ...c,
        label: translateComponentLabel(c.label || c.name, language),
        placeholder: translatePlaceholder(c.placeholder || '', language),
        info: translateInfo(c.info || '', language),
        options: c.options ? c.options.map(opt => translateOption(opt, language)) : undefined
      }));
    }
  }

  const combinedComponents = [...allComponents, ...dynamicExtraComponents];

  // 1-Click Fill Sample Handler for Beginners (Real-world clean samples in active language)
  const handleFillSample = () => {
    combinedComponents.forEach(comp => {
      const sampleVal = getRealisticSampleForComponent(comp, localizedFw.name, language);
      if (sampleVal !== undefined && sampleVal !== null) {
        onInputChange(comp.name, sampleVal);
      }
    });
  };

  const renderComponentInput = (comp: FrameworkComponent, index: number) => {
    const value = formValues[comp.name] ?? '';
    const isAiLoading = loadingFieldId === comp.name;
    const isOtherSelected = value === 'Lainnya...' || value === 'Other...';
    const displayLabel = translateComponentLabel(comp.label || comp.name, language);
    const displayInfo = translateInfo(comp.info || '', language);
    const displayPlaceholder = translatePlaceholder(comp.placeholder || '', language);

    return (
      <div 
        key={comp.name} 
        className="space-y-2 p-4 bg-[#090d16]/70 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl transition-all shadow-sm"
      >
        {/* Label & AI Helper */}
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={comp.name} className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-sans">
            <span className="text-[11px] font-mono text-slate-500 w-4">{index + 1}.</span>
            <span>{displayLabel}</span>
            {comp.optional && <span className="text-[10px] text-slate-500 font-normal">({t('optional')})</span>}
          </label>

          {showAIFeatures && (
            <button
              type="button"
              onClick={() => onAiSuggest(comp.name, displayLabel)}
              disabled={isAiLoading}
              className={`h-6 px-2.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                isAiLoading
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700 animate-pulse cursor-wait'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700/40'
              }`}
              title={language === 'id' ? 'Bantu ide otomatis dengan AI' : 'Suggest ideas with AI'}
            >
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline">{isAiLoading ? t('ai_suggesting') : t('ai_suggest_btn')}</span>
            </button>
          )}
        </div>

        {/* Input Field Control by Type */}
        {comp.type === 'select' ? (
          <div className="space-y-2">
            <select
              id={comp.name}
              value={value}
              onChange={(e) => onInputChange(comp.name, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
            >
              <option value="">-- {language === 'id' ? `Pilih ${displayLabel}` : `Select ${displayLabel}`} --</option>
              {(comp.options || []).map((opt) => (
                <option key={opt} value={opt}>
                  {translateOption(opt, language)}
                </option>
              ))}
            </select>

            {/* Dynamic Custom Input when "Lainnya..." / "Other..." is selected */}
            {isOtherSelected && (
              <div className="animate-fade-in pl-3 border-l-2 border-emerald-500 space-y-1.5 mt-2">
                <label className="text-[11px] text-emerald-300 font-medium font-sans">
                  {t('custom_other_label')} {displayLabel}:
                </label>
                <input
                  type="text"
                  value={customOtherValues[comp.name] || ''}
                  onChange={(e) => onCustomOtherChange(comp.name, e.target.value)}
                  placeholder={t('custom_other_placeholder')}
                  className="w-full px-3 py-2 bg-slate-950 border border-emerald-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
                  autoFocus
                />
              </div>
            )}
          </div>
        ) : comp.type === 'textarea' ? (
          <textarea
            id={comp.name}
            value={value}
            onChange={(e) => onInputChange(comp.name, e.target.value)}
            placeholder={displayPlaceholder || ''}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-y leading-relaxed font-sans transition-all"
          />
        ) : comp.type === 'slider' || comp.type === 'number' ? (
          <div className="flex items-center gap-3">
            <input
              type={comp.type === 'slider' ? 'range' : 'number'}
              id={comp.name}
              value={value || comp.min || 0}
              min={comp.min ?? 0}
              max={comp.max ?? 100}
              step={comp.step ?? 1}
              onChange={(e) => onInputChange(comp.name, Number(e.target.value))}
              className="flex-1 accent-emerald-500"
            />
            <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400 min-w-12 text-center">
              {value || comp.min || 0} {comp.unit || ''}
            </span>
          </div>
        ) : (
          <input
            type="text"
            id={comp.name}
            value={value}
            onChange={(e) => onInputChange(comp.name, e.target.value)}
            placeholder={displayPlaceholder || ''}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-sans transition-all"
          />
        )}

        {/* Subtle Guidance Info Helper underneath */}
        {displayInfo && (
          <p className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-0.5 font-sans leading-relaxed">
            <span className="text-slate-500">↳</span>
            <span>{displayInfo}</span>
          </p>
        )}
      </div>
    );
  };

  const hasAnyValue = Object.values(formValues).some(v => v !== '' && v !== null && v !== undefined);
  const localizedCategoryName = translateCategoryName(categoryName, language);
  const localizedSubcatName = translateSubcategoryName(subcategoryName, language);

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5 sm:space-y-6">
      {/* Header Info with Breadcrumbs & Action Buttons */}
      <div className="border-b border-slate-800/80 pb-4 sm:pb-5 space-y-3">
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            {onBackToGallery && (
              <button
                type="button"
                onClick={onBackToGallery}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors flex items-center gap-1 font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{language === 'id' ? 'Galeri' : 'Gallery'}</span>
              </button>
            )}
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px] sm:text-[11px] whitespace-nowrap">
              {localizedCategoryName}
            </span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300 font-sans font-medium text-[11px] sm:text-xs">
              {localizedSubcatName}
            </span>
          </div>


          <div className="flex items-center gap-2">
            {/* 1-Click Fill Sample Button */}
            {combinedComponents.length > 0 && (
              <button
                type="button"
                onClick={handleFillSample}
                className="h-8 px-3 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                title={language === 'id' ? 'Otomatis isi contoh data nyata' : 'Auto-fill realistic sample values'}
              >
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>{language === 'id' ? 'Isi Contoh Otomatis' : 'Fill Sample'}</span>
              </button>
            )}

            {/* Clear Button */}
            {hasAnyValue && (
              <button
                onClick={onClearFields}
                className="h-8 px-3 rounded-xl text-xs text-slate-400 hover:text-red-300 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/40 transition-all"
              >
                {t('clear_fields_btn')}
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight font-sans">
            {localizedFw.name}
          </h2>
          {localizedFw.description && (
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans max-w-2xl">
              {localizedFw.description}
            </p>
          )}
        </div>
      </div>

      {/* AI Persona Banner if available */}
      {localizedFw.aiLogic && (
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block font-sans">
              {language === 'id' ? 'Instruksi Logika AI' : 'AI System Logic'}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {localizedFw.aiLogic}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Form Components List */}
      <div className="space-y-3.5">
        {combinedComponents.length > 0 ? (
          combinedComponents.map(renderComponentInput)
        ) : (
          <div className="text-center py-16 text-slate-400 text-xs">
            {t('ready_direct_use')}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameworkPane;


