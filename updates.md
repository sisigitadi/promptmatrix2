
# PromptMatrix - Feature & Update Log

This document provides a history of major features and updates to the PromptMatrix application, helping users understand its evolution and current capabilities.

---
## V6.4.1 (Mobile Responsive UI Overhaul & 100% Bilingual Translation Audit)
*   **📱 Mobile Header & Responsive Viewport Perfection:**
    *   **Guaranteed Visibility:** Language switcher (Globe + "ID"/"EN") and AI Configuration button (Sparkle + status glow + "AI") are 100% visible on small smartphones ($\le 360\text{px} - 420\text{px}$).
    *   **Zero Horizontal Overflow:** Middle Studio/Gallery switcher is responsive (`hidden sm:flex`) to eliminate horizontal scrollbars and layout clipping.
    *   **Touch Targets:** Action buttons enlarged to $\ge 32\text{px}\times 32\text{px}$ on mobile and $\ge 36\text{px}$ on desktop.
    *   **Safe Area Padding:** Mobile quick-action floating dock includes `env(safe-area-inset-bottom)` for iPhone home indicator and Android gesture bars.
    *   **iOS Safari Bugfix:** Fixed form input auto-zoom on mobile devices (`font-size: 16px !important`).
*   **🌐 100% Bidirectional Bilingual Translation (Zero Untranslated Content):**
    *   **260 English Formulas in ID Mode:** Added comprehensive `EN_TO_ID_FRAMEWORK_NAMES_MAP` in `services/localizationService.ts` mapping all 260 English framework names to official, high-quality Indonesian titles.
    *   **100 Indonesian Formulas in EN Mode:** Fixed Review modal and stash displays using `translateFrameworkName`.
    *   **52 Form Labels & 52 Guidance Infos:** Fully mapped across `COMPLETE_LABELS_MAP`, `ALL_INFOS_MAP`, and `EN_TO_ID_LABELS_MAP`.
    *   **62 Dropdown Options:** Fully translated in `OPTION_TRANSLATIONS` and `EN_TO_ID_OPTIONS_MAP`.
    *   **ToolType Badges:** Dynamic bilingual badge rendering on gallery cards (`Teks`, `Kode`, `Gambar`, `Video`, `Audio & Musik`, `Perencanaan`, `Umum`).
*   **🤖 AI Features Enabled by Default:**
    *   `showAIFeatures` initialized to `true` out of the box, giving immediate access to AI Suggestion, AI Prompt Enhancement, and Quality Scoring.

---
## V6.4.0 (360 Masterclass Formulas, AI Sanitizer, Bundle Splitting & Stash Markdown)
*   **💎 360 Masterclass Formulas (2026 Ready):**
    *   Added 10 new high-demand frameworks:
        *   **GCC Reasoning Framework**: Goal-Constraint-Context for reasoning LLMs (Claude 3.7 Thinking, DeepSeek-R1, o1/o3).
        *   **Classic AIDA**: Attention-Interest-Desire-Action legendary copywriting formula.
        *   **Midjourney v6.1 Consistency**: Multi-scene character & style transfer (`--cref`, `--cw`, `--sref`, `--style raw`).
        *   **FLUX.1 Descriptive Studio**: Natural language photorealism with real optics (Leica, Cooke S4, Hasselblad).
        *   **Kling 1.5 & Runway Gen-3 Director**: Cinematic camera movements (Dolly, Crane, Orbit, Tracking) and motion intensity.
        *   **Suno v4 Lyrical Architect**: Full structural tags (`[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]`), BPM, and vocal timbres.
        *   **AI Coding Agent Rules**: Strict `.cursorrules` & Windsurf architecture guardrails and testing protocols.
        *   **MCP Server Designer**: Anthropic Model Context Protocol custom tools and `claude_desktop_config.json`.
        *   **TikTok Shop & Shopee Live Script**: 3-second retention hooks and yellow cart flash sale triggers.
        *   **LPDP Scholarship Essay**: Golden thread aligning national critical issues with post-study contribution.
