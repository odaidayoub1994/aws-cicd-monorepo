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
COPY frontend ./frontend

# Install dependencies
RUN yarn install --immutable

# Build shared-types first, then frontend
RUN yarn workspace @aws-cicd-monorepo/shared-types build && \
    yarn workspace frontend build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
