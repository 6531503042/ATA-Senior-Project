from fastapi import FastAPI, HTTPException, Query, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models.feedback_analysis import *
from scoring_model import FeedbackScorer
from services.feedback_analyzer_service import FeedbackAnalyzerService
from typing import List, Optional
import os
from dotenv import load_dotenv
import logging
import traceback
import json
import train_model
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(
    title="Feedback Scoring Service",
    description="AI-powered feedback analysis service",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize feedback scorer
scorer = FeedbackScorer(model_path="models")

@app.on_event("startup")
async def startup_event():
    """Initialize the feedback scoring service on startup."""
    try:
        logger.info("Starting up the Feedback Scoring Service")
        if not os.path.exists("models"):
            logger.info("Models not found. Training new models...")
            train_model.main()
        else:
            logger.info("Loading existing models...")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {str(exc)}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "message": str(exc)
        }
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test the model by scoring a simple text
        test_result = scorer.score_text_based("This is a test message")
        return {
            "status": "healthy",
            "service": "feedback-scoring",
            "model_status": "loaded"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "feedback-scoring",
                "model_status": "error",
                "error": str(e)
            }
        )

@app.post("/api/score")
async def score_feedback(submission: dict):
    """Score a feedback submission"""
    try:
        logger.info(f"Scoring feedback submission: {submission.get('id')}")
        result = scorer.score_submission(submission, submission.get("questions", []))
        return result
    except Exception as e:
        logger.error(f"Error scoring feedback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error scoring feedback: {str(e)}"
        )

@app.post("/api/analyze/text")
async def analyze_text(text: str):
    """Analyze a text response"""
    try:
        logger.info("Analyzing text response")
        result = scorer.score_text_based(text)
        return result
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing text: {str(e)}"
        )

@app.post("/api/retrain")
async def retrain_model(background_tasks: BackgroundTasks):
    """Retrain the model with new data"""
    try:
        logger.info("Starting model retraining")
        from train_model import main as train_models
        background_tasks.add_task(train_models)
        return {"message": "Model retraining started in background"}
    except Exception as e:
        logger.error(f"Error starting model retraining: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error starting model retraining: {str(e)}"
        )

@app.get("/api/submissions/all")
async def get_all_submissions():
    """Get all feedback submissions with their scores and analysis"""
    try:
        logger.info("Fetching and analyzing all feedback submissions")
        # Initialize analyzer service
        analyzer = FeedbackAnalyzerService(
            mongodb_url=os.getenv("MONGODB_URL", "mongodb://localhost:27017"),
            feedback_service_url=os.getenv("FEEDBACK_SERVICE_URL", "http://localhost:8084")
        )
        
        # Fetch submissions
        submissions = await analyzer.fetch_all_submissions()
        logger.info(f"Retrieved {len(submissions)} submissions")
        
        # Analyze each submission
        analyzed_submissions = []
        for submission in submissions:
            try:
                logger.info(f"Analyzing submission {submission.get('id')}")
                analysis = await analyzer.analyze_feedback_submission(submission)
                logger.info(f"Successfully analyzed submission {submission.get('id')}")
                
                # Store analysis in MongoDB
                await analyzer.store_analysis(analysis)
                logger.info(f"Stored analysis for submission {submission.get('id')}")
                
                analyzed_submissions.append({
                    "submission": submission,
                    "analysis": analysis.dict(),
                    "error": None
                })
            except Exception as e:
                logger.error(f"Error analyzing submission {submission.get('id')}: {str(e)}")
                logger.error(f"Error details: {e.__class__.__name__}: {str(e)}")
                analyzed_submissions.append({
                    "submission": submission,
                    "analysis": None,
                    "error": str(e)
                })
        
        return analyzed_submissions
    except Exception as e:
        logger.error(f"Error processing submissions: {str(e)}")
        logger.error(f"Error details: {e.__class__.__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing submissions: {str(e)}"
        )

@app.get("/api/analysis/feedback/{feedback_id}")
async def get_feedback_analysis(feedback_id: int):
    """Get analysis for a specific feedback"""
    try:
        logger.info(f"Analyzing feedback ID: {feedback_id}")
        analyzer = FeedbackAnalyzerService(
            mongodb_url=os.getenv("MONGODB_URL", "mongodb://localhost:27017"),
            feedback_service_url=os.getenv("FEEDBACK_SERVICE_URL", "http://localhost:8084")
        )
        analysis = await analyzer.analyze_feedback_submission({"id": feedback_id})
        return analysis
    except Exception as e:
        logger.error(f"Error analyzing feedback {feedback_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing feedback: {str(e)}"
        )

