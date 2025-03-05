from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum

class SentimentType(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"

class CategoryAnalysis(BaseModel):
    score: float = Field(ge=0, le=100)
    sentiment: str
    recommendations: List[str]

class ExecutiveSummary(BaseModel):
    overall_rating: str
    strengths: List[Dict]
    weaknesses: List[Dict]
    key_insights: List[str]
    action_items: List[Dict]

class QuestionAnalysis(BaseModel):
    question_id: str | int
    question_text: str
    question_type: str
    response: str
    category: Optional[str] = None
    score: float = Field(ge=0, le=100)
    sentiment: SentimentType
    suggestions: List = []
    improvement_priorities: List = []

    @validator('score')
    def validate_score(cls, v):
        if not 0 <= v <= 100:
            return 0.0
        return round(v, 1)

class FeedbackAnalysis(BaseModel):
    feedback_id: int
    project_id: int
    project_name: str
    submitted_by: Optional[str] = None
    submitted_at: datetime
    executive_summary: ExecutiveSummary
    question_analyses: List[QuestionAnalysis]
    overall_score: float = Field(ge=0, le=100)
    overall_sentiment: SentimentType
    overall_suggestions: List[str]
    overall_priorities: List[Dict]
    categories: Dict[str, CategoryAnalysis]
    satisfaction_score: float = Field(ge=0, le=100)
    improvement_areas: List[Dict]
    key_metrics: Dict

    @validator('satisfaction_score', 'overall_score')
    def validate_scores(cls, v):
        if not 0 <= v <= 100:
            return 0.0
        return round(v, 1)

class ProjectAnalysis(BaseModel):
    project_id: int
    project_name: str
    total_submissions: int = Field(ge=0)
    average_score: float = Field(ge=0, le=100)
    overall_sentiment: SentimentType
    sentiment_distribution: Dict[str, int]
    category_scores: Dict[str, float]
    top_suggestions: List[str]
    improvement_areas: List[Dict]
    trend_data: Dict[str, List[float]]
    submission_rate: float = Field(ge=0, le=100)
    participation_metrics: Dict[str, float]
    executive_summary: ExecutiveSummary
    category_analyses: Dict[str, CategoryAnalysis]

    @validator('average_score', 'submission_rate')
    def validate_rates(cls, v):
        if not 0 <= v <= 100:
            return 0.0
        return round(v, 1)

    @validator('sentiment_distribution')
    def validate_distribution(cls, v):
        total = sum(v.values())
        if total == 0:
            return {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0}
        return v

class UserAnalysis(BaseModel):
    user_id: str
    total_submissions: int = Field(ge=0)
    average_satisfaction: float = Field(ge=0, le=100)
    sentiment_trends: Dict[str, List[float]]
    participation_rate: float = Field(ge=0, le=100)
    most_active_categories: List[str]
    feedback_impact: Dict[str, float]
    improvement_suggestions: List[str]
    engagement_metrics: Dict[str, float]
    recent_submissions: List[FeedbackAnalysis]
    category_preferences: Dict[str, float]

    @validator('average_satisfaction', 'participation_rate')
    def validate_rates(cls, v):
        if not 0 <= v <= 100:
            return 0.0
        return round(v, 1)

    @validator('feedback_impact')
    def validate_impact(cls, v):
        return {k: round(val, 1) if isinstance(val, float) else val for k, val in v.items()} 