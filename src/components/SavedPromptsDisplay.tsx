import React, { useState } from "react";
import { generateFileName } from "../utils/promptGenerators";
import {
  Modal,
  Button,
  ListGroup,
  Form,
  InputGroup,
  Collapse,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import {
  FaStar,
  FaRegStar,
  FaHistory,
  FaPlay,
  FaEdit,
  FaTrash,
  FaDownload,
  FaFileCsv,
  FaFileImport,
  FaFolderOpen,
  FaSortAmountDown,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface SavedPromptsDisplayProps {
  show: boolean;
  onHide: () => void;
  savedPrompts: any[];
  onLoadPrompt: (versionData: any, parentPrompt: any) => void;
  onDeletePrompt: (id: number) => void;
  onExportPrompts: (prompts: any[]) => void;
  onImportPrompts: (prompts: any[]) => void;
  onRenamePrompt: (id: number, newName: string) => void;
  toggleFavorite: (id: string) => void;
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
  toggleFavorite,
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
      toast.success("Nama prompt diperbarui!");
    }
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
    a.click();
    URL.revokeObjectURL(url);
    toast.info("Prompt diekspor!");
  };

  const handleExportCsv = () => {
    const headers = [
      "id",
      "frameworkName",
      "category",
      "subcategory",
      "latestTimestamp",
      "formData",
    ];
    const csvRows = [headers.join(",")];
    const escapeCsvCell = (data: any) => {
      const stringData =
        typeof data === "object" ? JSON.stringify(data) : String(data);
      return `"${stringData.replace(/"/g, '""')}"`;
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
    a.click();
    URL.revokeObjectURL(url);
    toast.info("Database diekspor ke CSV!");
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
            toast.success("Data berhasil diimpor!");
          } catch (error) {
            console.error("Import error:", error);
            toast.error("Format file tidak valid.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const sortedPrompts = [...savedPrompts].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    if (sortBy === "nameAsc")
      return a.frameworkName.localeCompare(b.frameworkName);
    const lastVersionA = a.versions?.[a.versions?.length - 1]?.timestamp ?? 0;
    const lastVersionB = b.versions?.[b.versions?.length - 1]?.timestamp ?? 0;
    return lastVersionB - lastVersionA;
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      scrollable
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed border-bottom-0">
        <Modal.Title className="d-flex align-items-center gap-2 text-info">
          <FaFolderOpen /> Prompt Tersimpan & Riwayat
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-themed p-0">
        {/* ACTION BAR */}
        <div className="p-3 bg-dark border-bottom border-secondary d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex gap-2">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => onExportPrompts(savedPrompts)}
            >
              <FaDownload className="me-1" /> Ekspor JSON
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={handleExportCsv}
            >
              <FaFileCsv className="me-1" /> Ekspor CSV
            </Button>
            <Button variant="outline-primary" size="sm" onClick={handleImport}>
              <FaFileImport className="me-1" /> Impor
            </Button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <FaSortAmountDown className="text-muted small" />
            <Form.Select
              size="sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark text-light border-secondary"
              style={{ width: "160px" }}
            >
              <option value="dateDesc">Terbaru</option>
              <option value="nameAsc">Nama (A-Z)</option>
            </Form.Select>
          </div>
        </div>

        <div className="p-4">
          {savedPrompts.length === 0 ? (
            <div className="text-center py-5 text-muted opacity-50">
              <FaFolderOpen size={48} className="mb-3" />
              <p>Belum ada prompt yang disimpan.</p>
            </div>
          ) : (
            <Row className="g-3">
              {sortedPrompts.map((prompt) => (
                <Col key={prompt.id} xs={12}>
                  <div
                    className={`prompt-history-card border rounded p-3 bg-dark-subtle hover-lift ${prompt.isFavorite ? "border-warning" : "border-secondary"}`}
                  >
                    {promptToRename?.id === prompt.id ? (
                      <InputGroup size="sm">
                        <Form.Control
                          value={newPromptName}
                          onChange={(e) => setNewPromptName(e.target.value)}
                          className="bg-dark text-light border-info"
                          autoFocus
                        />
                        <Button variant="success" onClick={handleSaveRename}>
                          Simpan
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => setPromptToRename(null)}
                        >
                          Batal
                        </Button>
                      </InputGroup>
                    ) : (
                      <div className="d-flex flex-wrap align-items-center gap-3">
                        {/* FAVORITE TOGGLE */}
                        <Button
                          variant="link"
                          className={`p-0 fs-5 ${prompt.isFavorite ? "text-warning" : "text-muted opacity-50"}`}
                          onClick={() => toggleFavorite(prompt.id)}
                        >
                          {prompt.isFavorite ? <FaStar /> : <FaRegStar />}
                        </Button>

                        {/* CONTENT */}
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="mb-0 text-light fw-bold text-truncate">
                              {prompt.frameworkName}
                            </h6>
                            <Badge bg="secondary" className="opacity-75">
                              {prompt.category}
                            </Badge>
                          </div>
                          <div className="d-flex align-items-center gap-3 text-muted small">
                            <span className="d-flex align-items-center gap-1">
                              <FaCalendarAlt size={10} />
                              {new Date(
                                prompt.versions?.[prompt.versions?.length - 1]
                                  ?.timestamp ?? 0,
                              ).toLocaleString()}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <FaHistory size={10} />
                              {prompt.versions?.length || 0} Versi
                            </span>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="d-flex gap-2 ms-auto">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              onLoadPrompt(
                                prompt.versions?.[prompt.versions?.length - 1],
                                prompt,
                              )
                            }
                            title="Muat Versi Terbaru"
                            className="px-3"
                          >
                            <FaPlay size={10} className="me-1" /> Load
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleToggleExpand(prompt.id)}
                            title="Lihat Riwayat"
                          >
                            <FaHistory size={12} />
                          </Button>
                          <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => handleRenameClick(prompt)}
                            title="Ganti Nama"
                          >
                            <FaEdit size={12} />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleExportIndividualPrompt(prompt)}
                            title="Ekspor JSON"
                          >
                            <FaDownload size={12} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDeletePrompt(prompt.id)}
                            title="Hapus"
                          >
                            <FaTrash size={12} />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* VERSION HISTORY COLLAPSE */}
                    <Collapse in={expandedPromptId === prompt.id}>
                      <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <div className="small text-muted text-uppercase fw-bold mb-2">
                          Riwayat Iterasi
                        </div>
                        <ListGroup variant="flush">
                          {prompt.versions?.map(
                            (version: any, index: number) => (
                              <ListGroup.Item
                                key={index}
                                className="bg-transparent border-0 d-flex justify-content-between align-items-center py-2 px-0 text-light small border-bottom border-secondary border-opacity-10"
                              >
                                <div>
                                  <Badge
                                    bg="dark"
                                    className="me-2 text-info border border-info border-opacity-25"
                                  >
                                    v{index + 1}
                                  </Badge>
                                  <span className="opacity-75">
                                    {new Date(
                                      version.timestamp,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-info p-0 text-decoration-none"
                                  onClick={() => onLoadPrompt(version, prompt)}
                                >
                                  <FaPlay size={10} className="me-1" /> Muat
                                  Versi Ini
                                </Button>
                              </ListGroup.Item>
                            ),
                          )}
                        </ListGroup>
                      </div>
                    </Collapse>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="modal-footer-themed bg-dark border-top border-secondary">
        <Button variant="outline-secondary" onClick={onHide} className="px-4">
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SavedPromptsDisplay;
