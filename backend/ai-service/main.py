import os
import sys
from pathlib import Path

# Add the project root directory to Python path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

from datetime import datetime
from typing import List, Dict
import gc
import torch

from utils.model_loader import load_sentiment_analyzer, load_category_models
from services.sentiment_service import SentimentService
from services.categorization_service import CategorizationService
from services.priority_service import PriorityService
from utils.data_loader import FeedbackDataLoader
from services.database_service import DatabaseService

class FeedbackAnalyzer:
    def __init__(self):
        try:
            # Set memory efficient settings
            os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'max_split_size_mb:512'
            
            # Determine device
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
            
            # Initialize services
            sentiment_analyzer = load_sentiment_analyzer(self.device)
            tokenizer, model = load_category_models(self.device)
            
            self.sentiment_service = SentimentService(sentiment_analyzer)
            self.categorization_service = CategorizationService(tokenizer, model, self.device)
            self.priority_service = PriorityService()
            self.db_service = DatabaseService()
            
        except Exception as e:
            print(f"Error initializing FeedbackAnalyzer: {str(e)}")
            raise

    def process_feedback(self, feedback: str, metadata: Dict = None) -> Dict:
        try:
            # Analyze sentiment
            sentiment_result = self.sentiment_service.analyze(feedback)
            
            # Categorize feedback
            categories = self.categorization_service.categorize(feedback)
            
            # Determine priority
            priority = "low"
            if categories:
                priority = self.priority_service.determine_priority(
                    feedback,
                    sentiment_result['confidence'],
                    categories[0]['category']
                )

            result = {
                'feedback': feedback,
                'sentiment': sentiment_result['sentiment'],
                'sentiment_confidence': sentiment_result['confidence'],
                'categories': categories,
                'priority': priority,
                'processed_at': datetime.now().isoformat()
            }
            
            # Add metadata if provided
            if metadata:
                result.update(metadata)

            # Store in database
            self.db_service.store_feedback(result)
            
            # Clear memory
            gc.collect()
            return result
            
        except Exception as e:
            print(f"Error processing feedback: {str(e)}")
            return {
                'feedback': feedback,
                'error': str(e),
                'processed_at': datetime.now().isoformat()
            }

    def process_feedback_batch(self, feedbacks: List[str]) -> List[Dict]:
        return [self.process_feedback(feedback) for feedback in feedbacks]

def main():
    try:
        # Initialize the analyzer
        analyzer = FeedbackAnalyzer()
        
        # Initialize data loader
        data_path = os.path.join('data', 'mock_data', 'feedback_dataset_100.json')
        data_loader = FeedbackDataLoader(data_path)
        
        # Load feedback data
        feedbacks = data_loader.load_feedback_data()
        
        # Process feedback
        results = []
        for feedback in feedbacks:
            metadata = {
                'feedback_id': feedback['id'],
                'department': feedback['department'],
                'employee_level': feedback['employee_level'],
                'timestamp': feedback['timestamp']
            }
            result = analyzer.process_feedback(feedback['text'], metadata)
            results.append(result)
        
        # Print results with more detailed formatting
        for result in results:
            print("\n" + "="*80)
            print(f"Feedback ID: {result['feedback_id']}")
            print(f"Department: {result['department']}")
            print(f"Employee Level: {result['employee_level']}")
            print("-"*40)
            print("Text:", result['feedback'])
            print("Sentiment:", result['sentiment'])
            print("Confidence:", f"{result['sentiment_confidence']:.2%}")
            print("Categories:", [f"{cat['category']} ({cat['confidence']:.2%})" 
                               for cat in result['categories']])
            print("Priority:", result['priority'].upper())
            print("Processed at:", result['processed_at'])
                
    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main()
