# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    TRANSFORMERS_CACHE=/app/models \
    MODEL_PATH=/app/models \
    HF_HOME=/app/models

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libpq-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create models directory and download model
RUN mkdir -p /app/models && \
    python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; \
    tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased-finetuned-sst-2-english', cache_dir='/app/models'); \
    model = AutoModelForSequenceClassification.from_pretrained('distilbert-base-uncased-finetuned-sst-2-english', cache_dir='/app/models')"

# Copy project files
COPY src/main/python/ .

# Create a non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Create startup script
RUN echo '#!/bin/bash\n\
if [ ! -d "/app/models/distilbert-base-uncased-finetuned-sst-2-english" ]; then\n\
    python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; \
    tokenizer = AutoTokenizer.from_pretrained(\"distilbert-base-uncased-finetuned-sst-2-english\", cache_dir=\"/app/models\"); \
    model = AutoModelForSequenceClassification.from_pretrained(\"distilbert-base-uncased-finetuned-sst-2-english\", cache_dir=\"/app/models\")" \n\
fi\n\
exec uvicorn main:app --host 0.0.0.0 --port 8086 --reload' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 8086

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8086/health || exit 1

# Run the application using the startup script
CMD ["/app/start.sh"] 