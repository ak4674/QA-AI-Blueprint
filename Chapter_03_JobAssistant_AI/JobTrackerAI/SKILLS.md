# JobVerse — Technical Skills & Architecture Stack

This document outlines the complete technological footprint, UI/UX structure, and backend database implementation of the **JobVerse** platform (formerly CareerOrbit / JobTrackerAI).

## Core Technology Stack
- **Frontend Framework**: React 18, built and compiled via Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Custom Agentic Dark Mode configuration)
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Database (Local-First)**: IndexedDB managed via the `idb` wrapper promise-based library
- **Icons**: `lucide-react`
- **Date Utilities**: `date-fns`
- **Cloud Deployment Configuration**: Built-in `vercel.json` for automated Vercel hosting

## User Interface & Aesthetic Design (UI/CSS)
- **Theme**: Futuristic, Agentic Dark Theme (`#0B1120` canvas base) highlighting neon cyan and deep purple accents.
- **Micro-Animations**: Extensive use of Tailwind's `transition-all`, `hover:scale`, and `opacity` fades. Focus-states are heavily modified with `ring` glows mapping to primary action colors.
- **Glassmorphism**: Modals (`SignInModal`, `LumiModal`) employ `backdrop-blur` techniques mimicking glass physical textures over the DOM.
- **Responsive Layout**: Sidebar-less, 5-tab horizontal header-driven layout optimized to retain horizontal volume for wide data grids.

## Platform Capabilities & Logic

### 1. Unified Dashboard Tab
- Algorithmic 'Live' AI Insights via **Lumi AI**.
- Dynamically scans LocalDB (Companies and Jobs) to construct targeted resume-adaptation suggestions and strategic LinkedIn networking prompts rather than generating static data.

### 2. Kanban My Jobs Tab
- Real-time `Search` and `Filter` hooks directly attached to the Job array map logic.
- Complete drag-and-drop state lifecycle management.
- **3-Dots Action Menu**: Hovering over cards reveals instant context menus to systematically route cards through the application lifecycle (`Saved` -> `Applied` -> `Screening` -> `Interviewing` -> `Offer`) or push them into an invisible `Archived` cleanup state.

### 3. Entity Pages (Target Companies, Recruitment Agencies, My Network)
- 3-column responsive flex grid rendering detailed entity cards.
- Support for extensive internal metadata editing strings (Locations, Networks, Tags, URLs, Notes).
- Floating `+ Add` modal implementations natively connected to the IndexedDB upgrade lifecycle.

### 4. Authentication (Simulated)
- Embedded `SignInModal` replicating modern OAuth interactions (Google, GitHub, Email Magic Links).
- Mounts and persists user credentials (e.g. Anand Kumar) directly into the parent Application Header's state tree.

## Backend / Database Schema (IndexedDB)
The DB layer (`src/db.ts`) upgraded to version `2.0` automatically constructs the following object stores:
- **`jobs`**: Maps applications to states (e.g. Job Title, Company, Status, URL, Date, Resume).
- **`companies`**: Maintains Target Companies.
- **`agencies`**: Maintains Recruitment Agencies.
- **`network_contacts`**: Relational mapping tool to tag people against existing Companies/Jobs in a pipeline.
- **`scraped_jobs`**: Live feed ingestion array for web-matched opportunities.
