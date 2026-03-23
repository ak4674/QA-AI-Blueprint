# Findings

## Research
- **Goal**: Generate API and web application test cases (Functional and Non-functional).
- **Input**: Jira requirements (pasted or via chat).
- **Jira Output Format Constraints**: System must be prompted to output Jira-ready markdown (e.g., Summary, Description, Preconditions, Steps to Reproduce, Expected Result).

## Discoveries
- **Tech Stack**: Node.js (TypeScript) backend, React (TypeScript) frontend. Default Vite/Express ports are fine.
- **LLM Infrastructure**: Ollama API, LM Studio API, Grok (Groq) API, OpenAI, Claude API, and Gemini API.
- **Settings Persistence Layout**: The design shows inputs for `Ollama Setting`, `Groq Setting`, and `Open AI API keys`. By extension of the user request, this will include LM Studio, Claude, and Gemini configurations.
- **Persistence Method**: Configs will be saved locally (e.g. backend local file or `localStorage` synced with the backend) accessed via the Settings window with a `Save Button` and `Test Connection` button.

## Constraints
- Code execution is halted until Blueprint is approved (Protocol 0).
- Application must be fully run and tested at the end of the execution phase.