@app.get("/api/analysis/project/{project_id}")
async def get_project_analysis(project_id: int):
    """Get aggregated analysis for a project"""
    try:
        logger.info(f"Getting analysis for project ID: {project_id}")
        analyzer = FeedbackAnalyzerService(
            mongodb_url=os.getenv("MONGODB_URL", "mongodb://localhost:27017"),
            feedback_service_url=os.getenv("FEEDBACK_SERVICE_URL", "http://localhost:8084")
        )
        analysis = await analyzer.get_project_analysis(project_id)
        return analysis
    except Exception as e:
        logger.error(f"Error getting project analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting project analysis: {str(e)}"
        )

@app.get("/api/analysis/trends")
async def get_feedback_trends(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    project_id: Optional[int] = None
):
    """Get feedback trends and analytics"""
    try:
        logger.info("Getting feedback trends")
        analyzer = FeedbackAnalyzerService(
            mongodb_url=os.getenv("MONGODB_URL", "mongodb://localhost:27017"),
            feedback_service_url=os.getenv("FEEDBACK_SERVICE_URL", "http://localhost:8084")
        )
        
        # Convert dates if provided
        start = datetime.fromisoformat(start_date) if start_date else None
        end = datetime.fromisoformat(end_date) if end_date else None
        
        trends = {
            "sentiment_distribution": {},
            "score_trends": [],
            "category_distribution": {},
            "response_rate": {}
        }
        
        return trends
    except Exception as e:
        logger.error(f"Error getting feedback trends: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting feedback trends: {str(e)}"
        )

