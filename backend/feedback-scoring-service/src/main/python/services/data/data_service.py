import logging
import requests
import asyncio
import aiohttp
from typing import Dict, List, Any, Optional
import json
from datetime import datetime
from models.feedback_analysis import FeedbackAnalysis
from services.base_service import BaseService
from utils.helpers import async_retry

# Configure logger
logger = logging.getLogger(__name__)

class DataService(BaseService):
    """Service for handling data operations"""
    
    @async_retry(max_retries=3, delay=1.0)
    async def fetch_all_submissions(self) -> List[Dict]:
        """
        Fetch all feedback submissions from the feedback service
        
        Returns:
            List of feedback submissions
        """
        try:
            logger.info(f"Fetching all submissions from {self.feedback_service_url}")
            
            # Try to fetch from the feedback service
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{self.feedback_service_url}/api/admin/submissions/all") as response:
                        if response.status == 200:
                            data = await response.json()
                            logger.info(f"Successfully fetched {len(data)} submissions")
                            return data
                        else:
                            logger.warning(f"Failed to fetch submissions: {response.status}")
            except Exception as e:
                logger.error(f"Error fetching submissions: {str(e)}")
            
            # If fetching fails, generate mock data
            logger.info("Falling back to mock data")
            return self.generate_mock_submissions()
        except Exception as e:
            logger.error(f"Error in fetch_all_submissions: {str(e)}")
            return []
    
    @async_retry(max_retries=3, delay=1.0)
    async def fetch_submissions_by_feedback_id(self, feedback_id: int) -> List[Dict]:
        """
        Fetch all submissions for a specific feedback ID
        
        Args:
            feedback_id: The feedback ID to fetch submissions for
            
        Returns:
            List of feedback submissions for the specified feedback ID
        """
        try:
            logger.info(f"Fetching submissions for feedback ID {feedback_id} from {self.feedback_service_url}")
            
            # First try to fetch all submissions
            all_submissions = await self.fetch_all_submissions()
            
            # Filter submissions by feedback ID
            submissions = [s for s in all_submissions if s.get("feedbackId") == feedback_id]
            
            if submissions:
                logger.info(f"Found {len(submissions)} submissions for feedback ID {feedback_id}")
                return submissions
            
            # If no submissions found, try direct API call if available
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{self.feedback_service_url}/api/admin/feedback/{feedback_id}/submissions") as response:
                        if response.status == 200:
                            data = await response.json()
                            logger.info(f"Successfully fetched {len(data)} submissions for feedback ID {feedback_id}")
                            return data
                        else:
                            logger.warning(f"Failed to fetch submissions for feedback ID {feedback_id}: {response.status}")
            except Exception as e:
                logger.error(f"Error fetching submissions for feedback ID {feedback_id}: {str(e)}")
            
            # If still no submissions, return empty list
            logger.warning(f"No submissions found for feedback ID {feedback_id}")
            return []
        except Exception as e:
            logger.error(f"Error in fetch_submissions_by_feedback_id: {str(e)}")
            return []
    
    def generate_mock_submissions(self) -> List[Dict]:
        """
        Generate mock feedback submissions for testing
        
        Returns:
            List of mock feedback submissions
        """
        try:
            # Generate some basic mock data
            mock_data = []
            
            for i in range(1, 11):
                submission = {
                    "id": i,
                    "feedbackId": i % 3 + 1,  # Group submissions by feedback ID (1, 2, 3)
                    "projectId": i % 2 + 1,  # Alternate between project IDs 1 and 2
                    "projectName": f"Project {i % 2 + 1}",
                    "submittedBy": f"user{i}@example.com",
                    "submittedAt": datetime.now().isoformat(),
                    "responses": {
                        "1": "Very Satisfied" if i % 3 == 0 else "Neutral" if i % 3 == 1 else "Dissatisfied",
                        "2": "The project went well overall. Communication was good.",
                        "3": ["Communication", "Planning"] if i % 2 == 0 else ["Documentation", "Testing"],
                        "4": "POSITIVE" if i % 3 == 0 else "NEUTRAL" if i % 3 == 1 else "NEGATIVE"
                    },
                    "overallComments": "This is a sample feedback submission for testing purposes.",
                    "questionDetails": [
                        {
                            "id": 1,
                            "text": "How satisfied are you with the project?",
                            "questionType": "SINGLE_CHOICE",
                            "category": "SATISFACTION"
                        },
                        {
                            "id": 2,
                            "text": "What went well in the project?",
                            "questionType": "TEXT_BASED",
                            "category": "STRENGTHS"
                        },
                        {
                            "id": 3,
                            "text": "Which areas need improvement?",
                            "questionType": "MULTIPLE_CHOICE",
                            "category": "IMPROVEMENTS"
                        },
                        {
                            "id": 4,
                            "text": "What is your overall sentiment about the project?",
                            "questionType": "SENTIMENT",
                            "category": "SENTIMENT"
                        }
                    ]
                }
                mock_data.append(submission)
            
            logger.info(f"Generated {len(mock_data)} mock submissions")
            return mock_data
        except Exception as e:
            logger.error(f"Error generating mock submissions: {str(e)}")
            return []
    
    async def store_analysis(self, analysis: FeedbackAnalysis):
        """
        Store feedback analysis in MongoDB
        
        Args:
            analysis: Feedback analysis to store
        """
        try:
            # Convert to dictionary
            analysis_dict = analysis.dict()
            
            # Add timestamp
            analysis_dict["stored_at"] = datetime.now().isoformat()
            
            # Store in MongoDB
            await self.db.feedback_analyses.update_one(
                {"feedback_id": analysis.feedback_id},
                {"$set": analysis_dict},
                upsert=True
            )
            
            logger.info(f"Stored analysis for feedback ID {analysis.feedback_id}")
        except Exception as e:
            logger.error(f"Error storing analysis: {str(e)}")
    
    async def get_analysis_by_id(self, feedback_id: int) -> Optional[Dict]:
        """
        Get stored analysis by feedback ID
        
        Args:
            feedback_id: Feedback ID to retrieve
            
        Returns:
            Stored analysis or None if not found
        """
        try:
            analysis = await self.db.feedback_analyses.find_one({"feedback_id": feedback_id})
            if analysis:
                # Remove MongoDB _id field
                analysis.pop("_id", None)
                return analysis
            return None
        except Exception as e:
            logger.error(f"Error retrieving analysis: {str(e)}")
            return None
    
    async def get_analyses_by_project(self, project_id: int) -> List[Dict]:
        """
        Get all analyses for a project
        
        Args:
            project_id: Project ID to retrieve analyses for
            
        Returns:
            List of analyses for the project
        """
        try:
            cursor = self.db.feedback_analyses.find({"project_id": project_id})
            analyses = []
            async for analysis in cursor:
                # Remove MongoDB _id field
                analysis.pop("_id", None)
                analyses.append(analysis)
            return analyses
        except Exception as e:
            logger.error(f"Error retrieving project analyses: {str(e)}")
            return [] 