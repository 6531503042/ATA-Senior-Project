import logging
from typing import Dict, List, Any
from motor.motor_asyncio import AsyncIOMotorClient
from transformers import pipeline
import spacy
from config.settings import MONGODB_URL, FEEDBACK_SERVICE_URL

# Configure logger
logger = logging.getLogger(__name__)

class BaseService:
    """Base service class with common functionality"""
    
    def __init__(self, mongodb_url: str = MONGODB_URL, feedback_service_url: str = FEEDBACK_SERVICE_URL):
        """
        Initialize the base service
        
        Args:
            mongodb_url: MongoDB connection URL
            feedback_service_url: URL for the feedback service API
        """
        try:
            # Initialize MongoDB connection
            self.client = AsyncIOMotorClient(mongodb_url)
            self.db = self.client.feedback_analytics
            self.feedback_service_url = feedback_service_url
            
            # Initialize NLP components
            self._init_nlp_components()
            
            # Cache for sentiment analysis
            self.sentiment_cache = {}
            
            logger.info("Base service initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing base service: {str(e)}")
            raise
    
    def _init_nlp_components(self):
        """Initialize NLP components"""
        try:
            # Initialize sentiment pipeline
            self.sentiment_pipeline = pipeline("sentiment-analysis")
            
            # Initialize spaCy
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except OSError:
                # If model not found, download it
                import subprocess
                subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
                self.nlp = spacy.load("en_core_web_sm")
                
            logger.info("NLP components initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing NLP components: {str(e)}")
            raise
    
    def _get_sentiment_label(self, score: float) -> str:
        """
        Convert a sentiment score to a label
        
        Args:
            score: Sentiment score (0-1)
            
        Returns:
            Sentiment label (POSITIVE, NEUTRAL, NEGATIVE)
        """
        if score >= 0.6:
            return "POSITIVE"
        elif score <= 0.4:
            return "NEGATIVE"
        else:
            return "NEUTRAL"
    
    def count_sentiments(self, sentiments: List[str]) -> Dict[str, int]:
        """
        Count occurrences of each sentiment in a list
        
        Args:
            sentiments: List of sentiment labels
            
        Returns:
            Dictionary with counts for each sentiment
        """
        result = {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0}
        for sentiment in sentiments:
            if sentiment in result:
                result[sentiment] += 1
        return result 