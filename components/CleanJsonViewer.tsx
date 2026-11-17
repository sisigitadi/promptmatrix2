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
  isLightTheme = false,
}) => {
  const { t, language } = useLanguage();

  // Split JSON into individual lines for clean line-by-line rendering & highlighting
  const lines = useMemo(() => {
    return jsonString.split('\n');
  }, [jsonString]);

  // Syntax highlighting line tokenizer (WCAG AA >= 4.5:1 for both Light and Dark themes)
  const renderHighlightedLine = (line: string, index: number) => {
    const trimmed = line.trim();
    if (
      trimmed === '{' ||
      trimmed === '}' ||
      trimmed === '},' ||
      trimmed === '[' ||
      trimmed === ']' ||
      trimmed === '],'
    ) {
      return (
        <span key={index} className={isLightTheme ? 'text-slate-600 font-mono' : 'text-slate-400 font-mono'}>
          {line}
        </span>
      );
    }

    // Line with key-value pair: "key": value
    const match = line.match(/^(\s*)("([^"]+)")(\s*:\s*)([\s\S]*)$/);
    if (match) {
      const indent = match[1];
      const keyToken = match[2];
      const colonToken = match[4];
      const rawVal = match[5];

      let formattedVal: React.ReactNode = rawVal;
      const valTrimmed = rawVal.trim();

      if (valTrimmed.startsWith('"')) {
        formattedVal = (
          <span className={isLightTheme ? 'text-emerald-800 font-mono' : 'text-emerald-300 font-mono'}>
            {rawVal}
          </span>
        );
      } else if (
        valTrimmed === 'true' ||
        valTrimmed === 'false' ||
        valTrimmed === 'true,' ||
        valTrimmed === 'false,'
      ) {
        formattedVal = (
          <span
            className={
              isLightTheme
                ? 'text-purple-700 font-semibold font-mono'
                : 'text-purple-400 font-semibold font-mono'
            }
          >
            {rawVal}
          </span>
        );
      } else if (valTrimmed === 'null' || valTrimmed === 'null,') {
        formattedVal = (
          <span className={isLightTheme ? 'text-slate-600 italic font-mono' : 'text-slate-400 italic font-mono'}>
            {rawVal}
          </span>
        );
      } else if (/^-?\d+(\.\d+)?(e[+-]?\d+)?,?$/i.test(valTrimmed)) {
        formattedVal = (
          <span className={isLightTheme ? 'text-amber-800 font-mono' : 'text-amber-300 font-mono'}>
            {rawVal}
          </span>
        );
      } else {
        formattedVal = (
          <span className={isLightTheme ? 'text-slate-800 font-mono' : 'text-slate-300 font-mono'}>
            {rawVal}
          </span>
        );
      }

      return (
        <span key={index}>
          <span className="font-mono">{indent}</span>
          <span
            className={
              isLightTheme ? 'text-cyan-800 font-semibold font-mono' : 'text-cyan-400 font-semibold font-mono'
            }
          >
            {keyToken}
          </span>
          <span className={isLightTheme ? 'text-slate-600 font-mono' : 'text-slate-400 font-mono'}>
            {colonToken}
          </span>
          {formattedVal}
        </span>
      );
    }

    // Line with standalone string or array item
    const arrayStringMatch = line.match(/^(\s*)(".*?")(,?)$/);
    if (arrayStringMatch) {
      const indent = arrayStringMatch[1];
      const strVal = arrayStringMatch[2];
      const comma = arrayStringMatch[3];
      return (
        <span key={index}>
          <span className="font-mono">{indent}</span>
          <span className={isLightTheme ? 'text-emerald-800 font-mono' : 'text-emerald-300 font-mono'}>
            {strVal}
          </span>
          {comma && (
            <span className={isLightTheme ? 'text-slate-600 font-mono' : 'text-slate-400 font-mono'}>
              {comma}
            </span>
          )}
        </span>
      );
    }

    // Fallback normal line
    return (
      <span key={index} className={isLightTheme ? 'text-slate-800 font-mono' : 'text-slate-200 font-mono'}>
        {line}
      </span>
    );
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isLightTheme
          ? 'bg-slate-50 border-slate-300 text-slate-900 shadow-sm'
          : 'bg-[#070b12] border-slate-800/90 text-slate-100 shadow-inner'
      }`}
    >
      {/* Top Action & Sub-format Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-b text-xs ${
          isLightTheme
            ? 'bg-slate-100 border-slate-300 text-slate-800'
            : 'bg-slate-950/80 border-slate-800/80 text-slate-200'
        }`}
      >
        {/* Left: Sub-format selector pills */}
        <div
          className={`flex flex-wrap items-center gap-1 border rounded-xl p-0.5 font-sans ${
            isLightTheme
              ? 'bg-white border-slate-300'
              : 'bg-slate-900/90 border-slate-800/90'
          }`}
        >
          <button
            type="button"
            onClick={() => onFormatChange('full')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              activeFormat === 'full'
                ? isLightTheme
                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                  : 'bg-emerald-600/90 text-white font-semibold shadow-xs'
                : isLightTheme
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  : 'text-slate-300 hover:text-white'
            }`}
            title={
              language === 'id'
                ? 'Objek JSON lengkap dengan persona, parameter, dan messages'
                : 'Complete JSON object with persona, parameters, and messages'
            }
          >
            {t('preview_json_full')}
          </button>
          <button
            type="button"
            onClick={() => onFormatChange('messages')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              activeFormat === 'messages'
                ? isLightTheme
                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                  : 'bg-emerald-600/90 text-white font-semibold shadow-xs'
                : isLightTheme
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  : 'text-slate-300 hover:text-white'
            }`}
            title={
              language === 'id'
                ? 'Format array messages kompatibel OpenAI, Anthropic, & Gemini API'
                : 'Messages array format compatible with OpenAI, Anthropic, & Gemini API'
            }
          >
            {t('preview_json_messages')}
          </button>
          <button
            type="button"
            onClick={() => onFormatChange('prompt_only')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              activeFormat === 'prompt_only'
                ? isLightTheme
                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                  : 'bg-emerald-600/90 text-white font-semibold shadow-xs'
                : isLightTheme
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  : 'text-slate-300 hover:text-white'
            }`}
            title={
              language === 'id'
                ? 'Objek prompt string aman yang disanitasi'
                : 'Safe sanitized prompt string object'
            }
          >
            {t('preview_json_prompt_only')}
          </button>
        </div>

        {/* Right: Status badge & Copy JSON Button */}
        <div className="flex items-center gap-2">
          {/* Zero Decode Error Badge */}
          <div
            className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg border font-mono text-[10px] font-semibold ${
              isLightTheme
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
            }`}
          >
            <svg
              className="w-3 h-3 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{t('preview_json_badge')}</span>
          </div>

          {/* Quick Copy Button */}
          <button
            type="button"
            onClick={onCopy}
            className={`min-h-[32px] px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isCopied
                ? isLightTheme
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                : isLightTheme
                  ? 'bg-white hover:bg-slate-200 text-slate-900 border border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
            }`}
            title={t('copy_json_btn')}
          >
            {isCopied ? (
              <>
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('copied_btn')}</span>
              </>
            ) : (
              <>
                <svg
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isLightTheme ? 'text-cyan-700' : 'text-cyan-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>{t('copy_json_btn')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Container with Line Numbers */}
      <div
        className={`p-3 sm:p-4 min-h-[220px] max-h-[460px] overflow-auto font-mono text-xs sm:text-[12.5px] leading-relaxed ${
          isLightTheme
            ? 'bg-slate-50 text-slate-900 selection:bg-cyan-200 selection:text-cyan-950'
            : 'bg-[#070b12] text-slate-200 selection:bg-cyan-900/60'
        }`}
      >
        <div className="inline-block min-w-full">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`table-row ${
                isLightTheme ? 'hover:bg-slate-200/60' : 'hover:bg-slate-900/40'
              }`}
            >
              <span
                className={`table-cell select-none pr-3 text-right font-mono text-[11px] w-8 ${
                  isLightTheme ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
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
      <div
        className={`px-3.5 py-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
          isLightTheme
            ? 'bg-slate-100 border-slate-300 text-slate-700'
            : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
        }`}
      >
        <span className="truncate">{t('json_decode_clean_info')}</span>
        <span className="shrink-0 ml-2">{lines.length} lines • RFC 8259</span>
      </div>
    </div>
  );
};
