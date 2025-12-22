import { Part } from "@google/generative-ai";
import { Framework, FrameworkComponent } from "../data/frameworks"; // Keep FrameworkComponent for type guards
import { SPECIAL_FRAMEWORKS } from "../config";
import { FormData, CustomInputs, PromptBlock } from "../types";

// Helper to clean verbose descriptions from values (e.g. "Level 1 (Desc)" -> "Level 1")
const cleanVerboseValue = (val: string) => {
  if (!val) return "";
  let cleaned = val;

  // 1. Remove "Level X: " prefix (Flexible spacing)
  if (cleaned.match(/^(Level|Opsi|Tahap) \d+\s*:/i)) {
    cleaned = cleaned.replace(/^(Level|Opsi|Tahap) \d+\s*:\s*/i, "");
  }

  // 2. Remove description after Dash (Handle hyphen, en-dash, em-dash, with surrounding spaces)
  cleaned = cleaned.split(/\s+[-–—]\s+/)[0];

  // 3. Remove parenthesized description " (...)" (Handle optional space before parenthesis)
  cleaned = cleaned.split(/\s*\(/)[0];

  return cleaned.trim();
};

// Helper: Process Conditional Blocks [...]
const processConditionalBlocks = (
  template: string,
  values: FormData,
  customInputs: CustomInputs,
): string => {
  return template.replace(/\[([^\]]+)\]/g, (match, content) => {
    // Cari semua placeholder {KEY} di dalam konten blok ini
    const placeholders = content.match(/\{([a-zA-Z0-9_]+)\}/g);

    if (!placeholders) {
      // Jika tidak ada placeholder (teks biasa dalam kurung), tampilkan saja (hapus kurung)
      return content;
    }

    // Cek apakah minimal satu placeholder di blok ini memiliki nilai
    let hasValue = false;
    for (const ph of placeholders) {
      const key = ph.replace(/\{|\}/g, "");
      let val = values[key];
      if (val === "Lainnya...") val = customInputs[key];

      // Anggap ada value jika string tidak kosong / array ada isi
      if (
        val &&
        (typeof val !== "string" || val.trim() !== "") &&
        (!Array.isArray(val) || val.length > 0)
      ) {
        hasValue = true;
        break;
      }
    }

    // Jika tidak ada value sama sekali di blok ini, HAPUS blok ini.
    if (!hasValue) {
      return "";
    }

    // Jika ada value, kembalikan kontennya (kurung siku process selesai)
    return content;
  });
};

const replacePlaceholders = (
  template: string,
  values: FormData,
  customInputs: CustomInputs,
) => {
  // 1. Pre-process: Handle Conditional Blocks [...]
  let result = processConditionalBlocks(template, values, customInputs);

  // 2. Replace all placeholders
  for (const key in values) {
    const placeholder = `{${key}}`;
    let value = values[key];

    if (value === "Lainnya...") {
      value = customInputs[key] || "";
    }

    if (typeof value === "string" || typeof value === "number") {
      const cleanVal = cleanVerboseValue(String(value));
      // Replace with cleaned value. If empty/unselected, replace with empty string.
      // This often creates double spaces like "from  to".
      result = result.replace(new RegExp(placeholder, "g"), cleanVal);
    } else if (Array.isArray(value)) {
      const processedValues = value.map((item) => {
        if (item === "Lainnya...") {
          return customInputs[key] || "";
        }
        return cleanVerboseValue(String(item));
      });
      result = result.replace(
        new RegExp(placeholder, "g"),
        processedValues.filter(Boolean).join(", "),
      );
    }
  }

  // 3. Post-processing: Remove Dangling Prepositions
  const prepositions =
    "dari|ke|via|menggunakan|dengan|untuk|tentang|pada|di|pakai|sebagai";
  // Regex: Word boundary + Preposition + Word boundary + Spaces + Lookahead (Space OR Punctuation OR End)
  // \s{2,} captures the "double space" caused by empty replacement.
  const danglingRegex = new RegExp(
    `\\b(${prepositions})\\b\\s+(?=\\s|[.,:;!?\\n]|$)`,
    "gi",
  );

  // Run multiple times to clean chains like "dari dengan ke"
  let prevResult = "";
  while (result !== prevResult) {
    prevResult = result;
    result = result.replace(danglingRegex, "");
  }

  // 4. Cleanup residual double spaces
  result = result.replace(/  +/g, " ").trim();

  // 5. Fix puncuation sticking (e.g. " ." -> ".")
  result = result.replace(/\s+([.,:;!?])/g, "$1");

  // 6. Cleanup duplicate punctuation (caused by conditional blocks or empty inputs)
  // Remove duplicate commas
  result = result.replace(/,\s*,/g, ",");
  // Remove comma before dot (",.") -> "."
  result = result.replace(/,\s*\./g, ".");
  // Remove comma at the start of line (if any logic failed)
  result = result.replace(/^\s*,/, "");

  return result;
};

