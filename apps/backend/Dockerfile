# Use official Node 22 Alpine image
FROM node:22-alpine

# Build args
ARG NOTION_INTEGRATION_ID
ARG NOTION_INTEGRATION_SECRET
ARG PORT=3000
ARG NODE_ENV=production

# Set environment variables
ENV NOTION_INTEGRATION_ID=${NOTION_INTEGRATION_ID}
ENV NOTION_INTEGRATION_SECRET=${NOTION_INTEGRATION_SECRET}
ENV PORT=${PORT}
ENV NODE_ENV=${NODE_ENV}

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /usr/src

# Copy dependency files first for caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the source
COPY . .

# Expose port
EXPOSE ${PORT}

# Start command
CMD if [ "$NODE_ENV" = "development" ]; then pnpm dev; else PORT=$PORT pnpm start; fi
