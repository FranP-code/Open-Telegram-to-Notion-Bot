# Use official Node 22 Alpine image
FROM node:22-alpine

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /usr/src

# Copy only package files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Pass NODE_ENV at build/run time
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Default command
CMD if [ "$NODE_ENV" = "develop" ]; then pnpm dev; else pnpm start; fi
