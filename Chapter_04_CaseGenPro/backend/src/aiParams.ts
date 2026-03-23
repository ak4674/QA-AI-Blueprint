import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getAiModel(provider: string, settings: any) {
    if (provider === 'openai') {
        const openai = createOpenAI({
            apiKey: settings.openAIApiKey
        });
        return openai(settings.openAIModelName || 'gpt-4o');
    }
    
    if (provider === 'groq') {
        const groq = createOpenAI({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: settings.groqApiKey,
        });
        return groq(settings.groqModelName || 'llama3-8b-8192');
    }

    if (provider === 'anthropic') {
        const anthropic = createAnthropic({
            apiKey: settings.claudeApiKey
        });
        return anthropic(settings.claudeModelName || 'claude-3-5-sonnet-20240620');
    }

    if (provider === 'gemini') {
        const google = createGoogleGenerativeAI({
            apiKey: settings.geminiApiKey
        });
        return google(settings.geminiModelName || 'gemini-1.5-pro');
    }

    if (provider === 'lmstudio') {
        const lmstudio = createOpenAI({
            baseURL: settings.lmStudioEndpoint || 'http://localhost:1234/v1',
            apiKey: 'lm-studio',
        });
        return lmstudio(settings.lmStudioModelName || 'local-model');
    }

    // Default: ollama
    const ollama = createOpenAI({
        baseURL: (settings.ollamaEndpoint || 'http://localhost:11434') + '/v1',
        apiKey: 'ollama',
    });
    return ollama(settings.ollamaModelName || 'llama3.2'); // use dynamic model name
}

export const SYSTEM_PROMPT = `You are an expert QA Engineer. The user will provide a Jira requirement or user story.
Your ONLY task is to generate both Functional and Non-functional test cases as a strict JSON array.

CRITICAL RULES:
- Output ONLY a valid JSON array. NO markdown, NO extra text, NO code fences, NO explanation.
- Generate at least 5-8 thorough test cases covering functional, non-functional, security, and edge cases.
- Each element must have EXACTLY these fields:

{
  "id": "TC-001",
  "scenario": "Concise description of what is being tested",
  "preconditions": "What must be true before running the test",
  "steps": ["Step 1 description", "Step 2 description", "Step 3 description"],
  "expectedResult": "What should happen after steps are executed",
  "priority": "HIGH" | "MEDIUM" | "LOW",
  "type": "Functional" | "Non-functional" | "Security" | "Performance"
}

Prioritize HIGH for core features, MEDIUM for edge cases, LOW for cosmetic issues.
Start output with [ and end with ]. Output nothing else.`;

