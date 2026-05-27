# Base image
FROM node:22-alpine AS development

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

# Production image
FROM node:22-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
