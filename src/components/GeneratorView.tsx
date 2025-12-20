import React, { useState, useEffect, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import { Framework, FrameworkComponent } from "@/data/frameworks";
import {
  generateJsonPrompt,
  generatePrompt,
  generateUserPreviewPrompt,
  generateVisualPreviewPrompt,
  generateVisualPromptParts,
} from "@/utils/promptGenerators";
import { validateInput } from "@/utils/validation";
import { PromptBlock } from "@/types";
import { useFrameworkNavigation } from "@/hooks/useFrameworkNavigation";

const NavigationPane = React.lazy(() => import("@/components/NavigationPane"));
const FrameworkPane = React.lazy(() => import("@/components/FrameworkPane"));
const OutputDisplay = React.lazy(() => import("@/components/OutputDisplay"));
const OnboardingTour = React.lazy(() => import("@/components/OnboardingTour"));

interface GeneratorViewProps {
  showDevMode: boolean;
  isApiKeyEnabled: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  showOnboardingTour: boolean;
  setShowOnboardingTour: (show: boolean) => void;
  handleSavePrompt: (promptData: any) => void;
  handleUseAsInput: (outputContent: string) => void;
  onShowSavedPrompts: () => void;
  promptToLoad: any | null;
  onLoadComplete: () => void;
  onNavigate: (view: string) => void; // Added onNavigate prop
}

const GeneratorView: React.FC<GeneratorViewProps> = ({
  showDevMode,
  isApiKeyEnabled,
  apiKey,
  setApiKey,
  showOnboardingTour,
  setShowOnboardingTour,
  handleSavePrompt,
  handleUseAsInput,
  onShowSavedPrompts,
  promptToLoad,
  onLoadComplete,
  onNavigate,
}) => {
  const dispatch = (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case "SET_FORM_DATA":
        setFormData(action.payload.formData);
        setCustomInputs({});
        break;
      case "RESET_FORM":
        setFormData({});
        setCustomInputs({});
        break;
      default:
        break;
    }
  };

  const {
    selectedCategory,
    setSelectedCategory,
    selectedFramework,
    setSelectedFramework,
    openSubcategories,
    manualOpenSubcategories,
    searchQuery,
    debouncedSearchQuery,
    toolTypeFilter,
    handleToolTypeFilterChange,
    filteredFrameworks,
    currentFrameworkDetails,
    handleCategorySelect,
    handleFrameworkSelect,
    handleSearchChange,
    handleSubcategoryToggle,
    handleBackToCategories,
    isLoading,
  } = useFrameworkNavigation(dispatch);

  // Renaming isLoading to isNavigationLoading for clarity in usage below
  const isNavigationLoading = isLoading;

  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [customInputs, setCustomInputs] = useState<{ [key: string]: string }>(
    {},
  );
  const [promptBlocks, setPromptBlocks] = useState<PromptBlock[]>([
    { id: `block-${Date.now()}`, type: "text", content: "" },
  ]);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return sessionStorage.getItem("selectedModel") || "gemini-3.0-flash";
  });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [naturalLanguageOutput, setNaturalLanguageOutput] = useState<
    string | any[]
  >([]);
  const [previewNaturalLanguageOutput, setPreviewNaturalLanguageOutput] =
    useState("");
  const [previewJsonOutput, setPreviewJsonOutput] = useState("");

  // Effect to handle loading a prompt from parent
  useEffect(() => {
    if (promptToLoad) {
      // Destructure correctly based on how handleLoadPrompt constructs the object in App.tsx
      // setPromptToLoad({ versionData, parentPrompt });
      const { parentPrompt, versionData } = promptToLoad;
      const { category, frameworkName } = parentPrompt || {};
      const { formData: loadedFormData, customInputs: loadedCustomInputs } =
        versionData || {};

      if (category) setSelectedCategory(category);
      if (frameworkName) setSelectedFramework(frameworkName);

      setFormData(loadedFormData || {});
      setCustomInputs(loadedCustomInputs || {});

      // Load blocks if available in versionData
      if (versionData && Array.isArray(versionData.naturalLanguageOutput)) {
        // If the saved output was block-based (Visual Builder), try to restore it if possible
        // For now, we mainly support text/JSON framework restoration.
        // If promptsBlocks logic is needed for visual builder restoration:
        /* 
        setPromptBlocks(versionData.naturalLanguageOutput); 
        */
        // Fallback to default for now to prevent errors if type mismatch
        setPromptBlocks([
          { id: `block-${Date.now()}`, type: "text", content: "" },
        ]);
      } else {
        setPromptBlocks([
          { id: `block-${Date.now()}`, type: "text", content: "" },
        ]);
      }

      onLoadComplete();
    }
  }, [promptToLoad, onLoadComplete, setSelectedCategory, setSelectedFramework]);

  const handleInputChangeWithValidation = useCallback(
    (
      name: string,
      value: string | number | boolean | string[],
      inputDetails: FrameworkComponent,
    ) => {
      setFormData((prev) => {
        const newFormData = { ...prev, [name]: value };
        // Only validate string or number
        let error = "";
        if (typeof value === "string" || typeof value === "number") {
          error = validateInput(name, value, inputDetails as any);
        }
        setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        return newFormData;
      });
    },
    [setFormData, setValidationErrors],
  );

  const handleCustomInputChangeWithValidation = useCallback(
    (name: string, value: string, inputDetails: FrameworkComponent) => {
      setCustomInputs((prev) => ({ ...prev, [name]: value }));
      const error = validateInput(name, value, inputDetails);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [`${name}-custom`]: error,
      }));
    },
    [setCustomInputs, setValidationErrors],
  );

  const handleInputBlur = useCallback(
    (name: string) => {
      setTouchedFields((prev) => ({ ...prev, [name]: true }));
    },
    [setTouchedFields],
  );

  const handleModelSelect = useCallback(
    (model: string) => {
      setSelectedModel(model);
    },
    [setSelectedModel],
  );

  const validateForm = (
    data: { [key: string]: any },
    frameworkDetails: Framework | null,
  ) => {
    const errors: { [key: string]: string } = {};
    if (!frameworkDetails) return errors;
    const allInputs: { [key: string]: FrameworkComponent } = {
      ...(frameworkDetails.components
        ? Object.fromEntries(
            frameworkDetails.components.map((c: FrameworkComponent) => [
              c.name,
              c,
            ]),
          )
        : {}),
    };
    for (const name in allInputs) {
      const details = allInputs[name];
      const value = data[name];
      const error = validateInput(name, value, details);
      if (error) errors[name] = error;
    }
    if (frameworkDetails.crossValidationRules) {
      frameworkDetails.crossValidationRules.forEach((rule: any) => {
        if (
          data[rule.triggerField] === rule.triggerValue &&
          !data[rule.dependentField]
        ) {
          errors[rule.dependentField] = rule.errorMessage;
        }
      });
    }
    return errors;
  };

  useEffect(() => {
    if (currentFrameworkDetails && selectedFramework) {
      if (currentFrameworkDetails.framework.builder === "visual") {
        const visualPreview = generateVisualPreviewPrompt(promptBlocks);
        setPreviewNaturalLanguageOutput(visualPreview);
        const promptParts = generateVisualPromptParts(promptBlocks);
        setNaturalLanguageOutput(promptParts);
        setPreviewJsonOutput(JSON.stringify(promptBlocks, null, 2));
      } else {
        const userPreview = generateUserPreviewPrompt(
          currentFrameworkDetails.framework,
          formData,
          customInputs,
        );
        setPreviewNaturalLanguageOutput(userPreview);
        const finalPrompt = generatePrompt(
          currentFrameworkDetails.framework,
          formData,
          customInputs,
        );
        setNaturalLanguageOutput(finalPrompt);
        const json = generateJsonPrompt(
          currentFrameworkDetails.framework,
          selectedFramework,
          formData,
          customInputs,
        );
        setJsonOutput(json); // Set the final JSON output
        setPreviewJsonOutput(json);
      }
      const formValidationErrors = validateForm(
        formData,
        currentFrameworkDetails.framework,
      );
      setValidationErrors(formValidationErrors);
    } else {
      setNaturalLanguageOutput([]);
      setJsonOutput("");
      setPreviewNaturalLanguageOutput("");
      setPreviewJsonOutput("");
      setValidationErrors({});
    }
  }, [
    currentFrameworkDetails,
    selectedFramework,
    formData,
    customInputs,
    promptBlocks,
  ]);

  // Auto-scroll to FrameworkPane on small screens when a framework is selected
  useEffect(() => {
    if (selectedFramework && window.innerWidth < 1200) {
      const element = document.getElementById("framework-pane-container");
      if (element) {
        // Delay slightly to ensure content is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [selectedFramework]);

  return (
    <Row className="flex-grow-1 g-4 align-items-stretch">
      <Col
        xs={12}
        xl={4}
        className={`navigation-pane h-100`}
        id="navigation-pane"
      >
        <NavigationPane
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          debouncedSearchQuery={debouncedSearchQuery}
          filteredFrameworks={filteredFrameworks}
          openSubcategories={openSubcategories}
          manualOpenSubcategories={manualOpenSubcategories}
          handleCategorySelect={handleCategorySelect}
          handleBackToCategories={handleBackToCategories}
          handleFrameworkSelect={handleFrameworkSelect}
          handleSearchChange={handleSearchChange}
          handleSubcategoryToggle={handleSubcategoryToggle}
          toolTypeFilter={toolTypeFilter}
          handleToolTypeFilterChange={handleToolTypeFilterChange}
          isLoading={isNavigationLoading}
          showInitialMessage={
            !selectedCategory && !debouncedSearchQuery && !toolTypeFilter
          }
          onNavigate={onNavigate}
        />
      </Col>

      <Col
        xs={12}
        xl={4}
        className="d-flex flex-column h-100"
        id="framework-pane-container"
      >
        <FrameworkPane
          currentFrameworkDetails={currentFrameworkDetails}
          selectedFramework={selectedFramework}
          formData={formData}
          customInputs={customInputs}
          promptBlocks={promptBlocks}
          onPromptBlocksChange={setPromptBlocks}
          onModelSelect={handleModelSelect}
          selectedModel={selectedModel}
          showDevMode={showDevMode}
          apiKey={apiKey}
          setApiKey={setApiKey}
          handleInputChangeWithValidation={handleInputChangeWithValidation}
          handleCustomInputChangeWithValidation={
            handleCustomInputChangeWithValidation
          }
          validationErrors={validationErrors}
          touchedFields={touchedFields}
          handleInputBlur={handleInputBlur}
        />
      </Col>

      <Col xs={12} xl={4} className="d-flex flex-column h-100">
        <OutputDisplay
          naturalLanguageOutput={naturalLanguageOutput}
          jsonOutput={jsonOutput}
          previewNaturalLanguageOutput={previewNaturalLanguageOutput}
          previewJsonOutput={previewJsonOutput}
          currentFrameworkDetails={currentFrameworkDetails}
          formData={formData}
          customInputs={customInputs}
          selectedFramework={selectedFramework}
          selectedCategory={selectedCategory}
          onUseAsInput={handleUseAsInput}
          onShowSavedPrompts={onShowSavedPrompts}
          showDevMode={showDevMode}
          onSavePrompt={handleSavePrompt}
          apiKey={apiKey}
          setApiKey={setApiKey}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
          isApiKeyEnabled={isApiKeyEnabled}
          handleInputChangeWithValidation={handleInputChangeWithValidation}
          validationErrors={validationErrors}
          onSelectRecommendedFramework={handleFrameworkSelect}
        />
      </Col>

      <OnboardingTour
        show={showOnboardingTour}
        onHide={() => setShowOnboardingTour(false)}
        onComplete={() => setShowOnboardingTour(false)}
      />
    </Row>
  );
};

export default GeneratorView;