// This is the primary function for generating the final AI prompt.
export const generatePrompt = (
  framework: Framework,
  params: FormData,
  customInputs: CustomInputs,
): string => {
  // If the modern 'komponen_prompt' structure doesn't exist, fallback to the old generator.
  if (!framework || !framework.komponen_prompt) {
    return generateFinalPrompt(
      framework,
      framework.nama_kerangka || "",
      params,
      customInputs,
    );
  }

  const { PERAN, KONTEKS, TUGAS } = framework.komponen_prompt;

  // Combine static and active dynamic components to get all possible inputs.
  const allComponents: FrameworkComponent[] = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        const optionValue = sub.options[triggerValue];
        if (optionValue) {
          // New super-framework structure: optionValue is { components: [...] }
          if (
            "components" in optionValue &&
            Array.isArray(optionValue.components)
          ) {
            allComponents.push(...optionValue.components);
          }
          // Old structure: optionValue is FrameworkComponent[]
          else if (Array.isArray(optionValue)) {
            allComponents.push(...(optionValue as FrameworkComponent[]));
          }
        }
      }
    }
  });

  // Create a combined object of all input values for placeholder replacement.
  const allValues = { ...params };
  allComponents.forEach((comp) => {
    if (params[comp.name] === "Lainnya...") {
      allValues[comp.name] = customInputs[comp.name] || "";
    }
  });

  // Replace placeholders in each part of the prompt.
  const finalPeran = replacePlaceholders(PERAN || "", allValues, customInputs);
  const finalKonteks = replacePlaceholders(
    KONTEKS || "",
    allValues,
    customInputs,
  );

  // Super-framework logic: Check for nested TUGAS in dynamic subcomponents
  let tugasTemplate = TUGAS || ""; // Default to top-level TUGAS
  if (
    framework.dynamicSubcomponents &&
    !Array.isArray(framework.dynamicSubcomponents)
  ) {
    const trigger = framework.dynamicSubcomponents.trigger;
    const triggerValue = allValues[trigger];
    if (triggerValue) {
      const dynamicOption =
        framework.dynamicSubcomponents.options[triggerValue];
      // Check if dynamicOption is the object structure and has komponen_prompt
      if (
        dynamicOption &&
        !Array.isArray(dynamicOption) &&
        typeof dynamicOption === "object" &&
        "komponen_prompt" in dynamicOption &&
        (dynamicOption as any).komponen_prompt?.TUGAS
      ) {
        tugasTemplate = (dynamicOption as any).komponen_prompt.TUGAS;
      }
    }
  }

  const finalTugas = replacePlaceholders(
    tugasTemplate,
    allValues,
    customInputs,
  );

  // Construct the final prompt string.
  let prompt = "";
  if (finalPeran) prompt += `**Peran:**\n${finalPeran}\n\n`;
  if (finalKonteks) prompt += `**Konteks:**\n${finalKonteks}\n\n`;
  if (finalTugas) prompt += `**Tugas:**\n${finalTugas}\n\n`;

  // Add any extra instructions.
  if (framework.konteks_tambahan_instruksi_khusus) {
    prompt += `**Instruksi Tambahan:**\n${replacePlaceholders(framework.konteks_tambahan_instruksi_khusus, allValues, customInputs)}\n\n`;
  }

  // Handle FORMAT_OUTPUT.
  const formatOutput =
    framework.komponen_prompt?.FORMAT_OUTPUT ||
    framework.komponen_prompt?.["FORMAT OUTPUT"];
  if (formatOutput) {
    prompt += `**Format Output:**\n${replacePlaceholders(formatOutput, allValues, customInputs)}\n`;
  }

  return prompt.trim();
};

