# JobVerse (formerly JobTrackerAI)

A local-first, highly advanced Multi-Tab Job Pipeline and Networking ecosystem branded as **JobVerse**. Featuring a premium **Neon Agentic UI** with sophisticated blue/green gradients and restored deep dark card aesthetics. Manage your complete job hunting workflow, applications, targeted companies, recruitment agencies, and network contacts seamlessly inside your browser. No backend or cloud databases are required.

## 🚀 Quick Links
- **Official Feature Tour**: [Watch here](https://github.com/ak4674/QA-AI-Blueprint/blob/main/Chapter_03_JobAssistant_AI/JobTrackerAI/public/jobverse_official_tour.webp)
- **LinkedIn Connection Demo**: [Watch here](https://github.com/ak4674/QA-AI-Blueprint/blob/main/Chapter_03_JobAssistant_AI/JobTrackerAI/public/jobverse_demo.webp)

## Core Features & Modules

- **5-Tab Dashboard Structure**: Navigate instantly between the overview Dashboard, Kanban My Jobs, Target Companies, Recruitment Agencies, and My Network grids.
- **Neon Agentic UI**: Futuristic radial gradients of **Neon Blue (#00f2ff)** and **Neon Green (#00ff9d)** with high-contrast `#0B1120` dashboards.
- **Smart Omni-Search Routing**: A cross-entity navigation algorithm that identifies user intent. Pressing **Enter** automatically detects if queries match Network, Agency, or Jobs, and routes the user instantly.
- **Lumi AI (Live)**: A production-grade bridge to the **Pollinations AI** live model for real-time career and networking strategy generation.
- **Archiving & Phase Progression**: Rapid Job Lifecycle management via a 3-dots context menu on every card.
- **Local Data Persistence**: All data is stored in the browser using IndexedDB via the `idb` library for maximum privacy and performance.

## Technology Stack

- **Framework**: React 18 & Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Latest Version)
- **Database**: IndexedDB (`idb` wrapper)
- **DnD Utility**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Icons**: `lucide-react`
- **Date Handling**: `date-fns`

## Local Setup Instructions

1. **Clone the Repo and Navigate**
   ```bash
   cd JobTrackerAI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

Navigate to `http://localhost:5174/` to launch the client. All actions are handled in realtime directly in the browser. 

## Structure 

- `src/db.ts`: Handles the initialization, queries, and schema implementations for `indexedDB`.
- `src/components/KanbanBoard.tsx`: Orchestrates the draggable Context environment.
- `src/components/JobModal.tsx`: Slide-over UI layer for Add/Edit inputs.
- `src/types.ts`: TS Interfaces shaping the core data formats globally natively supported across app states.

---
*JobVerse - Your Career, Orchestrated.*
