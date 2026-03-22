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
- **Environment**: Optimized for zero-config Vercel deployment with built-in `vercel.json`

## User Interface & Aesthetic Design (UI/CSS)
- **Theme**: Futuristic, Agentic Dark Theme (`#0B1120` base) highlighting neon cyan and deep purple accents.
- **Micro-Animations**: Extensive use of Tailwind's `transition-all`, `hover:scale`, and `opacity` fades.
- **Glassmorphism**: Modals (`SignInModal`, `LumiModal`) employ `backdrop-blur` techniques mimicking glass physical textures over the DOM.
- **Responsive Layout**: 5-tab horizontal header-driven layout optimized for high-density wide data grids.

## Platform Capabilities & Logic

### 1. Global Intelligence & Routing
- **Smart Omni-Search**: A cross-entity navigation algorithm that identifies user intent. Pressing **Enter** on a query automatically detects if the target matches a **Network Contact**, **Recruitment Agency**, or **Job/Company**, and instantly navigates the user to the corresponding tab.
- **Live AI Assistant (Lumi AI)**: A production-grade bridge to the **Pollinations AI** live model. Replaces static mock data with real-time, context-aware career and networking strategy generation via asynchronous REST API fetches.

### 2. Kanban My Jobs Tab
- **Real-time Search Filter**: A live React state hook that performs non-destructive filtering against the IndexedDB job array.
- **3-Dots Action Menu**: A context-aware dropdown enabling rapid Job Lifecycle progression (`Wishlist` -> `Applied` -> `Screening` -> `Interviewing` -> `Offer`) or routing cards to a persistent `Archived` state.

### 3. Entity Management & Dashboards
- **Multi-Store Management**: Support for high-volume entry of Companies, Agencies, and Network Contacts via dedicated responsive grid systems.
- **Personalized Auth Simulation**: A tailored `SignInModal` pre-configured to mount the **Anand Kumar** (**aky.anand@gmail.com**) profile, establishing a persistent "AK" user session in the application header.

## Backend / Database Schema (IndexedDB)
The DB layer (`src/db.ts`) Version `2.0` automatically constructs the following object stores:
- **`jobs`**: Maps applications to states (e.g. Job Title, Company, Status, URL, Date, Resume).
- **`companies`**: Maintains Target Companies.
- **`agencies`**: Maintains Recruitment Agencies.
- **`network_contacts`**: Relational mapping tool for people/connections.
- **`scraped_jobs`**: Ingestion array for matched web opportunities.
