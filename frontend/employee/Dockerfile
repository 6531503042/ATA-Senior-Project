# Employee Frontend Dockerfile for Next.js application
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the application
CMD ["bun", "run", "dev", "--port", "3001"]