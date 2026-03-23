export interface AppSettings {
    ollamaEndpoint: string;
    ollamaModelName: string;
    lmStudioEndpoint: string;
    lmStudioModelName: string;
    groqApiKey: string;
    groqModelName: string;
    openAIApiKey: string;
    openAIModelName: string;
    claudeApiKey: string;
    claudeModelName: string;
    geminiApiKey: string;
    geminiModelName: string;
    selectedProvider: string;
}

export const defaultSettings: AppSettings = {
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModelName: 'llama3.2',
    lmStudioEndpoint: 'http://localhost:1234/v1',
    lmStudioModelName: 'local-model',
    groqApiKey: '',
    groqModelName: 'llama3-8b-8192',
    openAIApiKey: '',
    openAIModelName: 'gpt-4o',
    claudeApiKey: '',
    claudeModelName: 'claude-3-5-sonnet-20240620',
    geminiApiKey: '',
    geminiModelName: 'gemini-1.5-pro',
    selectedProvider: 'ollama'
};

export interface GenerateRequest {
    requirement: string;
    provider: string; // matches selectedProvider
}

export interface GenerateResponse {
    testCases: string;
    error?: string;
}