@app.get("/api/analysis/satisfaction/{feedback_id}")
async def get_satisfaction_analysis(feedback_id: int):
    """Get simplified satisfaction analysis for a specific feedback ID"""
    try:
        logger.info(f"Analyzing satisfaction for feedback ID: {feedback_id}")
        analyzer = FeedbackAnalyzerService(
            mongodb_url=os.getenv("MONGODB_URL", "mongodb://localhost:27017"),
            feedback_service_url=os.getenv("FEEDBACK_SERVICE_URL", "http://localhost:8084")
        )
        
        # Fetch all submissions
        all_submissions = await analyzer.fetch_all_submissions()
        
        # Filter submissions by feedback_id
        feedback_submissions = [s for s in all_submissions if s.get("feedbackId") == feedback_id]
        
        if not feedback_submissions:
            raise HTTPException(status_code=404, detail=f"No submissions found for feedback ID {feedback_id}")
        
        # Initialize counters
        total_submissions = len(feedback_submissions)
        satisfaction_scores = []
        sentiment_counts = {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0}
        all_suggestions = []
        
        # Analyze each submission
        for submission in feedback_submissions:
            try:
                # Calculate satisfaction score
                analysis = await analyzer.analyze_feedback_submission(submission)
                satisfaction_scores.append(analysis.overall_score * 100)  # Convert to percentage
                
                # Count sentiments from sentiment questions and text analysis
                for question in submission.get("questionDetails", []):
                    response = submission["responses"].get(str(question["id"]))
                    if not response:
                        continue
                        
                    if question.get("questionType") == "SENTIMENT":
                        sentiment = response.upper()
                        if sentiment in sentiment_counts:
                            sentiment_counts[sentiment] += 1
                    elif question.get("questionType") == "TEXT_BASED":
                        # Analyze text response
                        text_analysis = await analyzer.analyze_text_response(response)
                        if text_analysis:
                            sentiment = text_analysis.get("sentiment", "NEUTRAL")
                            if sentiment in sentiment_counts:
                                sentiment_counts[sentiment] += 1
                            # Collect suggestions
                            if text_analysis.get("suggestions"):
                                all_suggestions.extend(text_analysis["suggestions"])
                
                # Analyze overall comments
                if submission.get("overallComments"):
                    overall_analysis = await analyzer.analyze_text_response(submission["overallComments"])
                    if overall_analysis:
                        sentiment = overall_analysis.get("sentiment", "NEUTRAL")
                        if sentiment in sentiment_counts:
                            sentiment_counts[sentiment] += 1
                        if overall_analysis.get("suggestions"):
                            all_suggestions.extend(overall_analysis["suggestions"])
                            
            except Exception as e:
                logger.error(f"Error analyzing submission {submission.get('id')}: {str(e)}")
                continue
        
        # Calculate averages and percentages
        avg_satisfaction = sum(satisfaction_scores) / len(satisfaction_scores) if satisfaction_scores else 0
        total_sentiments = sum(sentiment_counts.values()) or 1  # Avoid division by zero
        
        sentiment_distribution = {
            "positive": {
                "percentage": round((sentiment_counts["POSITIVE"] / total_sentiments) * 100, 1),
                "emoji": "😃",
                "label": "Positive"
            },
            "neutral": {
                "percentage": round((sentiment_counts["NEUTRAL"] / total_sentiments) * 100, 1),
                "emoji": "😐",
                "label": "Neutral"
            },
            "negative": {
                "percentage": round((sentiment_counts["NEGATIVE"] / total_sentiments) * 100, 1),
                "emoji": "😞",
                "label": "Negative"
            }
        }
        
        # Prepare simplified response
        response = {
            "feedbackId": feedback_id,
            "satisfactionOverview": {
                "overallSatisfaction": round(avg_satisfaction, 1),
                "satisfactionRate": round((len([s for s in satisfaction_scores if s >= 60]) / len(satisfaction_scores)) * 100 if satisfaction_scores else 0, 1),
                "totalSubmissions": total_submissions
            },
            "sentimentDistribution": sentiment_distribution,
            "suggestions": list(set(all_suggestions))[:5]  # Top 5 unique suggestions
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing satisfaction: {str(e)}")
        logger.error(f"Error details: {e.__class__.__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing satisfaction: {str(e)}"
        )

@app.get("/api/analysis/insights/{feedback_id}")
async def get_ai_insights(feedback_id: int):
    """Get AI-powered insights for a specific feedback"""
    try:
        logger.info(f"Generating AI insights for feedback ID: {feedback_id}")
        analyzer = FeedbackAnalyzerService(
            mongodb_url=os.getenv("MONGODB_URL", "mongodb://localhost:27017"),
            feedback_service_url=os.getenv("FEEDBACK_SERVICE_URL", "http://localhost:8084")
        )
        
        # Fetch all submissions
        all_submissions = await analyzer.fetch_all_submissions()
        
        # Filter submissions by feedback_id
        feedback_submissions = [s for s in all_submissions if s.get("feedbackId") == feedback_id]
        
        if not feedback_submissions:
            raise HTTPException(status_code=404, detail=f"No submissions found for feedback ID {feedback_id}")
        
        # Generate AI insights
        insights = await analyzer.generate_ai_insights(feedback_submissions)

        def classify_priority(confidence: float, recommendation: str) -> str:
            """Classify priority based on confidence and recommendation content"""
            # Keywords indicating complexity/difficulty
            complex_keywords = ["implement", "establish", "develop", "create", "integrate"]
            medium_keywords = ["improve", "enhance", "update", "modify", "adjust"]
            easy_keywords = ["consider", "review", "discuss", "monitor", "track"]
            
            # Check recommendation complexity
            recommendation_lower = recommendation.lower()
            if any(keyword in recommendation_lower for keyword in complex_keywords):
                base_priority = "hard"
            elif any(keyword in recommendation_lower for keyword in medium_keywords):
                base_priority = "medium"
            else:
                base_priority = "easy"
            
            # Adjust based on confidence
            if confidence < 40:
                # Lower confidence might indicate more complex issues
                return "hard" if base_priority != "easy" else "medium"
            elif confidence > 70:
                # Higher confidence might indicate clearer, easier solutions
                return "medium" if base_priority == "hard" else base_priority
            
            return base_priority

        # Prepare response with priority classifications
        response = {
            "feedbackId": feedback_id,
            "title": "AI-Powered Insights",
            "description": "Leveraging advanced machine learning algorithms for data-driven recommendations",
            "insights": {
                "performanceInsights": {
                    "title": "Performance Insights",
                    "aiConfidence": insights.get("performanceInsights", {}).get("confidence", 0),
                    "recommendations": [
                        {
                            "text": rec,
                            "priority": classify_priority(
                                insights.get("performanceInsights", {}).get("confidence", 0),
                                rec
                            )
                        }
                        for rec in insights.get("performanceInsights", {}).get("recommendations", [])
                    ]
                },
                "engagementAnalysis": {
                    "title": "Engagement Analysis",
                    "aiConfidence": insights.get("engagementAnalysis", {}).get("confidence", 0),
                    "recommendations": [
                        {
                            "text": rec,
                            "priority": classify_priority(
                                insights.get("engagementAnalysis", {}).get("confidence", 0),
                                rec
                            )
                        }
                        for rec in insights.get("engagementAnalysis", {}).get("recommendations", [])
                    ]
                },
                "improvementOpportunities": {
                    "title": "Improvement Opportunities",
                    "aiConfidence": insights.get("improvementOpportunities", {}).get("confidence", 0),
                    "recommendations": [
                        {
                            "text": rec,
                            "priority": classify_priority(
                                insights.get("improvementOpportunities", {}).get("confidence", 0),
                                rec
                            )
                        }
                        for rec in insights.get("improvementOpportunities", {}).get("recommendations", [])
                    ]
                }
            },
            "metadata": {
                "totalSubmissions": len(feedback_submissions),
                "analyzedAt": datetime.now().isoformat(),
                "categories": list(set(
                    question["category"]
                    for submission in feedback_submissions
                    for question in submission.get("questionDetails", [])
                ))
            }
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error generating AI insights: {str(e)}")
        logger.error(f"Error details: {e.__class__.__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating AI insights: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8085, reload=True) 