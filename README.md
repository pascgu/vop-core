# VoP-core

The core frontend and shared tools for **VoP (Visual Object Programming)**. This repository includes:
- A **React Flow**-based editor for creating workflows (TypeScript).
- Shared utilities (JSON schemas, validation, etc.).

## Features
✅ **Lightweight editor** with compact nodes.
✅ **Reusable frontend** for VSCode, Android, and Desktop apps.
✅ **Standardized JSON schema** for workflows.

## Tech Stack
- **Frontend**: React Flow + TypeScript.

## Setup
- **First time setup:** Run `npm install` in the `ui/` directory to install dependencies.
- **Start the development server:** `npm start`
- **Build the project:** `npm run build`
- **Preview the build:** `npm run preview`
- **Output:** The build output is generated in `../dist/web-assets` after running `npm run build`.

## Vite Configuration
- **Vite** is configured to output the build to `../dist/web-assets`.

### Commands
- **Start the development server:**
  ```bash
  npm start
  ```
- **Build the project:**
  ```bash
  npm run build
  ```
- **Preview the build:**
  ```bash
  npm run preview
  ```
