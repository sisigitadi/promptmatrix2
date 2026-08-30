import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  disabled?: boolean;
  tooltip?: string;
  onAiSuggest?: (id: string, label: string) => void;
  isAiLoading?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'textarea',
  disabled = false,
  tooltip,
  onAiSuggest,
  isAiLoading = false
}) => {
  const { language } = useLanguage();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(id, e.target.value);
  };

  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <span>{label}</span>
          {tooltip && (
            <span className="text-[11px] text-slate-400 hover:text-teal-300 cursor-help" title={tooltip}>
              ℹ️
            </span>
          )}
        </label>

        {onAiSuggest && (
          <button
            type="button"
            onClick={() => onAiSuggest(id, label)}
            disabled={disabled || isAiLoading}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
              isAiLoading
                ? 'bg-purple-900/60 text-purple-300 border border-purple-700 animate-pulse cursor-wait'
                : 'bg-slate-800 hover:bg-teal-950 text-slate-400 hover:text-teal-300 border border-slate-700 hover:border-teal-600'
            }`}
            title={language === 'id' ? 'Bantu isi rekomendasi cerdas dengan AI' : 'Auto-generate suggestion with AI'}
          >
            <span>{isAiLoading ? '⏳' : '✨'}</span>
            <span>{isAiLoading ? (language === 'id' ? 'Menulis...' : 'Generating...') : (language === 'id' ? 'Bantu Ide' : 'AI Suggest')}</span>
          </button>
        )}
      </div>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || isAiLoading}
          rows={3}
          className={`w-full px-3 py-2 bg-slate-900/80 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all resize-y font-sans leading-relaxed ${
            disabled || isAiLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
      ) : (
        <input
          type="text"
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || isAiLoading}
          className={`w-full px-3 py-2 bg-slate-900/80 border border-slate-700 focus:border-teal-500 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all font-sans ${
            disabled || isAiLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
      )}
    </div>
  );
};

export default InputField;