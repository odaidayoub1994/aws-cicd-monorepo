# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for building
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Copy dependency files first (better layer caching)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY backend/package.json ./backend/package.json

# Install dependencies (cached unless lock/package.json changes)
RUN yarn install

# Copy source code
COPY packages/shared-types ./packages/shared-types
COPY packages/tsconfig ./packages/tsconfig
COPY backend ./backend

# Build shared-types first, then backend
RUN yarn workspace @aws-cicd-monorepo/shared-types build && \
    yarn workspace backend build

# Prune to production deps only and clean cache
RUN yarn workspaces focus backend --production && \
    rm -rf .yarn/cache

# Production stage — no Yarn/corepack needed
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy pruned node_modules (hoisted production deps)
COPY --from=builder /app/node_modules ./node_modules

# Copy shared-types built output (symlink target for workspace dep)
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/package.json

# Replace the symlink with the actual directory
RUN rm -rf node_modules/@aws-cicd-monorepo/shared-types && \
    ln -s /app/packages/shared-types node_modules/@aws-cicd-monorepo/shared-types

# Copy built backend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json

USER nestjs

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app/backend

CMD ["node", "dist/main.js"]
