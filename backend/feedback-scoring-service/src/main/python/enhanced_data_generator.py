import json
import random
from datetime import datetime, timedelta
import uuid

class EnhancedMockDataGenerator:
    def __init__(self):
        self.benefit_choices = [
            "Flexible Working Hours",
            "Remote Work Options",
            "Health Insurance",
            "Professional Development",
            "Gym Membership",
            "Mental Health Support",
            "Dental Insurance",
            "Vision Insurance",
            "401k Matching",
            "Stock Options",
            "Paid Time Off",
            "Parental Leave",
            "Education Reimbursement"
        ]

        self.question_categories = {
            "WORK_ENVIRONMENT": {
                "questions": [
                    "What improvements would you suggest for the physical workspace?",
                    "How can we enhance the office equipment and resources?",
                    "What changes would make your work environment more comfortable?",
                    "How can we improve workplace safety measures?"
                ],
                "descriptions": [
                    "Provide detailed feedback about workspace comfort and setup",
                    "Share your thoughts on work resources and equipment",
                    "Describe desired improvements for workspace ergonomics",
                    "Suggest improvements for workplace safety"
                ]
            },
            "WORK_LIFE_BALANCE": {
                "questions": [
                    "How can we improve work-life balance policies?",
                    "What changes would help with flexible working arrangements?",
                    "How can we enhance our leave policies?",
                    "What support would help you better manage work-life balance?"
                ],
                "descriptions": [
                    "Share suggestions for better work-life balance",
                    "Provide feedback on flexible work arrangements",
                    "Describe improvements for leave management",
                    "Suggest ways to enhance work-life support"
                ]
            },
            "TEAM_COLLABORATION": {
                "questions": [
                    "How can team communication be improved?",
                    "What would make collaboration more effective?",
                    "How can we enhance team dynamics?",
                    "What changes would make team meetings more productive?"
                ],
                "descriptions": [
                    "Provide suggestions for better team communication",
                    "Share ideas for improving collaboration",
                    "Describe ways to enhance team dynamics",
                    "Suggest improvements for team meetings"
                ]
            },
            "PROJECT_MANAGEMENT": {
                "questions": [
                    "What improvements would you suggest for project organization?",
                    "How can project objectives be made clearer?",
                    "What would help improve project timeline management?",
                    "How can resource allocation be optimized?"
                ],
                "descriptions": [
                    "Share feedback on project organization",
                    "Suggest ways to clarify project goals",
                    "Provide ideas for timeline management",
                    "Describe improvements for resource allocation"
                ]
            },
            "TECHNICAL_SKILLS": {
                "questions": [
                    "What technical training would be most beneficial?",
                    "How can technical documentation be improved?",
                    "What technical resources would help you be more effective?",
                    "How can technical support be enhanced?"
                ],
                "descriptions": [
                    "Suggest improvements for technical training",
                    "Share feedback on technical documentation",
                    "Describe needed technical resources",
                    "Provide ideas for better technical support"
                ]
            }
        }

        self.response_templates = {
            "positive": [
                "The {aspect} is working well, but could be enhanced by {improvement}. This would help improve {benefit}.",
                "While {aspect} is effective, implementing {improvement} would further enhance {benefit}.",
                "I appreciate the current {aspect}, and suggest {improvement} to maximize {benefit}.",
                "The {aspect} has been helpful, though adding {improvement} would boost {benefit}."
            ],
            "neutral": [
                "The {aspect} could be improved through {improvement}, which would help with {benefit}.",
                "Consider enhancing the {aspect} by {improvement} to better support {benefit}.",
                "There's room for improvement in {aspect} - specifically {improvement} would help with {benefit}.",
                "The {aspect} needs some adjustments, particularly {improvement} to enhance {benefit}."
            ],
            "constructive": [
                "The {aspect} needs improvement - implementing {improvement} would significantly enhance {benefit}.",
                "I strongly recommend improving {aspect} by {improvement} to better facilitate {benefit}.",
                "There are opportunities to enhance {aspect} through {improvement}, which would greatly improve {benefit}.",
                "To better support {benefit}, the {aspect} should be improved by {improvement}."
            ]
        }

        self.aspects = {
            "WORK_ENVIRONMENT": [
                "workspace layout", "office equipment", "desk setup", "lighting",
                "noise levels", "air quality", "ergonomic furniture", "meeting spaces"
            ],
            "WORK_LIFE_BALANCE": [
                "flexible hours", "remote work options", "break schedules", "vacation policy",
                "overtime management", "workload distribution", "scheduling system", "time-off requests"
            ],
            "TEAM_COLLABORATION": [
                "communication channels", "meeting structure", "team tools", "information sharing",
                "cross-team coordination", "project updates", "collaboration platforms", "team activities"
            ],
            "PROJECT_MANAGEMENT": [
                "task tracking", "deadline management", "resource planning", "project documentation",
                "milestone tracking", "risk management", "progress reporting", "team assignments"
            ],
            "TECHNICAL_SKILLS": [
                "training programs", "documentation system", "technical tools", "learning resources",
                "skill assessment", "certification support", "mentorship program", "knowledge base"
            ]
        }

        self.improvements = {
            "WORK_ENVIRONMENT": [
                "adding adjustable desks", "upgrading lighting systems", "implementing noise reduction solutions",
                "installing better ventilation", "creating more breakout spaces", "improving storage solutions",
                "updating office equipment", "enhancing meeting room technology"
            ],
            "WORK_LIFE_BALANCE": [
                "implementing flexible start times", "expanding remote work options", "introducing compressed work weeks",
                "adding mental health days", "creating better overtime policies", "improving vacation tracking",
                "developing workload management tools", "establishing clear boundaries"
            ],
            "TEAM_COLLABORATION": [
                "implementing daily check-ins", "creating structured meeting guidelines", "using better collaboration tools",
                "establishing clear communication channels", "organizing team-building activities", "improving documentation practices",
                "setting up regular feedback sessions", "creating knowledge sharing sessions"
            ],
            "PROJECT_MANAGEMENT": [
                "implementing agile methodologies", "using better project tracking tools", "creating clearer milestones",
                "improving resource allocation", "establishing better reporting systems", "enhancing risk assessment",
                "developing better estimation processes", "improving sprint planning"
            ],
            "TECHNICAL_SKILLS": [
                "providing more workshops", "creating comprehensive documentation", "offering certification programs",
                "establishing mentorship programs", "implementing peer learning sessions", "improving online resources",
                "creating skill development paths", "offering specialized training"
            ]
        }

        self.benefits = {
            "WORK_ENVIRONMENT": [
                "productivity", "comfort", "focus", "collaboration",
                "employee satisfaction", "workplace efficiency", "team interaction", "work quality"
            ],
            "WORK_LIFE_BALANCE": [
                "job satisfaction", "stress reduction", "employee retention", "mental health",
                "productivity", "team morale", "work efficiency", "personal well-being"
            ],
            "TEAM_COLLABORATION": [
                "project efficiency", "team cohesion", "knowledge sharing", "innovation",
                "problem solving", "delivery speed", "work quality", "team satisfaction"
            ],
            "PROJECT_MANAGEMENT": [
                "project success", "team coordination", "delivery time", "resource utilization",
                "stakeholder satisfaction", "quality control", "risk mitigation", "team efficiency"
            ],
            "TECHNICAL_SKILLS": [
                "work efficiency", "innovation capability", "problem-solving", "product quality",
                "team capability", "development speed", "code quality", "technical excellence"
            ]
        }

        # Add scoring mappings for different question types
        self.single_choice_mappings = {
            "Very Satisfied": 5,
            "Satisfied": 4,
            "Neutral": 3,
            "Dissatisfied": 2,
            "Very Dissatisfied": 1
        }

        self.sentiment_mappings = {
            "POSITIVE": 5,
            "NEUTRAL": 3,
            "NEGATIVE": 1
        }

        # Add question type templates
        self.question_types = {
            "SINGLE_CHOICE": {
                "choices": [
                    "Very Satisfied",
                    "Satisfied",
                    "Neutral",
                    "Dissatisfied",
                    "Very Dissatisfied"
                ]
            },
            "MULTIPLE_CHOICE": {
                "choices": self.benefit_choices
            },
            "TEXT_BASED": {
                "choices": []
            },
            "SENTIMENT": {
                "choices": [
                    "POSITIVE",
                    "NEUTRAL",
                    "NEGATIVE"
                ]
            }
        }

    def generate_question_set(self, category):
        questions = []
        question_texts = self.question_categories[category]["questions"]
        descriptions = self.question_categories[category]["descriptions"]
        
        for i in range(len(question_texts)):
            question_type = random.choice(list(self.question_types.keys()))
            
            question = {
                "id": len(questions) + 1,
                "text": question_texts[i],
                "description": descriptions[i],
                "questionType": question_type,
                "category": category,
                "choices": self.question_types[question_type]["choices"],
                "required": True
            }
            questions.append(question)
        
        return questions

    def generate_response_by_type(self, question):
        """Generate appropriate response based on question type"""
        question_type = question["questionType"]
        
        if question_type == "SINGLE_CHOICE":
            return random.choice(question["choices"])
        
        elif question_type == "MULTIPLE_CHOICE":
            num_choices = random.randint(1, min(3, len(question["choices"])))
            return ", ".join(random.sample(question["choices"], num_choices))
        
        elif question_type == "SENTIMENT":
            return random.choice(question["choices"])
        
        else:  # TEXT_BASED
            return self.generate_response(question)

    def generate_response(self, question):
        sentiment = random.choice(["positive", "neutral", "constructive"])
        template = random.choice(self.response_templates[sentiment])
        
        category = question["category"]
        aspect = random.choice(self.aspects[category])
        improvement = random.choice(self.improvements[category])
        benefit = random.choice(self.benefits[category])
        
        response = template.format(
            aspect=aspect,
            improvement=improvement,
            benefit=benefit
        )
        
        # Add some randomization to make responses more unique
        if random.random() < 0.3:
            additional_benefit = random.choice(self.benefits[category])
            response += f" This would also help with {additional_benefit}."
        
        if random.random() < 0.2:
            response += " Based on my experience, this is a critical area for improvement."
        
        return response

    def generate_submission(self, feedback_id, questions):
        """Generate a single submission with responses to all questions."""
        submission = {
            "id": str(uuid.uuid4()),
            "feedbackId": feedback_id,
            "submittedBy": f"user_{random.randint(1, 1000)}",
            "responses": {},
            "questionDetails": questions,
            "overallComments": self.generate_overall_comments(),
            "submittedAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        for question in questions:
            response = self.generate_response_by_type(question)
            submission["responses"][str(question["id"])] = response  # Convert ID to string
        
        return submission

    def generate_overall_comments(self):
        """Generate overall comments by combining feedback from different aspects."""
        category = random.choice(list(self.aspects.keys()))
        aspect = random.choice(self.aspects[category])
        improvement = random.choice(self.improvements[category])
        benefit = random.choice(self.benefits[category])
        
        template = random.choice(self.response_templates["neutral"])
        return template.format(aspect=aspect, improvement=improvement, benefit=benefit)

def generate_enhanced_dataset():
    generator = EnhancedMockDataGenerator()
    all_submissions = []
    feedback_id = 1

    # Generate submissions for each category
    for category in generator.question_categories.keys():
        questions = generator.generate_question_set(category)
        
        # Generate 100 submissions for each category
        for _ in range(100):
            submission = generator.generate_submission(feedback_id, questions)
            all_submissions.append(submission)
        
        feedback_id += 1

    # Save to file
    dataset = {
        "submissions": all_submissions,
        "metadata": {
            "total_submissions": len(all_submissions),
            "categories": list(generator.question_categories.keys()),
            "generated_at": datetime.now().isoformat()
        }
    }

    with open("enhanced_training_data.json", "w") as f:
        json.dump(dataset, f, indent=2)

    print(f"Generated {len(all_submissions)} submissions across {len(generator.question_categories)} categories")
    print("Data saved to enhanced_training_data.json")

if __name__ == "__main__":
    generate_enhanced_dataset() 