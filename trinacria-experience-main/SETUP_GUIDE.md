# Trinacria Experience - Setup & Configuration Guide

## ✅ Lovable Branding Removed

This project has been successfully debugged and cleaned of all Lovable branding and dependencies:

### Changes Made:
1. **Removed `.lovable/` directory** - Deleted Lovable project metadata folder
2. **Updated `vite.config.ts`** - Replaced `@lovable.dev/vite-tanstack-config` with standard Vite plugins:
   - TanStack Router plugin
   - React plugin
   - Tailwind CSS plugin
   - TypeScript config paths plugin
   - Cloudflare plugin
3. **Updated `package.json`** - Removed `@lovable.dev/vite-tanstack-config` from devDependencies
4. **Cleaned metadata** - Removed Lovable branding from `src/routes/__root.tsx`:
   - Removed `author: "Lovable"` meta tag
   - Removed `twitter:site: "@Lovable"` meta tag
   - Removed Lovable-hosted image URLs

## 🚀 Running the Project

### Prerequisites
You'll need to install Node.js (v18+) or Bun on your system:

**Option 1: Using npm/Node.js**
- Download from: https://nodejs.org/
- Recommended: LTS version (v20 or v22)

**Option 2: Using Bun (recommended for this project)**
- Download from: https://bun.sh/
- Installation: `curl -fsSL https://bun.sh/install | bash`

### Installation & Development

```bash
# Navigate to the project directory
cd trinacria-experience-main

# Install dependencies
# Using npm:
npm install

# Using Bun (recommended):
bun install

# Start development server
npm run dev
# or with Bun:
bun run dev

# Build for production
npm run build
# or with Bun:
bun run build

# Preview production build
npm run preview
# or with Bun:
bun run preview

# Lint code
npm run lint
# or with Bun:
bun run lint

# Format code
npm run format
# or with Bun:
bun run format
```

## 📁 Project Structure

- **`src/`** - Source code (components, routes, data, hooks, lib, types)
  - **`components/`** - React components (UI, modals, sidebars, etc.)
  - **`routes/`** - TanStack Router route definitions
  - **`data/`** - Data files (POIs, etc.)
  - **`hooks/`** - Custom React hooks
  - **`lib/`** - Utility functions and helpers
  - **`types/`** - TypeScript type definitions
- **`public/`** - Static assets
- **`vite.config.ts`** - Vite configuration (dev server, build settings)
- **`tsconfig.json`** - TypeScript configuration
- **`wrangler.jsonc`** - Cloudflare Workers configuration
- **`components.json`** - Component library config

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Routing**: TanStack Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Maps**: Leaflet & React Leaflet
- **360° Viewer**: Pannellum
- **HTTP Client**: TanStack React Query
- **Forms**: React Hook Form
- **Deployment**: Cloudflare Workers

## 📝 Notes

- Project originally created with Lovable.dev but now fully independent
- All Lovable build tooling and branding has been removed
- Standard Vite plugins now handle build configuration
- Project maintains its full functionality and structure
- Ready for independent development and deployment

## ❓ Troubleshooting

If you encounter issues:

1. **Dependency conflicts**: Delete `bun.lock` (or `node_modules/` and `package-lock.json` for npm) and reinstall
2. **Port conflicts**: By default runs on `http://localhost:5173`
3. **TypeScript errors**: Run `tsc --noEmit` to check compilation
4. **ESLint issues**: Run `npm run lint` to identify code style problems

## 🚀 Deployment

This project is configured for Cloudflare Workers deployment. See `wrangler.jsonc` for worker configuration details.