*   **🧹 AI Enhance Output Sanitizer (`sanitizePromptText`):**
    *   Eliminates markdown code fences (```markdown) and bold formatting asterisks (**) leaking from LLMs.
*   **⚡ High-Performance Vite Code Splitting:**
    *   Separated vendor and dataset chunks (`data-frameworks`, `data-localization`, `vendor-react`).
    *   Main JS bundle reduced from 1,415 kB to 152 kB (89% bandwidth reduction).
*   **📦 Stash Markdown Export & Clean SVG Icons:**
    *   Added one-click export of saved prompts to Markdown (`.md`) format.
    *   Replaced raw emojis with clean SVG icons across the Stash drawer and quick tags.
*   **🛡️ ErrorBoundary Safeguard:**
    *   Emergency cache reset no longer wipes saved API keys (`pm_ai_settings`) or activation status (`pm_ai_unlocked`).
*   **🌐 Domain & SEO Unification:**
    *   Updated all metadata to `https://prompt.sigitadi.id` authored by Sigit Adi.

---
## V6.3.1 (Developer Portfolio Link in Header)
*   **🔗 Portfolio Link in Header Brand Area:**
    *   Added a subtle `🌐 sigitadi.id` link next to the header subtitle, linking to `https://sigitadi.id/` (opens in new tab).
    *   Visible on `md:` breakpoint and above (tablet & desktop). Hidden on mobile to keep the header compact.
    *   Styled with emerald accent colors (`emerald-500/70` → hover `emerald-400`) consistent with the design system.
*   **Documentation & Versioning:** Updated `package.json` to `6.3.1`, `CHANGELOG.md`, `updates.md`.

---
## V6.3.0 (Smart Language Detection & Landing Flow Polish)
*   **🌐 Smart Browser Locale Detection & EN Default:**
    *   PromptMatrix now defaults to English (`EN`) while automatically inspecting the user's browser locale (`navigator.languages` / `navigator.language`).
    *   If the user's browser language begins with `id` or `in` (Indonesian), the application automatically initializes in Bahasa Indonesia (`ID`).
    *   Explicit language toggling via the header button persists across reloads via `localStorage`.
    *   Synchronized `<html lang="...">` dynamically for enhanced accessibility and crawler recognition.
*   **🧭 Landing Page Navigation Fix:**
    *   Resolved an initial-mount issue where the app previously auto-switched to Studio mode under "Koleksi & Inovasi - Prinsip Kepemimpinan & Evaluasi Produk" (Pareto Principle).
    *   The app now cleanly and reliably opens on the **Template Gallery** overview landing page.
    *   Template grid ordering now accurately follows `CATEGORY_ORDER`, showcasing "Teks & Konten" at the forefront.
*   **Documentation & Versioning:** Updated `package.json`, `CHANGELOG.md`, `updates.md`, and `README.md`.

---
## V6.2.0 (Previous Version - UI/UX Fixes)
*   **UI/UX Bug Fixes & Polish:**
    *   **Mobile Subtitle Wrapping:** Fixed an issue where the app subtitle in the header could be truncated on mobile devices by ensuring proper text wrapping logic. The subtitle now correctly wraps to multiple lines if necessary on smaller screens.
    *   **Teaser Popup Reliability:** Addressed a bug where the "Premium Teaser Popup" might not appear reliably as intended on initial load after disclaimer/how-to-use modals. The trigger logic has been refined to ensure the `localStorage` flag (marking it as "shown") is set more accurately when the popup is actually scheduled to display.
    *   **Category & Framework Toggles (Reviewed):** Existing hover effects for category and framework selection buttons were reviewed. Confirmed they already provide unique and informative feedback (icon scaling, button lift, background/text color changes on hover) as per recent requests, so no structural changes were needed for these elements.
*   **Documentation:** Updated `updates.md` and `README.md` to reflect these fixes.
*   **Version:** Maintained at `V6.2.0` as these are primarily bug fixes and minor polish to existing V6.2.0 features.

---
## V6.2.0 (Initial Release - Premium Preparation & UI Polish)
*   **Premium Feature Preparation & Freemium Model Articulation:**
    *   **Visual Distinction for AI Features:** All AI-powered features (Framework Finder & Researcher, Per-Field Suggestions, Overall Feedback, Detailed Analysis, AI Web Research) now use a consistent `AiTextIcon`. This icon dynamically changes appearance (color, animation) based on `apiKeyAvailable` (simulating active premium status) or appears desaturated/static if premium features are notionally inactive.
    *   **Clearer User Communication on Premium:**
        *   Tooltips for disabled AI features consistently state: "Premium Feature: Subscription Required (Coming Soon)."
        *   Content in `SubscriptionInfoModal` and `TeaserPopupModal` has been reviewed and updated to clearly explain the freemium model, the value of core free features, and the "premium features coming soon" status for AI-driven enhancements.
*   **UI/UX Enhancements:**
    *   The `AiTextIcon` serves as the standard visual indicator for all AI-powered functionalities, improving UI consistency.
    *   Improved handling and clarity for the "Other..." option in interactive single-choice dropdowns within the Interactive Prompt Builder.
    *   General styling refinements applied to modals and various interactive elements for a more polished user experience.
*   **Content Update:**
    *   Added the "AIDA" (Attention, Interest, Desire, Action) framework to the list of Text Prompt Frameworks.
*   **Code Cleanup:**
    *   Removed the unused `FavTextIcon.tsx` component and its associated imports, streamlining the codebase.
*   **Version Update:** Application version updated to `V6.2.0` across all relevant files and documentation.

---
## V6.1.7 (Maintenance & Info Update)
*   **Version Update & Consistency:** Application version updated to `V6.1.7`.
*   **Informational Content Review:** Updated content within Disclaimer, How To Use, and Learn About Premium modals.
*   **API Key Security:** Re-confirmed adherence to best practices.
*   **Code Cleanup:** Removed unused `FavTextIcon.tsx` (initial step).

---

## V6.0.0 
*   **Freemium Model & Premium AI Teasers:**
    *   Core prompt building and management features remain free.
    *   AI-powered features (Framework Suggester, Per-Field Suggestions, Overall Feedback, Detailed Analysis, AI Web Research) are now presented as premium features requiring a future subscription.
    *   "Premium Plan" / "Free Plan" badges and Subscription Info Modal added.
    *   Teaser Popup for upcoming premium AI capabilities.
*   **🔬 AI-Powered Detailed Prompt Analysis (Premium Feature - Subscription Coming Soon):**
    *   Users can request a **Detailed Analysis** of their generated prompt.
    *   AI (Gemini) provides a structured breakdown including: Clarity Score, Specificity Score, Potential Ambiguities, Actionable Suggestions, and Overall Assessment.
    *   Tombol baru "Analisis Detail dengan AI 📊" ditambahkan di panel Pratinjau Prompt.
    *   Hasil analisis ditampilkan secara terstruktur di bawah pratinjau prompt, dalam format yang mudah dibaca.
*   **🌐 AI Web Research (Premium Feature - Subscription Coming Soon):**
    *   "AI Framework Finder" enhanced to "AI Framework Finder & Researcher".
    *   AI (Gemini with Google Search grounding) summarizes findings on new prompt techniques and provides source links.
*   **UI/UX Refinements:** Ongoing minor improvements.

---

## V5.5.0
*   **Documentation:**
    *   Created `updates.md` file (this file) for a comprehensive feature and update log.
    *   Updated footer version to V5.5.0.
    *   Created `release-notes.md` for detailed technical release information.
    *   Adopted Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`).
*   **Minor UI:** Adjustments to align with SemVer and documentation updates.

---

## V5.1 - V5.4 (Incremental Enhancements)

This period focused on data management enhancements, usability improvements, and refining existing features.

*   **Data Management:**
    *   **Export/Import for Saved prompts:**
        *   Added functionality to export all saved prompts from the "Saved prompts" list into a single JSON file (`promptmatrix_stash_backup.json`).
        *   Allowed users to import prompts from a previously exported JSON file back into their list of saved prompts.
        *   Toast notifications confirm successful export/import or indicate errors.
*   **User Experience (UX):**
    *   **Favorite Frameworks:** (This feature was subsequently removed to simplify the UI/UX).
        *   Users could mark/unmark frameworks as "favorites".
        *   Favorited frameworks were visually distinct and sorted.
        *   Favorite status was persisted in `localStorage`.
*   **Code & Logic:**
    *   Refinements to the interactive prompt assembly logic for cleaner and more accurate prompt generation.
    *   Updated `README.md` and `LICENSE.md` for clarity and completeness.
    *   General code cleanup and minor bug fixes.

---

## V5.0 - Data Management & Major UX Polish

This version marked a significant step in making PromptMatrix a more robust and user-friendly tool for managing and creating prompts.

*   **Core Feature - Saved prompts (My Saved Prompts):**
    *   Implemented local prompt storage using **IndexedDB**.
    *   Users can **Save** their crafted prompts.
    *   A dedicated "Saved prompts" panel allows users to:
        *   View a list of saved prompts with details (name, framework, date, preview).
        *   **Load** saved prompts back into the editor.
        *   **Rename** saved prompts.
        *   **Delete** saved prompts (with confirmation).
    *   This feature is available regardless of API key status.
*   **Framework Navigation:**
    *   Added a **Search/Filter bar** above the framework list to quickly find frameworks by name or description.
*   **User Feedback:**
    *   Implemented **Toast Notifications** for actions like saving, loading, deleting prompts, and for errors.
*   **UI & Styling:**
    *   Introduced more sophisticated animations and visual feedback for button clicks and UI interactions.
    *   Improved layout for new panels (Saved prompts).
    *   Enhanced non-copyable placeholder text styling for better clarity.
    *   Consistent prompt preview logic, showing instructional text until significant user input.

---

## V4.0 - Interactive Prompt Studio & Advanced AI

This was a transformative update, revolutionizing how users interact with Media and Music frameworks and expanding AI capabilities.

*   **Revolutionized Prompt Creation - Interactive Prompt Studio:**
    *   All **Image, Video, and Music frameworks** converted to use a new **Interactive Prompt Builder**.
    *   Guides users step-by-step with diverse input types:
        *   **Manual Input:** For free-form descriptions.
        *   **Single-Choice (Dropdowns):** For parameters with common options, including an "Other..." option that reveals a manual text input.
        *   **Multiple-Choice (Collapsible Checkboxes):** For elements with multiple selectable options, presented in a space-saving collapsible format.
*   **Enhanced AI Integration (Requires API Key):**
    *   **AI Framework Suggester:** Users can describe their goal, and AI suggests relevant frameworks, visually highlighted in the UI.
    *   **AI Suggestions for "Other..." Inputs:** Contextual AI help when "Other..." is selected in interactive dropdowns.
    *   Existing AI features (per-field suggestions, overall prompt feedback) were refined.
*   **UI/UX Overhaul:**
    *   **Dynamic API Key Status Indicator:** Header now clearly shows "AI Inside" (or similar) if an API key is active, or "Disconnected" if not, with distinct styling and animation.
    *   Refined collapsible panel behavior for main input/output areas.
    *   Improved visual consistency and aesthetics across the application.
    *   More intelligent prompt assembly logic for interactive frameworks, producing cleaner outputs in the "Prompt Preview."

---

## V3.0 - AI Integration (Early Features)

Introduced the first set of AI-powered assistance features, dependent on a user-provided Google Gemini API Key.

*   **AI-Powered Prompt Enhancement (API Key Dependent):**
    *   **Overall Prompt Feedback:** Button ("Get AI Suggestions" or similar) to submit the generated prompt to Gemini for analysis and feedback on strengths, weaknesses, and suggestions.
    *   **Per-Field Suggestions (Text Frameworks):** AI-powered autocomplete/suggestions for individual input fields in text-based frameworks.
*   **User Guidance & Transparency:**
    *   Clear visual and functional disabling of AI features if no API key is detected.
    *   **Disclaimer Modal:** Introduced to inform users about the tool's purpose, AI feature dependency, and privacy.
    *   **How-To-Use Modal:** Added a guided tour of the application's features and workflow, including a visual diagram.

---

## V2.0 - Media & Music Frameworks Introduced

Expanded the scope of PromptMatrix beyond text-based prompts.

*   **New Framework Categories:** Added "Media" (for Image & Video AI) and "Music" (for Music & Audio AI) categories.
*   **Initial Framework Structures:** Provided foundational, non-interactive (component-based) frameworks for popular media and music AI tools like Midjourney, DALL-E, Suno AI, etc.
*   **Tool Links:** Integrated direct links to the official websites/platforms for many of the supported AI tools.

---

## V1.0 - Core Conception & Text Frameworks

The initial release of PromptMatrix, establishing its core purpose as an educational tool for prompt engineering.

*   **Educational Goal:** Designed to help users learn and understand the principles of effective prompt construction.
*   **Text Prompt Frameworks:** Focused on well-known text-based prompting methodologies (e.g., RTF, TRACE, CARE, TAG).
*   **Component-Based Input:** Users fill in distinct components of a chosen framework.
*   **Real-Time Prompt Preview:** Dynamically generated prompt output based on user inputs.
*   **Core Functionality:**
    *   Copy to Clipboard for easy transfer of prompts.
    *   Bilingual Interface (English & Indonesian).
    *   Responsive Design with a Dark Theme.
*   **Static Content:** Frameworks and examples were primarily hardcoded.
*   **No AI Integration:** Functioned purely as a local, client-side tool for prompt construction and learning.

---
*This log is intended to be a high-level overview. Specific sub-versions might have included minor bug fixes and UI tweaks not detailed exhaustively here.*
