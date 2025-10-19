import React, { useState, useEffect, Suspense, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Container, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import { generateFileName } from "@/utils/promptGenerators";
import "react-toastify/dist/ReactToastify.css";

// Lazy load main components
const Header = React.lazy(() => import("@/components/Header"));
const GeneratorView = React.lazy(() => import("@/components/GeneratorView"));
const Dashboard = React.lazy(() => import("@/components/Dashboard"));
const SavedPromptsDisplay = React.lazy(
  () => import("@/components/SavedPromptsDisplay"),
);
const HelpModal = React.lazy(() => import("@/components/HelpModal"));
const FrameworkBuilderModal = React.lazy(
  () => import("@/components/FrameworkBuilderModal"),
);
const ErrorBoundary = React.lazy(() => import("@/components/ErrorBoundary"));
const Footer = React.lazy(() => import("@/components/Footer"));
const FeedbackModal = React.lazy(() => import("@/components/FeedbackModal"));
const CookieConsent = React.lazy(() => import("@/components/CookieConsent"));

const App = () => {
  // Top-level state
  const [activeView, setActiveView] = useState("generator");
  const [promptToLoad, setPromptToLoad] = useState<any | null>(null);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showDevMode, setShowDevMode] = useState<boolean>(
    () => localStorage.getItem("showDevMode") === "true",
  );
  const [isApiKeyEnabled, setIsApiKeyEnabled] = useState<boolean>(
    () => localStorage.getItem("isApiKeyEnabled") === "true",
  );
  const [apiKey, setApiKey] = useState<string>(
    () => localStorage.getItem("apiKey") || "",
  );
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [isLightTheme, setIsLightTheme] = useState<boolean>(
    () => localStorage.getItem("isLightTheme") === "true",
  );
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFrameworkBuilderModal, setShowFrameworkBuilderModal] =
    useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState<boolean>(
    () => localStorage.getItem("hasCompletedOnboarding") !== "true",
  );

  // Saved prompts state and handlers
  const [savedPrompts, setSavedPrompts] = useState<any[]>(() => {
    const localData = localStorage.getItem("savedPrompts");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleSavePrompt = useCallback((promptData: any) => {
    const newPrompt = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      frameworkName: promptData.frameworkName,
      category: promptData.category,
      subcategory: promptData.subcategory,
      versions: [
        {
          timestamp: Date.now(),
          formData: promptData.formData,
          customInputs: promptData.customInputs,
          naturalLanguageOutput: promptData.naturalLanguageOutput,
          jsonOutput: promptData.jsonOutput,
        },
      ],
    };
    setSavedPrompts((prev) => [...prev, newPrompt]);
    toast.success("Prompt berhasil disimpan!");
  }, []);

  const handleLoadPrompt = useCallback(
    (versionData: any, parentPrompt: any) => {
      setPromptToLoad({ versionData, parentPrompt });
      setActiveView("generator");
      toast.info("Memuat prompt di tampilan generator...");
    },
    [],
  );

  const handleLoadComplete = useCallback(() => {
    setPromptToLoad(null);
  }, []);

  const handleDeletePrompt = useCallback((id: number) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
    toast.info("Prompt berhasil dihapus!");
  }, []);

  const handleExportPrompts = useCallback((prompts: any[]) => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = generateFileName("all_saved_prompts", "json");
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.info("Prompt berhasil diekspor!");
  }, []);

  const handleImportPrompts = useCallback(
    (importedPrompts: any[]) => {
      if (
        !Array.isArray(importedPrompts) ||
        !importedPrompts.every(
          (p) => typeof p === "object" && p !== null && "id" in p,
        )
      ) {
        toast.error("Format file impor tidak valid.");
        return;
      }
      const existingIds = new Set(savedPrompts.map((p) => p.id));
      const newPrompts = importedPrompts.filter((p) => !existingIds.has(p.id));
      setSavedPrompts((prev) => [...prev, ...newPrompts]);
      toast.success(`${newPrompts.length} prompt berhasil diimpor!`);
    },
    [savedPrompts],
  );

  // Navigation handler
  const handleNavigate = (view: string) => setActiveView(view);

  // Dev mode logic
  const handleLogoClick = useCallback(() => {
    setLogoClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 9) {
        setShowDevMode((prevShowDevMode) => !prevShowDevMode);
        setIsApiKeyEnabled((prevIsApiKeyEnabled) => !prevIsApiKeyEnabled);
        setLogoClickCount(0);
      }
      return newCount;
    });
  }, [setShowDevMode, setIsApiKeyEnabled]);

  // Theme and local storage effects
  useEffect(() => {
    localStorage.setItem("showDevMode", String(showDevMode));
  }, [showDevMode]);

  useEffect(() => {
    document.body.classList.toggle("light-theme", isLightTheme);
    localStorage.setItem("isLightTheme", String(isLightTheme));
  }, [isLightTheme]);

  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("isApiKeyEnabled", String(isApiKeyEnabled));
  }, [isApiKeyEnabled]);

  useEffect(() => {
    localStorage.setItem("hasCompletedOnboarding", String(!showOnboardingTour));
  }, [showOnboardingTour]);

  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </div>
      }
    >
      <Header
        onNavigate={handleNavigate}
        onShowSavedPrompts={() => setShowSavedPrompts(true)}
        onLogoClick={handleLogoClick}
        showDevMode={showDevMode}
        showNavigation={showNavigation}
        setShowNavigation={setShowNavigation}
        onShowHelp={() => setShowHelpModal(true)}
        isLightTheme={isLightTheme}
        setIsLightTheme={setIsLightTheme}
        onShowFrameworkBuilder={() => setShowFrameworkBuilderModal(true)}
      />
      <Container fluid className={`main-container p-4`}>
        {activeView === "generator" ? (
          <GeneratorView
            showDevMode={showDevMode}
            isApiKeyEnabled={isApiKeyEnabled}
            apiKey={apiKey}
            setApiKey={setApiKey}
            showOnboardingTour={showOnboardingTour}
            setShowOnboardingTour={setShowOnboardingTour}
            handleSavePrompt={handleSavePrompt}
            onShowSavedPrompts={() => setShowSavedPrompts(true)}
            promptToLoad={promptToLoad}
            onLoadComplete={handleLoadComplete}
            handleUseAsInput={() => {}} // Placeholder
            onNavigate={handleNavigate} // Pass onNavigate prop
          />
        ) : (
          <Dashboard
            savedPrompts={savedPrompts}
            onNavigate={handleNavigate}
            onLoadPrompt={handleLoadPrompt}
          />
        )}
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <SavedPromptsDisplay
        show={showSavedPrompts}
        onHide={() => setShowSavedPrompts(false)}
        savedPrompts={savedPrompts}
        onLoadPrompt={handleLoadPrompt}
        onDeletePrompt={handleDeletePrompt}
        onExportPrompts={handleExportPrompts}
        onImportPrompts={handleImportPrompts}
        onRenamePrompt={() => {}} // Placeholder
      />
      <Footer
        showDevMode={showDevMode}
        isApiKeyEnabled={isApiKeyEnabled}
        onShowFeedback={() => setShowFeedbackModal(true)}
      />
      <HelpModal show={showHelpModal} onHide={() => setShowHelpModal(false)} />
      <FrameworkBuilderModal
        show={showFrameworkBuilderModal}
        onHide={() => setShowFrameworkBuilderModal(false)}
        isLightTheme={isLightTheme}
      />
      <FeedbackModal
        show={showFeedbackModal}
        onHide={() => setShowFeedbackModal(false)}
      />
      <CookieConsent />
    </Suspense>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
