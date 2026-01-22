# ═══════════════════════════════════════════════════════════════════════════════
# Nabd AI Agent - Production Dockerfile
# ═══════════════════════════════════════════════════════════════════════════════

# ───────────────────────────────────────────────────────────────────────────────
# Stage 1: Base with Puppeteer dependencies
# ───────────────────────────────────────────────────────────────────────────────
FROM node:18-slim AS base

# Install Chrome/Puppeteer dependencies for web browsing agent
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set working directory
WORKDIR /app

# ───────────────────────────────────────────────────────────────────────────────
# Stage 2: Dependencies
# ───────────────────────────────────────────────────────────────────────────────
FROM base AS deps

# Copy package files from nabd-saas directory
COPY nabd-saas/package*.json ./

# Install dependencies
RUN npm ci --only=production

# ───────────────────────────────────────────────────────────────────────────────
# Stage 3: Builder
# ───────────────────────────────────────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY nabd-saas/package*.json ./
RUN npm ci

# Copy source code from nabd-saas directory
COPY nabd-saas/ .

# Build the application
RUN npm run build

# ───────────────────────────────────────────────────────────────────────────────
# Stage 4: Production Runner
# ───────────────────────────────────────────────────────────────────────────────
FROM base AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nabd

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Set ownership
RUN chown -R nabd:nodejs /app

# Switch to non-root user
USER nabd

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
