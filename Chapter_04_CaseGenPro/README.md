# CaseGen Pro — Local UI & API Test Generator

> **By Arya Technology** — Fast, reliable Jira-ready test case generation powered by local and cloud LLMs.

CaseGen Pro accepts Jira requirements as input and generates structured, production-ready test cases (Functional & Non-Functional) for UI and API workflows — all running locally on your machine.

---

## Quick Start (One-Click Launch)

1. Double-click **`launch.bat`** in the root of this project folder.
2. Two terminal windows will open (Backend + Frontend servers).
3. Your browser will automatically open at **http://localhost:5173**.

> If the browser opens before the app loads, wait 5 seconds and refresh.

---

## Prerequisites

Ensure these are installed before running:

| Requirement | Version | Download |
|---|---|---|
| **Node.js** | v18+ | https://nodejs.org |
| **npm** | v9+ (bundled with Node.js) | — |
| **Ollama** *(Optional — for local LLM)* | Latest | https://ollama.com |

---

## Manual Launch (Step-by-Step)

### Step 1: Install Dependencies (First Time Only)

Open a terminal in the project root and run:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Start the Backend Server

Open a **new terminal window**:

```bash
cd backend
npm run dev
```

You should see: `Server running on port 3000`

### Step 3: Start the Frontend Server

Open another **new terminal window**:

```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:5173/`

### Step 4: Open the Application

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## How to Use CaseGen Pro

### Step 1 — Configure Your LLM (First Time Setup)

Click **"API Settings"** in the bottom-left corner of the app.

| LLM Provider | What to Enter |
|---|---|
| **Ollama (Local)** | Base URL: `http://localhost:11434`, Model: e.g. `llama3` or `mistral` |
| **Groq** | API Key from https://console.groq.com |
| **OpenAI** | API Key from https://platform.openai.com |
| **Claude (Anthropic)** | API Key from https://console.anthropic.com |
| **Gemini (Google)** | API Key from https://aistudio.google.com |

After entering your credentials:
- Click **Save** to persist the settings locally.
- Click **Test Connection** to verify the LLM is reachable.

### Step 2 — Select Your LLM

In the main view, use the **dropdown** at the bottom-right of the input area to choose your preferred LLM provider (Ollama, Groq, OpenAI, etc.).

### Step 3 — Generate Test Cases

Paste your **Jira requirement** or user story in the input box. Example:

```
As a user, I want to log in to the system using my email and password
so that I can access my personal dashboard and manage my tasks.
```

Click the **Generate** button (or press **Enter**).

### Step 4 — Review Output

CaseGen Pro generates structured test cases in Jira-ready format:

- **Summary** — Short title for the test case
- **Preconditions** — Required system state before the test
- **Steps to Reproduce** — Numbered, clear test steps
- **Expected Result** — What the system should do

Both **Functional** and **Non-Functional** test cases are generated (covering performance, security, and accessibility).

### Step 5 — Chat History

- All sessions are saved in the **left sidebar**.
- Click any previous chat to revisit its generated test cases.
- Use **"New Chat"** to start a fresh session.

---

## Project Structure

```
Project_01_LolcalLLMtestGenerator_Antigravity/
├── backend/              # Express + TypeScript API Server (port 3000)
│   └── src/
│       ├── index.ts      # Server entry point
│       ├── aiParams.ts   # LLM integration logic (Ollama, Groq, OpenAI, etc.)
│       ├── types.ts      # Shared TypeScript type definitions
│       └── settings.json # Persisted LLM configurations (auto-saved)
├── frontend/             # React + Vite UI (port 5173)
│   └── src/              # React components and pages
├── launch.bat            # One-click launcher for Windows
└── README.md             # This file
```

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `Port 3000 already in use` | Run `npx kill-port 3000` in terminal |
| `Port 5173 already in use` | Run `npx kill-port 5173` in terminal |
| Ollama not connecting | Run `ollama serve` in a separate terminal first |
| Invalid API Key | Re-enter in API Settings and click Test Connection |
| Blank screen after launch | Wait 5 seconds and refresh — dev servers may still be starting |
| `npm install` fails | Ensure Node.js v18+ is installed via `node --version` |

---

*© 2025 Arya Technology. All rights reserved.*