// Function for the user-facing preview, showing AI logic and filled inputs in plain text.
export const generateUserPreviewPrompt = (
  framework: Framework,
  params: FormData,
  customInputs: CustomInputs,
): string => {
  if (!framework) {
    return "Pilih kerangka kerja untuk melihat pratinjau.";
  }

  // Pre-calculate active components to check for inputs
  const allComponents: FrameworkComponent[] = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        const optionValue = sub.options[triggerValue];
        if (optionValue) {
          if (
            "components" in optionValue &&
            Array.isArray(optionValue.components)
          ) {
            allComponents.push(...optionValue.components);
          } else if (Array.isArray(optionValue)) {
            allComponents.push(...(optionValue as FrameworkComponent[]));
          }
        }
      }
    }
  });

  // Check if any input has been filled
  let hasInputs = false;
  allComponents.forEach((comp) => {
    const value = params[comp.name];
    if (
      value !== undefined &&
      value !== "" &&
      value !== null &&
      (!Array.isArray(value) || value.length > 0)
    ) {
      hasInputs = true;
    }
  });

  let previewContent = "";

  // 1. Gabungkan PERAN (Persona) - SELALU TAMPIL
  if (framework.komponen_prompt) {
    if (framework.komponen_prompt.PERAN) {
      const processedPersona = replacePlaceholders(
        framework.komponen_prompt.PERAN,
        params,
        customInputs,
      );
      // Hapus bold markdown (**) agar lebih bersih
      previewContent += `${processedPersona.replace(/\*\*/g, "")}\n\n`;
    }

    // 2. KONTEKS - HANYA TAMPIL JIKA ADA INPUT
    if (hasInputs && framework.komponen_prompt.KONTEKS) {
      let processedContext = replacePlaceholders(
        framework.komponen_prompt.KONTEKS,
        params,
        customInputs,
      );

      // Cleanup: Hapus bold kosong dari template jika input kosong
      processedContext = processedContext.replace(/\*\*\s*\*\*/g, "").trim();

      if (processedContext) {
        previewContent += `${processedContext.replace(/\*\*/g, "")}\n\n`;
      }
    }
  } else if (framework.ai_logic_description) {
    // Fallback untuk framework lama
    previewContent += `${framework.ai_logic_description.replace(/\*\*/g, "")}\n\n`;
  }

  // 3. List Input Values sebagai "Detail Spesifikasi" (Hanya yang BELUM masuk narasi)
  const narrativeTemplates = [
    framework.komponen_prompt.PERAN,
    framework.komponen_prompt.KONTEKS,
    framework.komponen_prompt.TUGAS,
    framework.konteks_tambahan_instruksi_khusus,
  ].join(" ");

  let detailSpecsNeeded = false;
  let specContent = `\nBerikut adalah detail spesifikasi tambahan:\n`;

  allComponents.forEach((comp) => {
    // Lewati jika komponen sudah ada di narasi sebagai placeholder {NAMA}
    if (narrativeTemplates.includes(`{${comp.name}}`)) return;

    const value = params[comp.name];
    if (
      value !== undefined &&
      value !== "" &&
      value !== null &&
      (!Array.isArray(value) || value.length > 0)
    ) {
      let displayValue = "";
      if (value === "Lainnya...") {
        displayValue = customInputs[comp.name] || "";
      } else if (Array.isArray(value)) {
        displayValue = value
          .map((item) => {
            if (item === "Lainnya...") return customInputs[comp.name] || "";
            return cleanVerboseValue(String(item));
          })
          .filter(Boolean)
          .join(", ");
      } else {
        displayValue = cleanVerboseValue(String(value));
      }

      if (displayValue) {
        specContent += `- ${comp.label}: ${displayValue}\n`;
        detailSpecsNeeded = true;
      }
    }
  });

  if (detailSpecsNeeded) {
    previewContent += specContent;
  }

  if (!hasInputs) {
    previewContent += "\n(Belum ada input yang diisi)";
  }

  return previewContent.trim();
};

