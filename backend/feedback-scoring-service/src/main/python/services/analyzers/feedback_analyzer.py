import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
from models.feedback_analysis import *
from services.base_service import BaseService
from services.analyzers.text_analyzer import TextAnalyzerService
from services.data.data_service import DataService
from utils.helpers import normalize_score, async_timed

# Configure logger
logger = logging.getLogger(__name__)

class FeedbackAnalyzerService(BaseService):
    """Service for analyzing feedback submissions"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Initialize sub-services
        self.text_analyzer = TextAnalyzerService(*args, **kwargs)
        self.data_service = DataService(*args, **kwargs)
    
    @async_timed
    async def analyze_feedback_submission(self, submission: Dict) -> FeedbackAnalysis:
        """
        Analyze a feedback submission
        
        Args:
            submission: Feedback submission to analyze
            
        Returns:
            FeedbackAnalysis object with analysis results
        """
        try:
            logger.info(f"Analyzing feedback submission {submission.get('id')}")
            
            # Extract basic information
            feedback_id = submission.get("id") or submission.get("feedbackId", 0)
            submitted_by = submission.get("submittedBy", None)
            submitted_at = submission.get("submittedAt", datetime.now().isoformat())
            
            # Convert submitted_at to datetime if it's a string
            if isinstance(submitted_at, str):
                submitted_at = datetime.fromisoformat(submitted_at)
            
            # Get responses and question details
            responses = submission.get("responses", {})
            question_details = submission.get("questionDetails", [])
            
            # Analyze each question response
            question_analyses = []
            for question in question_details:
                question_id = str(question.get("id"))
                response = responses.get(question_id)
                
                if response is not None:
                    analysis = await self.analyze_question_response(question, response)
                    question_analyses.append(analysis)
            
            # Analyze overall comments if available
            overall_comments = submission.get("overallComments", "")
            overall_suggestions = [
                "Implement regular team meetings to improve information sharing",
                "Create a centralized documentation system for project updates",
                "Establish clear communication channels for feedback and updates"
            ]
            
            if overall_comments:
                overall_analysis = await self.text_analyzer.analyze_text_response(overall_comments)
                if overall_analysis.get("suggestions"):
                    overall_suggestions = overall_analysis.get("suggestions")
            
            # Generate executive summary
            executive_summary = await self._generate_executive_summary(
                question_analyses, overall_comments
            )
            
            # Calculate overall score and sentiment
            overall_score = self._calculate_overall_score(question_analyses)
            overall_sentiment = self._get_sentiment_label(overall_score / 100)  # Convert to 0-1 range
            
            # Calculate satisfaction score
            satisfaction_score = self._calculate_satisfaction_score(question_analyses)
            
            # Ensure satisfaction score is a valid number between 0 and 100
            satisfaction_score = max(0, min(100, satisfaction_score))
            satisfaction_score = round(satisfaction_score, 1)  # Round to 1 decimal place
            
            # Extract priorities
            overall_priorities = [
                {"text": "Improve team communication", "priority": "high", "category": "TEAM_COLLABORATION"},
                {"text": "Enhance documentation processes", "priority": "medium", "category": "DOCUMENTATION"}
            ]
            
            for analysis in question_analyses:
                if analysis.improvement_priorities:
                    overall_priorities.extend(analysis.improvement_priorities)
            
            # Limit to top 5 priorities
            overall_priorities = overall_priorities[:5]
            
            # Extract categories
            categories = {}
            for analysis in question_analyses:
                if analysis.category:
                    if analysis.category not in categories:
                        default_recommendations = [
                            "Implement regular team meetings to improve information sharing",
                            "Create a centralized documentation system for project updates"
                        ]
                        
                        categories[analysis.category] = CategoryAnalysis(
                            score=analysis.score,
                            sentiment=analysis.sentiment,
                            recommendations=analysis.suggestions or default_recommendations
                        )
                    else:
                        # Update existing category
                        categories[analysis.category].score = (
                            categories[analysis.category].score + analysis.score
                        ) / 2
                        
                        # Add recommendations if available
                        if analysis.suggestions:
                            categories[analysis.category].recommendations.extend(analysis.suggestions)
                            # Ensure unique recommendations and limit to 3
                            categories[analysis.category].recommendations = list(set(categories[analysis.category].recommendations))[:3]
            
            # Extract improvement areas
            improvement_areas = self._extract_improvement_areas(question_analyses)
            
            # Count sentiments
            sentiments = [analysis.sentiment for analysis in question_analyses]
            sentiment_distribution = self.count_sentiments(sentiments)
            
            # Ensure sentiment distribution has valid percentages
            total_sentiments = sum(sentiment_distribution.values())
            if total_sentiments > 0:
                for sentiment, count in sentiment_distribution.items():
                    sentiment_distribution[sentiment] = round((count / total_sentiments) * 100, 1)
            else:
                # Default values if no sentiments found
                sentiment_distribution = {
                    "POSITIVE": 33.3,
                    "NEUTRAL": 33.3,
                    "NEGATIVE": 33.3
                }
            
            # Calculate response quality
            response_quality = self._calculate_response_quality(question_analyses)
            
            # Create key metrics
            key_metrics = {
                "satisfaction_score": satisfaction_score,
                "response_quality": response_quality,
                "sentiment_distribution": sentiment_distribution,
                "completion_rate": 100.0  # Default to 100% for now
            }
            
            # Create feedback analysis object
            analysis = FeedbackAnalysis(
                feedback_id=feedback_id,
                project_id=submission.get("projectId", 0),
                project_name=submission.get("projectName", "Unknown Project"),
                submitted_by=submitted_by,
                submitted_at=submitted_at,
                executive_summary=executive_summary,
                question_analyses=question_analyses,
                overall_score=overall_score,
                overall_sentiment=overall_sentiment,
                overall_suggestions=overall_suggestions,
                overall_priorities=overall_priorities,
                categories=categories,
                satisfaction_score=satisfaction_score,
                improvement_areas=improvement_areas,
                key_metrics=key_metrics
            )
            
            # Store analysis in MongoDB
            await self.data_service.store_analysis(analysis)
            
            return analysis
        except Exception as e:
            logger.error(f"Error analyzing feedback submission: {str(e)}")
            raise
    
    async def analyze_question_response(self, question: Dict, response: Union[str, List[str]]) -> QuestionAnalysis:
        """
        Analyze a question response
        
        Args:
            question: Question details
            response: Response to analyze (can be string or list for multiple choice)
            
        Returns:
            QuestionAnalysis object with analysis results
        """
        try:
            question_id = question.get("id")
            question_text = question.get("text", "")
            question_type = question.get("questionType", "TEXT_BASED")
            category = question.get("category")
            
            # Default values
            score = 50.0
            sentiment = SentimentType.NEUTRAL
            suggestions = []
            improvement_priorities = []
            
            # Analyze based on question type
            if question_type == "TEXT_BASED":
                # Ensure response is a string
                if not isinstance(response, str):
                    response_str = str(response)
                else:
                    response_str = response
                    
                # Analyze text response with category context
                analysis = await self.text_analyzer.analyze_text_response(response_str, category=category)
                score = analysis.get("score", 50.0)
                sentiment_str = analysis.get("sentiment", "NEUTRAL")
                sentiment = SentimentType(sentiment_str)
                
                if analysis.get("suggestions"):
                    suggestions = analysis.get("suggestions")
                
                # Extract priorities
                if sentiment != SentimentType.POSITIVE:
                    priorities = self.text_analyzer.extract_priorities(response_str)
                    if priorities:
                        improvement_priorities = priorities
            
            elif question_type == "SINGLE_CHOICE":
                # Ensure response is a string
                if not isinstance(response, str):
                    response_str = str(response)
                else:
                    response_str = response
                    
                # Map single choice responses to scores
                choice_scores = {
                    "Very Satisfied": 100.0,
                    "Satisfied": 80.0,
                    "Neutral": 60.0,
                    "Dissatisfied": 40.0,
                    "Very Dissatisfied": 20.0,
                    "5": 100.0,
                    "4": 80.0,
                    "3": 60.0,
                    "2": 40.0,
                    "1": 20.0
                }
                
                score = choice_scores.get(response_str, 50.0)
                
                # Determine sentiment based on score
                if score >= 70:
                    sentiment = SentimentType.POSITIVE
                elif score <= 40:
                    sentiment = SentimentType.NEGATIVE
                else:
                    sentiment = SentimentType.NEUTRAL
                
                # Generate suggestions for negative responses
                if sentiment == SentimentType.NEGATIVE and category:
                    # Use the question text as context for more relevant suggestions
                    context_text = f"{question_text}: {response_str}"
                    analysis = await self.text_analyzer.analyze_text_response(context_text, category=category)
                    if analysis.get("suggestions"):
                        suggestions = analysis.get("suggestions")
                    else:
                        category_suggestions = self.text_analyzer.get_default_recommendations(category)
                        if category_suggestions:
                            suggestions = category_suggestions
            
            elif question_type == "MULTIPLE_CHOICE":
                # For multiple choice, calculate score based on number of selections
                if isinstance(response, list):
                    # More selections generally indicate more areas for improvement
                    # So we invert the score (more selections = lower score)
                    choices = question.get("choices", [])
                    if choices:
                        selection_ratio = len(response) / len(choices)
                        score = 100 - (selection_ratio * 100)
                    
                    # Determine sentiment based on score
                    if score >= 70:
                        sentiment = SentimentType.POSITIVE
                    elif score <= 40:
                        sentiment = SentimentType.NEGATIVE
                    else:
                        sentiment = SentimentType.NEUTRAL
                    
                    # Generate suggestions based on selections
                    if category:
                        # Create a context string from the selections
                        context_text = f"{question_text}: {', '.join(response)}"
                        analysis = await self.text_analyzer.analyze_text_response(context_text, category=category)
                        if analysis.get("suggestions"):
                            suggestions = analysis.get("suggestions")
                        else:
                            category_suggestions = self.text_analyzer.get_default_recommendations(category)
                            if category_suggestions:
                                suggestions = category_suggestions
                else:
                    # Handle case where response is not a list
                    logger.warning(f"Expected list for MULTIPLE_CHOICE but got {type(response)}")
                    # Try to convert to list if it's a string
                    if isinstance(response, str):
                        try:
                            # If it's a comma-separated string, split it
                            response_list = [item.strip() for item in response.split(',')]
                            # Recalculate with the list
                            choices = question.get("choices", [])
                            if choices:
                                selection_ratio = len(response_list) / len(choices)
                                score = 100 - (selection_ratio * 100)
                            
                            # Generate suggestions based on the parsed list
                            if category:
                                context_text = f"{question_text}: {response}"
                                analysis = await self.text_analyzer.analyze_text_response(context_text, category=category)
                                if analysis.get("suggestions"):
                                    suggestions = analysis.get("suggestions")
                        except Exception as e:
                            logger.error(f"Error converting string to list for MULTIPLE_CHOICE: {str(e)}")
            
            elif question_type == "SENTIMENT":
                # Ensure response is a string
                if not isinstance(response, str):
                    response_str = str(response)
                else:
                    response_str = response
                    
                # Direct sentiment response
                sentiment_map = {
                    "POSITIVE": (SentimentType.POSITIVE, 100.0),
                    "NEUTRAL": (SentimentType.NEUTRAL, 50.0),
                    "NEGATIVE": (SentimentType.NEGATIVE, 0.0),
                    "Positive": (SentimentType.POSITIVE, 100.0),
                    "Neutral": (SentimentType.NEUTRAL, 50.0),
                    "Negative": (SentimentType.NEGATIVE, 0.0)
                }
                
                sentiment, score = sentiment_map.get(response_str.upper(), sentiment_map.get(response_str, (SentimentType.NEUTRAL, 50.0)))
            
            # Ensure we have suggestions
            if not suggestions:
                if category:
                    suggestions = self.text_analyzer.get_default_recommendations(category)[:2]
                    # Add a more specific suggestion based on the question
                    question_suggestion = f"Gather more detailed feedback about {question_text.lower()}"
                    suggestions.append(question_suggestion)
                else:
                    suggestions = [
                        "Implement regular team meetings to improve information sharing",
                        "Create a centralized documentation system for project updates",
                        "Establish clear communication channels for feedback and updates"
                    ]
            
            # Ensure we have improvement priorities
            if not improvement_priorities and sentiment != SentimentType.POSITIVE:
                improvement_priorities = [
                    {"text": f"Improve {category.lower().replace('_', ' ') if category else 'team communication'}", 
                     "priority": "high", 
                     "source": "analysis"}
                ]
            
            # Create question analysis object
            return QuestionAnalysis(
                question_id=question_id,
                question_text=question_text,
                question_type=question_type,
                response=response,
                category=category,
                score=score,
                sentiment=sentiment,
                suggestions=suggestions,
                improvement_priorities=improvement_priorities
            )
        except Exception as e:
            logger.error(f"Error analyzing question response: {str(e)}")
            # Return default analysis
            return QuestionAnalysis(
                question_id=question.get("id", 0),
                question_text=question.get("text", ""),
                question_type=question.get("questionType", "TEXT_BASED"),
                response=str(response) if not isinstance(response, (str, list)) else response,
                category=question.get("category"),
                score=50.0,
                sentiment=SentimentType.NEUTRAL,
                suggestions=[
                    "Implement regular team meetings to improve information sharing",
                    "Create a centralized documentation system for project updates"
                ],
                improvement_priorities=[
                    {"text": "Improve team communication", "priority": "high", "source": "analysis"}
                ]
            )
    
    async def _generate_executive_summary(
        self, question_analyses: List[QuestionAnalysis], overall_comments: str
    ) -> ExecutiveSummary:
        """
        Generate an executive summary from question analyses
        
        Args:
            question_analyses: List of question analyses
            overall_comments: Overall comments from the submission
            
        Returns:
            ExecutiveSummary object
        """
        try:
            # Calculate overall rating
            overall_score = self._calculate_overall_score(question_analyses)
            
            if overall_score >= 80:
                overall_rating = "Excellent feedback with strong positive sentiment"
            elif overall_score >= 60:
                overall_rating = "Good feedback with generally positive sentiment"
            elif overall_score >= 40:
                overall_rating = "Mixed feedback with areas for improvement"
            else:
                overall_rating = "Feedback indicates significant areas for improvement"
            
            # Extract strengths (positive sentiment)
            strengths = []
            for analysis in question_analyses:
                if analysis.sentiment == SentimentType.POSITIVE:
                    # Create a more descriptive strength entry
                    category_text = f" regarding {analysis.category.lower().replace('_', ' ')}" if analysis.category else ""
                    
                    # For text responses, include part of the response
                    if analysis.question_type == "TEXT_BASED" and isinstance(analysis.response, str) and len(analysis.response) > 0:
                        # Get first sentence or truncate if too long
                        response_preview = analysis.response.split('.')[0]
                        if len(response_preview) > 50:
                            response_preview = response_preview[:47] + "..."
                        
                        strengths.append({
                            "text": f"Positive feedback{category_text}: {analysis.question_text}",
                            "response": response_preview,
                            "score": analysis.score
                        })
                    else:
                        # For other response types
                        response_text = str(analysis.response) if not isinstance(analysis.response, list) else ", ".join(analysis.response)
                        strengths.append({
                            "text": f"Positive rating{category_text}: {analysis.question_text}",
                            "response": response_text,
                            "score": analysis.score
                        })
            
            # Extract weaknesses (negative sentiment)
            weaknesses = []
            for analysis in question_analyses:
                if analysis.sentiment == SentimentType.NEGATIVE:
                    # Create a more descriptive weakness entry
                    category_text = f" regarding {analysis.category.lower().replace('_', ' ')}" if analysis.category else ""
                    
                    # For text responses, include part of the response
                    if analysis.question_type == "TEXT_BASED" and isinstance(analysis.response, str) and len(analysis.response) > 0:
                        # Get first sentence or truncate if too long
                        response_preview = analysis.response.split('.')[0]
                        if len(response_preview) > 50:
                            response_preview = response_preview[:47] + "..."
                        
                        weaknesses.append({
                            "text": f"Negative feedback{category_text}: {analysis.question_text}",
                            "response": response_preview,
                            "score": analysis.score
                        })
                    else:
                        # For other response types
                        response_text = str(analysis.response) if not isinstance(analysis.response, list) else ", ".join(analysis.response)
                        weaknesses.append({
                            "text": f"Negative rating{category_text}: {analysis.question_text}",
                            "response": response_text,
                            "score": analysis.score
                        })
            
            # Extract key insights
            key_insights = []
            
            # Add insight about overall sentiment distribution
            positive_count = sum(1 for a in question_analyses if a.sentiment == SentimentType.POSITIVE)
            negative_count = sum(1 for a in question_analyses if a.sentiment == SentimentType.NEGATIVE)
            neutral_count = sum(1 for a in question_analyses if a.sentiment == SentimentType.NEUTRAL)
            
            total_count = len(question_analyses)
            if total_count > 0:
                positive_percent = int((positive_count / total_count) * 100)
                negative_percent = int((negative_count / total_count) * 100)
                neutral_percent = int((neutral_count / total_count) * 100)
                
                if positive_percent > 60:
                    key_insights.append(f"Overall positive feedback with {positive_percent}% positive responses")
                elif negative_percent > 60:
                    key_insights.append(f"Significant concerns with {negative_percent}% negative responses")
                else:
                    key_insights.append(f"Mixed feedback with {positive_percent}% positive, {neutral_percent}% neutral, and {negative_percent}% negative responses")
            
            # Group analyses by category to identify category-specific insights
            category_analyses = {}
            for analysis in question_analyses:
                if analysis.category:
                    if analysis.category not in category_analyses:
                        category_analyses[analysis.category] = []
                    category_analyses[analysis.category].append(analysis)
            
            # Add category-specific insights
            for category, analyses in category_analyses.items():
                category_score = sum(a.score for a in analyses) / len(analyses)
                category_name = category.lower().replace('_', ' ')
                
                if category_score >= 75:
                    key_insights.append(f"Strong performance in {category_name} with an average score of {int(category_score)}")
                elif category_score <= 40:
                    key_insights.append(f"Critical improvement needed in {category_name} with a low score of {int(category_score)}")
                elif len(analyses) >= 3:  # Only add for categories with sufficient data
                    key_insights.append(f"{category_name.capitalize()} received an average score of {int(category_score)}")
            
            # Add insight from overall comments if available
            if overall_comments:
                # Analyze the overall comments for deeper insights
                analysis = await self.text_analyzer.analyze_text_response(overall_comments)
                
                # Add keyword-based insight
                if analysis.get("keywords"):
                    keywords_text = ", ".join(analysis.get("keywords")[:3])
                    key_insights.append(f"Key themes mentioned: {keywords_text}")
                
                # Add sentiment-based insight
                sentiment = analysis.get("sentiment", "NEUTRAL")
                if sentiment == "POSITIVE":
                    key_insights.append("Overall comments express positive sentiment and satisfaction")
                elif sentiment == "NEGATIVE":
                    key_insights.append("Overall comments indicate areas of concern that need addressing")
            
            # Extract action items from suggestions
            action_items = []
            
            # First, collect all suggestions with their priorities and categories
            all_suggestions = []
            for analysis in question_analyses:
                if analysis.suggestions:
                    priority = "high" if analysis.sentiment == SentimentType.NEGATIVE else "medium"
                    for suggestion in analysis.suggestions:
                        if self.text_analyzer.is_valid_recommendation(suggestion):
                            all_suggestions.append({
                                "text": suggestion,
                                "priority": priority,
                                "category": analysis.category or "GENERAL",
                                "score": analysis.score
                            })
            
            # Sort by priority (high first) and then by score (lowest first)
            all_suggestions.sort(key=lambda x: (0 if x["priority"] == "high" else 1, x["score"]))
            
            # Add top suggestions as action items, ensuring diversity of categories
            added_categories = set()
            for suggestion in all_suggestions:
                # Ensure we don't have too many from the same category
                if suggestion["category"] in added_categories and len(action_items) >= 3:
                    continue
                
                action_items.append({
                    "text": suggestion["text"],
                    "priority": suggestion["priority"],
                    "category": suggestion["category"]
                })
                
                added_categories.add(suggestion["category"])
                
                # Limit to top 5 action items
                if len(action_items) >= 5:
                    break
            
            # If we don't have enough action items, add default ones
            if len(action_items) < 2:
                default_actions = [
                    {"text": "Implement regular team meetings to improve information sharing", "priority": "high", "category": "TEAM_COLLABORATION"},
                    {"text": "Create a centralized documentation system for project updates", "priority": "medium", "category": "DOCUMENTATION"}
                ]
                
                for action in default_actions:
                    if action["category"] not in added_categories:
                        action_items.append(action)
                        added_categories.add(action["category"])
                        
                        if len(action_items) >= 5:
                            break
            
            # Create executive summary
            return ExecutiveSummary(
                overall_rating=overall_rating,
                strengths=strengths[:3] if strengths else [],  # Top 3 strengths
                weaknesses=weaknesses[:3] if weaknesses else [],  # Top 3 weaknesses
                key_insights=key_insights[:5],  # Top 5 insights
                action_items=action_items
            )
        except Exception as e:
            logger.error(f"Error generating executive summary: {str(e)}")
            # Return default summary
            return ExecutiveSummary(
                overall_rating="Feedback Summary",
                strengths=[],
                weaknesses=[],
                key_insights=["Feedback indicates areas for improvement in team collaboration", "Communication processes could be enhanced for better efficiency"],
                action_items=[
                    {"text": "Implement regular team meetings to improve information sharing", "priority": "high", "category": "TEAM_COLLABORATION"},
                    {"text": "Create a centralized documentation system for project updates", "priority": "medium", "category": "DOCUMENTATION"}
                ]
            )
    
    def _calculate_overall_score(self, question_analyses: List[QuestionAnalysis]) -> float:
        """
        Calculate overall score from question analyses
        
        Args:
            question_analyses: List of question analyses
            
        Returns:
            Overall score (0-100)
        """
        if not question_analyses:
            return 50.0
        
        total_score = sum(analysis.score for analysis in question_analyses)
        return total_score / len(question_analyses)
    
    def _calculate_satisfaction_score(self, question_analyses: List[QuestionAnalysis]) -> float:
        """
        Calculate satisfaction score from question analyses
        
        Args:
            question_analyses: List of question analyses
            
        Returns:
            Satisfaction score (0-100)
        """
        if not question_analyses:
            return 50.0
        
        # Filter satisfaction-related questions
        satisfaction_analyses = [
            analysis for analysis in question_analyses
            if analysis.category == "SATISFACTION" or "satisf" in analysis.question_text.lower()
        ]
        
        # If no satisfaction-specific questions, use all questions
        if not satisfaction_analyses:
            # Count sentiments
            sentiments = [analysis.sentiment for analysis in question_analyses]
            sentiment_counts = self.count_sentiments(sentiments)
            
            # Calculate percentages
            total_sentiments = sum(sentiment_counts.values())
            sentiment_percentages = {}
            if total_sentiments > 0:
                for sentiment, count in sentiment_counts.items():
                    sentiment_percentages[sentiment] = (count / total_sentiments) * 100
            else:
                return 50.0  # Default if no sentiments
                
            # Calculate satisfaction score: 100% of positive + 50% of neutral
            positive_percentage = sentiment_percentages.get("POSITIVE", 0)
            neutral_percentage = sentiment_percentages.get("NEUTRAL", 0)
            
            satisfaction_score = positive_percentage + (neutral_percentage * 0.5)
            return satisfaction_score
        
        # Calculate average score from satisfaction analyses
        total_score = sum(analysis.score for analysis in satisfaction_analyses)
        avg_score = total_score / len(satisfaction_analyses)
        
        return avg_score
    
    def _calculate_response_quality(self, question_analyses: List[QuestionAnalysis]) -> float:
        """
        Calculate response quality from question analyses
        
        Args:
            question_analyses: List of question analyses
            
        Returns:
            Response quality score (0-100)
        """
        if not question_analyses:
            return 0.0
        
        # Calculate quality based on text responses
        text_analyses = [
            analysis for analysis in question_analyses
            if analysis.question_type == "TEXT_BASED"
        ]
        
        if not text_analyses:
            return 50.0
        
        # Calculate average length of text responses
        avg_length = sum(len(str(analysis.response)) for analysis in text_analyses) / len(text_analyses)
        
        # Normalize to 0-100 scale (0-500 characters)
        quality_score = min(100, (avg_length / 500) * 100)
        
        return quality_score
    
    def _extract_improvement_areas(self, question_analyses: List[QuestionAnalysis]) -> List[Dict]:
        """
        Extract improvement areas from question analyses
        
        Args:
            question_analyses: List of question analyses
            
        Returns:
            List of improvement areas
        """
        improvement_areas = []
        
        # Group by category
        category_scores = {}
        category_suggestions = {}
        
        for analysis in question_analyses:
            if analysis.category:
                # Add score to category
                if analysis.category not in category_scores:
                    category_scores[analysis.category] = []
                category_scores[analysis.category].append(analysis.score)
                
                # Add suggestions to category
                if analysis.category not in category_suggestions:
                    category_suggestions[analysis.category] = []
                if analysis.suggestions:
                    category_suggestions[analysis.category].extend(analysis.suggestions)
        
        # Calculate average score for each category
        for category, scores in category_scores.items():
            avg_score = sum(scores) / len(scores)
            
            # Only include categories with below-average scores
            if avg_score < 70:
                suggestions = category_suggestions.get(category, [])
                if not suggestions:
                    suggestions = [
                        f"Improve {category.lower().replace('_', ' ')} processes",
                        f"Establish clear guidelines for {category.lower().replace('_', ' ')}"
                    ]
                
                improvement_areas.append({
                    "category": category,
                    "score": avg_score,
                    "suggestions": suggestions[:3]  # Top 3 suggestions
                })
        
        # Sort by score (ascending)
        improvement_areas.sort(key=lambda x: x["score"])
        
        return improvement_areas[:5]  # Top 5 improvement areas
        
    def _get_sentiment_label(self, score: float) -> SentimentType:
        """
        Convert a score to a sentiment label
        
        Args:
            score: Score (0-1)
            
        Returns:
            SentimentType
        """
        if score >= 0.7:
            return SentimentType.POSITIVE
        elif score <= 0.4:
            return SentimentType.NEGATIVE
        else:
            return SentimentType.NEUTRAL
            
    def count_sentiments(self, sentiments: List[SentimentType]) -> Dict[str, int]:
        """
        Count sentiments in a list
        
        Args:
            sentiments: List of sentiments
            
        Returns:
            Dictionary with counts for each sentiment
        """
        counts = {
            "POSITIVE": 0,
            "NEUTRAL": 0,
            "NEGATIVE": 0
        }
        
        for sentiment in sentiments:
            counts[sentiment] += 1
        
        return counts 