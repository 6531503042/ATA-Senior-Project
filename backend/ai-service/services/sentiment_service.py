from typing import Dict

class SentimentService:
    def __init__(self, sentiment_analyzer):
        self.analyzer = sentiment_analyzer

    def analyze(self, text: str) -> Dict:
        """Analyze sentiment of the feedback"""
        result = self.analyzer(text)[0]
        return {
            'sentiment': result['label'],
            'confidence': result['score']
        } 