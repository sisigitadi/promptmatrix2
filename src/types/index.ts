export interface FrameworkComponent {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "textarea"
    | "color"
    | "date"
    | "datetime"
    | "slider"
    | "boolean"
    | "code"
    | "multiselect"
    | "image"
    | "file"
    | "negative_prompt";
  description?: string;
  placeholder?: string;
  options?: (string | { label: string; value: string })[];
  info?: string;
  min?: number;
  max?: number;
  step?: number;
  optional?: boolean;
  unit?: string;
  default?: any;
  validation?: {
    min_length?: number;
    max_length?: number;
    regex?: string;
    min_value?: number;
    max_value?: number;
    min_date?: string;
    max_date?: string;
  };
}

export type DynamicSubcomponents = {
  trigger: string;
  options: {
    [key: string]: FrameworkComponent[] | { components: FrameworkComponent[] };
  };
};

export type KomponenPromptType = {
  PERAN?: string;
  KONTEKS?: string;
  TUGAS?: string;
  "FORMAT OUTPUT"?: string;
  [key: string]: string | undefined;
};

export interface Framework {
  id_kerangka?: string;
  nama_kerangka?: string;
  version?: string;
  kategori?: string[];
  description: string;
  perspektif_user?: string;
  ai_logic_description?: string;
  toolType?:
    | "text"
    | "code"
    | "music-composition"
    | "music-generation"
    | "audio-generation"
    | "image-generation"
    | "image-editing"
    | "planning"
    | "video";
  components?: FrameworkComponent[];
  dynamicSubcomponents?: DynamicSubcomponents | DynamicSubcomponents[];
  komponen_prompt?: KomponenPromptType;
  konteks_tambahan_instruksi_khusus?: string;
  contoh_kalimat?: string;
  output?: "natural_language_prompt" | "json_prompt";
  crossValidationRules?: any[]; // Keep any for now as complex rule structure
  examples?: { input: string; output: string }[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
  builder?: "visual";
}

export type PromptFrameworksType = {
  [category: string]: {
    [subcategory: string]: {
      [framework: string]: Framework;
    };
  };
};

export interface FormData {
  [key: string]: any;
}

export interface CustomInputs {
  [key: string]: string;
}

export interface PromptData {
  category: string;
  subcategory: string;
  frameworkName: string;
  formData: FormData;
  customInputs: CustomInputs;
  naturalLanguageOutput: string | any[]; // Part[] from Gemini
  jsonOutput: string;
  versions?: { timestamp: number; formData: FormData }[];
  timestamp?: number;
  id?: string;
}

export interface SavedPrompt extends PromptData {
  id: string;
  timestamp: number;
  isFavorite?: boolean;
}

export interface VersionData {
  timestamp: number;
  formData: FormData;
}

export interface PromptBlock {
  id: string;
  type: "text" | "image";
  content: string | null;
}
