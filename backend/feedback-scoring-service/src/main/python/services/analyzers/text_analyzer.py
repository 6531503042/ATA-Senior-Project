import logging
from typing import Dict, List, Any, Optional
from textblob import TextBlob
import re
import spacy
from services.base_service import BaseService
from utils.helpers import normalize_score, extract_keywords
from collections import Counter

# Configure logger
logger = logging.getLogger(__name__)

class TextAnalyzerService(BaseService):
    """Service for analyzing text responses"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Load spaCy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
            logger.info("Loaded spaCy model successfully")
        except Exception as e:
            logger.error(f"Error loading spaCy model: {str(e)}")
            self.nlp = None
        
        # Keywords for different aspects
        self.improvement_keywords = {
            "WORK_ENVIRONMENT": ["workspace", "office", "desk", "lighting", "noise", "air", "ergonomic", "meeting", "environment", "space", "comfort"],
            "WORK_LIFE_BALANCE": ["flexible", "remote", "break", "vacation", "overtime", "workload", "schedule", "balance", "hours", "stress", "burnout", "family"],
            "TEAM_COLLABORATION": ["communication", "meeting", "collaboration", "team", "coordination", "update", "feedback", "share", "discuss", "transparency", "information"],
            "PROJECT_MANAGEMENT": ["task", "deadline", "resource", "documentation", "milestone", "risk", "planning", "timeline", "scope", "requirement", "priority", "agile", "scrum"],
            "TECHNICAL_SKILLS": ["training", "documentation", "tools", "learning", "skills", "mentorship", "knowledge", "development", "expertise", "technology", "certification"],
            "LEADERSHIP": ["manager", "leadership", "direction", "vision", "guidance", "support", "decision", "strategy", "clarity", "recognition"],
            "COMMUNICATION": ["communication", "clarity", "message", "channel", "email", "meeting", "update", "information", "transparency", "feedback"],
            "SATISFACTION": ["satisfied", "dissatisfied", "happy", "unhappy", "content", "discontent", "pleased", "displeased", "enjoy", "frustrate"],
            "IMPROVEMENTS": ["improve", "enhancement", "better", "upgrade", "fix", "change", "modify", "adjust", "revise", "update"],
            "STRENGTHS": ["strength", "good", "excellent", "positive", "well", "effective", "efficient", "success", "achievement", "accomplish"],
            "SENTIMENT": ["feel", "feeling", "emotion", "mood", "attitude", "perception", "opinion", "view", "thought", "impression"]
        }
        
        # Initialize sentiment cache
        self.sentiment_cache = {}
        
        # Initialize sentiment pipeline
        try:
            from transformers import pipeline
            self.sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
            logger.info("Initialized sentiment pipeline successfully")
        except Exception as e:
            logger.error(f"Error initializing sentiment pipeline: {str(e)}")
            self.sentiment_pipeline = None
    
    async def analyze_text_response(self, text: str, category: Optional[str] = None) -> Dict:
        """
        Analyze a text response
        
        Args:
            text: Text to analyze
            category: Optional category for context
            
        Returns:
            Dictionary with analysis results
        """
        try:
            # Check cache first
            cache_key = f"{text}_{category}" if category else text
            if cache_key in self.sentiment_cache:
                return self.sentiment_cache[cache_key]
            
            # Default values
            score = 50.0
            sentiment = "NEUTRAL"
            keywords = []
            suggestions = []
            
            # Analyze sentiment using transformer model
            if self.sentiment_pipeline:
                try:
                    # Truncate text if too long
                    truncated_text = text[:1000] if len(text) > 1000 else text
                    
                    # Get sentiment from transformer model
                    result = self.sentiment_pipeline(truncated_text)[0]
                    label = result["label"]
                    confidence = result["score"]
                    
                    # Map to our sentiment labels
                    if label == "POSITIVE" or label == "positive":
                        sentiment = "POSITIVE"
                        score = confidence * 100
                    elif label == "NEGATIVE" or label == "negative":
                        sentiment = "NEGATIVE"
                        score = (1 - confidence) * 100
                    else:
                        sentiment = "NEUTRAL"
                        score = 50.0
                    
                    # If sentiment is neutral with low confidence, try TextBlob as fallback
                    if sentiment == "NEUTRAL" and confidence < 0.7:
                        # Use TextBlob as fallback
                        blob = TextBlob(text)
                        polarity = blob.sentiment.polarity
                        
                        if polarity > 0.2:
                            sentiment = "POSITIVE"
                            score = (polarity * 50) + 50  # Scale to 50-100
                        elif polarity < -0.2:
                            sentiment = "NEGATIVE"
                            score = 50 - (abs(polarity) * 50)  # Scale to 0-50
                        else:
                            sentiment = "NEUTRAL"
                            score = 50.0
                except Exception as e:
                    logger.error(f"Error using transformer model for sentiment analysis: {str(e)}")
                    # Fallback to TextBlob
                    blob = TextBlob(text)
                    polarity = blob.sentiment.polarity
                    
                    if polarity > 0.2:
                        sentiment = "POSITIVE"
                        score = (polarity * 50) + 50  # Scale to 50-100
                    elif polarity < -0.2:
                        sentiment = "NEGATIVE"
                        score = 50 - (abs(polarity) * 50)  # Scale to 0-50
                    else:
                        sentiment = "NEUTRAL"
                        score = 50.0
            else:
                # Use TextBlob for sentiment analysis
                blob = TextBlob(text)
                polarity = blob.sentiment.polarity
                
                if polarity > 0.2:
                    sentiment = "POSITIVE"
                    score = (polarity * 50) + 50  # Scale to 50-100
                elif polarity < -0.2:
                    sentiment = "NEGATIVE"
                    score = 50 - (abs(polarity) * 50)  # Scale to 0-50
                else:
                    sentiment = "NEUTRAL"
                    score = 50.0
            
            # Extract keywords and perform deep analysis using spaCy
            if self.nlp:
                doc = self.nlp(text)
                
                # Extract important words (nouns, verbs, adjectives)
                important_words = []
                for token in doc:
                    if token.pos_ in ["NOUN", "VERB", "ADJ"] and not token.is_stop and len(token.text) > 2:
                        important_words.append(token.lemma_.lower())
                
                # Count word frequencies
                word_counts = Counter(important_words)
                
                # Get top keywords
                keywords = [word for word, count in word_counts.most_common(5)]
                
                # Perform deep analysis to extract context-specific insights
                context_insights = self._extract_context_insights(doc, category)
                
                # Generate suggestions based on content and context insights
                suggestions = self._generate_contextual_suggestions(doc, sentiment, context_insights, category)
            
            # Normalize score to 0-100 range
            score = max(0, min(100, score))
            
            # Create result dictionary
            result = {
                "score": score,
                "sentiment": sentiment,
                "keywords": keywords,
                "suggestions": suggestions
            }
            
            # Cache the result
            self.sentiment_cache[cache_key] = result
            
            return result
        except Exception as e:
            logger.error(f"Error analyzing text response: {str(e)}")
            return {
                "score": 50.0,
                "sentiment": "NEUTRAL",
                "keywords": [],
                "suggestions": []
            }
    
    def _extract_context_insights(self, doc, category: Optional[str] = None) -> Dict:
        """
        Extract deeper contextual insights from the text
        
        Args:
            doc: spaCy document
            category: Optional category for context
            
        Returns:
            Dictionary with contextual insights
        """
        insights = {
            "themes": [],
            "concerns": [],
            "strengths": [],
            "action_areas": [],
            "entities": []
        }
        
        # Extract named entities
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        insights["entities"] = entities
        
        # Extract key themes using noun chunks
        themes = []
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) > 1 and not any(word.is_stop for word in chunk):
                themes.append(chunk.text.lower())
        insights["themes"] = list(set(themes))[:5]
        
        # Extract concerns (sentences with negative sentiment)
        concerns = []
        for sent in doc.sents:
            sent_text = sent.text.strip()
            if sent_text:
                # Check for negative sentiment indicators
                negative_indicators = ["not", "no", "never", "problem", "issue", "difficult", "challenge", "lack", "poor", "bad", "wrong"]
                if any(indicator in sent_text.lower() for indicator in negative_indicators):
                    concerns.append(sent_text)
        insights["concerns"] = concerns[:3]
        
        # Extract strengths (sentences with positive sentiment)
        strengths = []
        for sent in doc.sents:
            sent_text = sent.text.strip()
            if sent_text:
                # Check for positive sentiment indicators
                positive_indicators = ["good", "great", "excellent", "best", "better", "improve", "helpful", "effective", "efficient", "success", "well"]
                if any(indicator in sent_text.lower() for indicator in positive_indicators):
                    strengths.append(sent_text)
        insights["strengths"] = strengths[:3]
        
        # Extract action areas (sentences with action verbs)
        action_areas = []
        action_verbs = ["need", "should", "must", "require", "implement", "develop", "create", "establish", "improve", "enhance", "increase", "reduce"]
        for sent in doc.sents:
            sent_text = sent.text.strip()
            if sent_text:
                if any(verb in sent_text.lower() for verb in action_verbs):
                    action_areas.append(sent_text)
        insights["action_areas"] = action_areas[:3]
        
        return insights
    
    def _generate_contextual_suggestions(self, doc, sentiment: str, insights: Dict, category: Optional[str] = None) -> List[str]:
        """
        Generate contextual suggestions based on deep text analysis
        
        Args:
            doc: spaCy document
            sentiment: Sentiment of the text
            insights: Contextual insights from the text
            category: Optional category for context
            
        Returns:
            List of contextual suggestions
        """
        suggestions = []
        
        # If positive sentiment with no concerns, provide minimal suggestions
        if sentiment == "POSITIVE" and not insights["concerns"]:
            if category:
                # Get one category-specific suggestion for positive feedback
                category_suggestions = self.get_default_recommendations(category)
                if category_suggestions:
                    return [f"Continue the current approach to {category.lower().replace('_', ' ')} while exploring {category_suggestions[0].lower().split('implement ')[1] if 'implement ' in category_suggestions[0].lower() else category_suggestions[0].lower()}"]
            return ["Continue the current approach while looking for opportunities to innovate"]
        
        # Generate suggestions from action areas (highest priority)
        if insights["action_areas"]:
            for action in insights["action_areas"]:
                # Extract the main action from the sentence
                action_doc = self.nlp(action)
                main_verb = None
                main_object = None
                
                for token in action_doc:
                    if token.pos_ == "VERB" and token.text.lower() not in ["is", "are", "was", "were", "be", "been", "am"]:
                        main_verb = token.text
                        # Find the object of this verb
                        for child in token.children:
                            if child.dep_ in ["dobj", "pobj"]:
                                # Get the full noun phrase
                                for chunk in action_doc.noun_chunks:
                                    if child in chunk:
                                        main_object = chunk.text
                                        break
                                if not main_object:
                                    main_object = child.text
                                break
                        if main_verb and main_object:
                            break
                
                if main_verb and main_object:
                    # Convert to a suggestion
                    action_verb = self._get_action_verb(main_verb)
                    suggestion = f"{action_verb} {main_object} to improve overall effectiveness"
                    suggestions.append(suggestion)
        
        # Generate suggestions from concerns
        if insights["concerns"]:
            for concern in insights["concerns"]:
                # Extract the main concern from the sentence
                concern_doc = self.nlp(concern)
                main_issue = None
                
                # Look for noun chunks that might represent the issue
                for chunk in concern_doc.noun_chunks:
                    if len(chunk.text.split()) > 1:
                        main_issue = chunk.text
                        break
                
                if not main_issue:
                    # Fallback to finding a key noun
                    for token in concern_doc:
                        if token.pos_ == "NOUN" and not token.is_stop:
                            main_issue = token.text
                            break
                
                if main_issue:
                    # Generate a suggestion to address the concern
                    suggestion = f"Address issues related to {main_issue} through structured improvement initiatives"
                    suggestions.append(suggestion)
        
        # If we have category context, add category-specific suggestions
        if category and len(suggestions) < 3:
            category_lower = category.lower().replace('_', ' ')
            
            # Check if we have any themes related to the category
            category_related_themes = [theme for theme in insights["themes"] if category_lower in theme or any(word in theme for word in category_lower.split())]
            
            if category_related_themes:
                for theme in category_related_themes[:2]:
                    suggestion = f"Develop a comprehensive approach to {theme} within the {category_lower} framework"
                    suggestions.append(suggestion)
            else:
                # Add one category-specific suggestion
                category_suggestions = self.get_default_recommendations(category)
                if category_suggestions and len(suggestions) < 3:
                    suggestions.append(category_suggestions[0])
        
        # If we still don't have enough suggestions, add generic ones based on themes
        if len(suggestions) < 3 and insights["themes"]:
            for theme in insights["themes"]:
                if len(suggestions) >= 3:
                    break
                suggestion = f"Create a structured framework for improving {theme}"
                suggestions.append(suggestion)
        
        # Ensure we have at least one suggestion
        if not suggestions:
            if category:
                return self.get_default_recommendations(category)[:3]
            return [
                "Implement a structured approach to project planning and execution",
                "Establish clear communication channels for different types of information",
                "Create standardized processes to ensure consistency and quality"
            ]
        
        # Ensure uniqueness and proper formatting
        unique_suggestions = []
        for suggestion in suggestions:
            # Ensure first letter is capitalized and ends with period
            formatted = suggestion[0].upper() + suggestion[1:]
            if not formatted.endswith('.'):
                formatted += '.'
            
            if formatted not in unique_suggestions:
                unique_suggestions.append(formatted)
        
        # Limit to top 3 suggestions
        return unique_suggestions[:3]
    
    def _get_action_verb(self, verb: str) -> str:
        """
        Convert a verb to an action verb for suggestions
        
        Args:
            verb: Original verb
            
        Returns:
            Action verb
        """
        action_verb_mapping = {
            "need": "Implement",
            "needs": "Implement",
            "needed": "Implement",
            "should": "Establish",
            "must": "Develop",
            "require": "Create",
            "requires": "Create",
            "required": "Create",
            "want": "Implement",
            "wants": "Implement",
            "wanted": "Implement",
            "like": "Consider",
            "likes": "Consider",
            "liked": "Consider",
            "improve": "Enhance",
            "improves": "Enhance",
            "improved": "Enhance",
            "increase": "Boost",
            "increases": "Boost",
            "increased": "Boost",
            "decrease": "Reduce",
            "decreases": "Reduce",
            "decreased": "Reduce",
            "enhance": "Optimize",
            "enhances": "Optimize",
            "enhanced": "Optimize",
            "implement": "Deploy",
            "implements": "Deploy",
            "implemented": "Deploy",
            "develop": "Create",
            "develops": "Create",
            "developed": "Create",
            "establish": "Institute",
            "establishes": "Institute",
            "established": "Institute",
            "create": "Develop",
            "creates": "Develop",
            "created": "Develop",
            "build": "Construct",
            "builds": "Construct",
            "built": "Construct",
            "design": "Architect",
            "designs": "Architect",
            "designed": "Architect",
            "optimize": "Streamline",
            "optimizes": "Streamline",
            "optimized": "Streamline",
            "streamline": "Optimize",
            "streamlines": "Optimize",
            "streamlined": "Optimize",
            "fix": "Resolve",
            "fixes": "Resolve",
            "fixed": "Resolve",
            "resolve": "Address",
            "resolves": "Address",
            "resolved": "Address",
            "address": "Tackle",
            "addresses": "Tackle",
            "addressed": "Tackle",
            "tackle": "Solve",
            "tackles": "Solve",
            "tackled": "Solve",
            "solve": "Fix",
            "solves": "Fix",
            "solved": "Fix"
        }
        
        verb_lower = verb.lower()
        if verb_lower in action_verb_mapping:
            return action_verb_mapping[verb_lower]
        
        # Default action verbs if no mapping found
        default_action_verbs = ["Implement", "Establish", "Develop", "Create", "Enhance", "Optimize", "Streamline", "Improve"]
        import random
        return random.choice(default_action_verbs)
    
    def _generate_suggestions_from_text(self, text: str, sentiment: str, category: Optional[str] = None) -> List[str]:
        """
        Generate suggestions based on text content
        
        Args:
            text: Text to analyze
            sentiment: Sentiment of the text
            category: Optional category for context
            
        Returns:
            List of suggestions
        """
        # If positive sentiment, fewer suggestions needed
        if sentiment == "POSITIVE":
            if category:
                return self.get_default_recommendations(category)[:1]
            return ["Continue the current approach while looking for opportunities to innovate"]
        
        # Try to extract specific issues from the text
        doc = self.nlp(text)
        
        # Look for improvement-related phrases
        improvement_phrases = []
        for sent in doc.sents:
            sent_text = sent.text.lower()
            if any(term in sent_text for term in ["improve", "better", "enhance", "increase", "need", "should", "could", "would"]):
                improvement_phrases.append(sent.text)
        
        # Generate specific suggestions based on identified issues
        specific_suggestions = []
        
        # Process improvement phrases to generate suggestions
        for phrase in improvement_phrases:
            phrase_doc = self.nlp(phrase)
            
            # Extract key verbs and nouns
            verbs = [token.lemma_ for token in phrase_doc if token.pos_ == "VERB"]
            nouns = [token.text for token in phrase_doc if token.pos_ == "NOUN"]
            
            # Generate suggestions based on extracted elements
            if "communication" in phrase.lower() or "collaborate" in phrase.lower() or "collaboration" in phrase.lower():
                specific_suggestions.append("Implement a structured communication plan with regular check-ins")
                specific_suggestions.append("Create dedicated channels for different types of team communication")
            
            if "document" in phrase.lower() or "documentation" in phrase.lower():
                specific_suggestions.append("Develop standardized templates for project documentation")
                specific_suggestions.append("Implement a centralized knowledge repository for easy access to information")
            
            if "meeting" in phrase.lower():
                specific_suggestions.append("Structure meetings with clear agendas and action items")
                specific_suggestions.append("Implement a mix of synchronous and asynchronous communication methods")
            
            if "requirement" in phrase.lower():
                specific_suggestions.append("Create a detailed requirements gathering process with stakeholder sign-off")
                specific_suggestions.append("Implement regular requirement review sessions to address changes early")
            
            if "time" in phrase.lower() or "deadline" in phrase.lower():
                specific_suggestions.append("Develop realistic project timelines with buffer periods for unexpected issues")
                specific_suggestions.append("Implement time management techniques like time-boxing for better focus")
            
            if "training" in phrase.lower() or "skill" in phrase.lower():
                specific_suggestions.append("Create personalized learning paths for team members based on their roles")
                specific_suggestions.append("Allocate dedicated time for skill development and learning")
        
        # If we found specific suggestions, use them
        if specific_suggestions:
            # Return a subset to avoid too many suggestions
            import random
            if len(specific_suggestions) > 3:
                return random.sample(specific_suggestions, 3)
            return specific_suggestions
        
        # Fallback to keyword-based suggestions
        keyword_suggestions = []
        
        # Check for keywords and generate relevant suggestions
        if any(keyword in text.lower() for keyword in ["communication", "collaborate", "team", "coordination"]):
            keyword_suggestions.append("Establish clear communication protocols for different types of information")
            keyword_suggestions.append("Implement collaborative tools that facilitate real-time information sharing")
        
        if any(keyword in text.lower() for keyword in ["document", "clarity", "information"]):
            keyword_suggestions.append("Create comprehensive documentation standards for all project artifacts")
            keyword_suggestions.append("Implement a knowledge management system for centralized information access")
        
        if any(keyword in text.lower() for keyword in ["time", "deadline", "delay", "schedule"]):
            keyword_suggestions.append("Develop more realistic project timelines with contingency buffers")
            keyword_suggestions.append("Implement agile methodologies to better adapt to changing requirements")
        
        if any(keyword in text.lower() for keyword in ["quality", "standard", "process"]):
            keyword_suggestions.append("Establish clear quality standards with measurable criteria")
            keyword_suggestions.append("Implement regular quality assurance reviews throughout the project lifecycle")
        
        if any(keyword in text.lower() for keyword in ["training", "skill", "knowledge", "learn"]):
            keyword_suggestions.append("Create a structured training program aligned with project requirements")
            keyword_suggestions.append("Implement a mentorship system pairing junior and senior team members")
        
        # If we found keyword suggestions, use them
        if keyword_suggestions:
            return keyword_suggestions[:3]
        
        # If all else fails, use category-based suggestions
        if category:
            return self.get_default_recommendations(category)
        
        # Default generic suggestions
        return [
            "Implement a structured approach to project planning and execution",
            "Establish clear communication channels for different types of information",
            "Create standardized processes to ensure consistency and quality"
        ]
    
    def get_default_recommendations(self, category: str) -> List[str]:
        """
        Get default recommendations for a category
        
        Args:
            category: Category to get recommendations for
            
        Returns:
            List of recommendations
        """
        category_lower = category.lower()
        
        recommendations_by_category = {
            "work_life_balance": [
                "Implement flexible working hours to accommodate different personal schedules",
                "Create clear boundaries between work and personal time to prevent burnout",
                "Offer remote work options to reduce commute stress and improve work-life balance",
                "Provide mental health resources and support for employees experiencing stress",
                "Organize team-building activities that respect personal time constraints"
            ],
            "team_collaboration": [
                "Schedule regular brainstorming sessions to encourage idea sharing",
                "Implement a shared project management tool to improve task visibility",
                "Create cross-functional teams to tackle complex problems",
                "Establish clear communication channels for different types of information",
                "Organize team-building activities focused on improving collaboration skills"
            ],
            "project_management": [
                "Implement agile methodologies to improve adaptability to changing requirements",
                "Create detailed project timelines with buffer periods for unexpected delays",
                "Establish clear roles and responsibilities for each team member",
                "Schedule regular status update meetings to keep everyone informed",
                "Develop a standardized documentation process for project requirements"
            ],
            "communication": [
                "Create a communication plan that outlines channels for different types of information",
                "Schedule regular one-on-one meetings between team members and managers",
                "Implement a feedback system that encourages constructive criticism",
                "Use visual aids and diagrams to communicate complex ideas",
                "Establish guidelines for effective email and messaging communication"
            ],
            "technical_skills": [
                "Provide access to online learning platforms for continuous skill development",
                "Organize regular knowledge-sharing sessions on technical topics",
                "Create a mentorship program pairing junior and senior developers",
                "Allocate time for experimentation with new technologies",
                "Support attendance at industry conferences and workshops"
            ],
            "leadership": [
                "Implement transparent decision-making processes",
                "Provide leadership training for managers and team leads",
                "Create opportunities for emerging leaders to take on challenging projects",
                "Establish regular feedback sessions between leaders and team members",
                "Develop a leadership framework that emphasizes both results and people skills"
            ],
            "personal_growth": [
                "Create individual development plans for each team member",
                "Provide budget for professional certifications and courses",
                "Implement a mentorship program for career guidance",
                "Schedule regular career development discussions",
                "Create opportunities for cross-training in different roles"
            ],
            "innovation": [
                "Allocate time for innovation and experimentation",
                "Create a process for evaluating and implementing new ideas",
                "Reward innovative thinking and creative problem-solving",
                "Establish cross-functional innovation teams",
                "Provide resources for prototyping and testing new concepts"
            ],
            "work_environment": [
                "Design collaborative spaces that facilitate teamwork",
                "Ensure ergonomic workstations for all employees",
                "Create quiet zones for focused work",
                "Implement environmental sustainability practices",
                "Provide amenities that improve workplace comfort and productivity"
            ],
            "project_satisfaction": [
                "Implement a structured requirements gathering process",
                "Create clear documentation standards for all projects",
                "Establish regular client feedback sessions throughout the project lifecycle",
                "Develop a quality assurance process for deliverables",
                "Celebrate project milestones and successes"
            ],
            "documentation": [
                "Implement a centralized knowledge management system",
                "Create standardized templates for different types of documentation",
                "Schedule regular documentation review sessions",
                "Train team members on effective documentation practices",
                "Integrate documentation into the development workflow"
            ]
        }
        
        # Find the closest matching category
        matching_category = None
        for key in recommendations_by_category.keys():
            if key in category_lower or category_lower in key:
                matching_category = key
                break
        
        if matching_category:
            # Return a random selection of 2-3 recommendations
            import random
            recommendations = recommendations_by_category[matching_category]
            return random.sample(recommendations, min(3, len(recommendations)))
        
        # Default recommendations if no matching category
        return [
            "Establish clear communication channels for different types of information",
            "Implement regular feedback sessions to identify areas for improvement",
            "Create standardized processes to ensure consistency and quality"
        ]
    
    def extract_priorities(self, text: str) -> List[Dict]:
        """
        Extract improvement priorities from text
        
        Args:
            text: Text to analyze
            
        Returns:
            List of improvement priorities
        """
        # Process the text with spaCy
        doc = self.nlp(text)
        
        # Look for priority indicators
        priorities = []
        
        # Check for explicit priority statements
        priority_indicators = ["important", "critical", "crucial", "essential", "necessary", "significant", "urgent", "priority"]
        for sent in doc.sents:
            sent_text = sent.text.lower()
            
            # Check for priority indicators
            if any(indicator in sent_text for indicator in priority_indicators):
                # Extract the main subject of the sentence
                main_subject = None
                for chunk in sent.noun_chunks:
                    if chunk.root.dep_ in ["nsubj", "dobj"]:
                        main_subject = chunk.text
                        break
                
                if main_subject:
                    priorities.append({
                        "text": main_subject,
                        "priority": "high",
                        "source": sent.text
                    })
        
        # Check for improvement statements
        improvement_indicators = ["improve", "enhance", "increase", "better", "optimize", "streamline"]
        for sent in doc.sents:
            sent_text = sent.text.lower()
            
            # Check for improvement indicators
            if any(indicator in sent_text for indicator in improvement_indicators):
                # Extract what needs to be improved
                improvement_target = None
                for token in sent:
                    if token.lemma_ in improvement_indicators and token.i < len(sent) - 1:
                        # Look for the object of the improvement verb
                        for child in token.children:
                            if child.dep_ in ["dobj", "pobj"]:
                                # Get the full noun phrase
                                for chunk in sent.noun_chunks:
                                    if child in chunk:
                                        improvement_target = chunk.text
                                        break
                                if not improvement_target:
                                    improvement_target = child.text
                                break
                
                if improvement_target:
                    priorities.append({
                        "text": f"Improve {improvement_target}",
                        "priority": "medium",
                        "source": sent.text
                    })
        
        # Check for problem statements
        problem_indicators = ["problem", "issue", "challenge", "difficulty", "concern", "trouble"]
        for sent in doc.sents:
            sent_text = sent.text.lower()
            
            # Check for problem indicators
            if any(indicator in sent_text for indicator in problem_indicators):
                # Extract the problem
                problem = None
                for token in sent:
                    if token.lemma_ in problem_indicators and token.i < len(sent) - 1:
                        # Look for what the problem is related to
                        for child in token.children:
                            if child.dep_ in ["amod", "compound"]:
                                problem = f"{child.text} {token.text}"
                                break
                        if not problem:
                            # Look for prepositional phrases
                            for child in token.children:
                                if child.dep_ == "prep":
                                    for grandchild in child.children:
                                        if grandchild.dep_ == "pobj":
                                            problem = f"{token.text} with {grandchild.text}"
                                            break
                                    if problem:
                                        break
                
                if problem:
                    priorities.append({
                        "text": f"Address {problem}",
                        "priority": "high",
                        "source": sent.text
                    })
        
        # If we couldn't extract specific priorities, look for general themes
        if not priorities:
            # Extract key noun phrases as potential improvement areas
            noun_phrases = [chunk.text for chunk in doc.noun_chunks if len(chunk.text.split()) > 1]
            
            for phrase in noun_phrases[:2]:  # Limit to top 2
                priorities.append({
                    "text": f"Focus on improving {phrase}",
                    "priority": "medium",
                    "source": "keyword"
                })
        
        # Ensure we have at least one priority
        if not priorities:
            # Extract key entities as fallback
            entities = [ent.text for ent in doc.ents]
            if entities:
                priorities.append({
                    "text": f"Address issues related to {entities[0]}",
                    "priority": "medium",
                    "source": "entity"
                })
            else:
                # Last resort - extract a key noun
                nouns = [token.text for token in doc if token.pos_ == "NOUN"]
                if nouns:
                    priorities.append({
                        "text": f"Improve {nouns[0]} processes",
                        "priority": "medium",
                        "source": "keyword"
                    })
        
        # Limit to top 3 priorities
        return priorities[:3]
    
    def is_valid_recommendation(self, text: str) -> bool:
        """
        Check if a text is a valid recommendation
        
        Args:
            text: Text to check
            
        Returns:
            True if valid recommendation, False otherwise
        """
        if not text or len(text.strip()) < 10:
            return False
        
        # Check if it's a complete sentence
        if not text[0].isupper() or not text.rstrip(".!?").strip():
            return False
        
        # Check if it contains action verbs
        action_verbs = ["implement", "create", "develop", "establish", "provide", "improve", "review", "conduct", "set", "build", "design", "optimize"]
        return any(verb in text.lower() for verb in action_verbs) 