# Feedback Scoring Service

An AI-powered feedback analysis service that processes text feedback, extracts sentiments, identifies improvement areas, and provides actionable insights.

## Features

- **Sentiment Analysis**: Analyze the sentiment of feedback text using transformer models
- **Improvement Suggestions**: Generate actionable suggestions based on feedback content
- **Priority Classification**: Classify feedback items by priority and impact
- **Category Analysis**: Analyze feedback by categories (work environment, team collaboration, etc.)
- **Executive Summaries**: Generate concise summaries for management review
- **Trend Analysis**: Track feedback trends over time

## Architecture

The service follows a clean, modular architecture:

- **API Layer**: FastAPI endpoints for interacting with the service
- **Core**: Core business logic and ML models
- **Services**: Service layer for complex operations
- **Models**: Data models and validation
- **Utils**: Utility functions and helpers
- **Config**: Centralized configuration

## Tech Stack

- **Framework**: FastAPI
- **ML/NLP**: PyTorch, Transformers, spaCy, scikit-learn
- **Database**: MongoDB
- **Containerization**: Docker

## Setup and Installation

1. Create a Python virtual environment:

```bash
python3.11 -m venv venv
```

2. Activate the virtual environment:

- On macOS/Linux:

```bash
source venv/bin/activate
```

- On Windows:

```bash
.\venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Install spaCy and download the English language model:

```bash
# Install spaCy and its dependencies
pip install -U spacy

# Download the English language model
python -m spacy download en_core_web_sm
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
# API settings
API_HOST=0.0.0.0
API_PORT=8085
API_RELOAD=True
API_WORKERS=1

# CORS settings
CORS_ORIGINS=http://localhost:3000

# Database settings
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=feedback_analytics

# External services
FEEDBACK_SERVICE_URL=http://localhost:8084

# Model settings
USE_GPU=True

# Logging
LOG_LEVEL=INFO

# Performance
BATCH_SIZE=16
MAX_WORKERS=4
```

## Running the Service

1. Navigate to the Python source directory:

```bash
cd src/main/python
```

2. Run the service using Python:

```bash
python main.py
```

The service will be available at `http://localhost:8085`

## Docker Deployment

1. Build the Docker image:

```bash
docker build -t feedback-scoring-service .
```

2. Run the container:

```bash
docker run -p 8085:8085 --env-file .env feedback-scoring-service
```

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /api/score`: Score a feedback submission
- `POST /api/analyze/text`: Analyze a text response
- `POST /api/retrain`: Retrain the model with new data
- `GET /api/submissions/all`: Get all feedback submissions
- `GET /api/analysis/feedback/{feedback_id}`: Get analysis for a specific feedback
- `GET /api/analysis/satisfaction/{feedback_id}`: Get satisfaction analysis
- `GET /api/analysis/insights/{feedback_id}`: Get AI-powered insights

## Project Structure

```
src/main/python/
├── api/                  # API endpoints
│   ├── __init__.py
│   └── routes.py
├── config/               # Configuration
│   ├── __init__.py
│   └── settings.py
├── core/                 # Core business logic
│   ├── __init__.py
│   ├── scoring_model.py
│   └── train_model.py
├── models/               # Data models
│   ├── __init__.py
│   └── feedback_analysis.py
├── services/             # Service layer
│   ├── __init__.py
│   └── feedback_analyzer_service.py
├── utils/                # Utility functions
│   ├── __init__.py
│   └── helpers.py
├── __init__.py
├── main.py               # Application entry point
└── mock_training_data.json
```

## Development

### Adding New Features

1. Define data models in `models/`
2. Implement core logic in `core/`
3. Create service methods in `services/`
4. Add API endpoints in `api/routes.py`

### Testing

To run the tests:

```bash
python -m pytest tests/
```

## Troubleshooting

If you encounter spaCy-related errors:

1. Ensure spaCy is properly installed:

```bash
pip install -U spacy
```

2. Verify the English model is installed:

```bash
python -m spacy download en_core_web_sm
```

3. Test spaCy installation:

```bash
python -c "import spacy; nlp = spacy.load('en_core_web_sm'); print('spaCy is working!')"
```

## Performance Optimization

The service includes several performance optimizations:

- Model caching to reduce initialization time
- Batch processing for analyzing multiple submissions
- Parallel processing for heavy NLP tasks
- GPU acceleration when available

## License

[MIT License](LICENSE)
