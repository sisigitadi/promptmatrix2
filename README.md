# Prompt Matrix 2.0 - Professional Prompt Engineering Suites

Prompt Matrix 2.0 is a state-of-the-art web application designed to revolutionize the way you create, curate, and optimize AI prompts. Built with a focus on structured prompt engineering, it provides a powerful toolkit for AI power users, developers, and creative professionals to achieve high-quality, predictable outputs from any Large Language Model (LLM).

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://sisigitadi.github.io/promptmatrix2/)
![Version](https://img.shields.io/badge/Version-2.0.2-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

---

## 🚀 Key Features

### 1. Structured Framework Engine
Access hundreds of pre-defined frameworks across multiple domains like **Coding, Creative, Business, and Strategy**. Each framework is built on proven prompt engineering principles (Role, Context, Task, Format Output).

### 2. Intelligent Prompt Management
- **Local Persistence:** Save and manage your prompts locally with version history.
- **Multi-format Export:** Export your prompt libraries in **JSON, MD, or CSV** for backup or sharing.
- **Smart Chaining:** Seamlessly use the output of one prompt as the input for another to build complex AI workflows.

### 3. Advanced Input System
- **Dynamic Forms:** Responsive input fields tailored to each blueprint.
- **Validation Engine:** Real-time validation ensures your inputs are optimized for AI consumption.
- **Visual Builder:** A dedicated visual mode for building prompts with attachments and structured blocks.

### 4. Premium User Interface
- **Cyber-Spacious Design:** A modern 3D interface with Glassmorphism accents.
- **Dark/Light Mode:** Full theme support for comfortable long-session usage.
- **Lazy-Loaded Performance:** Optimized for speed with component-level splitting.

---

## 🛠 Technology Stack

- **Core:** React 19 (TypeScript), Vite 7
- **UI Framework:** React Bootstrap 5
- **Icons:** React Icons (Fa, Lucide)
- **Notifications:** React Toastify
- **Prompt Generation:** Custom-built Generator Utility
- **Build System:** Vite-powered Bundler

---

## ⚙️ Installation & Setup

To run this project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sisigitadi.github.io/promptmatrix2/
   cd PromptMatrixV20
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

This application is ready for deployment to GitHub Pages.

1. **Build the Application:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```
   *Note: Ensure the `homepage` field in `package.json` matches your GitHub Pages URL.*

---

## 🛡️ Security & Privacy

- **No Server Storage:** All prompts and configurations are stored in your browser's local storage. Your data never leaves your device unless you choose to export it.
- **API Protection:** The application is configured to handle API keys via browser session storage or local storage. **Always ensure your `.env` files and sensitive credentials are added to `.gitignore` before pushing to public repositories.**

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the AI Community. 
Repository: [https://github.com/sisigitadi/promptmatrix2/](https://github.com/sisigitadi/promptmatrix2/)
