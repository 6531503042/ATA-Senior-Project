import json
import numpy as np
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import spacy
from collections import defaultdict
import re

class FeedbackAnalyzer:
    def __init__(self):
        # Load spaCy model for NLP tasks
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            # If model not found, download it
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize classifiers
        self.priority_classifier = RandomForestClassifier()
        self.vectorizer = TfidfVectorizer(max_features=1000)
        
        # Keywords for different aspects
        self.improvement_keywords = {
            "WORK_ENVIRONMENT": ["workspace", "office", "desk", "lighting", "noise", "air", "ergonomic", "meeting"],
            "WORK_LIFE_BALANCE": ["flexible", "remote", "break", "vacation", "overtime", "workload", "schedule"],
            "TEAM_COLLABORATION": ["communication", "meeting", "collaboration", "team", "coordination", "update"],
            "PROJECT_MANAGEMENT": ["task", "deadline", "resource", "documentation", "milestone", "risk", "planning"],
            "TECHNICAL_SKILLS": ["training", "documentation", "tools", "learning", "skills", "mentorship", "knowledge"]
        }
        
        self.sentiment_weights = {
            "positive": 5,
            "neutral": 3,
            "negative": 1
        }

        # Add scoring mappings
        self.single_choice_mappings = {
            "Very Satisfied": 5,
            "Satisfied": 4,
            "Neutral": 3,
            "Dissatisfied": 2,
            "Very Dissatisfied": 1,
            "5": 5,  # Numeric mappings
            "4": 4,
            "3": 3,
            "2": 2,
            "1": 1
        }

        self.sentiment_mappings = {
            "POSITIVE": 5,
            "NEUTRAL": 3,
            "NEGATIVE": 1
        }

        # Add solution suggestions for different categories
        self.solution_suggestions = {
            "WORK_ENVIRONMENT": {
                "workspace": [
                    "Implement an open office layout with dedicated quiet zones",
                    "Install adjustable standing desks and ergonomic chairs",
                    "Create more collaborative spaces and meeting rooms"
                ],
                "lighting": [
                    "Install adjustable LED lighting systems",
                    "Maximize natural light through window optimization",
                    "Add task lighting at individual workstations"
                ],
                "noise": [
                    "Install sound-absorbing panels and dividers",
                    "Designate quiet zones for focused work",
                    "Implement noise masking systems"
                ],
                "air quality": [
                    "Upgrade HVAC systems with better filtration",
                    "Install air quality monitors",
                    "Regular maintenance of ventilation systems"
                ]
            },
            "WORK_LIFE_BALANCE": {
                "flexible hours": [
                    "Implement core hours with flexible start/end times",
                    "Allow work-from-home options",
                    "Create clear flexible working policies"
                ],
                "workload": [
                    "Regular workload assessments",
                    "Implement project management tools",
                    "Cross-training team members for better distribution"
                ],
                "breaks": [
                    "Encourage regular break schedules",
                    "Create comfortable break areas",
                    "Implement break-tracking software"
                ]
            },
            "TEAM_COLLABORATION": {
                "meetings": [
                    "Establish regular team sync-ups",
                    "Implement efficient meeting protocols",
                    "Use collaborative meeting tools"
                ],
                "communication": [
                    "Adopt team chat platforms",
                    "Set up knowledge sharing sessions",
                    "Create communication guidelines"
                ],
                "tools": [
                    "Implement project management software",
                    "Use collaborative document platforms",
                    "Set up version control systems"
                ]
            },
            "PROJECT_MANAGEMENT": {
                "planning": [
                    "Implement agile methodologies",
                    "Use sprint planning techniques",
                    "Create detailed project roadmaps"
                ],
                "tracking": [
                    "Use project tracking software",
                    "Implement regular status updates",
                    "Set up milestone tracking"
                ],
                "resources": [
                    "Regular resource allocation reviews",
                    "Create resource management plans",
                    "Implement capacity planning"
                ]
            },
            "TECHNICAL_SKILLS": {
                "training": [
                    "Establish regular training programs",
                    "Create mentorship opportunities",
                    "Provide access to online learning platforms"
                ],
                "documentation": [
                    "Implement documentation standards",
                    "Create knowledge base systems",
                    "Regular documentation reviews"
                ],
                "tools": [
                    "Regular tool evaluation and updates",
                    "Provide tool-specific training",
                    "Create tool usage guidelines"
                ]
            }
        }

    def train(self, training_data_path):
        """Train the model using the generated dataset."""
        with open(training_data_path, 'r') as f:
            data = json.load(f)
        
        # Prepare training data for priority classification
        X_texts = []
        y_priorities = []
        
        for submission in data['submissions']:
            for question in submission['questionDetails']:
                response = submission['responses'].get(question['questionId'])
                if response and question['questionType'] == 'TEXT_BASED':
                    X_texts.append(response)
                    
                    # Determine priority based on sentiment and improvement suggestions
                    sentiment_score = self._analyze_sentiment(response)
                    num_suggestions = len(self._extract_improvements(response))
                    
                    if sentiment_score < 0.2 or num_suggestions >= 3:
                        priority = 3  # High priority
                    elif sentiment_score < 0.6 or num_suggestions >= 2:
                        priority = 2  # Medium priority
                    else:
                        priority = 1  # Low priority
                        
                    y_priorities.append(priority)
        
        if X_texts:  # Only train if we have text responses
            # Transform text data and train priority classifier
            X_vectors = self.vectorizer.fit_transform(X_texts)
            self.priority_classifier.fit(X_vectors, y_priorities)
            
            print(f"Model trained on {len(X_texts)} responses")
        else:
            print("No text responses found for training")

    def analyze_response(self, question_id, question_text, response_text, category, question_type, choices=None):
        """Analyze a single response and provide detailed insights."""
        # Initialize base metrics
        sentiment_score = 0.0
        satisfaction_score = 0
        keywords = []
        improvements = []
        
        # Handle different question types
        if question_type == "SINGLE_CHOICE":
            satisfaction_score = self.single_choice_mappings.get(response_text, 3)
            sentiment_score = (satisfaction_score - 1) / 4  # Normalize to 0-1
            
        elif question_type == "MULTIPLE_CHOICE":
            if choices:
                selected = set(response_text.split(", "))
                satisfaction_score = int((len(selected) / len(choices)) * 5)
                sentiment_score = len(selected) / len(choices)
            
        elif question_type == "SENTIMENT":
            satisfaction_score = self.sentiment_mappings.get(response_text, 3)
            sentiment_score = (satisfaction_score - 1) / 4
            
        else:  # TEXT_BASED
            sentiment_score = self._analyze_sentiment(response_text)
            keywords = self._extract_keywords(response_text, category)
            improvements = self._extract_improvements(response_text)
            satisfaction_score = self._calculate_satisfaction_score(sentiment_score, len(improvements))
        
        # Determine priority level
        priority = self._determine_priority(response_text) if question_type == "TEXT_BASED" else \
                  3 if satisfaction_score <= 2 else \
                  2 if satisfaction_score == 3 else 1
        
        return {
            "questionId": question_id,
            "question": question_text,
            "response": response_text,
            "questionType": question_type,
            "category": category,
            "satisfactionScore": satisfaction_score,
            "analysis": {
                "sentiment": self._get_sentiment_label(sentiment_score),
                "keywords": keywords,
                "improvements": improvements,  # Now contains both improvements and solutions
                "priorityLevel": priority
            }
        }

    def analyze_submission(self, submission):
        """Analyze an entire submission and provide a summary."""
        analyses = []
        total_satisfaction = 0
        priority_counts = defaultdict(int)
        all_improvements = defaultdict(list)
        
        for detail in submission['questionDetails']:
            analysis = self.analyze_response(
                detail['questionId'],
                detail['text'],
                submission['responses'].get(detail['questionId'], ''),
                detail['category'],
                detail['questionType'],
                detail.get('choices', [])
            )
            analyses.append(analysis)
            
            total_satisfaction += analysis['satisfactionScore']
            priority_counts[int(analysis['analysis']['priorityLevel'])] += 1
            
            # Collect improvements by category
            if analysis['analysis']['improvements']:
                all_improvements[detail['category']].extend(analysis['analysis']['improvements'])
        
        # Calculate average satisfaction score (0-100 scale)
        avg_satisfaction = (total_satisfaction / len(analyses)) * 20
        
        # Analyze overall comments if present
        if submission.get('overallComments'):
            overall_sentiment = self._analyze_sentiment(submission['overallComments'])
            overall_improvements = self._extract_improvements(submission['overallComments'])
            
            # Add overall improvements to respective categories
            for improvement in overall_improvements:
                # Determine category based on keywords
                matched_category = None
                for category, keywords in self.improvement_keywords.items():
                    if any(keyword in improvement['improvement'].lower() for keyword in keywords):
                        matched_category = category
                        break
                
                if matched_category:
                    all_improvements[matched_category].append(improvement)
        
        # Determine top priority categories
        priority_ranking = []
        for category, improvements in all_improvements.items():
            if improvements:  # Only include categories with improvements
                avg_priority = self._calculate_category_priority(improvements)
                priority_ranking.append({
                    "category": category,
                    "priority": int(avg_priority),
                    "suggestions": list(set(improvement['improvement'] for improvement in improvements))  # Remove duplicates
                })
        
        # Sort by priority (highest first)
        priority_ranking.sort(key=lambda x: x['priority'], reverse=True)
        
        return {
            "submissionId": submission['id'],
            "totalSatisfactionScore": round(avg_satisfaction, 2),
            "priorityAnalysis": {
                "topCategory": priority_ranking[0]['category'] if priority_ranking else None,
                "priorityRanking": priority_ranking,
                "priorityCounts": {int(k): v for k, v in priority_counts.items()}
            },
            "summary": self._generate_summary(avg_satisfaction, priority_ranking),
            "detailedAnalyses": analyses
        }

    def _analyze_sentiment(self, text):
        """Analyze sentiment of text and return score between 0 and 1."""
        blob = TextBlob(text)
        # Normalize from [-1, 1] to [0, 1]
        return (blob.sentiment.polarity + 1) / 2

    def _extract_keywords(self, text, category):
        """Extract relevant keywords from text based on category."""
        doc = self.nlp(text.lower())
        keywords = []
        
        # Get category-specific keywords
        category_keywords = self.improvement_keywords.get(category, [])
        
        # Extract noun phrases and relevant keywords
        for chunk in doc.noun_chunks:
            if any(keyword in chunk.text for keyword in category_keywords):
                keywords.append(chunk.text)
        
        # Add individual relevant words
        for token in doc:
            if token.text in category_keywords:
                keywords.append(token.text)
        
        return list(set(keywords))  # Remove duplicates

    def _extract_improvements(self, text):
        """Extract improvement suggestions from text with solutions."""
        doc = self.nlp(text.lower())
        improvements = []
        
        # Look for improvement-related patterns
        improvement_patterns = [
            r"should\s+\w+",
            r"could\s+\w+",
            r"need\s+to\s+\w+",
            r"improve\s+\w+",
            r"implement\s+\w+",
            r"suggest\s+\w+",
            r"recommend\s+\w+",
            r"would\s+help\s+\w+",
            r"would\s+be\s+better\s+\w+",
            r"requires\s+\w+",
            r"lacks\s+\w+",
            r"missing\s+\w+"
        ]
        
        for pattern in improvement_patterns:
            matches = re.finditer(pattern, text.lower())
            for match in matches:
                # Get the full phrase around the suggestion
                start = max(0, match.start() - 30)
                end = min(len(text), match.end() + 30)
                phrase = text[start:end].strip()
                
                # Clean and format the improvement text
                improvement = self._clean_improvement_text(phrase)
                
                # Find relevant solutions
                solutions = self._find_solutions(improvement)
                
                if solutions:
                    improvements.append({
                        "improvement": improvement,
                        "solutions": solutions
                    })
        
        return improvements

    def _find_solutions(self, improvement_text):
        """Find relevant solutions for an improvement area."""
        solutions = []
        improvement_lower = improvement_text.lower()
        
        for category, areas in self.solution_suggestions.items():
            for area, suggestions in areas.items():
                if area in improvement_lower or any(keyword in improvement_lower for keyword in area.split()):
                    solutions.extend(suggestions)
                    if len(solutions) >= 3:  # Limit to top 3 most relevant solutions
                        return solutions[:3]
        
        return solutions

    def _clean_improvement_text(self, text):
        """Clean and format improvement text."""
        # Remove extra whitespace and capitalize first letter
        text = " ".join(text.split())
        return text[0].upper() + text[1:]

    def _determine_priority(self, text):
        """Determine priority level based on text analysis."""
        # Convert text to vector
        vector = self.vectorizer.transform([text])
        return self.priority_classifier.predict(vector)[0]

    def _calculate_satisfaction_score(self, sentiment_score, num_improvements):
        """Calculate satisfaction score (1-5 scale)."""
        # Base score from sentiment
        base_score = sentiment_score * 5
        
        # Adjust based on number of improvements suggested
        if num_improvements >= 3:
            base_score = max(1, base_score - 1)
        elif num_improvements == 0:
            base_score = min(5, base_score + 0.5)
        
        return round(base_score)

    def _get_sentiment_label(self, sentiment_score):
        """Convert sentiment score to label."""
        if sentiment_score >= 0.7:
            return "Positive"
        elif sentiment_score >= 0.4:
            return "Neutral"
        else:
            return "Negative"

    def _calculate_category_priority(self, improvements):
        """Calculate priority level for a category based on improvements."""
        if len(improvements) >= 3:
            return 3
        elif len(improvements) >= 1:
            return 2
        return 1

    def _generate_summary(self, satisfaction_score, priority_ranking):
        """Generate a human-readable summary of the analysis."""
        summary_parts = [f"The overall satisfaction score is {satisfaction_score}%."]
        
        if priority_ranking:
            top_priority = priority_ranking[0]
            summary_parts.append(
                f"{top_priority['category']} needs the most improvement, "
                f"with a focus on {', '.join(top_priority['suggestions'][:2])}."
            )
            
            if len(priority_ranking) > 1:
                second_priority = priority_ranking[1]
                summary_parts.append(
                    f"{second_priority['category']} is another area to address."
                )
        
        return " ".join(summary_parts)

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)

# Example usage
if __name__ == "__main__":
    analyzer = FeedbackAnalyzer()
    
    # Train the model
    analyzer.train("enhanced_training_data.json")
    
    # Load some test data
    with open("enhanced_training_data.json", 'r') as f:
        data = json.load(f)
    
    # Analyze a submission
    test_submission = data['submissions'][0]
    analysis = analyzer.analyze_submission(test_submission)
    
    # Print results
    print("\nAnalysis Results:")
    print(json.dumps(analysis, indent=2, cls=NumpyEncoder)) 