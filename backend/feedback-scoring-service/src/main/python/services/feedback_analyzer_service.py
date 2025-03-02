import requests
from typing import List, Dict
import pandas as pd
from datetime import datetime
from models.feedback_analysis import *
from transformers import pipeline
from textblob import TextBlob
import numpy as np
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
import asyncio
import aiohttp
from collections import defaultdict
import sys
import os
import random
import re
import logging

# Configure logger
logger = logging.getLogger(__name__)

# Add the parent directory to the Python path to import from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from enhanced_data_generator import EnhancedMockDataGenerator

class FeedbackAnalyzerService:
    def __init__(self, mongodb_url: str, feedback_service_url: str):
        """Initialize the FeedbackAnalyzer service."""
        try:
            # Initialize sentiment pipeline once and cache it
            self.sentiment_pipeline = pipeline("sentiment-analysis")
            
            # Initialize MongoDB connection
            import motor.motor_asyncio
            self.client = motor.motor_asyncio.AsyncIOMotorClient(mongodb_url)
            self.db = self.client.feedback_analytics
            self.feedback_service_url = feedback_service_url
            
            # Initialize feedback analyzer
            from feedback_analyzer import FeedbackAnalyzer
            self.analyzer = FeedbackAnalyzer()
            
            # Cache TextBlob results
            self.sentiment_cache = {}
            
            # Initialize other attributes
            self.mock_data_generator = EnhancedMockDataGenerator()

            # Keywords for different aspects
            self.improvement_keywords = {
                "WORK_ENVIRONMENT": ["workspace", "office", "desk", "lighting", "noise", "air", "ergonomic", "meeting"],
                "WORK_LIFE_BALANCE": ["flexible", "remote", "break", "vacation", "overtime", "workload", "schedule"],
                "TEAM_COLLABORATION": ["communication", "meeting", "collaboration", "team", "coordination", "update"],
                "PROJECT_MANAGEMENT": ["task", "deadline", "resource", "documentation", "milestone", "risk", "planning"],
                "TECHNICAL_SKILLS": ["training", "documentation", "tools", "learning", "skills", "mentorship", "knowledge"]
            }

            # Solution suggestions for different categories
            self.solution_suggestions = {
                "WORK_ENVIRONMENT": {
                    "workspace": [
                        "Implement flexible seating arrangements",
                        "Create dedicated quiet zones for focused work"
                    ],
                    "equipment": [
                        "Upgrade office equipment and tools",
                        "Provide ergonomic furniture options"
                    ]
                },
                "TEAM_COLLABORATION": {
                    "communication": [
                        "Implement daily stand-ups for better coordination",
                        "Use collaborative tools for real-time communication"
                    ],
                    "meetings": [
                        "Structure regular team sync-ups",
                        "Create clear meeting agendas and follow-ups"
                    ]
                },
                "PROJECT_MANAGEMENT": {
                    "planning": [
                        "Implement agile methodologies",
                        "Create detailed project roadmaps"
                    ],
                    "tracking": [
                        "Use project management software effectively",
                        "Set up regular milestone reviews"
                    ]
                }
            }

        except Exception as e:
            logger.error(f"Error initializing service: {str(e)}")
            raise

    async def fetch_all_submissions(self) -> List[Dict]:
        """Fetch all feedback submissions from the feedback service or use mock data if service is unavailable"""
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.feedback_service_url}/api/admin/submissions/all",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        # If service returns error, use mock data
                        print("Warning: Feedback service unavailable. Using mock data.")
                        return self.generate_mock_submissions()
        except aiohttp.ClientError as e:
            print(f"Warning: Could not connect to feedback service ({str(e)}). Using mock data.")
            return self.generate_mock_submissions()

    def generate_mock_submissions(self) -> List[Dict]:
        """Generate mock submissions for testing"""
        mock_questions = [
            {
                "id": "1",
                "text": "How satisfied are you with the work environment?",
                "category": "WORK_ENVIRONMENT",
                "questionType": "SINGLE_CHOICE",
                "choices": ["1", "2", "3", "4", "5"]
            },
            {
                "id": "2",
                "text": "What aspects of work-life balance could be improved?",
                "category": "WORK_LIFE_BALANCE",
                "questionType": "TEXT_BASED"
            },
            {
                "id": "3",
                "text": "Rate your team collaboration experience",
                "category": "TEAM_COLLABORATION",
                "questionType": "SINGLE_CHOICE",
                "choices": ["1", "2", "3", "4", "5"]
            },
            {
                "id": "4",
                "text": "What project management improvements would you suggest?",
                "category": "PROJECT_MANAGEMENT",
                "questionType": "TEXT_BASED"
            },
            {
                "id": "5",
                "text": "How would you rate the technical skill development opportunities?",
                "category": "TECHNICAL_SKILLS",
                "questionType": "SINGLE_CHOICE",
                "choices": ["1", "2", "3", "4", "5"]
            }
        ]

        all_submissions = []
        feedback_id = 1

        # Generate 5 submissions
        for i in range(5):
            responses = {}
            for question in mock_questions:
                if question["questionType"] == "SINGLE_CHOICE":
                    responses[question["id"]] = str(random.randint(3, 5))  # Bias towards positive responses
                else:
                    responses[question["id"]] = self.mock_data_generator.generate_response_by_type(question)

            submission = {
                "id": str(i + 1),
                "feedbackId": feedback_id,
                "projectId": 1,
                "projectName": "Sample Project",
                "submittedBy": f"user_{random.randint(1, 1000)}",
                "responses": responses,
                "questionDetails": mock_questions,
                "overallComments": self.mock_data_generator.generate_overall_comments(),
                "submittedAt": datetime.now().isoformat()
            }
            all_submissions.append(submission)

        return all_submissions

    async def analyze_text_response(self, text: str) -> Dict:
        """Analyze text response for sentiment and suggestions with caching"""
        if not text or not isinstance(text, str):
            return {
                "sentiment": "NEUTRAL",
                "score": 0.5,
                "suggestions": []
            }

        # Check cache first
        cache_key = hash(text)
        if cache_key in self.sentiment_cache:
            return self.sentiment_cache[cache_key]

        try:
            # Use the cached pipeline for sentiment analysis
            sentiment_result = self.sentiment_pipeline(text[:512])[0]  # Limit text length
            sentiment = sentiment_result["label"]
            score = sentiment_result["score"]

            # Quick regex for suggestions instead of full NLP processing
            suggestions = []
            if any(word in text.lower() for word in ["should", "could", "need", "improve", "better"]):
                suggestions = [s.strip() for s in text.split(".") if any(
                    word in s.lower() for word in ["should", "could", "need", "improve", "better"]
                )]

            result = {
                "sentiment": sentiment,
                "score": score,
                "suggestions": suggestions
            }

            # Cache the result
            self.sentiment_cache[cache_key] = result
            return result

        except Exception as e:
            print(f"Error analyzing text: {str(e)}")
            return {
                "sentiment": "NEUTRAL",
                "score": 0.5,
                "suggestions": []
            }

    def is_valid_recommendation(self, text: str) -> bool:
        """Validate if a recommendation meets quality standards"""
        # Clean and normalize the text
        text = text.strip().lower()
        words = text.split()
        
        # Must be between 6 and 50 words
        if not (6 <= len(words) <= 50):
            return False
            
        # Must start with an action verb
        action_verbs = {
            "implement", "establish", "create", "develop", "introduce", "improve",
            "enhance", "optimize", "streamline", "organize", "schedule", "conduct",
            "provide", "set up", "launch", "initiate", "facilitate", "coordinate"
        }
        
        if not any(text.startswith(verb) for verb in action_verbs):
            return False
            
        # Must not be a question
        if text.endswith('?'):
            return False
            
        # Must not start with personal pronouns or context statements
        invalid_starts = {'i ', 'we ', 'you ', 'they ', 'based on', 'according to', 'from the'}
        if any(text.startswith(start) for start in invalid_starts):
            return False
            
        # Must not be too generic
        generic_phrases = {
            'have more', 'do more', 'be more', 'get more',
            'make sure', 'try to', 'need to', 'want to'
        }
        if any(phrase in text for phrase in generic_phrases):
            return False
        
        return True

    def get_default_recommendations(self, category: str) -> List[str]:
        """Get high-quality default recommendations for a category"""
        category_name = category.lower().replace('_', ' ')
        defaults = {
            "work environment": [
                "Implement flexible seating arrangements with dedicated quiet zones for focused work",
                "Establish regular workspace satisfaction surveys with actionable improvement plans",
                "Create designated collaboration spaces with necessary technology and tools",
                "Implement ergonomic workspace assessments and improvements program"
            ],
            "work life balance": [
                "Implement flexible working hours with core collaboration time windows",
                "Establish clear boundaries for after-hours communication and expectations",
                "Create structured time-off policies with coverage planning",
                "Implement wellness programs and stress management workshops"
            ],
            "team collaboration": [
                "Implement daily stand-up meetings for improved team coordination",
                "Establish regular cross-team knowledge sharing sessions and documentation",
                "Create dedicated channels for project-specific communication",
                "Implement collaborative project tracking tools with clear ownership"
            ],
            "project management": [
                "Implement agile project management methodologies with regular sprints",
                "Establish clear project milestones and progress tracking mechanisms",
                "Create standardized project documentation and reporting templates",
                "Implement regular project retrospectives for continuous improvement"
            ],
            "technical skills": [
                "Implement regular technical training sessions for skill development",
                "Establish mentorship program for knowledge transfer and growth",
                "Create comprehensive technical documentation standards",
                "Implement peer code review processes for quality assurance"
            ]
        }
        
        return defaults.get(category_name, [
            f"Implement regular review process for {category_name} improvement",
            f"Establish metrics to track {category_name} effectiveness",
            f"Create standardized procedures for {category_name} management",
            f"Implement feedback mechanisms for {category_name} enhancement"
        ])

    def analyze_category_insights(self, responses: List[Dict], category: str) -> Dict:
        """Analyze responses for a specific category with optimized processing"""
        try:
            if not responses:
                return {
                    "category": category,
                    "confidence": 50.0,  # Medium confidence for default insights
                    "recommendations": [
                        "Implement regular feedback collection to gather more detailed insights",
                        "Consider establishing baseline metrics for better tracking"
                    ],
                    "sentiment_score": 0.5
                }

            # Process responses in batches for sentiment analysis
            text_responses = []
            valid_responses = []
            
            for response in responses:
                if response.get("category") == category:
                    text = response.get("response", "")
                    if isinstance(text, str) and text.strip():
                        text_responses.append(text)
                        valid_responses.append(text)

            if not valid_responses:
                return {
                    "category": category,
                    "confidence": 40.0,
                    "recommendations": [
                        "Establish regular communication channels for feedback",
                        "Create structured feedback collection processes"
                    ],
                    "sentiment_score": 0.5
                }

            # Batch sentiment analysis
            sentiments = []
            for i in range(0, len(valid_responses), 8):  # Process in batches of 8
                batch = valid_responses[i:i + 8]
                results = self.sentiment_pipeline(batch)
                sentiments.extend([1 if r["label"] == "POSITIVE" else 0 for r in results])

            # Calculate metrics
            avg_sentiment = sum(sentiments) / len(sentiments)
            confidence_score = min(
                (len(valid_responses) / 5) * 0.5 +  # More responses increase confidence
                (abs(avg_sentiment - 0.5) * 2 * 0.3) +  # Strong sentiments increase confidence
                0.2,  # Base confidence
                1.0
            ) * 100

            # Get default recommendations based on category
            recommendations = self.get_default_recommendations(category)

            return {
                "category": category,
                "confidence": round(confidence_score, 1),
                "recommendations": recommendations[:2],
                "sentiment_score": avg_sentiment
            }

        except Exception as e:
            print(f"Error analyzing category insights: {str(e)}")
            return None

    async def generate_ai_insights(self, submissions: List[Dict]) -> Dict:
        """Generate AI-powered insights from feedback submissions"""
        try:
            # Collect all responses by category
            category_responses = defaultdict(list)
            
            for submission in submissions:
                for question in submission.get("questionDetails", []):
                    category = question.get("category")
                    response = {
                        "response": submission["responses"].get(str(question["id"])),
                        "category": category,
                        "type": question.get("questionType")
                    }
                    category_responses[category].append(response)
            
            # Analyze each category
            category_insights = []
            for category, responses in category_responses.items():
                insight = self.analyze_category_insights(responses, category)
                if insight and insight["recommendations"]:
                    category_insights.append(insight)
            
            # Sort by confidence score and get top 3
            category_insights.sort(key=lambda x: x["confidence"], reverse=True)
            top_insights = category_insights[:3]
            
            # Map insights to specific areas
            mapped_insights = {
                "performanceInsights": None,
                "engagementAnalysis": None,
                "improvementOpportunities": None
            }
            
            # Map insights based on sentiment and category
            for insight in top_insights:
                if not mapped_insights["performanceInsights"] and insight["category"] in ["PROJECT_MANAGEMENT", "TECHNICAL_SKILLS"]:
                    mapped_insights["performanceInsights"] = {
                        "confidence": insight["confidence"],
                        "recommendations": insight["recommendations"]
                    }
                elif not mapped_insights["engagementAnalysis"] and insight["category"] in ["TEAM_COLLABORATION", "WORK_ENVIRONMENT"]:
                    mapped_insights["engagementAnalysis"] = {
                        "confidence": insight["confidence"],
                        "recommendations": insight["recommendations"]
                    }
                elif not mapped_insights["improvementOpportunities"]:
                    mapped_insights["improvementOpportunities"] = {
                        "confidence": insight["confidence"],
                        "recommendations": insight["recommendations"]
                    }
            
            return mapped_insights
            
        except Exception as e:
            print(f"Error generating AI insights: {str(e)}")
            return {}

    async def analyze_question_response(self, question: Dict, response: str) -> QuestionAnalysis:
        """Analyze a single question response."""
        try:
            question_type = question.get("questionType", "")
            question_text = question.get("text", "")
            category = question.get("category", "UNCATEGORIZED")
            
            # Initialize score and sentiment
            score = 0.0
            sentiment = SentimentType.NEUTRAL
            suggestions = []
            improvement_priorities = []
            
            # Analyze based on question type
            if question_type == "MULTIPLE_CHOICE":
                # For multiple choice, analyze selection coverage
                choices = question.get("choices", [])
                if choices:
                    selected = response.split(", ") if isinstance(response, str) else [str(response)]
                    score = len(selected) / len(choices)
                    suggestions.append({
                        "type": "selection_analysis",
                        "content": f"Selected {len(selected)} out of {len(choices)} options",
                        "details": selected
                    })
                    
            elif question_type == "TEXT_BASED":
                # For text-based responses, use sentiment analysis
                if response:
                    sentiment_result = self.sentiment_pipeline(response)[0]
                    score = sentiment_result["score"]
                    sentiment = SentimentType.POSITIVE if sentiment_result["label"] == "POSITIVE" else (
                        SentimentType.NEGATIVE if sentiment_result["label"] == "NEGATIVE" else SentimentType.NEUTRAL
                    )
                    
                    # Add sentiment analysis suggestion
                    suggestions.append({
                        "type": "sentiment_analysis",
                        "content": f"Expressed {sentiment.value.lower()} sentiment",
                        "score": score
                    })
                    
                    # Extract action items if present
                    action_words = ["should", "need", "must", "could"]
                    if any(word in response.lower() for word in action_words):
                        action_items = [
                            s.strip() for s in response.split(".")
                            if any(word in s.lower() for word in action_words)
                        ]
                        if action_items:
                            improvement_priorities.extend([
                                {"description": item, "priority": "Medium"}
                                for item in action_items
                            ])
                            
            elif question_type == "SENTIMENT":
                # For sentiment questions, directly map the response
                sentiment_map = {
                    "POSITIVE": (SentimentType.POSITIVE, 1.0),
                    "NEUTRAL": (SentimentType.NEUTRAL, 0.5),
                    "NEGATIVE": (SentimentType.NEGATIVE, 0.0)
                }
                
                # If response is a sentiment word, use direct mapping
                upper_response = response.upper() if isinstance(response, str) else ""
                if upper_response in sentiment_map:
                    sentiment, score = sentiment_map[upper_response]
                else:
                    # If response is text, analyze it
                    sentiment_result = self.sentiment_pipeline(response)[0]
                    score = sentiment_result["score"]
                    sentiment = SentimentType.POSITIVE if sentiment_result["label"] == "POSITIVE" else (
                        SentimentType.NEGATIVE if sentiment_result["label"] == "NEGATIVE" else SentimentType.NEUTRAL
                    )
            
            return QuestionAnalysis(
                question_id=question.get("id", ""),
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
            raise

    async def _generate_executive_summary(
        self,
        question_analyses: List[QuestionAnalysis],
        categories_analysis: Dict[str, CategoryAnalysis]
    ) -> ExecutiveSummary:
        """Generate an executive summary based on question analyses and category analyses."""
        try:
            strengths = []
            weaknesses = []
            key_insights = []
            action_items = []
            
            # Analyze question-based performance
            for qa in question_analyses:
                if qa.score >= 0.8:
                    strengths.append({
                        "category": qa.category,
                        "score": qa.score * 100,
                        "description": f"High performance in {qa.question_text}"
                    })
                elif qa.score <= 0.4:
                    weaknesses.append({
                        "category": qa.category,
                        "score": qa.score * 100,
                        "description": f"Needs improvement in {qa.question_text}"
                    })
                
                # Extract action items from suggestions
                for suggestion in qa.suggestions:
                    if isinstance(suggestion, dict) and suggestion.get("type") == "action_items":
                        for item in suggestion.get("items", []):
                            action_items.append({
                                "description": item,
                                "category": qa.category,
                                "priority": "High" if qa.score <= 0.4 else "Medium"
                            })
            
            # Analyze category-based performance
            for category, analysis in categories_analysis.items():
                if analysis.score >= 0.8:
                    key_insights.append(f"Strong performance in {category.lower().replace('_', ' ')}")
                elif analysis.score <= 0.4:
                    key_insights.append(f"Attention needed in {category.lower().replace('_', ' ')}")
                
                # Add category recommendations as action items
                for recommendation in analysis.recommendations:
                    if isinstance(recommendation, str):
                        action_items.append({
                            "description": recommendation,
                            "category": category,
                            "priority": "High" if analysis.score <= 0.4 else "Medium"
                        })
            
            # Calculate overall rating
            avg_score = sum(qa.score for qa in question_analyses) / len(question_analyses) if question_analyses else 0.0
            overall_rating = f"{avg_score * 100:.1f}%"
            
            # Add general insights
            positive_count = sum(1 for qa in question_analyses if qa.sentiment == SentimentType.POSITIVE)
            sentiment_ratio = positive_count / len(question_analyses) if question_analyses else 0
            if sentiment_ratio >= 0.7:
                key_insights.append("Overall positive sentiment across responses")
            elif sentiment_ratio <= 0.3:
                key_insights.append("Generally negative sentiment requires attention")
            
            # Deduplicate action items and insights
            action_items = list({item["description"]: item for item in action_items}.values())
            key_insights = list(set(key_insights))
            
            return ExecutiveSummary(
                overall_rating=overall_rating,
                strengths=strengths,
                weaknesses=weaknesses,
                key_insights=key_insights,
                action_items=action_items
            )
            
        except Exception as e:
            logger.error(f"Error generating executive summary: {str(e)}")
            raise

    async def analyze_feedback_submission(self, submission: Dict) -> FeedbackAnalysis:
        """Analyze a feedback submission and return detailed analysis."""
        try:
            # First fetch the actual submission data if we only have the ID
            if isinstance(submission, dict) and len(submission.keys()) == 1 and "id" in submission:
                logger.info(f"Fetching full submission data for ID {submission['id']}")
                all_submissions = await self.fetch_all_submissions()
                matching_submissions = [s for s in all_submissions if str(s.get("id")) == str(submission["id"])]
                if not matching_submissions:
                    logger.error(f"No submission found with ID {submission['id']}")
                    raise HTTPException(status_code=404, detail=f"No submission found with ID {submission['id']}")
                submission = matching_submissions[0]

            # Validate required fields
            if "responses" not in submission:
                logger.error("Missing 'responses' field in submission")
                raise ValueError("Missing 'responses' field in submission")
            if "questionDetails" not in submission:
                logger.error("Missing 'questionDetails' field in submission")
                raise ValueError("Missing 'questionDetails' field in submission")

            # Extract question details and create a mapping
            question_details_map = {
                str(q["id"]): q for q in submission["questionDetails"]
            }
            logger.debug(f"Found {len(question_details_map)} questions in details")
            
            question_analyses = []
            categories_analysis = {}
            
            # Process each response
            responses = submission["responses"]
            logger.debug(f"Processing {len(responses)} responses")
            
            for question_id, response in responses.items():
                question_detail = question_details_map.get(str(question_id))
                if not question_detail:
                    logger.warning(f"No question details found for question ID {question_id}")
                    continue
                
                # Get category from question details
                category = question_detail.get("category", "UNCATEGORIZED")
                logger.debug(f"Processing question {question_id} in category {category}")
                
                # Analyze the question response
                analysis = await self.analyze_question_response(question_detail, response)
                
                # Update the category in the analysis
                analysis.category = category
                
                question_analyses.append(analysis)
                
                # Aggregate analysis by category
                if category not in categories_analysis:
                    categories_analysis[category] = CategoryAnalysis(
                        score=0.0,
                        sentiment="NEUTRAL",
                        recommendations=[]
                    )
                
                # Update category analysis
                cat_analysis = categories_analysis[category]
                cat_analysis.score = (cat_analysis.score + analysis.score) / 2
                cat_analysis.sentiment = analysis.sentiment
                if analysis.suggestions:
                    cat_analysis.recommendations.extend([str(s) for s in analysis.suggestions])
            
            if not question_analyses:
                logger.error("No questions were successfully analyzed")
                raise ValueError("No questions were successfully analyzed")
            
            # Calculate overall metrics
            overall_score = sum(qa.score for qa in question_analyses) / len(question_analyses)
            overall_sentiment = self._get_sentiment_label(overall_score)
            
            # Generate executive summary
            executive_summary = await self._generate_executive_summary(question_analyses, categories_analysis)
            
            # Extract overall suggestions and priorities
            overall_suggestions = []
            overall_priorities = []
            
            for qa in question_analyses:
                if qa.suggestions:
                    overall_suggestions.extend([str(s) for s in qa.suggestions])
                if qa.improvement_priorities:
                    overall_priorities.extend(qa.improvement_priorities)
            
            # Calculate satisfaction score
            satisfaction_score = sum(1 for qa in question_analyses if qa.sentiment == SentimentType.POSITIVE) / len(question_analyses)
            
            # Create improvement areas list
            improvement_areas = [
                {"category": cat, "score": analysis.score, "recommendations": analysis.recommendations}
                for cat, analysis in categories_analysis.items()
                if analysis.score < 0.7  # Consider areas with score less than 70% as needing improvement
            ]
            
            # Calculate key metrics
            key_metrics = {
                "overall_satisfaction": satisfaction_score,
                "response_quality": sum(qa.score for qa in question_analyses) / len(question_analyses),
                "sentiment_score": sum(1 for qa in question_analyses if qa.sentiment == SentimentType.POSITIVE) / len(question_analyses),
                "improvement_count": len(improvement_areas)
            }
            
            logger.info("Successfully analyzed feedback submission")
            return FeedbackAnalysis(
                feedback_id=submission.get("id", 0),
                project_id=submission.get("projectId", 0),
                project_name=submission.get("projectName", ""),
                submitted_by=submission.get("submittedBy"),
                submitted_at=submission.get("submittedAt", datetime.now().isoformat()),
                executive_summary=executive_summary,
                question_analyses=question_analyses,
                overall_score=overall_score,
                overall_sentiment=overall_sentiment,
                overall_suggestions=list(set(overall_suggestions)),
                overall_priorities=overall_priorities,
                categories=categories_analysis,
                satisfaction_score=satisfaction_score,
                improvement_areas=improvement_areas,
                key_metrics=key_metrics
            )
            
        except Exception as e:
            logger.error(f"Error analyzing feedback submission: {str(e)}")
            raise

    def extract_priorities(self, text: str) -> List[Dict[str, float]]:
        """Extract improvement priorities from text"""
        keywords = ["communication", "training", "tools", "process", "management", "collaboration"]
        priorities = []
        
        # Simple keyword-based priority extraction
        text_lower = text.lower()
        for keyword in keywords:
            if keyword in text_lower:
                # Use sentiment analysis to determine priority score
                sentiment = self.sentiment_pipeline(keyword + " in context: " + text)[0]
                score = sentiment["score"] if sentiment["label"] == "POSITIVE" else -sentiment["score"]
                priorities.append({"name": keyword, "score": score})
                
        return priorities

    def extract_categories(self, submission: Dict) -> List[str]:
        """Extract categories from feedback submission"""
        categories = set()
        for question in submission.get("questionDetails", []):
            if "category" in question:
                categories.add(question["category"])
        return list(categories)

    async def store_analysis(self, analysis: FeedbackAnalysis):
        """Store analysis results in MongoDB"""
        try:
            await self.db.feedback_analyses.update_one(
                {"feedback_id": analysis.feedback_id},
                {"$set": analysis.dict()},
                upsert=True
            )
        except Exception as e:
            logger.error(f"Error storing analysis: {str(e)}")
            # Don't raise the exception, just log it
            pass

    async def get_project_analysis(self, project_id: int, sort_by: str = None, order: str = "desc") -> ProjectAnalysis:
        """Get aggregated analysis for a project"""
        pipeline = [
            {"$match": {"project_id": project_id}},
            {"$group": {
                "_id": "$project_id",
                "project_name": {"$first": "$project_name"},
                "feedback_count": {"$sum": 1},
                "average_score": {"$avg": "$overall_score"},
                "sentiments": {"$push": "$overall_sentiment"},
                "categories": {"$push": "$categories"},
                "suggestions": {"$push": "$overall_suggestions"},
                "priorities": {"$push": "$overall_priorities"}
            }}
        ]
        
        result = await self.db.feedback_analyses.aggregate(pipeline).to_list(1)
        if not result:
            raise HTTPException(status_code=404, detail="Project not found")
            
        result = result[0]
        
        # Process and sort the results based on parameters
        if sort_by:
            # Add sorting logic here
            pass
            
        return ProjectAnalysis(
            project_id=project_id,
            project_name=result["project_name"],
            feedback_count=result["feedback_count"],
            average_score=result["average_score"],
            sentiment_distribution=self.count_sentiments(result["sentiments"]),
            top_categories=self.aggregate_categories(result["categories"]),
            common_suggestions=self.aggregate_suggestions(result["suggestions"]),
            improvement_priorities=self.aggregate_priorities(result["priorities"]),
            trend=self.calculate_trends(result)
        )

    async def get_user_analysis(self, user_id: str) -> UserAnalysis:
        """Get aggregated analysis for a user"""
        pipeline = [
            {"$match": {"submitted_by": user_id}},
            {"$group": {
                "_id": "$submitted_by",
                "feedback_count": {"$sum": 1},
                "average_score": {"$avg": "$overall_score"},
                "sentiments": {"$push": "$overall_sentiment"},
                "categories": {"$push": "$categories"},
                "suggestions": {"$push": "$overall_suggestions"}
            }}
        ]
        
        result = await self.db.feedback_analyses.aggregate(pipeline).to_list(1)
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
            
        result = result[0]
        
        return UserAnalysis(
            user_id=user_id,
            feedback_count=result["feedback_count"],
            average_score=result["average_score"],
            sentiment_distribution=self.count_sentiments(result["sentiments"]),
            preferred_categories=self.aggregate_categories(result["categories"]),
            improvement_suggestions=self.aggregate_suggestions(result["suggestions"]),
            submission_trend=self.calculate_user_trends(result)
        )

    # Helper methods for aggregation
    def count_sentiments(self, sentiments: List[str]) -> Dict[str, int]:
        return {s: sentiments.count(s) for s in set(sentiments)}

    def aggregate_categories(self, categories_list: List[List[str]]) -> List[Dict[str, int]]:
        flat_categories = [cat for cats in categories_list for cat in cats]
        return [{"category": cat, "count": flat_categories.count(cat)} 
                for cat in set(flat_categories)]

    def aggregate_suggestions(self, suggestions_list: List[List[str]]) -> List[Dict[str, int]]:
        flat_suggestions = [sug for sugs in suggestions_list for sug in sugs]
        return [{"suggestion": sug, "count": flat_suggestions.count(sug)} 
                for sug in set(flat_suggestions)]

    def aggregate_priorities(self, priorities_list: List[Dict[str, float]]) -> List[Dict[str, float]]:
        # Aggregate and average priorities
        priority_sums = {}
        priority_counts = {}
        
        for priorities in priorities_list:
            for priority, score in priorities.items():
                priority_sums[priority] = priority_sums.get(priority, 0) + score
                priority_counts[priority] = priority_counts.get(priority, 0) + 1
        
        return [{"priority": p, "score": priority_sums[p] / priority_counts[p]} 
                for p in priority_sums.keys()]

    def calculate_trends(self, data: Dict) -> Dict[str, List[float]]:
        # Implement trend calculation logic
        # This is a placeholder implementation
        return {
            "scores": [0.0],  # Replace with actual trend data
            "sentiment": [0.0]  # Replace with actual trend data
        }

    def calculate_user_trends(self, data: Dict) -> Dict[str, List[float]]:
        # Implement user-specific trend calculation
        # This is a placeholder implementation
        return {
            "scores": [0.0],  # Replace with actual trend data
            "participation": [0.0]  # Replace with actual trend data
        }

    def _generate_suggestions(self, overall_comments: str, question_analyses: List[QuestionAnalysis]) -> List[str]:
        """Generate improvement suggestions based on feedback"""
        suggestions = []
        
        # Add suggestions based on overall comments
        if "improve" in overall_comments.lower() or "should" in overall_comments.lower():
            sentences = overall_comments.split('.')
            for sentence in sentences:
                if any(word in sentence.lower() for word in ["improve", "should", "could", "would", "better"]):
                    clean_suggestion = sentence.strip()
                    if clean_suggestion:
                        suggestions.append(clean_suggestion)
        
        # Add suggestions based on low scores
        for analysis in question_analyses:
            if analysis.score < 0.6 and analysis.question_type == "TEXT_BASED":
                suggestions.append(f"Consider improvements in {analysis.question_text}")
        
        return list(set(suggestions))  # Remove duplicates 

    def _determine_suggestion_category(self, suggestion: str) -> str:
        """Determine the category of a suggestion based on keywords"""
        suggestion_lower = suggestion.lower()
        
        category_keywords = {
            "WORK_ENVIRONMENT": ["office", "workspace", "environment", "facility"],
            "WORK_LIFE_BALANCE": ["balance", "hours", "flexibility", "schedule"],
            "TEAM_COLLABORATION": ["team", "collaboration", "communication", "meetings"],
            "PROJECT_MANAGEMENT": ["project", "management", "deadline", "planning"],
            "TECHNICAL_SKILLS": ["technical", "skills", "training", "development"]
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in suggestion_lower for keyword in keywords):
                return category
        
        return "GENERAL"

    def _get_sentiment_label(self, score: float) -> str:
        """Get sentiment label based on score"""
        if score > 0.8:
            return "POSITIVE"
        elif score < 0.4:
            return "NEGATIVE"
        else:
            return "NEUTRAL" 