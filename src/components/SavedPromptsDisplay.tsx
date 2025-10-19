import React, { useState } from "react";
import { generateFileName } from "../utils/promptGenerators";
import {
  Modal,
  Button,
  ListGroup,
  Form,
  InputGroup,
  Collapse,
} from "react-bootstrap";

interface SavedPromptsDisplayProps {
  show: boolean;
  onHide: () => void;
  savedPrompts: any[];
  onLoadPrompt: (promptData: any) => void;
  onDeletePrompt: (id: number) => void;
  onExportPrompts: (prompts: any[]) => void;
  onImportPrompts: (prompts: any[]) => void;
  onRenamePrompt: (id: number, newName: string) => void;
}

const SavedPromptsDisplay: React.FC<SavedPromptsDisplayProps> = ({
  show,
  onHide,
  savedPrompts,
  onLoadPrompt,
  onDeletePrompt,
  onExportPrompts,
  onImportPrompts,
  onRenamePrompt,
}) => {
  const [sortBy, setSortBy] = useState("dateDesc");
  const [promptToRename, setPromptToRename] = useState<any>(null);
  const [newPromptName, setNewPromptName] = useState("");
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);

  const handleToggleExpand = (promptId: string) => {
    setExpandedPromptId(expandedPromptId === promptId ? null : promptId);
  };

  const handleRenameClick = (prompt: any) => {
    setPromptToRename(prompt);
    setNewPromptName(prompt.frameworkName);
  };

  const handleSaveRename = () => {
    if (promptToRename && newPromptName.trim() !== "") {
      onRenamePrompt(promptToRename.id, newPromptName.trim());
      setPromptToRename(null);
      setNewPromptName("");
    }
  };

  const handleCancelRename = () => {
    setPromptToRename(null);
    setNewPromptName("");
  };

  const handleExportIndividualPrompt = (prompt: any) => {
    const filename = generateFileName(
      `${prompt.frameworkName}_${prompt.id}`,
      "json",
    );
    const blob = new Blob([JSON.stringify(prompt, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = [
      "id",
      "frameworkName",
      "category",
      "subcategory",
      "latestTimestamp",
      "formData",
      "customInputs",
      "naturalLanguageOutput",
      "jsonOutput",
    ];

    const csvRows = [headers.join(",")];

    const escapeCsvCell = (cellData: any) => {
      if (cellData === null || cellData === undefined) {
        return "";
      }
      const stringData =
        typeof cellData === "object"
          ? JSON.stringify(cellData)
          : String(cellData);
      if (
        stringData.includes(",") ||
        stringData.includes('"') ||
        stringData.includes("\n")
      ) {
        return `"${stringData.replace(/"/g, '""')}"`;
      }
      return stringData;
    };

    savedPrompts.forEach((prompt) => {
      const latestVersion = prompt.versions[prompt.versions.length - 1];
      const row = [
        prompt.id,
        prompt.frameworkName,
        prompt.category,
        prompt.subcategory,
        new Date(latestVersion.timestamp).toISOString(),
        escapeCsvCell(latestVersion.formData),
        escapeCsvCell(latestVersion.customInputs),
        escapeCsvCell(latestVersion.naturalLanguageOutput),
        escapeCsvCell(latestVersion.jsonOutput),
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateFileName("saved_prompts", "csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            onImportPrompts(importedData);
          } catch (error) {
            console.error("Error parsing imported file:", error);
            alert(
              "Gagal mengimpor prompt. Pastikan file adalah JSON yang valid.",
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const sortedPrompts = [...savedPrompts].sort((a, b) => {
    if (sortBy === "nameAsc") {
      return a.frameworkName.localeCompare(b.frameworkName);
    } else if (sortBy === "dateDesc") {
      const lastVersionA = a.versions?.[a.versions.length - 1]?.timestamp || 0;
      const lastVersionB = b.versions?.[b.versions.length - 1]?.timestamp || 0;
      return lastVersionB - lastVersionA;
    }
    return 0;
  });

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="modal-themed">
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>📚 Prompt Tersimpan & Riwayat</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed text-start">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex">
            <Button
              variant="success"
              className="me-2"
              onClick={() => onExportPrompts(savedPrompts)}
              aria-label="Ekspor Semua Prompt Tersimpan ke JSON"
            >
              ⬇️ Ekspor JSON
            </Button>
            <Button
              variant="success"
              className="me-2"
              onClick={handleExportCsv}
              aria-label="Ekspor Semua Prompt Tersimpan ke CSV"
            >
              ⬇️ Ekspor CSV
            </Button>
            <Button
              variant="info"
              onClick={handleImport}
              aria-label="Impor Prompt dari File"
            >
              ⬆️ Impor
            </Button>
          </div>
          <Form.Group controlId="sortBySelect" className="mb-0 ms-3">
            <Form.Select
              size="sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as string)}
              className="form-select-themed"
            >
              <option value="dateDesc">Urutkan: Terbaru</option>
              <option value="nameAsc">Urutkan: Nama (A-Z)</option>
            </Form.Select>
          </Form.Group>
        </div>
        {savedPrompts.length === 0 ? (
          <p className="text-center">Belum ada prompt yang disimpan.</p>
        ) : (
          <ListGroup className="saved-prompts-list">
            {sortedPrompts.map((prompt) => (
              <ListGroup.Item
                key={prompt.id}
                className="list-group-item-themed"
              >
                {promptToRename?.id === prompt.id ? (
                  <InputGroup className="flex-grow-1">
                    <Form.Control
                      type="text"
                      value={newPromptName}
                      onChange={(e) => setNewPromptName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSaveRename()
                      }
                      autoFocus
                    />
                    <Button variant="success" onClick={handleSaveRename}>
                      Simpan
                    </Button>
                    <Button variant="secondary" onClick={handleCancelRename}>
                      Batal
                    </Button>
                  </InputGroup>
                ) : (
                  <div className="d-flex justify-content-between w-100">
                    <div
                      className="flex-grow-1 me-2"
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "1em",
                          marginBottom: "0.1em",
                          display: "block",
                        }}
                      >
                        {prompt.frameworkName}
                      </strong>
                      <small style={{ fontSize: "0.75em", display: "block" }}>
                        {new Date(
                          prompt.versions[prompt.versions.length - 1].timestamp,
                        ).toLocaleDateString()}{" "}
                        {new Date(
                          prompt.versions[prompt.versions.length - 1].timestamp,
                        ).toLocaleTimeString()}
                      </small>
                      <div className="prompt-actions d-flex flex-wrap gap-1 mt-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleToggleExpand(prompt.id)}
                          title="Lihat Riwayat Versi"
                          aria-label="Lihat Riwayat Versi"
                        >
                          {expandedPromptId === prompt.id
                            ? "⬆️ Sembunyikan"
                            : "⬇️ Riwayat"}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            onLoadPrompt(
                              prompt.versions[prompt.versions.length - 1],
                              prompt,
                            )
                          }
                          title="Muat Versi Terbaru"
                          aria-label="Muat Versi Terbaru"
                        >
                          ▶️
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleRenameClick(prompt)}
                          title="Ganti Nama"
                          aria-label="Ganti Nama Prompt"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeletePrompt(prompt.id)}
                          title="Hapus Prompt"
                          aria-label="Hapus Prompt"
                        >
                          🗑️
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleExportIndividualPrompt(prompt)}
                          title="Ekspor Prompt Ini"
                          aria-label="Ekspor Prompt Ini"
                        >
                          ⬇️ JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Collapse in={expandedPromptId === prompt.id}>
                  <div className="mt-3 pt-2 border-top">
                    <h6>Riwayat Versi:</h6>
                    <ListGroup variant="flush">
                      {prompt.versions.map((version: any, index: number) => (
                        <ListGroup.Item
                          key={index}
                          className="d-flex justify-content-between align-items-center small list-group-item-themed"
                        >
                          <span>
                            Versi {index + 1} -{" "}
                            {new Date(version.timestamp).toLocaleString()}
                          </span>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onLoadPrompt(version, prompt)}
                            title="Muat Versi Ini"
                            aria-label={`Muat Versi ${index + 1}`}
                          >
                            ▶️
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Collapse>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-themed">
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SavedPromptsDisplay;
