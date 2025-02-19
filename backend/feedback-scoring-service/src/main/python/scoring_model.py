import numpy as np
from textblob import TextBlob
from typing import Dict, List, Optional
from enum import Enum
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

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
        self.model_path = model_path or "models"
        
        # Initialize sentiment analysis model
        self.tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
        self.sentiment_model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
        
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
            "Very Dissatisfied": 0.2
        }

        # Sentiment mappings
        self.sentiment_scores = {
            "POSITIVE": 1.0,
            "NEUTRAL": 0.6,
            "NEGATIVE": 0.2
        }

    def initialize_models(self):
        """Initialize or load pre-trained models"""
        try:
            # Load TF-IDF vectorizer
            self.tfidf = joblib.load(os.path.join(self.model_path, "tfidf_vectorizer.joblib"))
            # Load impact classifier
            self.impact_classifier = joblib.load(os.path.join(self.model_path, "impact_classifier.joblib"))
        except:
            # Initialize new models if not found
            self.tfidf = TfidfVectorizer(max_features=5000)
            self.impact_classifier = RandomForestClassifier(n_estimators=100)

    def train_models(self, training_data: List[Dict]):
        """Train the ML models using provided training data"""
        texts = []
        impact_labels = []
        
        for item in training_data:
            texts.append(item["text"])
            impact_labels.append(item["impact_category"])
        
        # Train TF-IDF vectorizer
        X = self.tfidf.fit_transform(texts)
        
        # Train impact classifier
        self.impact_classifier.fit(X, impact_labels)
        
        # Save trained models
        os.makedirs(self.model_path, exist_ok=True)
        joblib.dump(self.tfidf, os.path.join(self.model_path, "tfidf_vectorizer.joblib"))
        joblib.dump(self.impact_classifier, os.path.join(self.model_path, "impact_classifier.joblib"))

    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment using transformer model"""
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        outputs = self.sentiment_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        sentiment_score = probs[0][1].item()  # Probability of positive sentiment
        
        return {
            "score": sentiment_score,
            "sentiment": "POSITIVE" if sentiment_score > 0.6 else "NEGATIVE" if sentiment_score < 0.4 else "NEUTRAL"
        }

    def score_single_choice(self, answer: str) -> float:
        """Score single choice questions based on predefined mappings."""
        return self.single_choice_scores.get(answer, 0.5)

    def score_multiple_choice(self, answers: List[str], total_choices: int) -> float:
        """Score multiple choice questions based on number of selections."""
        if not answers:
            return 0.0
        return min(len(answers) / total_choices, 1.0)

    def score_text_based(self, text: str) -> Dict:
        """Score text-based responses using ML models"""
        if not text:
            return {
                "score": 0.0,
                "impact": ImpactCategory.IMPROVEMENT_SUGGESTED,
                "sentiment": 0.0,
                "keywords": []
            }

        # Get sentiment analysis
        sentiment_result = self.analyze_sentiment(text)
        
        # Get impact category
        text_vector = self.tfidf.transform([text])
        impact = self.impact_classifier.predict(text_vector)[0]
        
        # Extract important keywords using TF-IDF
        feature_names = self.tfidf.get_feature_names_out()
        important_words = text_vector.toarray()[0]
        keywords = [(feature_names[i], important_words[i]) 
                   for i in important_words.argsort()[-5:][::-1] 
                   if important_words[i] > 0]

        return {
            "score": sentiment_result["score"],
            "impact": impact,
            "sentiment": sentiment_result["sentiment"],
            "keywords": keywords
        }

    def score_sentiment(self, sentiment: str) -> float:
        """Score sentiment-based responses."""
        return self.sentiment_scores.get(sentiment.upper(), 0.5)

    def score_submission(self, submission: Dict, questions: List[Dict]) -> Dict:
        """Score an entire feedback submission."""
        scores = {}
        total_score = 0.0
        question_map = {str(q["id"]): q for q in questions}

        for question_id, answer in submission["responses"].items():
            question = question_map.get(question_id)
            if not question:
                continue

            question_type = question["questionType"]
            
            if question_type == QuestionType.SINGLE_CHOICE:
                score = self.score_single_choice(answer)
            elif question_type == QuestionType.MULTIPLE_CHOICE:
                answers = answer.split(", ") if isinstance(answer, str) else answer
                score = self.score_multiple_choice(answers, len(question["choices"]))
            elif question_type == QuestionType.TEXT_BASED:
                score_data = self.score_text_based(answer)
                score = score_data["score"]
                scores[question_id] = score_data
                continue
            elif question_type == QuestionType.SENTIMENT:
                score = self.score_sentiment(answer)
            else:
                score = 0.0

            scores[question_id] = score
            total_score += score * self.weights[question_type]

        # Score overall comments
        overall_sentiment = self.score_text_based(submission.get("overallComments", ""))

        return {
            "submission_id": submission["id"],
            "question_scores": scores,
            "overall_score": total_score / sum(self.weights.values()),
            "overall_sentiment": overall_sentiment,
            "impact_category": overall_sentiment["impact"]
        }

# Example usage
if __name__ == "__main__":
    # Mock data
    mock_submission = {
        "id": 1,
        "responses": {
            "1": "Satisfied",
            "2": "Health Insurance, Remote Work, Professional Development",
            "3": "We need more team meetings and better communication tools.",
            "4": "POSITIVE"
        },
        "overallComments": "Generally satisfied but room for improvement."
    }

    mock_questions = [
        {
            "id": 1,
            "questionType": "SINGLE_CHOICE",
            "choices": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
        },
        {
            "id": 2,
            "questionType": "MULTIPLE_CHOICE",
            "choices": ["Health Insurance", "Remote Work", "Professional Development", "Gym Membership"]
        },
        {
            "id": 3,
            "questionType": "TEXT_BASED",
            "choices": []
        },
        {
            "id": 4,
            "questionType": "SENTIMENT",
            "choices": ["POSITIVE", "NEUTRAL", "NEGATIVE"]
        }
    ]

    scorer = FeedbackScorer()
    result = scorer.score_submission(mock_submission, mock_questions)
    print(json.dumps(result, indent=2)) 