# Feedback Scoring Service

This service provides AI-powered scoring and analysis for feedback submissions.

## Setup and Installation

1. Create a Python virtual environment:
```bash
python -m venv venv
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

## Development

- The service uses FastAPI for the REST API
- Feedback scoring is handled by the `FeedbackScorer` class
- Test files are available in `test_analyzer.py`

## Testing

To run the tests:
```bash
python -m pytest test_analyzer.py
``` 