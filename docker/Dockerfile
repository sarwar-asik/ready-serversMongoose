FROM node:22 AS builder

WORKDIR /app

# Copy package files (support both npm and yarn)
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies (use yarn if yarn.lock exists, otherwise npm)
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm install --legacy-peer-deps; fi

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

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install only production dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; else npm install --only=production --legacy-peer-deps; fi

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Copy any additional needed files (config, env, etc.)
COPY .env* ./

EXPOSE 5001

CMD ["node", "dist/server.js"]