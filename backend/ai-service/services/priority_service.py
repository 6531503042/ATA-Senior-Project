from config.categories_config import CATEGORY_WEIGHTS

class PriorityService:
    def __init__(self):
        self.category_weights = CATEGORY_WEIGHTS

    def determine_priority(self, text: str, sentiment_score: float, category: str) -> str:
        """Determine priority level based on sentiment and category"""
        category_weight = self.category_weights.get(category, 0.5)
        priority_score = abs(sentiment_score - 0.5) * 2 * category_weight

        if priority_score > 0.7:
            return "high"
        elif priority_score > 0.4:
            return "medium"
        return "low" 