# JobVerse (formerly JobTrackerAI)

A local-first, highly advanced Multi-Tab Job Pipeline and Networking ecosystem built with React, Vite, Tailwind CSS (v4), and IndexedDB. Manage your complete job hunting workflow, applications, targeted companies, recruitment agencies, and network contacts seamlessly inside your browser. No backend or cloud databases are required.

## Core Features & Modules

- **5-Tab Dashboard Structure**: Navigate instantly between the overview Dashboard, Kanban My Jobs, Target Companies, Recruitment Agencies, and My Network grids.
- **Lumi AI Insights**: A dynamic agent that scans your IndexedDB entries to formulate personalized networking and resume-modification prompts.
- **Archiving & Phase Progression 3-Dots Menu**: Easily archive old jobs or move them through logical stages (`Saved` -> `Applied` -> `Screening`...) using built-in context dropdowns on every job card.
- **Live Search & Filter**: Real-time algorithmic search hooks attached to the Kanban board without mutating the core DB pipeline.
- **Authentication**: Simulated OAuth flow for user personalization and credential storage logic.
- **Local Data Persistence**: All data is stored in the browser using IndexedDB via the `idb` library.
- **Drag & Drop**: Powered by `@dnd-kit/core` for seamless interactions and sortable lists.
- **Elegant & Minimal UI**: Utilizes modern UI tokens, agentic dark mode (`#0B1120`), and glassmorphism optimized for both mobile and desktop.

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
