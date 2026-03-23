# Task Plan

## Blueprint

### Architecture & Tech Stack
- **Frontend**: React with TypeScript (Vite).
- **Backend**: Node.js with TypeScript (Express).
- **Persistence**: Local configuration saving (JSON on backend) for API credentials.
- **Core Functionality**:
  - LLM integration layer for evaluating models (Ollama, LM Studio, Grok/Groq, OpenAI, Claude, Gemini).
  - Main window: Chat interface accepting Jira requirements.
  - History sidebar and generative test case display area.
  - Settings window: Input fields for keys/URLs (`Ollama Setting`, `Groq Setting`, `Open AI API keys`, etc.), Save configurations, and Test Connection functionality.
  - Strict generation prompting to ensure Jira-ready Output (Summary, Preconditions, Steps, Expected Results) for both Functional and Non-functional web/API test cases.

## Phases and Goals

### Phase 0: Discovery (Complete)
- [x] Initialize project tracking files
- [x] Answer discovery questions
- [x] Draft Blueprint
- [x] Blueprint Approval

### Phase 1: Planning & Setup (Complete)
- [x] Scaffold Node.js Backend with TypeScript.
- [x] Scaffold React Frontend with TypeScript.
- [x] Define shared types (configs, Jira formats).

### Phase 2: Frontend Development (Complete)
- [x] Build Main Layout (Sidebar History, Test Case display area, Chat Input).
- [x] Build Settings Layout (LLM configs, Save, Test Connection).

### Phase 3: Backend Development & Integrations (Complete)
- [x] Build Settings APIs to store and retrieve LLM configurations.
- [x] Build Test Connection endpoints for testing LLM reachability.
- [x] Implement AI Model generation logic.

### Phase 4: Polishing & Execution (Complete)
- [x] Ensure strict Jira output formatting through system prompts.
- [x] Launch application locally to ensure backend and frontend run successfully.

## Checklists
_To be populated during execution phases._
