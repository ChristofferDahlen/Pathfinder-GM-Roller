# Pathfinder GM Roller — Development Commands

# Start dev server (port 3000)
dev:
    npm run dev

# Build for production
build:
    npm run build

# Generate static site
generate:
    npm run generate

# Preview production build
preview:
    npm run preview

# Install dependencies
install:
    npm install

# Run all tests (single run)
test:
    npx vitest --run

# Run unit tests only
test-unit:
    npx vitest --project unit --run

# Run tests in watch mode
test-watch:
    npm run test:watch

# Run e2e tests (requires dev server running)
test-e2e:
    npm run test:e2e

# Lint
lint:
    npx eslint .

# Type check
typecheck:
    npx nuxi typecheck