export const generateVisualPreviewPrompt = (blocks: PromptBlock[]): string => {
  if (!blocks || blocks.length === 0) {
    return "Tambahkan blok untuk membangun prompt visual Anda.";
  }

  let previewContent = "Isi Prompt Visual:\n--------------------";

  blocks.forEach((block, index) => {
    if (block.type === "text") {
      previewContent += `[Blok Teks #${index + 1}]:\n${block.content || "(kosong)"}\n\n`;
    } else if (block.type === "image") {
      previewContent += `[Blok Gambar #${index + 1}]:\n(Gambar telah ditambahkan)\n\n`;
    }
  });

  return previewContent.trim();
};

export const generateVisualPromptParts = (blocks: PromptBlock[]): Part[] => {
  if (!blocks) return [];

  return blocks
    .map((block): Part | null => {
      if (block.type === "text" && block.content) {
        return { text: block.content };
      } else if (block.type === "image" && block.content) {
        const match = block.content.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const data = match[2];
          return { inlineData: { mimeType, data } };
        }
      }
      return null;
    })
    .filter((part): part is Part => part !== null);
};

export const generatePlaceholderPrompt = (framework: Framework): string => {
  if (!framework || !framework.komponen_prompt) return "";

  const { PERAN, KONTEKS, TUGAS } = framework.komponen_prompt;
  let prompt = "";

  if (PERAN) prompt += `**Peran:**\n${PERAN}\n\n`;
  if (KONTEKS) prompt += `**Konteks:**\n${KONTEKS}\n\n`;
  if (TUGAS) prompt += `**Tugas:**\n${TUGAS}\n\n`;

  if (framework.konteks_tambahan_instruksi_khusus) {
    prompt += `**Instruksi Tambahan:**\n${framework.konteks_tambahan_instruksi_khusus}\n\n`;
  }

  const formatOutput =
    framework.komponen_prompt?.FORMAT_OUTPUT ||
    framework.komponen_prompt?.["FORMAT OUTPUT"];
  if (formatOutput) {
    prompt += `**Format Output:**\n${formatOutput}\n`;
  }

  return prompt.trim();
};

export const generateFileName = (
  baseName: string,
  extension: string,
): string => {
  const sanitizedBaseName = baseName
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/__+/g, "_");
  const timestamp = new Date()
    .toISOString()
    .replace(/[:\-.]/g, "")
    .slice(0, 15);
  return `${sanitizedBaseName}_${timestamp}.${extension}`;
};

// Fallback for older frameworks
export const generateNaturalLanguagePrompt = (
  framework: Framework,
  params: FormData,
  customInputs: CustomInputs,
) => {
  let promptContent = "";

  if (framework.ai_logic_description) {
    promptContent += `${framework.ai_logic_description}\n\n`;
  }

  const allComponents: FrameworkComponent[] = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        const optionValue = sub.options[triggerValue];
        if (Array.isArray(optionValue)) {
          allComponents.push(...(optionValue as FrameworkComponent[]));
        } else if ("components" in optionValue) {
          allComponents.push(...optionValue.components);
        }
      }
    }
  });

  let maxLabelLength = 0;
  allComponents.forEach((comp) => {
    const value = params[comp.name];
    const isOptional = comp.optional || false;
    if (value || !isOptional) {
      const displayValue =
        value === "Lainnya..." ? customInputs[comp.name] || "" : value;
      if (displayValue || !isOptional) {
        if (comp.label.length > maxLabelLength) {
          maxLabelLength = comp.label.length;
        }
      }
    }
  });

  allComponents.forEach((comp) => {
    const value = params[comp.name];
    const isOptional = comp.optional || false;
    if (value || !isOptional) {
      const displayValue =
        value === "Lainnya..." ? customInputs[comp.name] || "" : value;
      if (displayValue || !isOptional) {
        const paddedLabel = comp.label.padEnd(maxLabelLength, " ");
        promptContent += `${paddedLabel}: ${displayValue || "[Tidak diisi]"}\n`;
      }
    }
  });

  return promptContent.trim();
};

