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

# Add the parent directory to the Python path to import from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from enhanced_data_generator import EnhancedMockDataGenerator

class FeedbackAnalyzerService:
    def __init__(self, mongodb_url: str, feedback_service_url: str):
        self.mongodb_client = AsyncIOMotorClient(mongodb_url)
        self.db = self.mongodb_client.feedback_analytics
        self.feedback_service_url = feedback_service_url
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        
        # Initialize mock data generator
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
        all_submissions = []
        feedback_id = 1
        
        # Generate submissions for each category
        for category in self.mock_data_generator.question_categories.keys():
            questions = self.mock_data_generator.generate_question_set(category)
            
            # Update question IDs to be strings
            for i, question in enumerate(questions):
                question["id"] = str(i + 1)  # Convert to string ID
            
            # Generate 20 submissions for each category
            for _ in range(20):
                # Generate responses for each question
                responses = {}
                for question in questions:
                    response = self.mock_data_generator.generate_response_by_type(question)
                    responses[question["id"]] = response
                
                submission = {
                    "id": str(len(all_submissions) + 1),
                    "feedbackId": feedback_id,
                    "submittedBy": f"user_{random.randint(1, 1000)}",
                    "responses": responses,
                    "questionDetails": questions,
                    "overallComments": self.mock_data_generator.generate_overall_comments(),
                    "submittedAt": datetime.now().isoformat()
                }
                all_submissions.append(submission)
        
        return all_submissions

    async def analyze_text_response(self, text: str) -> Dict:
        """Analyze text response for sentiment and suggestions"""
        if not text or not isinstance(text, str):
            return {
                "sentiment": "NEUTRAL",
                "score": 0.5,
                "suggestions": []
            }

        try:
            # Use TextBlob for sentiment analysis
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            
            # Map polarity to sentiment labels
            if polarity > 0.1:
                sentiment = "POSITIVE"
                score = min((polarity + 1) / 2, 1.0)
            elif polarity < -0.1:
                sentiment = "NEGATIVE"
                score = max((polarity + 1) / 2, 0.0)
            else:
                sentiment = "NEUTRAL"
                score = 0.5

            # Extract suggestions using simple text analysis
            suggestions = []
            sentences = blob.sentences
            for sentence in sentences:
                if any(word in sentence.string.lower() for word in ["should", "could", "need", "improve", "better"]):
                    suggestions.append(sentence.string.strip())

            return {
                "sentiment": sentiment,
                "score": score,
                "suggestions": suggestions
            }
        except Exception as e:
            print(f"Error analyzing text: {str(e)}")
            return {
                "sentiment": "NEUTRAL",
                "score": 0.5,
                "suggestions": []
            }

    def analyze_category_insights(self, responses: List[Dict], category: str) -> Dict:
        """Analyze responses for a specific category and generate insights"""
        try:
            # Collect all text responses and sentiments for this category
            text_responses = []
            sentiments = []
            
            for response in responses:
                if response.get("category") == category:
                    text = response.get("response", "")
                    if text and isinstance(text, str):
                        text_responses.append(text)
                        blob = TextBlob(text)
                        sentiments.append(blob.sentiment.polarity)
            
            # If no valid responses, return a default insight
            if not text_responses:
                return {
                    "category": category,
                    "confidence": 50.0,  # Medium confidence
                    "recommendations": [
                        f"No specific feedback provided for {category.lower().replace('_', ' ')}",
                        "Consider gathering more detailed feedback"
                    ],
                    "sentiment_score": 0.0
                }
                
            # Calculate confidence score based on consistency and quantity of feedback
            confidence_score = min(
                (len(text_responses) / 5) * 0.5 +  # More responses increase confidence
                (abs(np.mean(sentiments)) * 0.3) +  # Strong sentiments increase confidence
                0.2,  # Base confidence
                1.0
            ) * 100
            
            # Generate recommendations based on category
            recommendations = []
            combined_text = " ".join(text_responses).lower()
            
            # Extract action items and suggestions
            for text in text_responses:
                blob = TextBlob(text)
                for sentence in blob.sentences:
                    if any(word in sentence.string.lower() for word in ["should", "need", "must", "could", "improve", "suggest"]):
                        recommendations.append(sentence.string.strip())
            
            # If no explicit recommendations found, generate based on category
            if not recommendations and category in self.solution_suggestions:
                category_solutions = self.solution_suggestions[category]
                for area, solutions in category_solutions.items():
                    if any(keyword in combined_text for keyword in area.split()):
                        recommendations.extend(solutions[:2])
            
            # If still no recommendations, provide default ones
            if not recommendations:
                recommendations = [
                    f"Consider implementing regular feedback sessions for {category.lower().replace('_', ' ')}",
                    f"Establish clear metrics for measuring {category.lower().replace('_', ' ')} effectiveness"
                ]
                        
            return {
                "category": category,
                "confidence": round(confidence_score, 1),
                "recommendations": list(set(recommendations))[:2],  # Top 2 unique recommendations
                "sentiment_score": float(np.mean(sentiments)) if sentiments else 0.0
            }
        except Exception as e:
            print(f"Error analyzing category insights: {str(e)}")
            # Return a default insight instead of None
            return {
                "category": category,
                "confidence": 30.0,  # Low confidence due to error
                "recommendations": [
                    f"Error analyzing {category.lower().replace('_', ' ')} feedback",
                    "Please review the raw feedback manually"
                ],
                "sentiment_score": 0.0
            }

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
            question_analyses = []
            overall_score = 0.0
            satisfaction_scores = []
            improvement_areas = []
            key_metrics = {}
            key_insights = []
            
            # Analyze each question
            for question in submission.get("questionDetails", []):
                response = question.get("response", "")
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
                            key_insights.append(f"High satisfaction ({satisfaction * 100:.0f}%) reported for {category.lower().replace('_', ' ')}")
                        elif satisfaction <= 0.4:
                            key_insights.append(f"Low satisfaction ({satisfaction * 100:.0f}%) reported for {category.lower().replace('_', ' ')}")
                    except:
                        satisfaction_scores.append(0.5)
                
                # Enhanced question analysis
                analysis = await self.analyze_question_response(question, response)
                
                # Add question-specific insights
                insights = []
                if question_type == "MULTIPLE_CHOICE":
                    selected_options = response.split(", ")
                    insights.append(f"Selected {len(selected_options)} out of {len(question.get('choices', []))} options")
                    if len(selected_options) > 2:
                        insights.append("Shows diverse preferences/needs")
                elif question_type == "TEXT_BASED":
                    text_sentiment = self.sentiment_analyzer(response)[0]
                    sentiment_strength = "strong" if text_sentiment["score"] > 0.8 else "moderate"
                    insights.append(f"Expressed {sentiment_strength} {text_sentiment['label'].lower()} sentiment")
                    
                    # Extract action items
                    if any(word in response.lower() for word in ["should", "need", "must", "could"]):
                        action_items = [s.strip() for s in response.split(".") if any(word in s.lower() for word in ["should", "need", "must", "could"])]
                        insights.extend([f"Action item: {item}" for item in action_items])
                
                analysis.suggestions = insights
                question_analyses.append(analysis)
                overall_score += analysis.score
                
                # Track improvement areas for low scores
                if analysis.score < 0.6:
                    improvement_areas.append({
                        "category": category,
                        "question": question.get("text", ""),
                        "score": analysis.score,
                        "priority": "High" if analysis.score < 0.4 else "Medium"
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
            
            # Generate executive summary
            executive_summary = {
                "overall_rating": f"{final_score * 100:.1f}%",
                "key_strengths": [cat for cat, score in key_metrics.items() if "satisfaction" in cat and score > 0.8],
                "improvement_areas": [area["category"] for area in improvement_areas],
                "key_insights": key_insights,
                "action_items": suggestions
            }
            
            return FeedbackAnalysis(
                feedback_id=submission.get("id", 0),
                project_id=submission.get("projectId", 0),
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
                categories=self.extract_categories(submission),
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
                sentiment = self.sentiment_analyzer(keyword + " in context: " + text)[0]
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