import json
import os
import logging
from typing import List, Dict, Any
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import torch
from tqdm import tqdm
import concurrent.futures
from pathlib import Path

# Configure logger
logger = logging.getLogger(__name__)

# Import local modules
from core.scoring_model import FeedbackScorer, ImpactCategory

def load_training_data(file_path: str) -> List[Dict[str, Any]]:
    """
    Load training data from a JSON file
    
    Args:
        file_path: Path to the JSON file containing training data
        
    Returns:
        List of training data items
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info(f"Loaded {len(data)} training examples from {file_path}")
        return data
    except Exception as e:
        logger.error(f"Error loading training data: {str(e)}")
        # Return empty list if file not found or invalid
        return []

def preprocess_training_data(raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Preprocess raw training data into a format suitable for model training
    
    Args:
        raw_data: Raw training data from JSON file
        
    Returns:
        Preprocessed training data
    """
    processed_data = []
    
    try:
        for item in raw_data:
            # Extract text responses
            responses = item.get("responses", {})
            
            for question_id, response in responses.items():
                if isinstance(response, str) and len(response.strip()) > 0:
                    # Determine impact category based on sentiment and keywords
                    impact_category = determine_impact_category(response)
                    
                    processed_data.append({
                        "text": response,
                        "impact_category": impact_category,
                        "original_id": item.get("id"),
                        "question_id": question_id
                    })
            
            # Also process overall comments if available
            if "overallComments" in item and item["overallComments"]:
                impact_category = determine_impact_category(item["overallComments"])
                processed_data.append({
                    "text": item["overallComments"],
                    "impact_category": impact_category,
                    "original_id": item.get("id"),
                    "question_id": "overall"
                })
                
        logger.info(f"Preprocessed {len(processed_data)} training examples")
        return processed_data
    except Exception as e:
        logger.error(f"Error preprocessing training data: {str(e)}")
        return []

def determine_impact_category(text: str) -> str:
    """
    Determine the impact category of a text response based on keywords
    
    Args:
        text: Text response
        
    Returns:
        Impact category string
    """
    text_lower = text.lower()
    
    # Keywords indicating high priority issues
    high_priority_keywords = [
        "urgent", "critical", "immediately", "serious", "major issue",
        "blocker", "broken", "failing", "crash", "error", "bug"
    ]
    
    # Keywords indicating improvement suggestions
    improvement_keywords = [
        "improve", "suggest", "recommendation", "consider", "should",
        "could", "would be better", "enhance", "upgrade", "update"
    ]
    
    # Keywords indicating positive feedback
    positive_keywords = [
        "great", "excellent", "good", "awesome", "fantastic",
        "helpful", "useful", "appreciate", "thank", "well done"
    ]
    
    # Check for high priority issues first
    if any(keyword in text_lower for keyword in high_priority_keywords):
        return ImpactCategory.HIGH_PRIORITY
    
    # Then check for improvement suggestions
    if any(keyword in text_lower for keyword in improvement_keywords):
        return ImpactCategory.IMPROVEMENT_SUGGESTED
    
    # Finally check for positive feedback
    if any(keyword in text_lower for keyword in positive_keywords):
        return ImpactCategory.POSITIVE_FEEDBACK
    
    # Default to improvement suggested if no clear category is found
    return ImpactCategory.IMPROVEMENT_SUGGESTED

def train_and_evaluate(training_data: List[Dict[str, Any]], model_path: str = "models") -> Dict[str, Any]:
    """
    Train and evaluate the feedback scoring models
    
    Args:
        training_data: Preprocessed training data
        model_path: Path to save trained models
        
    Returns:
        Dictionary with training results and metrics
    """
    if not training_data:
        logger.warning("No training data provided")
        return {"success": False, "error": "No training data provided"}
    
    try:
        # Initialize scorer
        scorer = FeedbackScorer(model_path=model_path)
        
        # Split data into training and validation sets
        train_data, val_data = train_test_split(training_data, test_size=0.2, random_state=42)
        
        logger.info(f"Training with {len(train_data)} examples, validating with {len(val_data)} examples")
        
        # Train models
        scorer.train_models(train_data)
        
        # Evaluate on validation set
        val_texts = [item["text"] for item in val_data]
        val_labels = [item["impact_category"] for item in val_data]
        
        # Process validation data in parallel for faster evaluation
        predictions = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = [executor.submit(scorer.score_text_based, text) for text in val_texts]
            for future in tqdm(concurrent.futures.as_completed(futures), total=len(futures), desc="Evaluating"):
                result = future.result()
                predictions.append(result.get("impact_category", ImpactCategory.IMPROVEMENT_SUGGESTED))
        
        # Calculate metrics
        accuracy = accuracy_score(val_labels, predictions)
        report = classification_report(val_labels, predictions, output_dict=True)
        
        logger.info(f"Model evaluation complete. Accuracy: {accuracy:.4f}")
        
        return {
            "success": True,
            "accuracy": accuracy,
            "report": report,
            "training_size": len(train_data),
            "validation_size": len(val_data)
        }
    except Exception as e:
        logger.error(f"Error in model training and evaluation: {str(e)}")
        return {"success": False, "error": str(e)}

def main():
    """Main function to train the feedback scoring models"""
    try:
        # Set up model directory
        model_dir = "models"
        os.makedirs(model_dir, exist_ok=True)
        
        # Load training data
        data_path = "../resources/mock_training_data.json"
        if not os.path.exists(data_path):
            # Try to find the file in different locations
            potential_paths = [
                "mock_training_data.json",  # Current directory
                "../resources/mock_training_data.json",  # Resources directory
                "../../resources/mock_training_data.json",  # One level up
                "../../../resources/mock_training_data.json",  # Two levels up
                "src/main/resources/mock_training_data.json",  # Project root
            ]
            
            for path in potential_paths:
                if os.path.exists(path):
                    data_path = path
                    logger.info(f"Found training data at {data_path}")
                    break
        
        raw_data = load_training_data(data_path)
        
        if not raw_data:
            logger.error(f"No training data found at {data_path}")
            return
        
        # Preprocess data
        processed_data = preprocess_training_data(raw_data)
        
        # Train and evaluate models
        results = train_and_evaluate(processed_data, model_path=model_dir)
        
        if results["success"]:
            logger.info("Model training completed successfully")
            logger.info(f"Model accuracy: {results['accuracy']:.4f}")
            
            # Save training results
            with open(os.path.join(model_dir, "training_results.json"), "w") as f:
                json.dump(results, f, indent=2)
        else:
            logger.error(f"Model training failed: {results.get('error', 'Unknown error')}")
    
    except Exception as e:
        logger.error(f"Error in main training function: {str(e)}")

if __name__ == "__main__":
    # Configure logging when run as script
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    main() 