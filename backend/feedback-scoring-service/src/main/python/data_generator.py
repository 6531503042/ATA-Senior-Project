import json
import random
from datetime import datetime, timedelta
import uuid

class MockDataGenerator:
    def __init__(self):
        self.satisfaction_choices = [
            "Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"
        ]
        
        self.benefit_choices = [
            "Flexible Working Hours", "Remote Work Options", "Health Insurance",
            "Professional Development", "Gym Membership", "Mental Health Support",
            "Dental Insurance", "Vision Insurance", "401k Matching", "Stock Options",
            "Paid Time Off", "Parental Leave", "Education Reimbursement"
        ]
        
        self.collaboration_improvements = [
            [
                "We should have more regular team meetings",
                "Use collaboration tools more effectively",
                "Implement daily stand-ups",
                "Better communication channels needed",
                "Need more cross-team collaboration"
            ],
            [
                "The current tools work well",
                "Team communication is effective",
                "Project tracking is good",
                "Regular updates help a lot",
                "Documentation is clear"
            ],
            [
                "Communication could be improved",
                "Sometimes information gets lost",
                "Need better project management",
                "Meeting schedules are inconsistent",
                "Tool adoption is slow"
            ]
        ]
        
        self.sentiment_choices = ["POSITIVE", "NEUTRAL", "NEGATIVE"]
        
        self.overall_comment_templates = [
            "Overall, {satisfaction}. The project management is {management}. {improvement}",
            "The work environment is {satisfaction}. {improvement} Team collaboration is {management}.",
            "{satisfaction} with the current setup. {improvement} Project management could be {management}.",
            "From my perspective, {satisfaction}. {improvement} The overall approach is {management}."
        ]
        
        self.satisfaction_phrases = {
            "high": [
                "I'm very satisfied",
                "things are working great",
                "I'm really happy",
                "the environment is excellent"
            ],
            "medium": [
                "things are okay",
                "it's generally satisfactory",
                "most things work well",
                "the situation is acceptable"
            ],
            "low": [
                "I'm not very satisfied",
                "things could be better",
                "there are significant issues",
                "improvements are needed"
            ]
        }
        
        self.management_phrases = {
            "high": [
                "very effective",
                "well-organized",
                "highly efficient",
                "working great"
            ],
            "medium": [
                "adequate",
                "mostly effective",
                "reasonably good",
                "working okay"
            ],
            "low": [
                "needs improvement",
                "not very effective",
                "could be better",
                "somewhat disorganized"
            ]
        }
        
        self.improvement_suggestions = {
            "high": [
                "Minor tweaks could make things even better.",
                "A few small adjustments would help.",
                "Some fine-tuning would be beneficial.",
                "Small improvements could enhance the experience."
            ],
            "medium": [
                "Several areas could use improvement.",
                "Some processes need refinement.",
                "Moderate changes would help.",
                "There's room for enhancement."
            ],
            "low": [
                "Significant changes are needed.",
                "Major improvements are required.",
                "Substantial reforms would help.",
                "Critical changes should be implemented."
            ]
        }

    def generate_timestamp(self, start_date="2025-01-01", end_date="2025-12-31"):
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        time_between = end - start
        days_between = time_between.days
        random_days = random.randrange(days_between)
        random_time = start + timedelta(days=random_days)
        return random_time.isoformat()

    def generate_overall_comment(self, satisfaction_level):
        satisfaction = random.choice(self.satisfaction_phrases[satisfaction_level])
        management = random.choice(self.management_phrases[satisfaction_level])
        improvement = random.choice(self.improvement_suggestions[satisfaction_level])
        
        template = random.choice(self.overall_comment_templates)
        return template.format(
            satisfaction=satisfaction,
            management=management,
            improvement=improvement
        )

    def generate_collaboration_text(self, sentiment):
        if sentiment == "POSITIVE":
            phrases = self.collaboration_improvements[0]
        elif sentiment == "NEUTRAL":
            phrases = self.collaboration_improvements[1]
        else:
            phrases = self.collaboration_improvements[2]
            
        num_phrases = random.randint(1, 3)
        selected_phrases = random.sample(phrases, num_phrases)
        return " ".join(selected_phrases) + "."

    def generate_submission(self, feedback_id, user_id):
        # Determine overall sentiment for consistency
        base_sentiment = random.choices(
            ["high", "medium", "low"],
            weights=[0.4, 0.4, 0.2]
        )[0]
        
        # Generate consistent responses
        satisfaction = random.choices(
            self.satisfaction_choices,
            weights=[0.3, 0.3, 0.2, 0.1, 0.1] if base_sentiment == "high" else
                    [0.1, 0.3, 0.3, 0.2, 0.1] if base_sentiment == "medium" else
                    [0.1, 0.1, 0.2, 0.3, 0.3]
        )[0]
        
        num_benefits = random.randint(2, 5)
        benefits = ", ".join(random.sample(self.benefit_choices, num_benefits))
        
        sentiment = random.choices(
            self.sentiment_choices,
            weights=[0.7, 0.2, 0.1] if base_sentiment == "high" else
                    [0.2, 0.6, 0.2] if base_sentiment == "medium" else
                    [0.1, 0.2, 0.7]
        )[0]
        
        collaboration_text = self.generate_collaboration_text(sentiment)
        
        return {
            "id": random.randint(1, 10000),
            "feedbackId": feedback_id,
            "submittedBy": str(user_id),
            "responses": {
                "1": satisfaction,
                "2": benefits,
                "3": collaboration_text,
                "4": sentiment
            },
            "overallComments": self.generate_overall_comment(base_sentiment),
            "submittedAt": self.generate_timestamp(),
            "updatedAt": None
        }

    def generate_feedback(self):
        return {
            "id": 1,
            "title": "Employee Satisfaction Survey",
            "description": "Annual employee satisfaction and feedback survey",
            "project": {
                "id": random.randint(1, 100),
                "questions": [],
                "name": f"Project {random.choice(['Alpha', 'Beta', 'Gamma', 'Delta'])}",
                "description": "Project to improve workplace environment",
                "memberIds": list(range(1, random.randint(5, 15))),
                "projectStartDate": "2025-01-01T00:00:00Z",
                "projectEndDate": "2025-12-31T23:59:59Z",
                "createdAt": "2025-01-01T00:00:00Z",
                "updatedAt": "2025-01-01T00:00:00Z"
            },
            "questionIds": [1, 2, 3, 4],
            "startDate": "2025-01-01T00:00:00",
            "endDate": "2025-12-31T23:59:59",
            "createdBy": "admin",
            "active": True,
            "createdAt": "2025-01-01T00:00:00",
            "updatedAt": "2025-01-01T00:00:00",
            "allowedUserIds": list(range(1, random.randint(5, 15)))
        }

    def generate_questions(self):
        return [
            {
                "id": 1,
                "text": "How satisfied are you with your work environment?",
                "description": "Rate your overall satisfaction with the workplace",
                "questionType": "SINGLE_CHOICE",
                "category": "WORK_ENVIRONMENT",
                "choices": self.satisfaction_choices,
                "required": True,
                "validationRules": None,
                "createdAt": "2025-01-01T00:00:00",
                "updatedAt": "2025-01-01T00:00:00"
            },
            {
                "id": 2,
                "text": "Which workplace benefits are most important to you?",
                "description": "Select all benefits that you value the most",
                "questionType": "MULTIPLE_CHOICE",
                "category": "WORK_LIFE_BALANCE",
                "choices": self.benefit_choices,
                "required": True,
                "validationRules": None,
                "createdAt": "2025-01-01T00:00:00",
                "updatedAt": "2025-01-01T00:00:00"
            },
            {
                "id": 3,
                "text": "What suggestions do you have for improving team collaboration?",
                "description": "Please provide your detailed feedback and suggestions",
                "questionType": "TEXT_BASED",
                "category": "TEAM_COLLABORATION",
                "choices": [],
                "required": True,
                "validationRules": None,
                "createdAt": "2025-01-01T00:00:00",
                "updatedAt": "2025-01-01T00:00:00"
            },
            {
                "id": 4,
                "text": "How do you feel about the current project management approach?",
                "description": "Express your sentiment about the project management methodology",
                "questionType": "SENTIMENT",
                "category": "PROJECT_MANAGEMENT",
                "choices": self.sentiment_choices,
                "required": True,
                "validationRules": None,
                "createdAt": "2025-01-01T00:00:00",
                "updatedAt": "2025-01-01T00:00:00"
            }
        ]

def generate_mock_dataset(num_submissions=1000):
    generator = MockDataGenerator()
    feedback = generator.generate_feedback()
    questions = generator.generate_questions()
    
    submissions = []
    for _ in range(num_submissions):
        user_id = random.randint(1, 100)
        submission = generator.generate_submission(feedback["id"], user_id)
        submissions.append(submission)
    
    dataset = {
        "feedback": feedback,
        "questions": questions,
        "submissions": submissions
    }
    
    return dataset

if __name__ == "__main__":
    # Generate mock dataset
    dataset = generate_mock_dataset(1000)
    
    # Save to file
    with open("mock_training_data.json", "w") as f:
        json.dump(dataset, f, indent=2)
    
    print(f"Generated {len(dataset['submissions'])} mock submissions")
    print("Data saved to mock_training_data.json") 