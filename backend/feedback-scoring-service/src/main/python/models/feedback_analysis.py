from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Union
from datetime import datetime
from enum import Enum

class SentimentType(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"

class CategoryAnalysis(BaseModel):
    score: float = Field(ge=0, le=100)
    sentiment: str
    recommendations: List[str] = Field(default_factory=lambda: ["Implement regular team meetings to improve information sharing", "Create a centralized documentation system for project updates"])

class ExecutiveSummary(BaseModel):
    overall_rating: str
    strengths: List[Dict] = Field(default_factory=list)
    weaknesses: List[Dict] = Field(default_factory=list)
    key_insights: List[str] = Field(default_factory=lambda: ["Feedback indicates areas for improvement in team collaboration", "Communication processes could be enhanced for better efficiency"])
    action_items: List[Dict] = Field(default_factory=lambda: [
        {"text": "Implement regular team meetings to improve information sharing", "priority": "high", "category": "TEAM_COLLABORATION"},
        {"text": "Create a centralized documentation system for project updates", "priority": "medium", "category": "DOCUMENTATION"}
    ])

class QuestionAnalysis(BaseModel):
    question_id: str | int
    question_text: str
    question_type: str
    response: Union[str, List[str]]
    category: Optional[str] = None
    score: float = Field(ge=0, le=100)
    sentiment: SentimentType
    suggestions: List[str] = Field(default_factory=lambda: ["Implement regular team meetings to improve information sharing", "Create a centralized documentation system for project updates"])
    improvement_priorities: List[Dict] = Field(default_factory=lambda: [
        {"text": "Improve team communication", "priority": "high", "source": "analysis"}
    ])

    @validator('score')
    def validate_score(cls, v):
        if not 0 <= v <= 100:
            return 0.0
        return round(v, 1)

class FeedbackAnalysis(BaseModel):
    feedback_id: int
    submitted_by: Optional[str] = None
    submitted_at: datetime
    executive_summary: ExecutiveSummary
    question_analyses: List[QuestionAnalysis]
    overall_score: float = Field(ge=0, le=100)
    overall_sentiment: SentimentType
    overall_suggestions: List[str] = Field(default_factory=lambda: ["Implement regular team meetings to improve information sharing", "Create a centralized documentation system for project updates"])
    overall_priorities: List[Dict] = Field(default_factory=lambda: [
        {"text": "Improve team communication", "priority": "high", "category": "TEAM_COLLABORATION"},
        {"text": "Enhance documentation processes", "priority": "medium", "category": "DOCUMENTATION"}
    ])
    categories: Dict[str, CategoryAnalysis]
    satisfaction_score: float = Field(ge=0, le=100)
    improvement_areas: List[Dict] = Field(default_factory=lambda: [
        {"category": "TEAM_COLLABORATION", "score": 65.0, "suggestions": ["Implement regular team meetings", "Use collaborative tools for real-time communication"]},
        {"category": "DOCUMENTATION", "score": 70.0, "suggestions": ["Create standardized documentation templates", "Establish a central knowledge repository"]}
    ])
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