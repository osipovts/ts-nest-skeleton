ARG NODE_VERSION=24
ARG PNPM_VERSION=11.17.0

################################
# Base
################################
FROM node:${NODE_VERSION}-slim AS base
ARG PNPM_VERSION
WORKDIR /app
ENV PNPM_HOME="/pnpm" \
    PNPM_STORE_PATH="/pnpm-store" \
    PATH="/pnpm:$PATH"
RUN corepack enable && \
    corepack prepare pnpm@${PNPM_VERSION} --activate && \
    pnpm config set store-dir "$PNPM_STORE_PATH"

################################
# Dependencies
################################
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY .npmrc* ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm fetch && \
    pnpm install \
      --frozen-lockfile \
      --offline

################################
# Build
################################
FROM deps AS build
COPY . .
RUN pnpm prisma:generate && \
    pnpm build && \
    pnpm prune --prod

################################
# Development
################################
FROM base AS dev
ENV NODE_ENV=development \
    CI=true
CMD ["pnpm", "start:dev"]

################################
# Production
################################
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12:nonroot AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
CMD ["dist/src/main.js"]
