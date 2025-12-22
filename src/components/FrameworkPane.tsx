import React, { useState, useMemo } from "react";
import { getRandomSuggestion } from "../data/suggestions";
import {
  Card,
  Form,
  Button,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Spinner,
} from "react-bootstrap";
import { Framework } from "../data/frameworks";
import { PromptBlock } from "../types";
import VisualPromptBuilder from "./VisualPromptBuilder";
import {
  FaKeyboard,
  FaHashtag,
  FaCalendarAlt,
  FaPalette,
  FaToggleOn,
  FaMousePointer,
  FaCode,
  FaSlidersH,
  FaBan,
  FaMagic,
  FaTimesCircle,
  FaInfoCircle,
  FaImage,
  FaFileAlt,
  FaExclamationCircle,
} from "react-icons/fa";

import { callGeminiApi } from "../utils/api"; // Import API functions
import { toast } from "react-toastify";
import FrameworkMultiSelect from "./framework-inputs/FrameworkMultiSelect";

interface FrameworkPaneProps {
  currentFrameworkDetails: {
    framework: Framework;
    category: string;
    subcategory: string;
  } | null;
  selectedFramework: string | null;
  formData: { [key: string]: any };
  customInputs: { [key: string]: string };

  onModelSelect: (model: string) => void; // New prop for model selection
  selectedModel: string; // New prop to hold the selected model
  showDevMode: boolean; // New prop to control API-related features

  apiKey: string;
  setApiKey: (key: string) => void;
  handleInputChangeWithValidation: (
    name: string,
    value: string | number | boolean | string[],
    inputDetails: any,
  ) => void; // New prop
  handleCustomInputChangeWithValidation: (
    name: string,
    value: string,
    inputDetails: any,
  ) => void; // New prop
  validationErrors: { [key: string]: string }; // New prop
  touchedFields: { [key: string]: boolean }; // New prop
  handleInputBlur: (name: string) => void; // New prop
  promptBlocks: PromptBlock[];
  onPromptBlocksChange: (blocks: PromptBlock[]) => void;
}

