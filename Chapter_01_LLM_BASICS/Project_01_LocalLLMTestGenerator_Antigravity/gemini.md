# 📜 gemini.md - Project Constitution

**Mission:** Build a deterministic, local-first test case generator that leverages both local (Ollama, LM Studio) and cloud LLMs to transform informal requirements into Jira-formatted test documentation.

---

## 🏛️ North Star
**Deterministic Quality:** Every requirement input produces valid, structured, and professional Jira test cases (Functional/Non-Functional).

---

## 🏗️ Architectural Invariants
1. **Frontend:** React (Vite) + TailwindCSS for the UI.
2. **Backend:** Node.js (Express) using TypeScript.
3. **Database:** SQLite (`testgen_data.sqlite`) for configuration and history.
4. **LLM Handlers:** Unified interface for:
    - **Cloud:** OpenAI, Claude, Gemini, Grok.
    - **Local:** Ollama (default port 11434), LM Studio (OpenAI-compatible).
5. **State Management:** Backend-driven for persistence; React State for UI.

---

## 📊 Data Schemas (SQL)

### 1. `Settings` (Provider Configs)
| Field | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `name` | TEXT | OpenAI, Claude, Ollama, etc. |
| `apiKey` | TEXT | (Encrypted or raw for local dev) |
| `model` | TEXT | e.g. gpt-4o, llama3 |
| `baseUrl` | TEXT | Endpoint URL if applicable |
| `isActive` | INTEGER | 0 or 1 |

### 2. `TestGenerations` (History)
| Field | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `input` | TEXT | The raw Jira requirement |
| `output` | TEXT | The generated JSON/Markdown test cases |
| `timestamp` | DATETIME| When it was created |
| `providerUsed` | TEXT | Which model generated this |

---

## 🎯 Behavioral Rules
1. **Never Hallucinate:** If the LLM response is not in Jira JSON format, the backend MUST attempt a retry or sanitize before returning to the UI.
2. **Security First:** Never log API keys in server logs.
3. **Responsive UI:** The "Test Connection" button must provide immediate feedback (success/fail).
4. **Unified Payload:** The result must always follow the "Functional/Non-Functional" Jira structure defined in Phase 2.
5. **Clean Data:** Connection tests ("Ping connection") MUST NOT be saved to history!

---

## 🛠️ Maintenance Log
- **2026-03-31:** Initialized `gemini.md` constitution via B.L.A.S.T. Protocol.
- **2026-03-31:** Implemented History persistence (Backend/Frontend). Connected SQLite history table to the History sidebar in the UI.
