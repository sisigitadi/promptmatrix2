import { Part } from "@google/generative-ai";
import { Framework } from "../data/frameworks";
import { SPECIAL_FRAMEWORKS } from "../config";
import { PromptBlock } from "../components/VisualPromptBuilder";

// Helper function to replace placeholders in a string
const replacePlaceholders = (
  template: string,
  values: { [key: string]: any },
  customInputs: { [key: string]: string },
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
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
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
  const allComponents = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        allComponents.push(...sub.options[triggerValue]);
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
  let processedTugas = TUGAS || "";
  if (framework.id_kerangka === "IMG-GEN-001" && TUGAS) {
    const modeOperasi = allValues.mode_operasi;
    if (modeOperasi === "deskripsikan_gambar") {
      const inputGambar = allValues.input_gambar_deskripsi || "";
      processedTugas = `Deskripsikan gambar berikut secara detail dan komprehensif, fokus pada objek, warna, suasana, dan gaya visual: ${inputGambar}`;
    } else if (modeOperasi === "hasilkan_gambar") {
      const deskripsiTeksGambar =
        allValues.deskripsi_teks_gambar_generasi || "";
      let gayaVisual = allValues.gaya_visual_generasi || "";
      if (gayaVisual === "lainnya") {
        gayaVisual = allValues.gaya_visual_lainnya || "";
      }
      const rasioAspek = allValues.rasio_aspek_generasi || "";
      processedTugas = `Hasilkan gambar berdasarkan deskripsi berikut: "${deskripsiTeksGambar}". Gunakan gaya visual: "${gayaVisual}" dan rasio aspek: "${rasioAspek}".`;
    }
  }
  const finalTugas = replacePlaceholders(
    processedTugas,
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
  const formatOutput = framework.komponen_prompt["FORMAT OUTPUT"];
  if (formatOutput) {
    prompt += `**Format Output:**\n${replacePlaceholders(formatOutput, allValues, customInputs)}\n`;
  }

  return prompt.trim();
};

// Function for the user-facing preview, showing AI logic and filled inputs in plain text.
export const generateUserPreviewPrompt = (
  framework: Framework,
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
): string => {
  if (!framework) {
    return "Pilih kerangka kerja untuk melihat pratinjau.";
  }

  let previewContent = "";

  if (framework.ai_logic_description) {
    previewContent += `${framework.ai_logic_description.replace(/\*\*/g, "")}\n\n`; // Remove bold markdown
  }

  const allComponents = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        allComponents.push(...sub.options[triggerValue]);
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
    .map((block) => {
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
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
) => {
  let promptContent = "";

  if (framework.ai_logic_description) {
    promptContent += `${framework.ai_logic_description}\n\n`;
  }

  const allComponents = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        allComponents.push(...sub.options[triggerValue]);
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
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
): string => {
  const allComponents = [...(framework.components || [])];
  const subcomponents = Array.isArray(framework.dynamicSubcomponents)
    ? framework.dynamicSubcomponents
    : framework.dynamicSubcomponents
      ? [framework.dynamicSubcomponents]
      : [];

  subcomponents.forEach((sub) => {
    if (sub && sub.trigger) {
      const triggerValue = params[sub.trigger];
      if (triggerValue && sub.options[triggerValue]) {
        allComponents.push(...sub.options[triggerValue]);
      }
    }
  });

  const allValues = { ...params };
  allComponents.forEach((comp) => {
    if (params[comp.name] === "Lainnya...") {
      allValues[comp.name] = customInputs[comp.name] || "";
    }
  });

  const formatOutputKey = "FORMAT OUTPUT"; // Define variable for the key

  const jsonOutput: { [key: string]: any } = {
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
      [formatOutputKey]: replacePlaceholders(
        framework.komponen_prompt?.[formatOutputKey] || "",
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
    input_komponen: allComponents.reduce((acc, comp) => {
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
    }, {}),
  };

  return JSON.stringify(jsonOutput, null, 2);
};

export const generateFinalPrompt = (
  framework: Framework,
  frameworkName: string,
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
): string => {
  if (frameworkName === SPECIAL_FRAMEWORKS.MIDJOURNEY) {
    const subject = params.subject || "";
    const style = params.style || "";
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
    return `A ${framework.toolType} of ${params.subject || frameworkName}. ${parts.join(", ")}.`;
  }
  return generateNaturalLanguagePrompt(framework, params, customInputs);
};
