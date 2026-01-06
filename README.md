# GrahPrakash

GrahPrakash is a TypeScript + Next.js web app that provides:
- Astrological predictions based on a user's date of birth and related inputs (natural-language predictions in English).
- Palm reading / hand analysis using MediaPipe (client-side hand-pose detection and analysis).

This README is a draft based on the repository structure (app/, components/, styles/, etc.). It documents features, how to run the project locally, and notes about configuration and contributions.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment / Configuration](#environment--configuration)
- [Running the app](#running-the-app)
- [How to use](#how-to-use)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## About

GrahPrakash (Greha Prakash) is an exploratory project that combines simple astrology (birthdate-based textual predictions) with a palm-reading feature that analyzes live camera input using MediaPipe. The astrology portion produces English-language predictions; palm-reading uses client-side MediaPipe models to locate and analyze hand landmarks.

---

## Features

- Astrology prediction page:
  - User enters birth details (date/time/place as implemented) and receives an astrological prediction in English.
  - Implemented with a chat-like component for interactive input/response flows (see `components/astrology-chat.tsx`).
- Palm reading page:
  - Live camera hand detection/analyis using MediaPipe.
  - Visual overlay of landmarks and computed palm-line hints (see `components/palm-analysis.tsx`).
- Modern UI components and layout built with TypeScript and Tailwind CSS.
- Next.js 13 App Router structure (server + client components).

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- pnpm (lockfile `pnpm-lock.yaml` present)
- MediaPipe (client-side hand detection)
- Custom UI components located under `components/ui/` (many common primitives present)

---

## Project Structure (high-level)

Based on the repository contents:

- `app/`
  - `page.tsx` — main landing route
  - `layout.tsx` — global layout
  - `globals.css` — global styles
  - `astrology/` — astrology route pages (e.g., `app/astrology/page.tsx`)
  - `palm-reading/` — palm reading route pages (e.g., `app/palm-reading/page.tsx`)
  - `api/` — (server functions / endpoints if present)
- `components/`
  - `astrology-chat.tsx` — astrology chat UI and logic
  - `palm-analysis.tsx` — MediaPipe-based palm analysis UI/logic
  - `main-menu.tsx`, `loading-screen.tsx`, `disclaimer.tsx`, `language-selector.tsx`, etc.
  - `theme-provider.tsx`
  - `ui/` — collection of UI primitives (button, input, dialog, sidebar, etc.)
- `public/` — static assets
- `styles/` — additional styles
- `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`
- `package.json`, `pnpm-lock.yaml`

Note: my listing of `components/ui/` results may be incomplete due to API pagination — view the full folder here:
https://github.com/Kartikgarg74/GrahPrakash/tree/main/components/ui

---

## Setup & Installation

Prerequisites:
- Node.js (recommended 18+)
- pnpm (optional but recommended; repo includes `pnpm-lock.yaml`)

Commands:

1. Clone
```bash
git clone https://github.com/Kartikgarg74/GrahPrakash.git
cd GrahPrakash
```

2. Install dependencies (using pnpm)
```bash
pnpm install
```
(If you prefer npm/yarn, you can use them, but pnpm matches the repo lockfile.)

---

## Environment / Configuration

- Palm reading (MediaPipe) runs client-side and generally does not require secret keys.
- Astrology/chat features may rely on an LLM or external chat API (not 100% confirmed). If your implementation uses an external service (e.g., OpenAI), create an environment variable such as:
  - `OPENAI_API_KEY` (or whatever name the server code expects)
- Add a `.env.local` in the project root and set vars, e.g.:
```
# Example — adjust to match server code
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SOME_FLAG=true
```

If you want me to scan the codebase for the exact env var names used (for example in `app/api` or server-side code), I can check specific files and update this README with exact configuration keys.

---

## Running the app

Development:
```bash
pnpm dev
# then open http://localhost:3000
```

Build for production:
```bash
pnpm build
pnpm start
```

(If the project uses `next` scripts in `package.json`, use those scripts — `pnpm dev`, `pnpm build`, `pnpm start` are typical.)

---

## How to use

- Visit the app home page — use the main menu to navigate to:
  - Astrology — enter your birth details and request predictions.
  - Palm Reading — allow camera access and place your hand in view for analysis.
- There is a language selector component — the project appears to support language selection though default predictions are in English.

---

## Development notes & TODOs

- Confirm whether the astrology predictions are produced via an LLM / external API. If so, secure and set the corresponding API key environment variable.
- Improve UX and error handling for camera permissions in palm-reading.
- Add unit or E2E tests (none detected by quick scan).
- Add a proper README to the repo (this file) and include screenshots / demo GIFs as you produce them.

If you want, I can:
- Search the repo to find the exact external API calls and environment variable names.
- Produce screenshots/instructions based on actual UI flows by reading the `app/*` and `components/*` code more deeply.
- Create a PR that adds this README to the repo.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature`
3. Make changes and commit
4. Push and open a PR

Please include:
- Short description of the change
- Screenshots if the UI is affected
- Any needed environment configuration

---

## Acknowledgements

- MediaPipe for hand-pose / landmark detection
- Next.js and Tailwind CSS for the framework and styling
- UI primitives (components/ui) which help assemble the UI
