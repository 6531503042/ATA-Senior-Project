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

# Add the parent directory to the Python path to import from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from enhanced_data_generator import EnhancedMockDataGenerator

class FeedbackAnalyzerService:
    def __init__(self, mongodb_url: str, feedback_service_url: str):
        # Initialize sentiment pipeline once and cache it
        self.sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device="cpu"  # Explicitly set to CPU for consistent performance
        )
        
        # Cache TextBlob results
        self.sentiment_cache = {}
        
        # Initialize other attributes
        self.mongodb_url = mongodb_url
        self.feedback_service_url = feedback_service_url
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
        """Analyze individual question response"""
        try:
            analysis = await self.analyze_text_response(response)
            
            return QuestionAnalysis(
                question_id=question.get("id", 0),
                question_text=question.get("text", ""),
                question_type=question.get("questionType", "TEXT"),
                response=response,
                score=analysis["score"],
                sentiment=SentimentType(analysis["sentiment"]),
                suggestions=[],  # Temporarily disable suggestions
                improvement_priorities=[]  # Add the missing field
            )
        except Exception as e:
            print(f"Error analyzing question response: {str(e)}")
            return QuestionAnalysis(
                question_id=question.get("id", 0),
                question_text=question.get("text", ""),
                question_type=question.get("questionType", "TEXT"),
                response=response,
                score=0.5,
                sentiment=SentimentType.NEUTRAL,
                suggestions=[],
                improvement_priorities=[]
            )

    async def analyze_feedback_submission(self, submission: Dict) -> FeedbackAnalysis:
        """Analyze complete feedback submission"""
        try:
            # First fetch the actual submission data if we only have the ID
            if isinstance(submission, dict) and len(submission.keys()) == 1 and "id" in submission:
                all_submissions = await self.fetch_all_submissions()
                matching_submissions = [s for s in all_submissions if str(s.get("id")) == str(submission["id"])]
                if not matching_submissions:
                    raise HTTPException(status_code=404, detail=f"No submission found with ID {submission['id']}")
                submission = matching_submissions[0]

            question_analyses = []
            overall_score = 0.0
            satisfaction_scores = []
            improvement_areas = []
            key_metrics = {}
            key_insights = []
            strengths = []
            weaknesses = []
            
            # Analyze each question
            for question in submission.get("questionDetails", []):
                response = submission["responses"].get(str(question["id"]))
                question_type = question.get("questionType", "")
                category = question.get("category", "")
                
                # Calculate satisfaction score based on question type
                if question_type == "SINGLE_CHOICE":
                    try:
                        satisfaction = float(response) / 5.0  # Normalize to 0-1
                        satisfaction_scores.append(satisfaction)
                        key_metrics[f"{category}_satisfaction"] = satisfaction
                        
                        # Add insight for satisfaction score
                        if satisfaction >= 0.8:
                            strengths.append({
                                "category": category,
                                "score": satisfaction * 100,
                                "description": f"High satisfaction in {category.lower().replace('_', ' ')}"
                            })
                        elif satisfaction <= 0.4:
                            weaknesses.append({
                                "category": category,
                                "score": satisfaction * 100,
                                "description": f"Low satisfaction in {category.lower().replace('_', ' ')}"
                            })
                    except:
                        satisfaction_scores.append(0.5)
                
                # Enhanced question analysis
                analysis = await self.analyze_question_response(question, response)
                
                # Add question-specific insights
                insights = []
                if question_type == "MULTIPLE_CHOICE":
                    selected_options = response.split(", ")
                    insights.append({
                        "type": "selection_analysis",
                        "content": f"Selected {len(selected_options)} out of {len(question.get('choices', []))} options",
                        "details": selected_options
                    })
                elif question_type == "TEXT_BASED":
                    text_sentiment = self.sentiment_pipeline(response)[0]
                    sentiment_strength = "strong" if text_sentiment["score"] > 0.8 else "moderate"
                    insights.append({
                        "type": "sentiment_analysis",
                        "content": f"Expressed {sentiment_strength} {text_sentiment['label'].lower()} sentiment",
                        "score": text_sentiment["score"]
                    })
                    
                    # Extract action items
                    if any(word in response.lower() for word in ["should", "need", "must", "could"]):
                        action_items = [s.strip() for s in response.split(".") if any(word in s.lower() for word in ["should", "need", "must", "could"])]
                        insights.append({
                            "type": "action_items",
                            "content": "Action items identified",
                            "items": action_items
                        })
                
                analysis.suggestions = insights
                question_analyses.append(analysis)
                overall_score += analysis.score
                
                # Track improvement areas for low scores
                if analysis.score < 0.6:
                    improvement_areas.append({
                        "category": category,
                        "question": question.get("text", ""),
                        "score": analysis.score,
                        "priority": "High" if analysis.score < 0.4 else "Medium",
                        "recommendations": self.get_default_recommendations(category)[:2]
                    })
            
            num_questions = len(question_analyses) or 1
            
            # Analyze overall comments
            overall_comments = submission.get("overallComments", "")
            overall_analysis = await self.analyze_text_response(overall_comments)
            
            # Extract priorities and suggestions
            priorities = self.extract_priorities(overall_comments)
            suggestions = self._generate_suggestions(overall_comments, question_analyses)
            
            # Calculate final scores
            avg_satisfaction = sum(satisfaction_scores) / len(satisfaction_scores) if satisfaction_scores else 0.5
            final_score = (overall_score / num_questions + avg_satisfaction) / 2
            
            # Add overall metrics
            key_metrics.update({
                "overall_satisfaction": avg_satisfaction,
                "response_quality": overall_score / num_questions,
                "sentiment_score": overall_analysis["score"],
                "improvement_count": len(improvement_areas)
            })
            
            # Generate insights based on scores and analysis
            strengths = []
            weaknesses = []
            key_insights = []

            # Add insights based on question analyses
            for analysis in question_analyses:
                if analysis.score >= 0.8:
                    strengths.append({
                        "category": analysis.category,
                        "score": analysis.score * 100,
                        "description": f"High performance in {analysis.question_text.lower()}"
                    })
                elif analysis.score <= 0.4:
                    weaknesses.append({
                        "category": analysis.category,
                        "score": analysis.score * 100,
                        "description": f"Needs improvement in {analysis.question_text.lower()}"
                    })

            # Add insights based on satisfaction scores
            if avg_satisfaction >= 0.8:
                key_insights.append(f"Overall high satisfaction rate of {avg_satisfaction * 100:.1f}%")
            elif avg_satisfaction <= 0.4:
                key_insights.append(f"Overall satisfaction needs attention at {avg_satisfaction * 100:.1f}%")

            # Add insights based on sentiment analysis
            if overall_analysis["sentiment"] == "POSITIVE":
                key_insights.append("Positive sentiment in overall feedback")
            elif overall_analysis["sentiment"] == "NEGATIVE":
                key_insights.append("Negative sentiment requires attention")

            # Add insights based on improvement areas
            if improvement_areas:
                key_insights.append(f"Found {len(improvement_areas)} areas needing improvement")
                
            # Generate executive summary
            executive_summary = ExecutiveSummary(
                overall_rating=f"{final_score * 100:.1f}%",
                strengths=strengths,
                weaknesses=weaknesses,
                key_insights=key_insights,
                action_items=[
                    {
                        "description": suggestion,
                        "category": self._determine_suggestion_category(suggestion),
                        "priority": "High" if any(word in suggestion.lower() for word in ["critical", "immediate", "urgent"]) else "Medium"
                    }
                    for suggestion in suggestions
                ]
            )
            
            # Calculate category scores
            category_scores = {}
            for category in self.extract_categories(submission):
                category_responses = [
                    q for q in question_analyses 
                    if q.category == category
                ]
                if category_responses:
                    avg_score = sum(q.score for q in category_responses) / len(category_responses)
                    category_scores[category] = CategoryAnalysis(
                        score=avg_score * 100,
                        sentiment=self._get_sentiment_label(avg_score),
                        recommendations=self.get_default_recommendations(category)[:2]
                    )
            
            return FeedbackAnalysis(
                feedback_id=int(submission.get("id", 0)),
                project_id=int(submission.get("projectId", 0)),
                project_name=submission.get("projectName", ""),
                submitted_by=submission.get("submittedBy", ""),
                submitted_at=datetime.fromisoformat(
                    submission.get("submittedAt", datetime.now().isoformat())
                ),
                executive_summary=executive_summary,
                question_analyses=question_analyses,
                overall_score=final_score,
                overall_sentiment=SentimentType(overall_analysis["sentiment"]),
                overall_suggestions=suggestions,
                overall_priorities=priorities,
                categories=category_scores,
                satisfaction_score=avg_satisfaction,
                improvement_areas=improvement_areas,
                key_metrics=key_metrics
            )
        except Exception as e:
            print(f"Error analyzing feedback submission: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error analyzing feedback: {str(e)}"
            )

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
        await self.db.feedback_analyses.update_one(
            {"feedback_id": analysis.feedback_id},
            {"$set": analysis.dict()},
            upsert=True
        )

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