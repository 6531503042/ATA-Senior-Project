# Feedback Scoring Service

This service provides AI-powered scoring and analysis for feedback submissions.

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

## Running the Service

1. Navigate to the Python source directory:
```bash
cd src/main/python
```

2. Run the service using uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8085 --reload
```

The service will be available at `http://localhost:8085`

## API Endpoints

- `POST /score`: Score a feedback submission
- `GET /health`: Health check endpoint
- `GET /api/submissions/all`: Get all feedback submissions
- `GET /api/analysis/feedback/{feedback_id}`: Get analysis for a specific feedback
- `GET /api/analysis/satisfaction/{feedback_id}`: Get satisfaction analysis
- `GET /api/analysis/insights/{feedback_id}`: Get AI-powered insights

## Dependencies

Key dependencies include:
- FastAPI for the REST API
- spaCy for natural language processing
- Transformers for sentiment analysis
- PyTorch for machine learning
- scikit-learn for ML utilities
- MongoDB for data storage

## Development

- The service uses FastAPI for the REST API
- Feedback scoring is handled by the `FeedbackScorer` class
- Natural language processing is handled by spaCy
- Test files are available in `test_analyzer.py`

## Testing

To run the tests:
```bash
python -m pytest test_analyzer.py
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