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
import { PromptBlock } from "@/components/VisualPromptBuilder";
import { Part } from "@google/generative-ai";
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
    setSelectedCategory, // Re-adding for direct manipulation
    selectedFramework,
    setSelectedFramework, // Re-adding for direct manipulation
    openSubcategories,
    searchQuery,
    debouncedSearchQuery,
    toolTypeFilter,
    handleToolTypeFilterChange,
    filteredFrameworks,
    manualOpenSubcategories,
    currentFrameworkDetails,
    handleCategorySelect,
    handleFrameworkSelect,
    handleSearchChange,
    handleSubcategoryToggle,
    handleBackToCategories,
    isLoading: isNavigationLoading,
  } = useFrameworkNavigation(dispatch);

  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [customInputs, setCustomInputs] = useState<{ [key: string]: string }>(
    {},
  );
  const [promptBlocks, setPromptBlocks] = useState<PromptBlock[]>([
    { id: `block-${Date.now()}`, type: "text", content: "" },
  ]);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return sessionStorage.getItem("selectedModel") || "gemini-1.5-flash";
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [naturalLanguageOutput, setNaturalLanguageOutput] = useState<
    string | Part[]
  >([]);
  const [jsonOutput, setJsonOutput] = useState("");
  const [previewNaturalLanguageOutput, setPreviewNaturalLanguageOutput] =
    useState("");
  const [previewJsonOutput, setPreviewJsonOutput] = useState("");

  // Effect to handle loading a prompt from parent
  useEffect(() => {
    if (promptToLoad) {
      const { versionData, parentPrompt } = promptToLoad;

      // Directly set the navigation state without causing side-effects like form clearing
      setSelectedCategory(parentPrompt.category);
      setSelectedFramework(parentPrompt.frameworkName);

      // Then, set the data for that framework
      setFormData(versionData.formData || {});
      setCustomInputs(versionData.customInputs || {});

      if (Array.isArray(versionData.naturalLanguageOutput)) {
        setPromptBlocks(versionData.naturalLanguageOutput);
      } else {
        setPromptBlocks([
          { id: `block-${Date.now()}`, type: "text", content: "" },
        ]);
      }

      // Signal completion to parent to clear the promptToLoad state
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
        const error = validateInput(name, value, inputDetails);
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
    const allInputs = {
      ...(frameworkDetails.components
        ? Object.fromEntries(
            frameworkDetails.components.map((c) => [c.name, c]),
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
      frameworkDetails.crossValidationRules.forEach((rule) => {
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
          showOnboardingTour={showOnboardingTour}
          completeOnboardingTour={() => setShowOnboardingTour(false)}
          onNavigate={onNavigate}
        />
      </Col>

      <Col xs={12} xl={4} className="d-flex flex-column h-100">
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
          isApiKeyEnabled={isApiKeyEnabled}
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
          handleInputChangeWithValidation={handleInputChangeWithValidation}
          validationErrors={validationErrors}
          isApiKeyEnabled={isApiKeyEnabled}
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
