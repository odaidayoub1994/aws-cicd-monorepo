# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for building
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Copy workspace files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/shared-types ./packages/shared-types
COPY packages/tsconfig ./packages/tsconfig
COPY packages/eslint-config ./packages/eslint-config
COPY backend ./backend

# Install dependencies
RUN yarn install

# Build shared-types first, then backend
RUN yarn workspace @aws-cicd-monorepo/shared-types build && \
    yarn workspace backend build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./package.json

# Install production dependencies only
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/packages/shared-types ./packages/shared-types
COPY --from=builder /app/backend/package.json ./backend/package.json

WORKDIR /app/backend
RUN yarn workspaces focus --production

USER nestjs

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "dist/main.js"]
