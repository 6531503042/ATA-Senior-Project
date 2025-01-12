import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_CONFIG = {
    'host': os.getenv('MONGODB_HOST', 'localhost'),
    'port': int(os.getenv('MONGODB_PORT', 27017)),
    'database': 'feedback_analysis_db',
    'collections': {
        'feedback': 'processed_feedback',
        'categories': 'feedback_categories',
        'departments': 'department_feedback',
        'sentiment': 'sentiment_analysis',
        'metrics': 'feedback_metrics'
    }
} 