export const generateJsonPrompt = (
  framework: Framework,
  frameworkName: string,
  params: FormData,
  customInputs: CustomInputs,
): string => {
  const allComponents: FrameworkComponent[] = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        const optionValue = sub.options[triggerValue];
        if (optionValue) {
          // New super-framework structure
          if (
            "components" in optionValue &&
            Array.isArray(optionValue.components)
          ) {
            allComponents.push(...optionValue.components);
          }
          // Old structure
          else if (Array.isArray(optionValue)) {
            allComponents.push(...(optionValue as FrameworkComponent[]));
          }
        }
      }
    }
  });

  const allValues = { ...params };
  allComponents.forEach((comp) => {
    if (params[comp.name] === "Lainnya...") {
      allValues[comp.name] = customInputs[comp.name] || "";
    }
  });

  const jsonOutput: Record<string, unknown> = {
    id_kerangka: framework.id_kerangka || "",
    nama_kerangka: framework.nama_kerangka || frameworkName,
    perspektif_user: framework.perspektif_user || framework.description || "",
    ai_logic_description: framework.ai_logic_description || "",
    komponen_prompt: {
      PERAN: replacePlaceholders(
        framework.komponen_prompt?.PERAN || "",
        allValues,
        customInputs,
      ),
      KONTEKS: replacePlaceholders(
        framework.komponen_prompt?.KONTEKS || "",
        allValues,
        customInputs,
      ),
      TUGAS: replacePlaceholders(
        framework.komponen_prompt?.TUGAS || "",
        allValues,
        customInputs,
      ),
      FORMAT_OUTPUT: replacePlaceholders(
        framework.komponen_prompt?.FORMAT_OUTPUT ||
          framework.komponen_prompt?.["FORMAT OUTPUT"] ||
          "",
        allValues,
        customInputs,
      ),
    },
    konteks_tambahan_instruksi_khusus: replacePlaceholders(
      framework.konteks_tambahan_instruksi_khusus || "",
      allValues,
      customInputs,
    ),
    contoh_kalimat: framework.contoh_kalimat || "",
    output: framework.output || "natural_language_prompt or json_prompt",
    input_komponen: allComponents.reduce(
      (acc, comp) => {
        let value = params[comp.name];
        if (value === "Lainnya...") {
          value = customInputs[comp.name] || "";
        } else if (Array.isArray(value)) {
          value = value.map((item) =>
            item === "Lainnya..." ? customInputs[comp.name] || "" : item,
          );
        }
        // Include all components, even if their value is empty, for a complete schema representation
        acc[comp.name] = value !== undefined && value !== null ? value : "";
        return acc;
      },
      {} as Record<string, any>,
    ),
  };

  return JSON.stringify(jsonOutput, null, 2);
};

export const generateFinalPrompt = (
  framework: Framework,
  frameworkName: string,
  params: FormData,
  customInputs: CustomInputs,
): string => {
  if (frameworkName === SPECIAL_FRAMEWORKS.MIDJOURNEY) {
    const subject = params.subject || "";
    const style = params.style || "";
    if (!framework.components) return "";
    const parameters = framework.components
      .map((comp) => {
        const value = params[comp.name];
        if (!value || comp.name === "subject" || comp.name === "style")
          return null;
        const displayValue =
          value === "Lainnya..." ? customInputs[comp.name] || "" : value;
        if (!displayValue) return null;
        const match = comp.label.match(/--([\w\d.-]+)/);
        if (match && match[1]) {
          return `--${match[1]} ${displayValue}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(" ");
    return `${subject} ${style} ${parameters}`.replace(/\s+/g, " ").trim();
  }
  if (frameworkName === SPECIAL_FRAMEWORKS.STABLE_DIFFUSION) {
    const positive = params.positivePrompt || "";
    const negative = params.negativePrompt || "";
    const techParams = params.technicalParameters || "";
    let output = `Positive Prompt:\n${positive}\n\n`;
    if (negative) {
      output += `Negative Prompt:\n${negative}\n\n`;
    }
    if (techParams) {
      output += `Parameters: ${techParams}`;
    }
    return output.trim();
  }
  if (SPECIAL_FRAMEWORKS.GENERIC_IMAGE_VIDEO.includes(frameworkName)) {
    const parts: string[] = [];
    if (framework.components) {
      framework.components.forEach((comp) => {
        const value = params[comp.name];
        if (value) {
          const displayValue =
            value === "Lainnya..." ? customInputs[comp.name] || "" : value;
          if (displayValue) {
            parts.push(
              `${comp.label.replace(/\(.+\)/, "").trim()}: ${displayValue}`,
            );
          }
        }
      });
    }
    return `A ${framework.toolType} of ${params.subject || frameworkName}. ${parts.join(", ")}.`;
  }
  return generateNaturalLanguagePrompt(framework, params, customInputs);
};
