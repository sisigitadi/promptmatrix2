export type Language = 'en' | 'id';

export type TranslationFunction = (...args: any[]) => string;

// Defines the structure for translations within a single language.
export interface Translations {
  [key: string]: string | string[] | TranslationFunction;
}

export type TranslationKey = string;

export interface TranslationSet {
  en: Translations;
  id: Translations;
}

// Re-export core framework types from data/frameworks for unified typing
export type {
  Framework,
  FrameworkComponent,
  PromptFrameworksType,
  DynamicSubcomponents,
  KomponenPromptType
} from './data/frameworks';

export interface SavedPrompt {
  id: number;
  timestamp: number;
  name: string;
  frameworkId: string | null; 
  category: string;
  promptComponents: any[];
  interactiveFormValues: Record<string, string | string[]>; 
  otherInputValues: Record<string, string>; 
  userDefinedInteraction: string;
  generatedPrompt: string; 
  promptToCopy: string; 
  language: Language; 
  selectedFrameworkName: string; 
  notes?: string; 
}

export interface WebResearchDataSource {
  title: string;
  uri: string;
}