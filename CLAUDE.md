# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the client for the Dead by Daylight Tooltips Twitch extension - a game overlay for streamers that allows viewers to hover over perks and addons to see details, descriptions, and changelogs. The extension integrates with Twitch's extension API and displays data received from a backend EBS (Extension Backend Service).

## Technology Stack

- **Framework**: Svelte 5 (using runes: `$state`, `$effect`, etc.)
- **Build Tool**: Vite 7
- **Language**: TypeScript (strict mode enabled)
- **Testing**: Vitest with happy-dom, @testing-library/svelte for component tests
- **Package Manager**: Yarn 4.10.0 (Berry)
- **Storybook**: v9 for component development
- **Error Tracking**: Sentry integration

## Common Commands

### Development

```bash
make clean dev          # Clean build artifacts, install deps, start dev server
yarn dev                # Start Vite dev server
yarn storybook          # Start Storybook on port 6006
```

### Testing

```bash
yarn test               # Run tests with coverage and type checking
make test               # Same as above
```

### Linting & Type Checking

```bash
make lint               # Run type check (tc) and ESLint
yarn tc                 # TypeScript compiler check (tsc --build)
yarn lint               # ESLint check
yarn check              # Svelte-check with TypeScript
```

### Building

```bash
make build              # Build for production
yarn build              # Same as above
make release            # Full release: deps, build, delete sourcemaps, package into zip
make package            # Create app.zip from dist folder
```

### Pre-commit Hook

The husky pre-commit hook runs:

1. `lint-staged` (Prettier formatting)
2. `yarn lint` (ESLint)
3. `yarn tc` (TypeScript check)

## Architecture

### Multiple Entry Points

The application has three distinct entry points defined in `vite.config.ts`:

- **video_overlay.html**: Main overlay view for desktop/web
- **mobile.html**: Mobile-specific view
- **config.html**: Configuration panel for streamers

The app mode is determined at runtime in `App.svelte` by checking which container element exists.

### Core Application Flow

1. **Initialization** (`src/main.ts`):
   - Sentry is initialized with browser tracing and profiling
   - Main App component is mounted to `#app`

2. **App Component** (`src/App.svelte`):
   - Detects which mode to run in (config/mobile/overlay)
   - Sets up auto-scaling based on viewport height (normalizes to 1080p)
   - Conditionally renders the appropriate view component

3. **Twitch Integration** (`src/lib/Twitch/Twitch.svelte`):
   - Registers Twitch extension callbacks on mount
   - Handles authorization, visibility changes, and context updates
   - Listens to broadcast messages from Twitch pubsub for real-time updates
   - Manages periodic polling of the EBS API for loadout data
   - Contains kill switch logic to disable extension during high load

### State Management (Svelte 5 Runes)

All stores are in `src/lib/Stores/` and use Svelte 5's rune-based reactivity (`.svelte.ts` files):

- **AppStateStore**: Controls overall app state (enabled/disabled, mode: config/mobile/overlay)
- **CurrentGameStateStore**: Current game loadout (perks, addons, UI scale)
- **VisualStore**: UI state (helper info visibility, etc.)
- **UserStore**: User/channel authentication data (token, channelId)
- **LocalizationStore**: Language preferences and i18n state
- **FeatureFlagsStore**: Feature flag toggles
- **MainGameStore**: Main game state (legacy, may use different pattern)

### Key Components Structure

- `src/lib/Perks/`: Perk-related components (tooltips, mobile view)
- `src/lib/Addons/`: Addon-related components
- `src/lib/Configuration/`: Configuration HUD components
- `src/lib/I18n/`: Internationalization utilities and translations
- `src/lib/Api/`: API utilities and hooks
- `src/lib/shared/`: Shared/reusable components
- `src/lib/Twitch/`: Twitch extension integration

### Data Flow

1. Twitch extension calls `onAuthorized` with authentication token
2. `queryPerks()` fetches current loadout from EBS API (or uses DEBUG mock data)
3. `updateApp()` processes payload and updates stores:
   - Perks: `{ actor: 'killer'|'survivor', id: string }`
   - Addons (killer only): `{ killerId: string, id: string }`
4. UI components reactively render based on store values
5. Periodic updates are scheduled based on `ttl` and `rdm` fields from payload
6. Twitch pubsub broadcasts can trigger immediate updates (type: 'update', 'delay', 'disable')

### Environment Variables

Environment files are in `./env/` directory (not root). Vite config sets `envDir: './env'`.

### Build Output

The build produces hashed assets for cache busting:

- `dist/assets/[name].[hash].[ext]`

Sourcemaps are generated as 'hidden' in non-dev builds and deleted during release.

## Development Notes

### Svelte 5 Usage

This project uses Svelte 5 runes. Key patterns:

- Use `$state()` for reactive state instead of `let` with stores
- Use `$effect()` for side effects instead of `$:` reactive statements
- Stores files use `.svelte.ts` extension to enable runes in TypeScript
- Testing requires aliasing `@testing-library/svelte` to `@testing-library/svelte/svelte5`

### Twitch Extension Constraints

- Extension must check game context and only enable when `game === 'Dead by Daylight'`
- Visibility changes should disable the app when not visible
- App uses polling + pubsub hybrid approach for updates
- DEBUG mode (lines 44-64 in Twitch.svelte) currently uses hardcoded mock data instead of real API

### Testing

- Test files: `*.test.ts` or `*.spec.ts`
- Environment: happy-dom with same-origin policy disabled for fetch
- Coverage provider: v8, includes all of `src/**`
- Setup file: `vitest-setup.ts`

### Build Optimizations

Production builds:

- Drop console.log/info/warn/trace and debugger statements
- Sentry source maps uploaded (requires SENTRY_AUTH_TOKEN env var)
- Webpack stats plugin generates bundle analysis data
