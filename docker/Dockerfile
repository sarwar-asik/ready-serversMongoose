FROM node:22 AS builder

WORKDIR /app

# Copy only package files first (to leverage layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# ----------------------
# 2. Production Stage
# ----------------------
FROM node:22

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Copy any additional needed files (config, env, etc.)
COPY .env ./

EXPOSE 5000

CMD ["node", "dist/server.js"]