const FrameworkPane: React.FC<FrameworkPaneProps> = ({
  currentFrameworkDetails,
  selectedFramework,
  formData,
  customInputs,

  onModelSelect: _onModelSelect,
  selectedModel,
  showDevMode,

  apiKey,
  setApiKey: _setApiKey,
  handleInputChangeWithValidation,
  handleCustomInputChangeWithValidation,
  validationErrors,
  touchedFields,
  handleInputBlur,
  promptBlocks,
  onPromptBlocksChange,
}) => {
  const [isAiAssisting, setIsAiAssisting] = useState<{
    [key: string]: boolean;
  }>({});

  const dynamicComponentsToRender = useMemo(() => {
    const { framework } = currentFrameworkDetails || {};
    if (!framework?.dynamicSubcomponents) {
      return [];
    }

    // Ensure dynamicSubcomponents is always an array to handle data inconsistency
    const subcomponentsArray = Array.isArray(framework.dynamicSubcomponents)
      ? framework.dynamicSubcomponents
      : [framework.dynamicSubcomponents];

    return subcomponentsArray.flatMap((dynamicSubcomponent) => {
      if (!dynamicSubcomponent || !dynamicSubcomponent.trigger) return [];
      const triggerValue = formData[dynamicSubcomponent.trigger];
      if (triggerValue && dynamicSubcomponent.options[triggerValue]) {
        const optionValue = dynamicSubcomponent.options[triggerValue];
        if (Array.isArray(optionValue)) {
          return optionValue;
        } else if (
          optionValue &&
          typeof optionValue === "object" &&
          "components" in optionValue
        ) {
          return optionValue.components;
        }
      }
      return [];
    });
  }, [currentFrameworkDetails, formData]);

  // This function is a placeholder. In a real application, you'd implement
  // a proper toast notification system (e.g., using react-toastify).
  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  // Placeholder for isApiKeyEnabled. In a real app, this would come from context or props.
  const isApiKeyEnabled = true; // Assuming API key is always enabled if present

  // Make renderFormComponent more generic to handle both old and new structures
  const renderFormComponent = (inputName: string, inputDetails: any) => {
    // Determine properties based on structure
    const compName = inputName;
    // Use 'label' for old components, 'description' for new VARIABEL_INPUT
    const compLabel = String(
      inputDetails.label || inputDetails.description || inputName,
    );
    const compType = inputDetails.type;
    const compPlaceholder = inputDetails.placeholder;
    const compOptions = inputDetails.options;
    const compInfo = inputDetails.info; // 'info' is from old FrameworkComponent
    const isOptional = inputDetails.optional; // New property from SOP

    const handleAiAssist = async (
      name: string,
      value: string,
      details: any,
      compType: string,
    ) => {
      console.log("handleAiAssist - API Key Check:", {
        apiKey,
        isApiKeyEnabled,
        selectedModel,
      });
      if (!apiKey) {
        toast.error(
          "API Key tidak ditemukan. Harap masukkan API Key di Pengaturan Mode Pengembang.",
        );
        return;
      }
      if (!isApiKeyEnabled) {
        toast.error(
          "API Key tidak diaktifkan. Harap aktifkan API Key di Pengaturan Mode Pengembang.",
        );
        return;
      }

      setIsAiAssisting((prev) => ({ ...prev, [name]: true }));

      const currentFramework = currentFrameworkDetails?.framework;
      const aiLogic = currentFramework?.ai_logic_description || "";
      const userPerspective = currentFramework?.perspektif_user || "";
      const role = currentFramework?.komponen_prompt?.PERAN || "";
      const context = currentFramework?.komponen_prompt?.KONTEKS || "";
      const task = currentFramework?.komponen_prompt?.TUGAS || "";

      const aiPrompt = `Anda adalah asisten prompt engineering. Tugas Anda adalah membantu pengguna mengisi atau menyempurnakan bagian dari prompt mereka.\n\nKerangka Kerja Saat Ini:\nNama: ${currentFramework?.nama_kerangka || "N/A"}\nDeskripsi: ${currentFramework?.description || "N/A"}\n\nKomponen yang sedang diisi:\nJudul Komponen: "${compLabel}"\nDeskripsi Variabel: "${details.description}"\nContoh/Placeholder: "${compPlaceholder || "N/A"}"\n\nIni adalah bagian dari kerangka kerja prompt dengan:\nPERAN: ${role}\nKONTEKS: ${context}\nTUGAS: ${task}\n\nLogika AI untuk kerangka kerja ini adalah: "${aiLogic}"\nPerspektif pengguna untuk kerangka kerja ini adalah: "${userPerspective}"\n\nTeks saat ini di bidang ini adalah: "${value}".\n\nInstruksi:\n- Fokuskan respons Anda secara strikt pada variabel "${details.description}" dan judul komponen "${compLabel}" dalam konteks kerangka kerja ini.\n- Jika teks saat ini kosong, hasilkan teks yang relevan dan sesuai dengan deskripsi variabel, judul komponen, dan konteks kerangka kerja.\n- Jika teks saat ini tidak kosong, perbaiki, perluas, atau sempurnakan teks ini agar lebih baik, lebih lengkap, dan sesuai dengan deskripsi variabel, judul komponen, dan konteks kerangka kerja.\n- Berikan hanya teks yang disarankan, tanpa penjelasan tambahan atau pembuka/penutup.\n- Pastikan output Anda langsung dapat digunakan sebagai nilai untuk bidang input ini.\n`;

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

        if (typeof apiResult === "object" && apiResult.error) {
          // Check for the error property
          showToast(
            `Gagal mendapatkan bantuan AI untuk ${compLabel}. ${apiResult.error}`,
            "error",
          );
        } else if (typeof apiResult === "string") {
          handleInputChangeWithValidation(name, apiResult, details);
        }
      } catch (error: any) {
        // Catch any unexpected errors
        console.error("AI Assist Error:", error);
        showToast(
          `Gagal mendapatkan bantuan AI untuk ${compLabel}. Error: ${error.message || String(error)}`,
          "error",
        );
      } finally {
        setIsAiAssisting((prev) => ({ ...prev, [name]: false }));
      }
    };

    const handleClearInput = (name: string, details: any) => {
      handleInputChangeWithValidation(name, "", details);
    };

    if (!compName) return null;

    const getIconForType = (type: string) => {
      switch (type) {
        case "text":
        case "textarea":
          return <FaKeyboard className="me-2" />;
        case "number":
          return <FaHashtag className="me-2" />;
        case "date":
        case "datetime":
          return <FaCalendarAlt className="me-2" />;
        case "color":
          return <FaPalette className="me-2" />;
        case "select":
        case "multiselect":
          return <FaMousePointer className="me-2" />;
        case "boolean":
          return <FaToggleOn className="me-2" />;
        case "code":
          return <FaCode className="me-2" />;
        case "slider":
          return <FaSlidersH className="me-2" />;
        case "negative_prompt":
          return <FaBan className="me-2" />;
        case "image":
          return <FaImage className="me-2" />;
        case "file":
          return <FaFileAlt className="me-2" />;
        default:
          return null;
      }
    };

    return (
      <Form.Group className="mb-3" controlId={compName} key={compName}>
        <Form.Label
          htmlFor={compName}
          className="small mb-1 d-flex align-items-center"
        >
          {getIconForType(compType)}
          {compLabel}

          {compInfo && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-${compName}`}>{compInfo}</Tooltip>}
            >
              <FaInfoCircle className="ms-2" style={{ cursor: "help" }} />
            </OverlayTrigger>
          )}
          {isOptional && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-optional-${compName}`}>
                  Bidang ini bersifat opsional dan dapat dibiarkan kosong.
                </Tooltip>
              }
            >
              <span className="ms-1" style={{ cursor: "help" }}>
                (Opsional)
              </span>
            </OverlayTrigger>
          )}
        </Form.Label>
        {compType === "text" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                type="text"
                id={compName}
                name={compName}
                placeholder={compPlaceholder}
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const suggestion = getRandomSuggestion(compName);
                  console.log(
                    `Dice clicked for ${compName}, suggestion: ${suggestion}`,
                  );
                  if (suggestion) {
                    handleInputChangeWithValidation(
                      compName,
                      suggestion,
                      inputDetails,
                    );
                  } else {
                    showToast(
                      "Maaf, belum ada saran untuk input ini.",
                      "error",
                    );
                  }
                }}
                title="Klik untuk saran acak"
                aria-label={`Saran acak untuk ${compLabel}`}
                className="interactive-input ms-1"
              >
                🎲
              </Button>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "number" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                type="number"
                id={compName}
                name={compName}
                placeholder={compPlaceholder}
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const min = inputDetails.min ?? 0;
                  const max = inputDetails.max ?? 100;
                  const randomVal =
                    Math.floor(Math.random() * (max - min + 1)) + min;
                  handleInputChangeWithValidation(
                    compName,
                    randomVal.toString(),
                    inputDetails,
                  );
                }}
                title="Saran angka acak"
                className="interactive-input ms-1"
              >
                🎲
              </Button>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "textarea" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                as="textarea"
                id={compName}
                name={compName}
                placeholder={compPlaceholder}
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                rows={Math.max(
                  3,
                  (formData[compName] || "").split("\n").length + 1,
                )}
                className="interactive-input"
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "negative_prompt" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                as="textarea"
                id={compName}
                name={compName}
                placeholder={
                  compPlaceholder || "Masukkan hal-hal yang ingin dihindari..."
                }
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                rows={Math.max(
                  2,
                  (formData[compName] || "").split("\n").length + 1,
                )}
                className="interactive-input"
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                aria-label={`Minta bantuan AI untuk ${compLabel}`}
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "color" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                type="color"
                id={compName}
                name={compName}
                placeholder={compPlaceholder}
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                className="interactive-input"
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const randomColor =
                    "#" +
                    Math.floor(Math.random() * 16777215)
                      .toString(16)
                      .padStart(6, "0");
                  handleInputChangeWithValidation(
                    compName,
                    randomColor,
                    inputDetails,
                  );
                }}
                title="Warna acak"
                className="interactive-input ms-1"
              >
                🎲
              </Button>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "date" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                type="date"
                id={compName}
                name={compName}
                placeholder={compPlaceholder}
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "slider" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Range
                id={compName}
                name={compName}
                min={inputDetails.min || 0}
                max={inputDetails.max || 100}
                step={inputDetails.step || 1}
                value={formData[compName] || inputDetails.min || 0}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const min = inputDetails.min ?? 0;
                  const max = inputDetails.max ?? 100;
                  const step = inputDetails.step ?? 1;
                  const steps = Math.floor((max - min) / step);
                  const randomVal =
                    min + Math.floor(Math.random() * (steps + 1)) * step;
                  handleInputChangeWithValidation(
                    compName,
                    randomVal.toString(),
                    inputDetails,
                  );
                }}
                title="Geser acak"
                className="interactive-input ms-1"
              >
                🎲
              </Button>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "select" && (
          <>
            <div className="d-flex align-items-center">
              <InputGroup className="flex-grow-1">
                <Form.Select
                  id={compName}
                  name={compName}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onBlur={() => handleInputBlur(compName)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                >
                  <option value="">Pilih {compLabel}...</option>
                  {compOptions?.map(
                    (option: string | { label: string; value: string }) => {
                      if (typeof option === "string") {
                        return (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        );
                      } else {
                        return (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        );
                      }
                    },
                  )}
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    if (compOptions && compOptions.length > 0) {
                      const randomIndex = Math.floor(
                        Math.random() * compOptions.length,
                      );
                      const randomOpt = compOptions[randomIndex];
                      const val =
                        typeof randomOpt === "string"
                          ? randomOpt
                          : randomOpt.value;
                      handleInputChangeWithValidation(
                        compName,
                        val,
                        inputDetails,
                      );
                    }
                  }}
                  title="Pilih acak"
                  className="interactive-input ms-1"
                >
                  🎲
                </Button>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </div>
            {formData[compName] === "Lainnya..." && (
              <Form.Group className="mt-2" controlId={`${compName}-custom`}>
                <Form.Control
                  type="text"
                  placeholder={`Sebutkan ${compLabel} Lainnya`}
                  value={customInputs[compName] || ""}
                  onChange={(e) =>
                    handleCustomInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onBlur={() => handleInputBlur(`${compName}-custom`)}
                  isInvalid={
                    touchedFields[`${compName}-custom`] &&
                    !!validationErrors[`${compName}-custom`]
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors[`${compName}-custom`]}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </>
        )}
        {compType === "boolean" && (
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id={compName}
              name={compName}
              label={compLabel}
              checked={!!formData[compName]}
              onChange={(e) =>
                handleInputChangeWithValidation(
                  compName,
                  e.target.checked,
                  inputDetails,
                )
              }
              onBlur={() => handleInputBlur(compName)}
              isInvalid={
                touchedFields[compName] && !!validationErrors[compName]
              }
              aria-invalid={
                touchedFields[compName] && !!validationErrors[compName]
                  ? "true"
                  : "false"
              }
              aria-describedby={
                touchedFields[compName] && !!validationErrors[compName]
                  ? `validation-feedback-${compName}`
                  : undefined
              }
            />
            <Form.Control.Feedback
              type="invalid"
              id={`validation-feedback-${compName}`}
            >
              {validationErrors[compName] || " "}
            </Form.Control.Feedback>
          </div>
        )}
        {compType === "code" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                as="textarea"
                id={compName}
                name={compName}
                placeholder={compPlaceholder}
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onBlur={() => handleInputBlur(compName)}
                rows={Math.max(
                  5,
                  (formData[compName] || "").split("\n").length + 1,
                )}
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const suggestion = getRandomSuggestion(compName);
                  if (suggestion) {
                    handleInputChangeWithValidation(
                      compName,
                      suggestion,
                      inputDetails,
                    );
                  } else {
                    showToast("Maaf, belum ada saran untuk kode ini.", "error");
                  }
                }}
                title="Saran kode acak"
                className="interactive-input ms-1"
              >
                🎲
              </Button>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                    compType,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "multiselect" && (
          <FrameworkMultiSelect
            compName={compName}
            compLabel={compLabel}
            compOptions={compOptions}
            formData={formData}
            customInputs={customInputs}
            inputDetails={inputDetails}
            handleInputChangeWithValidation={handleInputChangeWithValidation}
            handleCustomInputChangeWithValidation={
              handleCustomInputChangeWithValidation
            }
            handleInputBlur={handleInputBlur}
            validationErrors={validationErrors}
            touchedFields={touchedFields}
          />
        )}
        {compType === "image" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                type="file"
                name={compName}
                accept="image/*" // Accept only image files
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleInputChangeWithValidation(
                        compName,
                        event.target?.result as string,
                        inputDetails,
                      );
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                onBlur={() => handleInputBlur(compName)}
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        )}
        {compType === "file" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                type="file"
                name={compName}
                accept=".txt,.pdf" // Accept only text and PDF files
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      // For text files, read as text. For PDF, we might need a library to extract text.
                      // For simplicity, we'll read all as text for now.
                      handleInputChangeWithValidation(
                        compName,
                        event.target?.result as string,
                        inputDetails,
                      );
                    };
                    // Read as text for .txt, for .pdf it will be base64 which can be processed by AI
                    reader.readAsText(file);
                  }
                }}
                onBlur={() => handleInputBlur(compName)}
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                <FaExclamationCircle className="me-1" />
                {validationErrors[compName] || " "}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        )}
      </Form.Group>
    );
  };

  const [isWizardMode, setIsWizardMode] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  // Reset wizard step when framework changes
  React.useEffect(() => {
    setWizardStep(0);
  }, [selectedFramework]);

  const allComponentsToRender = useMemo(() => {
    const staticComps = currentFrameworkDetails?.framework?.components || [];
    return [...staticComps, ...dynamicComponentsToRender];
  }, [currentFrameworkDetails, dynamicComponentsToRender]);

  const handleNextStep = () => {
    if (wizardStep < allComponentsToRender.length - 1) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };

  const currentWizardComponent = allComponentsToRender[wizardStep];
  const isNextDisabled =
    (currentWizardComponent &&
      !currentWizardComponent.optional &&
      !!validationErrors[currentWizardComponent.name]) ||
    (currentWizardComponent &&
      !currentWizardComponent.optional &&
      !formData[currentWizardComponent.name]);

  return (
    <Card className="flex-grow-1 h-100">
      <Card.Body className="d-flex flex-column text-start">
        <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
          <h2 className="h5 mb-0">3. Komponen Kerangka Kerja:</h2>
          <Form.Check
            type="switch"
            id="wizard-mode-switch"
            label="Mode Wizard"
            checked={isWizardMode}
            onChange={() => setIsWizardMode(!isWizardMode)}
            title="Aktifkan untuk mode panduan langkah-demi-langkah"
          />
        </div>

        {!currentFrameworkDetails ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center placeholder-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-card-list mb-3"
              viewBox="0 0 16 16"
              style={{
                width: "clamp(40px, 8vw, 64px)",
                height: "clamp(40px, 8vw, 64px)",
                color: "var(--accent-color)",
              }}
            >
              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
              <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
            </svg>
            <h5
              className="text-center"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                color: "var(--text-color)",
              }}
            >
              Pilih Kerangka Kerja
            </h5>
            <p
              className="small text-center"
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                color: "var(--secondary-text-color)",
              }}
            >
              Silakan pilih kategori dan kerangka kerja dari panel di sebelah
              kiri untuk melihat komponennya di sini.
            </p>
          </div>
        ) : currentFrameworkDetails.framework?.builder === "visual" ? (
          <VisualPromptBuilder
            blocks={promptBlocks}
            onBlocksChange={onPromptBlocksChange}
          />
        ) : (
          <>
            <h3 className="h5">{selectedFramework}</h3>
            <p className="small">
              {currentFrameworkDetails.framework?.description}
            </p>
            <div className="flex-grow-1 overflow-auto pe-2">
              {isWizardMode ? (
                // WIZARD MODE UI
                <div className="d-flex flex-column h-100">
                  <div className="flex-grow-1">
                    <p className="text-center mb-2">
                      Langkah {wizardStep + 1} dari{" "}
                      {allComponentsToRender.length}
                    </p>
                    <div
                      className="progress mb-4"
                      role="progressbar"
                      aria-valuenow={
                        ((wizardStep + 1) / allComponentsToRender.length) * 100
                      }
                      aria-valuemin={0}
                      aria-valuemax={100}
                      style={{ height: "8px" }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${((wizardStep + 1) / allComponentsToRender.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {currentWizardComponent && (
                      <div className="mb-3 p-3 border rounded">
                        <p className="fw-bold">
                          Panduan Cara Menggunakan Mode Wizard:
                        </p>
                        <p className="small mb-2">
                          Mode Wizard memandu Anda mengisi prompt langkah demi
                          langkah. Fokus pada satu input relevan per langkah.
                          Gunakan tombol navigasi. Bidang wajib diisi sebelum
                          lanjut. Mode ini ideal untuk prompt kompleks atau
                          pengguna baru. Matikan sakelar &apos;Mode Wizard&apos;
                          untuk keluar.
                        </p>
                        <p className="fw-bold">Deskripsi Kerangka Kerja:</p>
                        <p className="small mb-0">
                          {currentFrameworkDetails.framework?.description && (
                            <p className="mb-1">
                              <strong>Ringkasan:</strong>{" "}
                              {currentFrameworkDetails.framework.description}
                            </p>
                          )}
                          {currentFrameworkDetails.framework
                            ?.perspektif_user && (
                            <p className="mb-1">
                              <strong>Perspektif Pengguna:</strong>{" "}
                              {
                                currentFrameworkDetails.framework
                                  .perspektif_user
                              }
                            </p>
                          )}
                          {currentFrameworkDetails.framework
                            ?.ai_logic_description && (
                            <p className="mb-1">
                              <strong>Logika AI:</strong>{" "}
                              {
                                currentFrameworkDetails.framework
                                  .ai_logic_description
                              }
                            </p>
                          )}
                          {currentFrameworkDetails.framework
                            ?.konteks_tambahan_instruksi_khusus && (
                            <p className="mb-1">
                              <strong>Instruksi Khusus:</strong>{" "}
                              {
                                currentFrameworkDetails.framework
                                  .konteks_tambahan_instruksi_khusus
                              }
                            </p>
                          )}
                          {currentFrameworkDetails.framework
                            ?.contoh_kalimat && (
                            <p className="mb-0">
                              <strong>Contoh Penggunaan:</strong>{" "}
                              {currentFrameworkDetails.framework.contoh_kalimat}
                            </p>
                          )}
                        </p>
                      </div>
                    )}
                    <Form>
                      {currentWizardComponent &&
                        renderFormComponent(
                          currentWizardComponent.name,
                          currentWizardComponent,
                        )}
                    </Form>
                  </div>
                  <div className="mt-auto pt-3 d-flex justify-content-between">
                    <Button
                      variant="secondary"
                      onClick={handlePrevStep}
                      disabled={wizardStep === 0}
                      title="Kembali ke langkah sebelumnya"
                    >
                      &larr; Sebelumnya
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleNextStep}
                      disabled={
                        wizardStep === allComponentsToRender.length - 1 ||
                        isNextDisabled
                      }
                      title="Lanjut ke langkah berikutnya"
                    >
                      Berikutnya &rarr;
                    </Button>
                  </div>
                </div>
              ) : (
                // STANDARD FORM UI
                <Form>
                  {currentFrameworkDetails.framework?.components?.map((comp) =>
                    renderFormComponent(comp.name, comp),
                  )}
                  {dynamicComponentsToRender.length > 0 && (
                    <div className="dynamic-components-section p-3 my-3 rounded">
                      <h6 className="h6 mb-2">Pengaturan Lanjutan:</h6>
                      <p className="small mb-0">
                        Bidang-bidang ini muncul berdasarkan pilihan Anda di
                        atas, menyesuaikan dengan kebutuhan spesifik kerangka
                        kerja.
                      </p>
                    </div>
                  )}
                  {dynamicComponentsToRender.map((comp) =>
                    renderFormComponent(comp.name, comp),
                  )}
                </Form>
              )}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default React.memo(FrameworkPane);
