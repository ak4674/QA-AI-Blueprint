# JobVerse Technical Skills & Architecture

This document outlines the technical stack, architecture patterns, and intelligence features integrated into the **JobVerse** platform.

## 🏗️ Core Architecture
- **Framework**: React 18 with TypeScript for type-safe component development.
- **Build Tool**: Vite 8.0 for lightning-fast development and optimized production builds.
- **State Management**: React Hooks (useState, useEffect) for local and component-level state.
- **Data Persistence**: IndexedDB (V2.0) via `db.ts` for a robust, offline-first persistent storage system.

## 🎨 Visual System & UX
- **UI Framework**: Tailwind CSS v4 for modern, utility-first styling.
- **Icons**: Lucide React for consistent, high-quality iconography.
- **Neon Agentic UI**: A bespoke, futuristic design system featuring:
    - **Background**: Dynamic mix of Neon Blue (#00f2ff) and Neon Green (#00ff9d) radial gradients.
    - **Theming**: Persistent Global Dark Mode with deep charcoal navy (#020617) and card backgrounds (#0B1120).
    - **Accents**: Neon glow effects, translucent glassmorphism headers, and interactive high-visibility states.
    - **Components**: Neon Dark Job Modal and Side-Card (3-Dots) context menus for rapid entity management.

## 🧠 Intelligence Features
- **Lumi AI Assistant**: Integrated global AI copilot powered by the Pollinations AI live model.
- **Global Search Routing**: An intelligent omni-search that automatically detects query intent and routes users to the appropriate tab (Company, Agency, or Contact).
- **Dashboard Analytics**: Real-time KPI cards and AI-driven career insights based on database statistics.

## 🛠️ Project Modules
1. **Scraped Job Board**: Hero search interface with multi-dimensional filtering.
2. **Kanban Pipeline**: Drag-and-drop job tracking with status-specific cards.
3. **Entity Relationship Management**: Dedicated grids for Target Companies, Recruitment Agencies, and Networking Contacts.
4. **Cloud Readiness**: Pre-configured `vercel.json` for 1-click professional deployment.

---

*Last Updated: March 2026*
