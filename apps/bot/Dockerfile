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

# ---- Environment Variables ----
# Define ARG for build-time
ARG BOT_TOKEN_DEV
ARG MY_USER_ID
ARG TESTING_USER_ID
ARG NODE_ENV=production
ARG NOTION_INTEGRATION_ID
ARG MONGODB_LINK
ARG MONGODB_PASSWORD
ARG ENCRYPT_KEY
ARG ENCRYPT_IV
ARG IMGBB_API_KEY
ARG WEBSITE_URL
ARG OLD_BOT
ARG FEEDBACK_FORM_URL
ARG SUPABASE_URL
ARG SUPABASE_PUBLIC_ANON_KEY
ARG REDIS_URL

# Promote them to runtime ENV
ENV BOT_TOKEN_DEV=$BOT_TOKEN_DEV \
    MY_USER_ID=$MY_USER_ID \
    TESTING_USER_ID=$TESTING_USER_ID \
    NODE_ENV=$NODE_ENV \
    NOTION_INTEGRATION_ID=$NOTION_INTEGRATION_ID \
    MONGODB_LINK=$MONGODB_LINK \
    MONGODB_PASSWORD=$MONGODB_PASSWORD \
    ENCRYPT_KEY=$ENCRYPT_KEY \
    ENCRYPT_IV=$ENCRYPT_IV \
    IMGBB_API_KEY=$IMGBB_API_KEY \
    WEBSITE_URL=$WEBSITE_URL \
    OLD_BOT=$OLD_BOT \
    FEEDBACK_FORM_URL=$FEEDBACK_FORM_URL \
    SUPABASE_URL=$SUPABASE_URL \
    SUPABASE_PUBLIC_ANON_KEY=$SUPABASE_PUBLIC_ANON_KEY \
    REDIS_URL=$REDIS_URL

# Default command
CMD if [ "$NODE_ENV" = "develop" ]; then pnpm dev; else pnpm start; fi
