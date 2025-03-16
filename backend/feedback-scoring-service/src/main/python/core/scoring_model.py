import numpy as np
from textblob import TextBlob
from typing import Dict, List, Optional, Union
from enum import Enum
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import logging

# Configure logger
logger = logging.getLogger(__name__)

class QuestionType(str, Enum):
    SINGLE_CHOICE = "SINGLE_CHOICE"
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    TEXT_BASED = "TEXT_BASED"
    SENTIMENT = "SENTIMENT"

class ImpactCategory(str, Enum):
    HIGH_PRIORITY = "HIGH_PRIORITY"
    IMPROVEMENT_SUGGESTED = "IMPROVEMENT_SUGGESTED"
    POSITIVE_FEEDBACK = "POSITIVE_FEEDBACK"

class FeedbackScorer:
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the FeedbackScorer with models for sentiment analysis and impact classification.
        
        Args:
            model_path: Path to the directory containing trained models
        """
        self.model_path = model_path or "models"
        
        # Initialize sentiment analysis model
        try:
            self.tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
            self.sentiment_model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
            # Move model to GPU if available
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.sentiment_model.to(self.device)
            logger.info(f"Sentiment model loaded and running on {self.device}")
        except Exception as e:
            logger.error(f"Error loading sentiment model: {str(e)}")
            raise
        
        # Load or initialize ML models
        self.initialize_models()

        # Scoring weights for different question types
        self.weights = {
            QuestionType.SINGLE_CHOICE: 0.3,
            QuestionType.MULTIPLE_CHOICE: 0.2,
            QuestionType.TEXT_BASED: 0.3,
            QuestionType.SENTIMENT: 0.2
        }

        # Choice mappings for single choice questions
        self.single_choice_scores = {
            "Very Satisfied": 1.0,
            "Satisfied": 0.8,
            "Neutral": 0.6,
            "Dissatisfied": 0.4,
            "Very Dissatisfied": 0.2,
            # Add numeric mappings
            "5": 1.0,
            "4": 0.8,
            "3": 0.6,
            "2": 0.4,
            "1": 0.2
        }

        # Sentiment mappings
        self.sentiment_scores = {
            "POSITIVE": 1.0,
            "NEUTRAL": 0.6,
            "NEGATIVE": 0.2
        }
        
        # Cache for sentiment analysis results
        self.sentiment_cache = {}

    def initialize_models(self):
        """Initialize or load pre-trained models"""
        try:
            # Load TF-IDF vectorizer
            tfidf_path = os.path.join(self.model_path, "tfidf_vectorizer.joblib")
            if os.path.exists(tfidf_path):
                self.tfidf = joblib.load(tfidf_path)
                logger.info("Loaded TF-IDF vectorizer from disk")
            else:
                self.tfidf = TfidfVectorizer(max_features=5000)
                logger.info("Initialized new TF-IDF vectorizer")
            
            # Load impact classifier
            classifier_path = os.path.join(self.model_path, "impact_classifier.joblib")
            if os.path.exists(classifier_path):
                self.impact_classifier = joblib.load(classifier_path)
                logger.info("Loaded impact classifier from disk")
            else:
                self.impact_classifier = RandomForestClassifier(n_estimators=100)
                logger.info("Initialized new impact classifier")
        except Exception as e:
            logger.error(f"Error initializing models: {str(e)}")
            # Initialize new models if loading fails
            self.tfidf = TfidfVectorizer(max_features=5000)
            self.impact_classifier = RandomForestClassifier(n_estimators=100)
            logger.info("Initialized new models due to loading error")

    def train_models(self, training_data: List[Dict]):
        """
        Train the ML models using provided training data
        
        Args:
            training_data: List of dictionaries containing text and impact_category
        """
        if not training_data:
            logger.warning("No training data provided")
            return
            
        try:
            texts = []
            impact_labels = []
            
            for item in training_data:
                texts.append(item["text"])
                impact_labels.append(item["impact_category"])
            
            logger.info(f"Training models with {len(texts)} examples")
            
            # Train TF-IDF vectorizer
            X = self.tfidf.fit_transform(texts)
            
            # Train impact classifier
            self.impact_classifier.fit(X, impact_labels)
            
            # Save trained models
            os.makedirs(self.model_path, exist_ok=True)
            joblib.dump(self.tfidf, os.path.join(self.model_path, "tfidf_vectorizer.joblib"))
            joblib.dump(self.impact_classifier, os.path.join(self.model_path, "impact_classifier.joblib"))
            
            logger.info("Models trained and saved successfully")
        except Exception as e:
            logger.error(f"Error training models: {str(e)}")
            raise

    def analyze_sentiment(self, text: str) -> Dict:
        """
        Analyze sentiment using transformer model with caching
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with sentiment score and label
        """
        # Check cache first
        if text in self.sentiment_cache:
            return self.sentiment_cache[text]
            
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            # Move inputs to the same device as the model
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.sentiment_model(**inputs)
                
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            sentiment_score = probs[0][1].item()  # Probability of positive sentiment
            
            result = {
                "score": sentiment_score,  # Keep as 0-1 scale, will be converted to 0-100 in score_text_based
                "sentiment": "POSITIVE" if sentiment_score > 0.6 else "NEGATIVE" if sentiment_score < 0.4 else "NEUTRAL"
            }
            
            # Cache the result
            self.sentiment_cache[text] = result
            return result
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {str(e)}")
            # Fallback to TextBlob if transformer fails
            return self._fallback_sentiment_analysis(text)
    
    def _fallback_sentiment_analysis(self, text: str) -> Dict:
        """Fallback sentiment analysis using TextBlob"""
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            
            # Map TextBlob polarity to our sentiment categories
            if polarity > 0.1:
                sentiment = "POSITIVE"
                score = 0.5 + (polarity / 2)  # Map 0.1 to 1.0 to 0.55 to 1.0
            elif polarity < -0.1:
                sentiment = "NEGATIVE"
                score = 0.5 - (abs(polarity) / 2)  # Map -0.1 to -1.0 to 0.45 to 0.0
            else:
                sentiment = "NEUTRAL"
                score = 0.5
                
            return {
                "score": score,  # Keep as 0-1 scale, will be converted to 0-100 in score_text_based
                "sentiment": sentiment
            }
        except Exception as e:
            logger.error(f"Error in fallback sentiment analysis: {str(e)}")
            # Ultimate fallback
            return {
                "score": 0.5,
                "sentiment": "NEUTRAL"
            }

    def score_single_choice(self, answer: str) -> float:
        """Score a single choice answer"""
        # Convert score to 0-100 scale and round to 1 decimal place
        score = self.single_choice_scores.get(answer, 0.5)
        return round(score * 100, 1)

    def score_multiple_choice(self, answers: List[str], total_choices: int) -> float:
        """Score multiple choice answers based on selection ratio"""
        if not total_choices:
            return 50.0
        # Convert score to 0-100 scale and round to 1 decimal place
        score = min(1.0, len(answers) / total_choices)
        return round(score * 100, 1)

    def score_text_based(self, text: str) -> Dict:
        """
        Score and analyze a text-based response
        
        Args:
            text: Text response to analyze
            
        Returns:
            Dictionary with analysis results
        """
        if not text or len(text.strip()) == 0:
            return {
                "score": 0.0,
                "sentiment": "NEUTRAL",
                "suggestions": [],
                "keywords": [],
                "impact_category": ImpactCategory.NEUTRAL
            }
            
        try:
            # Analyze sentiment
            sentiment_result = self.analyze_sentiment(text)
            
            # Extract keywords using TextBlob
            blob = TextBlob(text)
            noun_phrases = list(set(blob.noun_phrases))
            
            # Get impact category
            X = self.tfidf.transform([text])
            impact_category = self.impact_classifier.predict(X)[0]
            
            # Generate suggestions based on content
            suggestions = self._generate_suggestions(text, sentiment_result["sentiment"], impact_category)
            
            # Convert score to 0-100 scale and round to 1 decimal place
            score = round(sentiment_result["score"] * 100, 1)
            
            return {
                "score": score,
                "sentiment": sentiment_result["sentiment"],
                "suggestions": suggestions,
                "keywords": noun_phrases[:5],  # Top 5 keywords
                "impact_category": impact_category
            }
        except Exception as e:
            logger.error(f"Error scoring text: {str(e)}")
            return {
                "score": 50.0,
                "sentiment": "NEUTRAL",
                "suggestions": [],
                "keywords": [],
                "impact_category": ImpactCategory.NEUTRAL
            }
    
    def _generate_suggestions(self, text: str, sentiment: str, impact_category: str) -> List[str]:
        """Generate improvement suggestions based on text content"""
        # This would be expanded with more sophisticated logic
        suggestions = []
        
        # Simple keyword-based suggestion generation
        if "communication" in text.lower():
            suggestions.append("Consider improving team communication channels")
        if "deadline" in text.lower() or "time" in text.lower():
            suggestions.append("Review project timelines and deadline management")
        if "resource" in text.lower():
            suggestions.append("Evaluate resource allocation for the team")
        if "training" in text.lower() or "skill" in text.lower():
            suggestions.append("Provide additional training opportunities")
        
        return suggestions[:3]  # Return top 3 suggestions

    def score_sentiment(self, sentiment: str) -> float:
        """Score a sentiment response"""
        # Convert score to 0-100 scale and round to 1 decimal place
        score = self.sentiment_scores.get(sentiment.upper(), 0.5)
        return round(score * 100, 1)

    def score_submission(self, submission: Dict, questions: List[Dict]) -> Dict:
        """
        Score a complete feedback submission
        
        Args:
            submission: The feedback submission data
            questions: List of question definitions
            
        Returns:
            Dictionary with scoring results
        """
        if not submission or not questions:
            return {
                "overall_score": 0.0,
                "question_scores": [],
                "sentiment": "NEUTRAL",
                "suggestions": []
            }
            
        try:
            responses = submission.get("responses", {})
            question_scores = []
            total_weight = 0
            weighted_score_sum = 0
            all_suggestions = []
            
            for question in questions:
                question_id = str(question.get("id"))
                question_type = question.get("questionType", "TEXT_BASED")
                response = responses.get(question_id)
                
                if not response:
                    continue
                    
                # Score based on question type
                if question_type == QuestionType.SINGLE_CHOICE:
                    score = self.score_single_choice(response)
                    result = {
                        "score": score,
                        "sentiment": "POSITIVE" if score > 70 else "NEGATIVE" if score < 40 else "NEUTRAL",
                        "suggestions": []
                    }
                elif question_type == QuestionType.MULTIPLE_CHOICE:
                    total_choices = len(question.get("choices", []))
                    score = self.score_multiple_choice(response, total_choices)
                    result = {
                        "score": score,
                        "sentiment": "POSITIVE" if score > 70 else "NEGATIVE" if score < 40 else "NEUTRAL",
                        "suggestions": []
                    }
                elif question_type == QuestionType.SENTIMENT:
                    score = self.score_sentiment(response)
                    result = {
                        "score": score,
                        "sentiment": response.upper(),
                        "suggestions": []
                    }
                else:  # TEXT_BASED
                    result = self.score_text_based(response)
                    score = result.get("score", 50.0)
                    
                # Add suggestions to the collection
                if result.get("suggestions"):
                    all_suggestions.extend(result["suggestions"])
                
                # Calculate weighted score
                weight = self.weights.get(question_type, 0.25)
                weighted_score_sum += (score / 100) * weight  # Convert back to 0-1 scale for weighting
                total_weight += weight
                
                # Add to question scores
                question_scores.append({
                    "question_id": question_id,
                    "score": score,
                    "sentiment": result.get("sentiment", "NEUTRAL"),
                    "suggestions": result.get("suggestions", [])
                })
            
            # Calculate overall score
            if total_weight > 0:
                # Convert to 0-100 scale and round to 1 decimal place
                overall_score = round((weighted_score_sum / total_weight) * 100, 1)
            else:
                overall_score = 50.0
            
            # Determine overall sentiment
            if overall_score > 70:
                overall_sentiment = "POSITIVE"
            elif overall_score < 40:
                overall_sentiment = "NEGATIVE"
            else:
                overall_sentiment = "NEUTRAL"
                
            # Remove duplicate suggestions
            unique_suggestions = list(set(all_suggestions))
            
            return {
                "overall_score": overall_score,
                "question_scores": question_scores,
                "sentiment": overall_sentiment,
                "suggestions": unique_suggestions[:5]  # Top 5 unique suggestions
            }
        except Exception as e:
            logger.error(f"Error scoring submission: {str(e)}")
            return {
                "overall_score": 50.0,
                "question_scores": [],
                "sentiment": "NEUTRAL",
                "suggestions": [],
                "error": str(e)
            } 