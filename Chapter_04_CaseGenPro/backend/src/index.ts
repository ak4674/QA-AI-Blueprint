import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const SETTINGS_FILE = path.join(__dirname, 'settings.json');

app.get('/api/settings', async (req, res) => {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const newSettings = req.body;
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), 'utf-8');
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

import { generateText } from 'ai';
import { getAiModel, SYSTEM_PROMPT } from './aiParams.js';

app.post('/api/test-connection', async (req, res) => {
    try {
        const { provider } = req.body;
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        const settings = JSON.parse(data);

        const model = getAiModel(provider, settings);
        const { text } = await generateText({
            model: model,
            prompt: "Say the word 'success' if you can read this."
        });

        res.json({ success: true, message: `Connected to ${provider} successfully!` });
    } catch (e: any) {
        res.status(500).json({ success: false, message: `Connection failed: ${e.message}` });
    }
});

app.post('/api/generate', async (req, res) => {
    try {
        const { provider, requirement } = req.body;
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        const settings = JSON.parse(data);

        const model = getAiModel(provider, settings);
        
        const { text } = await generateText({
            model: model,
            system: SYSTEM_PROMPT,
            prompt: requirement
        });

        res.json({ testCases: text });
    } catch (e: any) {
        res.status(500).json({ error: `Generation failed: ${e.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
