import os
from pathlib import Path
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Base paths
BASE_DIR = Path(__file__).parent.parent.parent.parent.parent  # Project root
PYTHON_DIR = Path(__file__).parent.parent  # Python source directory

# API settings
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8085"))
API_RELOAD = os.getenv("API_RELOAD", "True").lower() in ("true", "1", "t")
API_WORKERS = int(os.getenv("API_WORKERS", "1"))

# CORS settings
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
CORS_METHODS = ["*"]
CORS_HEADERS = ["*"]

# Database settings
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "feedback_analytics")

# External services
FEEDBACK_SERVICE_URL = os.getenv("FEEDBACK_SERVICE_URL", "http://localhost:8084")

# Model settings
MODEL_DIR = os.path.join(PYTHON_DIR, "models")
SENTIMENT_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"
USE_GPU = os.getenv("USE_GPU", "True").lower() in ("true", "1", "t")

# Logging configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

# Cache settings
CACHE_ENABLED = os.getenv("CACHE_ENABLED", "True").lower() in ("true", "1", "t")
CACHE_TTL = int(os.getenv("CACHE_TTL", "3600"))  # Time to live in seconds

# Performance settings
BATCH_SIZE = int(os.getenv("BATCH_SIZE", "16"))
MAX_WORKERS = int(os.getenv("MAX_WORKERS", "4"))

# Configure logging
def configure_logging():
    """Configure logging for the application"""
    level = getattr(logging, LOG_LEVEL.upper(), logging.INFO)
    logging.basicConfig(
        level=level,
        format=LOG_FORMAT
    )
    
    # Reduce verbosity of some loggers
    logging.getLogger("transformers").setLevel(logging.WARNING)
    logging.getLogger("torch").setLevel(logging.WARNING)
    logging.getLogger("tensorflow").setLevel(logging.WARNING)
    logging.getLogger("matplotlib").setLevel(logging.WARNING)

# Call configure_logging when this module is imported
configure_logging() 