import { Part } from "@google/generative-ai";
import { Framework, FrameworkComponent } from "../data/frameworks"; // Keep FrameworkComponent for type guards
import { SPECIAL_FRAMEWORKS } from "../config";
import { FormData, CustomInputs, PromptBlock } from "../types";

// Helper function to replace placeholders in a string
const replacePlaceholders = (
  template: string,
  values: FormData,
  customInputs: CustomInputs,
) => {
  let result = template;
  for (const key in values) {
    const placeholder = `{${key}}`;
    let value = values[key];
    if (value === "Lainnya...") {
      value = customInputs[key] || "";
    }
    // Ensure value is a string or number before replacing
    if (typeof value === "string" || typeof value === "number") {
      result = result.replace(new RegExp(placeholder, "g"), String(value));
    } else if (Array.isArray(value)) {
      // Handle multiselect arrays, replacing "Lainnya..." with custom input if present
      const processedValues = value.map((item) => {
        if (item === "Lainnya...") {
          return customInputs[key] || ""; // Use the custom input for this key
        }
        return item;
      });
      result = result.replace(
        new RegExp(placeholder, "g"),
        processedValues.filter(Boolean).join(", "),
      );
    }
  }
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

  let previewContent = "";

  if (framework.ai_logic_description) {
    previewContent += `${framework.ai_logic_description.replace(/\*\*/g, "")}\n\n`; // Remove bold markdown
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
      let displayValue = "";
      if (value === "Lainnya...") {
        displayValue = customInputs[comp.name] || "";
      } else if (Array.isArray(value)) {
        // SOP: Juga tanpa karakter pemformatan seperti * atau -.
        displayValue = value
          .map((item) => String(item).replace(/\*\*/g, ""))
          .filter(Boolean)
          .join(", ");
      } else {
        displayValue = String(value).replace(/\*\*/g, ""); // Remove bold markdown from single values
      }
      if (displayValue) {
        previewContent += `${comp.label}: ${displayValue}\n`;
      }
    }
  });

  if (!hasInputs && !framework.ai_logic_description) {
    previewContent = "Isi komponen untuk melihat pratinjau.";
  } else if (!hasInputs) {
    // If there's an AI logic description but no inputs, we don't need to add more text.
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

/**
 * Generates a prompt containing its original placeholders (e.g., {{TOPIK}}).
 * Useful for developers creating AI application templates.
 */
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
