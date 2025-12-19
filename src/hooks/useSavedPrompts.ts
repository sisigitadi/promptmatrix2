import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SavedPrompt, PromptData } from "../types";

export function useSavedPrompts() {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    const localData = localStorage.getItem("savedPrompts");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleSavePrompt = (promptData: PromptData) => {
    const newPrompt: SavedPrompt = {
      ...promptData,
      id:
        promptData.id ||
        `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: promptData.timestamp || Date.now(),
    };
    setSavedPrompts((prev) => [...prev, newPrompt]);
    toast.success("Prompt berhasil disimpan!");
  };

  const handleExportPrompts = (prompts: SavedPrompt[]) => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "saved_prompts.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.info("Prompt berhasil diekspor!");
  };

  const handleImportPrompts = (importedPrompts: any[]) => {
    // Basic validation to ensure imported data matches SavedPrompt shape
    if (
      !Array.isArray(importedPrompts) ||
      !importedPrompts.every(
        (p) =>
          typeof p === "object" &&
          p !== null &&
          "id" in p &&
          "frameworkName" in p,
      )
    ) {
      toast.error(
        "Format file impor tidak valid. Pastikan berisi array prompt yang benar.",
      );
      return;
    }

    const validPrompts = importedPrompts as SavedPrompt[];
    const existingPromptIds = new Set(savedPrompts.map((p) => p.id));
    const newPrompts = validPrompts.filter((p) => !existingPromptIds.has(p.id));

    setSavedPrompts((prev) => [...prev, ...newPrompts]);
    toast.success(`${newPrompts.length} prompt berhasil diimpor!`);
    if (validPrompts.length > newPrompts.length) {
      toast.warn(
        `${validPrompts.length - newPrompts.length} prompt duplikat tidak diimpor.`,
      );
    }
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((prompt) => prompt.id !== id));
    toast.info("Prompt berhasil dihapus!");
  };

  const toggleFavorite = (id: string) => {
    setSavedPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? { ...prompt, isFavorite: !prompt.isFavorite }
          : prompt,
      ),
    );
  };

  return {
    savedPrompts,
    handleSavePrompt,
    handleExportPrompts,
    handleImportPrompts,
    handleDeletePrompt,
    toggleFavorite,
  };
}
