FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG PUBLIC_ENV__BACKEND_URL=http://localhost:5000
ENV PUBLIC_ENV__BACKEND_URL=$PUBLIC_ENV__BACKEND_URL

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . ./

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "preview", "--host", "--port", "3000"]
