import { useState } from "react";
import { toast } from "react-toastify";
import { callGeminiApi } from "../utils/api";
import { Framework } from "../data/frameworks";
import { FormData } from "../types";

interface UseAiAssistProps {
  apiKey: string;
  selectedModel: string;
  currentFrameworkDetails: Framework | null;
}

export const useAiAssist = ({
  apiKey,
  selectedModel,
  currentFrameworkDetails,
}: UseAiAssistProps) => {
  const [isAiAssisting, setIsAiAssisting] = useState<{
    [key: string]: boolean;
  }>({});

  const handleAiAssist = async (
    name: string,
    value: string,
    formData: FormData,
    details: any,
    compType: string,
    onSuccess: (result: string) => void,
  ) => {
    if (!apiKey) {
      toast.error(
        "API Key tidak ditemukan. Harap masukkan API Key di Pengaturan Mode Pengembang.",
      );
      return;
    }

    setIsAiAssisting((prev) => ({ ...prev, [name]: true }));

    const currentFramework = currentFrameworkDetails;
    const aiLogic = currentFramework?.ai_logic_description || "";
    const userPerspective = currentFramework?.perspektif_user || "";
    const role = currentFramework?.komponen_prompt?.PERAN || "";
    const context = currentFramework?.komponen_prompt?.KONTEKS || "";
    const task = currentFramework?.komponen_prompt?.TUGAS || "";

    // Fallback labels
    const compLabel = details.label || details.description || name;

    // Generate context from other fields
    let otherFieldsContext = "";
    if (formData) {
      const otherFields = Object.entries(formData)
        .filter(([key, val]) => key !== name && val && typeof val === "string") // Exclude current field and empty/non-string values
        .map(([key, val]) => {
          // Find label if possible, otherwise use key
          const comp = currentFramework?.components?.find(
            (c) => c.name === key,
          );
          const label = comp?.label || key;
          return `- ${label}: ${val}`;
        });

      if (otherFields.length > 0) {
        otherFieldsContext = `\nInformasi tambahan dari bidang lain yang sudah diisi:\n${otherFields.join("\n")}\n`;
      }
    }

    const aiPrompt = `Anda adalah asisten prompt engineering. Tugas Anda adalah membantu pengguna mengisi atau menyempurnakan bagian dari prompt mereka.\n\nKerangka Kerja Saat Ini:\nNama: ${currentFramework?.nama_kerangka || "N/A"}\nDeskripsi: ${currentFramework?.description || "N/A"}\n\nKomponen yang sedang diisi:\nJudul Komponen: "${compLabel}"\nDeskripsi Variabel: "${details.description}"\nContoh/Placeholder: "${details.placeholder || "N/A"}"\n\nIni adalah bagian dari kerangka kerja prompt dengan:\nPERAN: ${role}\nKONTEKS: ${context}\nTUGAS: ${task}\n\nLogika AI untuk kerangka kerja ini adalah: "${aiLogic}"\nPerspektif pengguna untuk kerangka kerja ini adalah: "${userPerspective}"\n${otherFieldsContext}\nTeks saat ini di bidang ini adalah: "${value}".\n\nInstruksi:\n- Fokuskan respons Anda secara strikt pada variabel "${details.description}" dan judul komponen "${compLabel}" dalam konteks kerangka kerja ini.\n- Gunakan informasi dari bidang lain sebagai konteks untuk membuat saran yang lebih relevan dan koheren.\n- Jika teks saat ini kosong, hasilkan teks yang relevan dan sesuai dengan deskripsi variabel, judul komponen, dan konteks kerangka kerja.\n- Jika teks saat ini tidak kosong, perbaiki, perluas, atau sempurnakan teks ini agar lebih baik, lebih lengkap, dan sesuai dengan deskripsi variabel, judul komponen, dan konteks kerangka kerja.\n- Berikan hanya teks yang disarankan, tanpa penjelasan tambahan atau pembuka/penutup.\n- Pastikan output Anda langsung dapat digunakan sebagai nilai untuk bidang input ini.\n`;

    let imagePayload = undefined;
    if (compType === "image" || compType === "file") {
      if (value && typeof value === "string" && value.startsWith("data:")) {
        const parts = value.split(";base64,");
        if (parts.length === 2) {
          imagePayload = {
            mimeType: parts[0].substring("data:".length),
            data: parts[1],
          };
        }
      }
    }

    try {
      const apiResult = await callGeminiApi(
        apiKey,
        aiPrompt,
        selectedModel,
        undefined,
        imagePayload,
      );

      if (
        typeof apiResult === "object" &&
        apiResult !== null &&
        "error" in apiResult
      ) {
        toast.error(
          `Gagal mendapatkan bantuan AI untuk ${compLabel}. ${(apiResult as any).error}`,
        );
      } else {
        onSuccess(apiResult as string);
      }
    } catch (error: any) {
      console.error("AI Assist Error:", error);
      toast.error(
        `Gagal mendapatkan bantuan AI untuk ${compLabel}. Error: ${error.message || String(error)}`,
      );
    } finally {
      setIsAiAssisting((prev) => ({ ...prev, [name]: false }));
    }
  };

  return {
    isAiAssisting,
    handleAiAssist,
  };
};
