# Build stage with disk space optimization
FROM node:18-slim as builder

WORKDIR /app

# Copy only necessary files for npm install
COPY package*.json ./

# Install dependencies with minimal build artifacts
RUN npm install --production=false --no-fund --no-audit --omit=dev

# Copy source files
COPY . .

# Build the app with output traces disabled to save space
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Copy only what's needed to run the app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 