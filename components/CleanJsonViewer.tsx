import React, { useMemo } from 'react';
import { JsonFormatType } from '../services/jsonPromptService';
import { useLanguage } from '../contexts/LanguageContext';

interface CleanJsonViewerProps {
  jsonString: string;
  activeFormat: JsonFormatType;
  onFormatChange: (format: JsonFormatType) => void;
  onCopy: () => void;
  isCopied: boolean;
  isLightTheme?: boolean;
}

export const CleanJsonViewer: React.FC<CleanJsonViewerProps> = ({
  jsonString,
  activeFormat,
  onFormatChange,
  onCopy,
  isCopied,
  isLightTheme = false
}) => {
  const { t, language } = useLanguage();

  // Split JSON into individual lines for clean line-by-line rendering & highlighting
  const lines = useMemo(() => {
    return jsonString.split('\n');
  }, [jsonString]);

  // Syntax highlighting line tokenizer
  const renderHighlightedLine = (line: string, index: number) => {
    // 1. Line is just a brace, bracket, or comma
    const trimmed = line.trim();
    if (trimmed === '{' || trimmed === '}' || trimmed === '},' || trimmed === '[' || trimmed === ']' || trimmed === '],') {
      return (
        <span key={index} className="text-slate-400 font-mono">
          {line}
        </span>
      );
    }

    // 2. Line with key-value pair: "key": value
    const match = line.match(/^(\s*)("([^"]+)")(\s*:\s*)([\s\S]*)$/);
    if (match) {
      const indent = match[1];
      const keyToken = match[2];
      const colonToken = match[4];
      const rawVal = match[5];

      // Format value token
      let formattedVal: React.ReactNode = rawVal;
      const valTrimmed = rawVal.trim();

      if (valTrimmed.startsWith('"')) {
        // String value
        formattedVal = <span className="text-emerald-300 font-mono">{rawVal}</span>;
      } else if (valTrimmed === 'true' || valTrimmed === 'false' || valTrimmed === 'true,' || valTrimmed === 'false,') {
        // Boolean
        formattedVal = <span className="text-purple-400 font-semibold font-mono">{rawVal}</span>;
      } else if (valTrimmed === 'null' || valTrimmed === 'null,') {
        // Null
        formattedVal = <span className="text-slate-500 italic font-mono">{rawVal}</span>;
      } else if (/^-?\d+(\.\d+)?(e[+-]?\d+)?,?$/i.test(valTrimmed)) {
        // Number
        formattedVal = <span className="text-amber-300 font-mono">{rawVal}</span>;
      } else {
        // Brackets / array starts
        formattedVal = <span className="text-slate-300 font-mono">{rawVal}</span>;
      }

      return (
        <span key={index}>
          <span className="font-mono">{indent}</span>
          <span className="text-cyan-400 font-semibold font-mono">{keyToken}</span>
          <span className="text-slate-500 font-mono">{colonToken}</span>
          {formattedVal}
        </span>
      );
    }

    // 3. Line with standalone string or array item
    const arrayStringMatch = line.match(/^(\s*)(".*?")(,?)$/);
    if (arrayStringMatch) {
      const indent = arrayStringMatch[1];
      const strVal = arrayStringMatch[2];
      const comma = arrayStringMatch[3];
      return (
        <span key={index}>
          <span className="font-mono">{indent}</span>
          <span className="text-emerald-300 font-mono">{strVal}</span>
          {comma && <span className="text-slate-500 font-mono">{comma}</span>}
        </span>
      );
    }

    // Fallback normal line
    return (
      <span key={index} className="text-slate-300 font-mono">
        {line}
      </span>
    );
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
      isLightTheme 
        ? 'bg-slate-50 border-slate-200 shadow-sm' 
        : 'bg-[#070b12] border-slate-800/90 shadow-inner'
    }`}>
      {/* Top Action & Sub-format Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 text-xs">
        {/* Left: Sub-format selector pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800/90 rounded-xl p-0.5 font-sans">
          <button
            type="button"
            onClick={() => onFormatChange('full')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeFormat === 'full'
                ? 'bg-emerald-600/90 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={language === 'id' ? 'Objek JSON lengkap dengan persona, parameter, dan messages' : 'Complete JSON object with persona, parameters, and messages'}
          >
            {t('preview_json_full')}
          </button>
          <button
            type="button"
            onClick={() => onFormatChange('messages')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeFormat === 'messages'
                ? 'bg-emerald-600/90 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={language === 'id' ? 'Format array messages kompatibel OpenAI, Anthropic, & Gemini API' : 'Messages array format compatible with OpenAI, Anthropic, & Gemini API'}
          >
            {t('preview_json_messages')}
          </button>
          <button
            type="button"
            onClick={() => onFormatChange('prompt_only')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeFormat === 'prompt_only'
                ? 'bg-emerald-600/90 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={language === 'id' ? 'Objek prompt string aman yang disanitasi' : 'Safe sanitized prompt string object'}
          >
            {t('preview_json_prompt_only')}
          </button>
        </div>

        {/* Right: Status badge & Copy JSON Button */}
        <div className="flex items-center gap-2">
          {/* Zero Decode Error Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[10px]">
            <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{t('preview_json_badge')}</span>
          </div>

          {/* Quick Copy Button */}
          <button
            type="button"
            onClick={onCopy}
            className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isCopied
                ? 'bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-750'
            }`}
            title={t('copy_json_btn')}
          >
            {isCopied ? (
              <>
                <svg className="w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('copied_btn')}</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>{t('copy_json_btn')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Container with Line Numbers */}
      <div className="p-3 sm:p-4 min-h-[220px] max-h-[460px] overflow-auto selection:bg-cyan-900/60 font-mono text-xs sm:text-[12.5px] leading-relaxed">
        <div className="inline-block min-w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row hover:bg-slate-900/30">
              <span className="table-cell select-none pr-3 text-right text-slate-600 font-mono text-[11px] w-8">
                {idx + 1}
              </span>
              <span className="table-cell whitespace-pre font-mono">
                {renderHighlightedLine(line, idx)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="px-3.5 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="truncate">
          {t('json_decode_clean_info')}
        </span>
        <span className="shrink-0 ml-2">
          {lines.length} lines • RFC 8259
        </span>
      </div>
    </div>
  );
};
