import json
import numpy as np
from feedback_analyzer import FeedbackAnalyzer
from enhanced_data_generator import EnhancedMockDataGenerator
from collections import defaultdict

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

def analyze_bulk_feedback(analyzer, data_generator, questions, num_submissions=100):
    """Analyze multiple feedback submissions and aggregate results by feedback ID and category"""
    feedback_results = defaultdict(lambda: {
        "total_score": 0,
        "submission_count": 0,
        "categories": defaultdict(lambda: {
            "responses": [],
            "satisfaction_scores": [],
            "priority_levels": [],
            "improvements": []
        }),
        "overall_comments": [],
        "overall_sentiment": []
    })
    
    for i in range(num_submissions):
        submission = data_generator.generate_submission(f"fb{i}", questions)
        result = analyzer.analyze_submission(submission)
        
        feedback_id = submission["feedbackId"]
        feedback_data = feedback_results[feedback_id]
        
        # Add submission score
        feedback_data["total_score"] += result["totalSatisfactionScore"]
        feedback_data["submission_count"] += 1
        
        # Add overall comments analysis
        if submission.get("overallComments"):
            feedback_data["overall_comments"].append(submission["overallComments"])
            sentiment = analyzer._analyze_sentiment(submission["overallComments"])
            feedback_data["overall_sentiment"].append(sentiment)
        
        # Aggregate by category
        for analysis in result["detailedAnalyses"]:
            category = analysis["category"]
            category_data = feedback_data["categories"][category]
            
            category_data["responses"].append({
                "response": analysis["response"],
                "satisfaction_score": analysis["satisfactionScore"],
                "priority_level": analysis["analysis"]["priorityLevel"],
                "improvements": analysis["analysis"].get("improvements", [])
            })
            
            category_data["satisfaction_scores"].append(analysis["satisfactionScore"])
            category_data["priority_levels"].append(analysis["analysis"]["priorityLevel"])
            if "improvements" in analysis["analysis"]:
                category_data["improvements"].extend(analysis["analysis"]["improvements"])

    # Process results into final summary
    summary = {
        "total_submissions": num_submissions,
        "feedback_analysis": {}
    }
    
    for feedback_id, feedback_data in feedback_results.items():
        avg_score = feedback_data["total_score"] / feedback_data["submission_count"]
        overall_sentiment = sum(feedback_data["overall_sentiment"]) / len(feedback_data["overall_sentiment"]) if feedback_data["overall_sentiment"] else 0
        
        category_summaries = {}
        for category, category_data in feedback_data["categories"].items():
            if category_data["satisfaction_scores"]:
                category_summaries[category] = {
                    "average_satisfaction": sum(category_data["satisfaction_scores"]) / len(category_data["satisfaction_scores"]),
                    "response_count": len(category_data["responses"]),
                    "high_priority_count": sum(1 for p in category_data["priority_levels"] if p <= 2),
                    "unique_improvements": len(set(str(imp) for imp in category_data["improvements"])),
                    "top_improvements": list(set(
                        imp["improvement"] for resp in category_data["responses"] 
                        for imp in resp.get("improvements", [])
                    ))[:3]
                }
        
        summary["feedback_analysis"][feedback_id] = {
            "average_satisfaction_score": avg_score,
            "submission_count": feedback_data["submission_count"],
            "overall_sentiment_score": overall_sentiment,
            "categories": category_summaries
        }
    
    return summary

def main():
    # Generate training data
    print("Generating training data...")
    data_generator = EnhancedMockDataGenerator()
    
    # Define questions with proper categories
    questions = [
        {
            "questionId": "q1",
            "text": "How satisfied are you with your work environment?",
            "questionType": "SINGLE_CHOICE",
            "category": "WORK_ENVIRONMENT",
            "choices": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
        },
        {
            "questionId": "q2",
            "text": "Which workplace benefits are most important to you?",
            "questionType": "MULTIPLE_CHOICE",
            "category": "WORK_LIFE_BALANCE",
            "choices": ["Flexible Working Hours", "Remote Work Options", "Health Insurance", 
                       "Professional Development", "Gym Membership", "Mental Health Support"]
        },
        {
            "questionId": "q3",
            "text": "What suggestions do you have for improving team collaboration?",
            "questionType": "TEXT_BASED",
            "category": "TEAM_COLLABORATION",
            "choices": []
        },
        {
            "questionId": "q4",
            "text": "How do you feel about the current project management approach?",
            "questionType": "SENTIMENT",
            "category": "PROJECT_MANAGEMENT",
            "choices": ["POSITIVE", "NEUTRAL", "NEGATIVE"]
        }
    ]
    
    # Generate training data
    training_data = []
    for i in range(500):  # Generate 500 submissions
        submission = data_generator.generate_submission(f"fb{i}", questions)
        training_data.append(submission)
    
    # Save training data to file
    with open("enhanced_training_data.json", "w") as f:
        json.dump({"submissions": training_data}, f, indent=2, cls=NumpyEncoder)
    
    # Initialize and train analyzer
    print("\nInitializing and training analyzer...")
    analyzer = FeedbackAnalyzer()
    analyzer.train("enhanced_training_data.json")
    
    # First analyze a single test submission
    print("\nAnalyzing single test submission...")
    test_submission = {
        "id": "test123",
        "feedbackId": "fb123",
        "submittedBy": "employee123",
        "responses": {
            "q1": "Very Satisfied",
            "q2": "Health Insurance, Remote Work, Professional Development",
            "q3": "We should have more regular team meetings and use collaboration tools more effectively.",
            "q4": "POSITIVE"
        },
        "questionDetails": questions,
        "overallComments": "Overall satisfied but team collaboration could be improved."
    }
    
    single_result = analyzer.analyze_submission(test_submission)
    print("\nSingle Submission Analysis:")
    print(json.dumps(single_result, indent=2, cls=NumpyEncoder))
    
    # Now analyze bulk submissions
    print("\nAnalyzing bulk submissions (100 feedbacks)...")
    bulk_summary = analyze_bulk_feedback(analyzer, data_generator, questions, 100)
    print("\nBulk Analysis Summary:")
    print(json.dumps(bulk_summary, indent=2, cls=NumpyEncoder))

if __name__ == "__main__":
    main() 