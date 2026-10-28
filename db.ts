import { SavedPrompt } from './types';

const DB_NAME = 'PromptMatrixDB';
const DB_VERSION = 1;
const STORE_NAME = 'userPrompts';

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      console.error("IndexedDB not supported by this browser.");
      return reject(new Error("IndexedDB not supported"));
    }

    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBRequest).error);
      reject(new Error('Error opening database'));
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const tempDb = (event.target as IDBOpenDBRequest).result;
      if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
        tempDb.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addPromptToDB = async (prompt: Omit<SavedPrompt, 'id' | 'timestamp'>): Promise<number> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const promptWithTimestamp: Omit<SavedPrompt, 'id'> = { ...prompt, timestamp: Date.now() };
    const request = store.add(promptWithTimestamp);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number);
    };
    request.onerror = (event) => {
      console.error('Error adding prompt:', (event.target as IDBRequest).error);
      reject(new Error('Error adding prompt'));
    };
  });
};

export const getAllPromptsFromDB = async (): Promise<SavedPrompt[]> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      const prompts = (event.target as IDBRequest).result as SavedPrompt[];
      // Sort by timestamp descending (newest first)
      resolve(prompts.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = (event) => {
      console.error('Error fetching prompts:', (event.target as IDBRequest).error);
      reject(new Error('Error fetching prompts'));
    };
  });
};

export const getPromptByIdFromDB = async (id: number): Promise<SavedPrompt | undefined> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as SavedPrompt | undefined);
    };
    request.onerror = (event) => {
      console.error('Error fetching prompt by ID:', (event.target as IDBRequest).error);
      reject(new Error('Error fetching prompt by ID'));
    };
  });
};

export const updatePromptInDB = async (prompt: SavedPrompt): Promise<void> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(prompt);

    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      console.error('Error updating prompt:', (event.target as IDBRequest).error);
      reject(new Error('Error updating prompt'));
    };
  });
};

export const deletePromptFromDB = async (id: number): Promise<void> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      console.error('Error deleting prompt:', (event.target as IDBRequest).error);
      reject(new Error('Error deleting prompt'));
    };
  });
};

/**
 * Exports all prompts to a downloadable JSON file
 */
export const exportPromptsToJSONFile = (prompts: SavedPrompt[]): void => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prompts, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `promptmatrix_stash_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
};

/**
 * Exports all prompts to a formatted Markdown (.md) document
 */
export const exportPromptsToMarkdownFile = (prompts: SavedPrompt[]): void => {
  const dateStr = new Date().toISOString().slice(0, 10);
  let md = `# Koleksi Prompt - PromptMatrix 2.0\n\n`;
  md += `> Diekspor pada: ${new Date().toLocaleString()}\n`;
  md += `> Total Prompt Tersimpan: ${prompts.length}\n\n---\n\n`;

  prompts.forEach((p, idx) => {
    md += `## ${idx + 1}. ${p.name || p.selectedFrameworkName || 'Untitled Prompt'}\n\n`;
    md += `* **Framework:** ${p.selectedFrameworkName || 'Custom'}\n`;
    md += `* **Kategori:** ${p.category || 'General'}\n`;
    md += `* **Waktu Simpan:** ${new Date(p.timestamp).toLocaleString()}\n\n`;
    md += `\`\`\`text\n${p.generatedPrompt}\n\`\`\`\n\n`;
    if (p.notes) {
      md += `> 💡 **Catatan:** ${p.notes}\n\n`;
    }
    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = `promptmatrix_stash_${dateStr}.md`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
};

/**
 * Exports all prompts to a clean text (.txt) file
 */
export const exportPromptsToPlainTextFile = (prompts: SavedPrompt[]): void => {
  const dateStr = new Date().toISOString().slice(0, 10);
  let txt = `PROMPT MATRIX 2.0 - KOLEKSI PROMPT TERSIMPAN\n`;
  txt += `Tanggal Ekspor: ${new Date().toLocaleString()}\n`;
  txt += `Total: ${prompts.length} prompt\n`;
  txt += `========================================================\n\n`;

  prompts.forEach((p, idx) => {
    txt += `[PROMPT #${idx + 1}] ${p.name || p.selectedFrameworkName}\n`;
    txt += `Framework: ${p.selectedFrameworkName} | Kategori: ${p.category}\n`;
    txt += `Waktu: ${new Date(p.timestamp).toLocaleString()}\n`;
    txt += `--------------------------------------------------------\n`;
    txt += `${p.generatedPrompt}\n`;
    txt += `========================================================\n\n`;
  });

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = `promptmatrix_stash_${dateStr}.txt`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
};

/**
 * Imports prompts from a user-uploaded JSON file into IndexedDB
 */
export const importPromptsFromJSONFile = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid format: Backup file must contain an array of prompts.");
        }

        const currentDb = await openDB();
        const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        let importedCount = 0;
        for (const item of parsed) {
          if (item && item.generatedPrompt) {
            // Strip old id so autoIncrement creates a fresh or non-conflicting entry
            const { id, ...promptWithoutId } = item;
            store.add({
              ...promptWithoutId,
              timestamp: item.timestamp || Date.now()
            });
            importedCount++;
          }
        }

        transaction.oncomplete = () => {
          resolve(importedCount);
        };
        transaction.onerror = (event) => {
          reject((event.target as IDBRequest).error || new Error("Error importing prompts into database."));
        };
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
};