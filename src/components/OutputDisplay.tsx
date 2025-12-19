import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Form,
  Button,
  Card,
  ButtonGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { callGeminiApi } from "../utils/api"; // Import the API function
import { FaCog, FaRocket } from "react-icons/fa"; // Import FaCog and FaRocket icons
import DevModeSettingsModal from "./DevModeSettingsModal"; // Import DevModeSettingsModal
import AiResponseModal from "./AiResponseModal"; // Import AiResponseModal
import { generateFileName } from "../utils/promptGenerators";
import { diffLines } from "diff";

import { Framework, PROMPT_FRAMEWORKS } from "../data/frameworks";

interface OutputDisplayProps {
  naturalLanguageOutput: string | Part[];
  jsonOutput: string;
  previewNaturalLanguageOutput: string;
  previewJsonOutput: string;
  currentFrameworkDetails: Framework | null;
  formData: { [key: string]: any };
  customInputs: { [key: string]: string };
  selectedFramework: string | null;
  selectedCategory: string | null;
  onUseAsInput: (outputContent: string) => void;
  onShowSavedPrompts: () => void;
  showDevMode: boolean;
  onSavePrompt: (promptData: any) => void;
  apiKey: string; // Added
  setApiKey: (key: string) => void; // Added
  selectedModel: string; // Added
  onModelSelect: (model: string) => void; // Added
  isApiKeyEnabled: boolean; // Added
  handleInputChangeWithValidation: (
    name: string,
    value: string | number,
    inputDetails: any,
  ) => void; // New prop
  validationErrors: { [key: string]: string }; // New prop
  onSelectRecommendedFramework: (
    frameworkName: string,
    categoryName?: string,
    subcategoryName?: string,
  ) => void; // New prop
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  naturalLanguageOutput,
  jsonOutput,
  previewNaturalLanguageOutput,
  previewJsonOutput,
  currentFrameworkDetails,
  formData,
  customInputs,
  selectedFramework,
  selectedCategory,
  onUseAsInput,
  onShowSavedPrompts,
  showDevMode,
  onSavePrompt,
  apiKey,
  setApiKey,
  selectedModel,
  onModelSelect,
  isApiKeyEnabled,
  handleInputChangeWithValidation,
  validationErrors,
  onSelectRecommendedFramework,
}) => {
  const [outputType, setOutputType] = useState<"natural" | "json">(
    () =>
      (localStorage.getItem("defaultOutputType") as "natural" | "json") ||
      "natural",
  );

  useEffect(() => {
    localStorage.setItem("defaultOutputType", outputType);
  }, [outputType]);
  const [copyButtonText, setCopyButtonText] = useState("Salin");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showDevModeSettingsModal, setShowDevModeSettingsModal] =
    useState(false); // New state for modal visibility
  const [showAiResponseModal, setShowAiResponseModal] = useState(false); // New state for AI Response Modal
  const [showDiffModal, setShowDiffModal] = useState(false); // New state for diff modal
  const [diffContent, setDiffContent] = useState(""); // New state for diff content
  const [isDirty, setIsDirty] = useState(false); // Add isDirty state

  const showPreview = Array.isArray(naturalLanguageOutput)
    ? naturalLanguageOutput.length === 0
    : !naturalLanguageOutput && !jsonOutput;

  const currentOutput =
    outputType === "natural"
      ? previewNaturalLanguageOutput
      : showPreview
        ? previewJsonOutput
        : jsonOutput;

  const [editableOutput, setEditableOutput] = useState<string>(currentOutput);
  const [isEditable, setIsEditable] = useState<boolean>(false); // New state for edit mode
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for the textarea

  useEffect(() => {
    setEditableOutput(currentOutput);
    setIsEditable(false); // Reset edit mode on new output
    setIsDirty(false); // Reset dirty state on new output
  }, [currentOutput]);
  useEffect(() => {
    if (isEditable && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditable]);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = editableOutput
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText("Tersalin!");
      setTimeout(() => setCopyButtonText("Salin"), 2000);
    });
  };

  const handleCompareOutput = () => {
    const differences = diffLines(
      previewNaturalLanguageOutput.replace(/\r\n/g, "\n"),
      editableOutput.replace(/\r\n/g, "\n"),
    );

    let diffOutput = "";
    differences.forEach((part) => {
      const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
      const lines = part.value.split(/\n/);

      // Handle the case where a part ends with a newline, which creates an empty string at the end of the split array.
      if (lines[lines.length - 1] === "") {
        lines.pop();
      }

      for (const line of lines) {
        diffOutput += `${prefix}${line}\n`;
      }
    });

    setDiffContent(diffOutput);
    setShowDiffModal(true);
  };

  const handleGenerateClick = async () => {
    console.log("handleGenerateClick - API Key Check:", {
      apiKey,
      isApiKeyEnabled,
      selectedModel,
    });
    setIsGenerating(true);
    setAiResponse(null);
    setAiError(null);
    setShowAiResponseModal(true); // Show modal immediately when generation starts

    const generationConfig = {
      temperature: formData.temperature
        ? parseFloat(formData.temperature)
        : undefined,
      topP: formData.top_p ? parseFloat(formData.top_p) : undefined,
      topK: formData.top_k ? parseInt(formData.top_k) : undefined,
    };

    const promptPayload =
      Array.isArray(naturalLanguageOutput) && naturalLanguageOutput.length > 0
        ? naturalLanguageOutput
        : editableOutput;

    try {
      const apiResult = await callGeminiApi(
        apiKey,
        promptPayload,
        selectedModel,
        generationConfig,
      );

      if (apiResult.error) {
        setAiError(apiResult.error);
        setAiResponse(null);
      } else {
        setAiResponse(apiResult);
        setAiError(null);
      }
    } catch (error: any) {
      // Catch any unexpected errors
      if (error.error) {
        // Check if the error object itself has an 'error' property from callGeminiApi
        setAiError(error.error);
      } else if (error instanceof Error) {
        setAiError(error.message);
      } else {
        setAiError("An unknown error occurred.");
      }
      setAiResponse(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!currentFrameworkDetails || !selectedFramework || !selectedCategory) {
      setSaveModalMessage(
        "Tidak dapat menyimpan prompt: Detail framework atau kategori tidak lengkap.",
      );
      setShowSaveModal(true);
      return;
    }

    const promptData = {
      category: selectedCategory,
      subcategory: currentFrameworkDetails.framework?.kategori?.[1] || "",
      frameworkName: selectedFramework,
      formData: formData,
      customInputs: customInputs,
      naturalLanguageOutput: naturalLanguageOutput,
      jsonOutput: jsonOutput,
    };
    onSavePrompt(promptData);
    setSaveModalMessage("Prompt berhasil disimpan!");
    setShowSaveModal(true);
  };

  const handleExportMarkdown = () => {
    let markdownContent = `# PromptMatrix Export - ${selectedFramework || "Untitled Prompt"}\n\n`;

    if (selectedCategory) {
      markdownContent += `**Kategori:** ${selectedCategory}\n`;
    }
    if (selectedFramework) {
      markdownContent += `**Kerangka Kerja:** ${selectedFramework}\n\n`;
    }

    if (Object.keys(formData).length > 0) {
      markdownContent += `## Input Data:\n`;
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          markdownContent += `- **${key}:** ${formData[key]}\n`;
        }
      }
      markdownContent += `\n`;
    }

    if (Object.keys(customInputs).length > 0) {
      markdownContent += `## Custom Inputs:\n`;
      for (const key in customInputs) {
        if (Object.prototype.hasOwnProperty.call(customInputs, key)) {
          markdownContent += `- **${key}:** ${customInputs[key]}\n`;
        }
      }
      markdownContent += `\n`;
    }

    markdownContent += `## Output Prompt:\n\n`;
    markdownContent += previewNaturalLanguageOutput;

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateFileName(selectedFramework || "untitled_prompt", "md");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const exportData = {
      framework: selectedFramework,
      category: selectedCategory,
      inputs: formData,
      customInputs: customInputs,
      naturalLanguageOutput: naturalLanguageOutput,
      jsonOutput: jsonOutput,
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateFileName(
      selectedFramework || "untitled_prompt",
      "json",
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    let csvContent = "";
    const headers = ["Field", "Value"];
    csvContent += headers.join(",") + "\n";

    const addRow = (field: string, value: any) => {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      csvContent += `"${field.replace(/"/g, "''")}","${stringValue.replace(
        /"/g,
        "''",
      )}"\n`;
    };

    addRow("Framework", selectedFramework || "");
    addRow("Category", selectedCategory || "");

    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        addRow(`Input - ${key}`, formData[key]);
      }
    }
    for (const key in customInputs) {
      if (Object.prototype.hasOwnProperty.call(customInputs, key)) {
        addRow(`Custom Input - ${key}`, customInputs[key]);
      }
    }
    addRow("Natural Language Output", naturalLanguageOutput);
    addRow("JSON Output", jsonOutput);

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateFileName(
      selectedFramework || "untitled_prompt",
      "csv",
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const recommendedFrameworks = useMemo(() => {
    if (!selectedCategory || !selectedFramework) return [];

    const recommendations: {
      name: string;
      category: string;
      subcategory: string;
    }[] = [];
    const currentCategoryData = PROMPT_FRAMEWORKS[selectedCategory];

    if (currentCategoryData) {
      for (const subcategoryName in currentCategoryData) {
        if (
          Object.prototype.hasOwnProperty.call(
            currentCategoryData,
            subcategoryName,
          )
        ) {
          const subcategoryData = currentCategoryData[subcategoryName];
          for (const frameworkName in subcategoryData) {
            if (
              Object.prototype.hasOwnProperty.call(
                subcategoryData,
                frameworkName,
              ) &&
              frameworkName !== selectedFramework
            ) {
              recommendations.push({
                name: frameworkName,
                category: selectedCategory,
                subcategory: subcategoryName,
              });
            }
          }
        }
      }
    }
    // Limit to 3 random recommendations for now
    return recommendations.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [selectedCategory, selectedFramework]);

  return (
    <>
      <Card className="flex-grow-1 h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          4. Pratinjau Prompt:
          <ButtonGroup aria-label="Output Type">
            <Button
              variant={outputType === "natural" ? "primary" : "outline-primary"}
              onClick={() => setOutputType("natural")}
            >
              📝 Natural
            </Button>
            <Button
              variant={outputType === "json" ? "primary" : "outline-primary"}
              onClick={() => setOutputType("json")}
            >
              📄 JSON
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body className="d-flex flex-column text-start">
          <>
            {/* Output Display Section (approx 75%) */}
            <div
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Form.Control
                as="textarea"
                ref={textareaRef}
                value={editableOutput}
                onChange={(e) => {
                  setEditableOutput(e.target.value);
                  setIsDirty(true);
                }}
                rows={Math.max(
                  10,
                  (editableOutput || "").split("\n").length + 1,
                )}
                className={`flex-grow-1 mb-3 output-textarea ${isEditable ? "editable" : ""} ${
                  outputType === "json" ? "syntax-highlighted" : ""
                }`}
                placeholder="Prompt Anda yang terstruktur lengkap akan disusun dan ditampilkan di sini..."
                aria-label="Output Prompt"
                readOnly={!isEditable} // Control editability
                style={{
                  padding: "clamp(1rem, 2vw, 1.5rem)",
                  fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                  maxHeight: "60vh", // Add a max height
                  overflowY: "auto", // Add scroll if content exceeds max height
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              />
              {outputType === "natural" && (
                <div className="d-flex justify-content-end small mb-2">
                  <span>Karakter: {editableOutput.length}</span>
                  <span className="ms-3">
                    Kata:{" "}
                    {editableOutput.trim().split(/\s+/).filter(Boolean).length}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-3">
                <ButtonGroup className="flex-grow-1 me-2">
                  {" "}
                  {/* Grouping Copy and Edit */}
                  <Button variant="success" onClick={handleCopy}>
                    📋 {copyButtonText}
                  </Button>
                  <Button variant="info" onClick={toggleEdit}>
                    {isEditable ? "Selesai Edit" : "✏️ Edit"}
                  </Button>
                  {isDirty && (
                    <Button
                      variant="outline-info"
                      onClick={handleCompareOutput}
                      className="ms-2"
                    >
                      ↔️ Bandingkan
                    </Button>
                  )}
                </ButtonGroup>
                <ButtonGroup className="flex-grow-1 me-2">
                  <Button
                    variant="outline-secondary"
                    onClick={handleExportMarkdown}
                  >
                    ⬇️ MD
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleExportJson}
                  >
                    ⬇️ JSON
                  </Button>
                  <Button variant="outline-secondary" onClick={handleExportCsv}>
                    ⬇️ CSV
                  </Button>
                </ButtonGroup>
                <Button
                  variant="warning"
                  onClick={() => onUseAsInput(currentOutput)}
                  className="flex-grow-1" // Removed me-2 as it's now the last button
                >
                  ➡️ Output {`→`} Input
                </Button>
              </div>

              <div className="d-flex justify-content-between mb-3">
                {showDevMode && (
                  <Button
                    variant="info"
                    onClick={handleGenerateClick}
                    className="flex-grow-1 me-2"
                    disabled={isGenerating || !isApiKeyEnabled || !apiKey} // Disable button when generating or API key is not enabled/empty
                  >
                    {isGenerating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaRocket /> Generate AI Response
                      </>
                    )}
                  </Button>
                )}

                {showDevMode && (
                  <Button
                    variant="outline-secondary" // Changed variant
                    onClick={() => setShowDevModeSettingsModal(true)}
                    className="flex-grow-0"
                    title="Pengaturan Mode Pengembang"
                    aria-label="Pengaturan Mode Pengembang"
                  >
                    <FaCog />
                  </Button>
                )}
              </div>
            </div>

            {/* Save Prompt Section (approx 25%) */}
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <Card.Title className="mb-3">5. Simpan Prompt:</Card.Title>
              <div className="d-flex justify-content-between">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="flex-grow-1 me-2"
                >
                  💾 Simpan Prompt
                </Button>
                <Button
                  variant="info"
                  onClick={onShowSavedPrompts}
                  className="flex-grow-1"
                >
                  📚 Prompt Tersimpan
                </Button>
              </div>
            </div>

            {recommendedFrameworks.length > 0 && (
              <div
                style={{
                  flexShrink: 0,
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border-color)",
                  marginTop: "1rem",
                }}
              >
                <Card.Title className="mb-3">
                  Rekomendasi Kerangka Kerja Terkait:
                </Card.Title>
                <div className="d-flex flex-wrap gap-2">
                  {recommendedFrameworks.map((rec) => (
                    <Button
                      key={rec.name}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        onSelectRecommendedFramework(
                          rec.name,
                          rec.category,
                          rec.subcategory,
                        );
                      }}
                    >
                      {rec.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        </Card.Body>
      </Card>

      {/* Save Confirmation Modal */}
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        centered
        dialogClassName="modal-themed"
      >
        <Modal.Header closeButton className="modal-header-themed">
          <Modal.Title>Notifikasi Penyimpanan</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-themed">
          <p>{saveModalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer-themed">
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {showDevMode && (
        <DevModeSettingsModal
          show={showDevModeSettingsModal}
          onHide={() => setShowDevModeSettingsModal(false)}
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          apiKey={apiKey}
          setApiKey={setApiKey}
          formData={formData}
          handleInputChangeWithValidation={handleInputChangeWithValidation}
          validationErrors={validationErrors}
        />
      )}

      <AiResponseModal
        show={showAiResponseModal}
        onHide={() => setShowAiResponseModal(false)}
        aiResponse={aiResponse}
        aiError={aiError}
        isGenerating={isGenerating}
      />

      {/* Diff Modal */}
      <Modal
        show={showDiffModal}
        onHide={() => setShowDiffModal(false)}
        centered
        dialogClassName="modal-themed"
        size="lg"
      >
        <Modal.Header closeButton className="modal-header-themed">
          <Modal.Title>Perbandingan Output</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-themed">
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              backgroundColor: "#282a36", // Dark theme background
              color: "#f8f8f2", // Default light text
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            {diffContent.split("\n").map((line, i) => {
              const color = line.startsWith("+ ")
                ? "#50fa7b" // Green for additions
                : line.startsWith("- ")
                  ? "#ff5555" // Red for deletions
                  : "inherit"; // Default color for unchanged lines
              return (
                <span key={i} style={{ color: color, display: "block" }}>
                  {line}
                </span>
              );
            })}
          </pre>
        </Modal.Body>
        <Modal.Footer className="modal-footer-themed">
          <Button variant="secondary" onClick={() => setShowDiffModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OutputDisplay;
