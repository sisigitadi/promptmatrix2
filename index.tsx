import React, { useState, useEffect, Suspense, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Container, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import { generateFileName } from "@/utils/promptGenerators";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
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
const InputSelectionModal = React.lazy(
  () => import("@/components/InputSelectionModal"),
);
const ErrorBoundary = React.lazy(() => import("@/components/ErrorBoundary"));
const Footer = React.lazy(() => import("@/components/Footer"));
const FeedbackModal = React.lazy(() => import("@/components/FeedbackModal"));
const CookieConsent = React.lazy(() => import("@/components/CookieConsent"));

import { PROMPT_FRAMEWORKS } from "@/data/frameworks";

const App = () => {
  // Top-level state
  const [activeView, setActiveView] = useState("generator");
  const [promptToLoad, setPromptToLoad] = useState<any | null>(null);
  const [logoClickCount, setLogoClickCount] = useState<number>(() => {
    const saved = localStorage.getItem("logoClickCount");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showDevMode, setShowDevMode] = useState<boolean>(
    () => localStorage.getItem("showDevMode") === "true",
  );
  const [isApiKeyEnabled, setIsApiKeyEnabled] = useState<boolean>(
    () => localStorage.getItem("isApiKeyEnabled") === "true",
  );
  const [apiKey, setApiKey] = useState<string>(
    () => sessionStorage.getItem("apiKey") || "",
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
  const [showInputSelectionModal, setShowInputSelectionModal] = useState(false);
  const [outputToChain, setOutputToChain] = useState("");

  const {
    savedPrompts,
    handleSavePrompt,
    handleExportPrompts,
    handleImportPrompts,
    handleDeletePrompt,
    toggleFavorite,
  } = useSavedPrompts();

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

  // Chaining logic
  const handleUseAsInput = useCallback((outputContent: string) => {
    setOutputToChain(outputContent);
    setShowInputSelectionModal(true);
  }, []);

  const handleSelectInputForChaining = useCallback(
    (frameworkName: string, inputName: string, inputValue: string) => {
      // Find category for the selected framework
      let foundCategory = "";
      Object.entries(PROMPT_FRAMEWORKS).forEach(([cat, subs]) => {
        Object.values(subs).forEach((fws) => {
          if (Object.keys(fws).includes(frameworkName)) {
            foundCategory = cat;
          }
        });
      });

      if (foundCategory) {
        setPromptToLoad({
          versionData: {
            formData: { [inputName]: inputValue },
          },
          parentPrompt: {
            category: foundCategory,
            frameworkName: frameworkName,
          },
        });
        setShowInputSelectionModal(false);
        setActiveView("generator");
        toast.success(`Chaining ke ${frameworkName} berhasil!`);
      } else {
        toast.error("Gagal menemukan kategori untuk kerangka kerja tersebut.");
      }
    },
    [],
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
        localStorage.setItem("logoClickCount", "0");
        return 0;
      }
      localStorage.setItem("logoClickCount", String(newCount));
      return newCount;
    });
  }, [setShowDevMode, setIsApiKeyEnabled]);

  // Theme and local storage effects
  useEffect(() => {
    localStorage.setItem("showDevMode", String(showDevMode));
  }, [showDevMode]);

  useEffect(() => {
    document.body.classList.toggle("light-theme", isLightTheme);
    document.documentElement.setAttribute(
      "data-bs-theme",
      isLightTheme ? "light" : "dark",
    );
    localStorage.setItem("isLightTheme", String(isLightTheme));
  }, [isLightTheme]);

  useEffect(() => {
    sessionStorage.setItem("apiKey", apiKey);
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
      <Container fluid className={`main-container`}>
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
            handleUseAsInput={handleUseAsInput}
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
        toggleFavorite={toggleFavorite}
      />
      <InputSelectionModal
        show={showInputSelectionModal}
        onHide={() => setShowInputSelectionModal(false)}
        outputToChain={outputToChain}
        onSelectInput={handleSelectInputForChaining}
      />
      <Footer
        showDevMode={showDevMode}
        isApiKeyEnabled={isApiKeyEnabled}
        onShowFeedback={() => setShowFeedbackModal(true)}
        onNavigate={handleNavigate}
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
