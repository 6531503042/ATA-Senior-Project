import json
import os
from scoring_model import FeedbackScorer, ImpactCategory
from sklearn.model_selection import train_test_split
import logging
from textblob import TextBlob

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_training_data(file_path: str):
    """Load and preprocess training data from JSON file."""
    try:
        logging.info("Loading enhanced training data...")
        with open("enhanced_training_data.json", "r") as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"Error loading training data: {str(e)}")
        return []
    
    processed_data = []
    for submission in data.get("submissions", []):
        for question_detail in submission.get("questionDetails", []):
            if question_detail.get("questionType") == "TEXT_BASED":
                response = submission["responses"].get(str(question_detail["id"]), "")
                if not response:
                    continue
                
                # Determine impact category based on content analysis
                blob = TextBlob(response.lower())
                sentiment = "POSITIVE" if blob.sentiment.polarity > 0 else "NEGATIVE" if blob.sentiment.polarity < 0 else "NEUTRAL"
                
                if "improve" in response.lower() or "suggest" in response.lower() or "could be better" in response.lower():
                    impact = ImpactCategory.IMPROVEMENT_SUGGESTED
                elif sentiment == "NEGATIVE" or "problem" in response.lower() or "issue" in response.lower():
                    impact = ImpactCategory.HIGH_PRIORITY
                else:
                    impact = ImpactCategory.POSITIVE_FEEDBACK
                    
                processed_data.append({
                    "text": response,
                    "impact_category": impact,
                    "original_sentiment": sentiment,
                    "category": question_detail.get("category", "")
                })
    
    return processed_data

def main():
    # Create models directory
    os.makedirs("models", exist_ok=True)
    
    try:
        # Load enhanced training data
        logger.info("Loading enhanced training data...")
        training_data = load_training_data("src/main/python/enhanced_training_data.json")
        
        # Split data into train and test sets
        train_data, test_data = train_test_split(training_data, test_size=0.2, random_state=42)
        
        # Initialize and train the model
        logger.info("Initializing feedback scorer...")
        scorer = FeedbackScorer(model_path="models")
        
        logger.info("Training models...")
        scorer.train_models(train_data)
        
        # Evaluate on test set
        logger.info("Evaluating models...")
        correct_predictions = 0
        total_predictions = len(test_data)
        
        for item in test_data:
            result = scorer.score_text_based(item["text"])
            if result["impact"] == item["impact_category"]:
                correct_predictions += 1
        
        accuracy = correct_predictions / total_predictions
        logger.info(f"Model accuracy on test set: {accuracy:.2%}")
        
        logger.info("Training completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during training: {str(e)}")
        raise

if __name__ == "__main__":
    main() 