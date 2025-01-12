from typing import Dict, List
from datetime import datetime
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.collection import Collection
from config.database_config import MONGODB_CONFIG

class DatabaseService:
    def __init__(self):
        self.client = self._connect_to_mongodb()
        self.db = self.client[MONGODB_CONFIG['database']]
        
        # Initialize collections
        self.feedback_collection = self.db[MONGODB_CONFIG['collections']['feedback']]
        self.categories_collection = self.db[MONGODB_CONFIG['collections']['categories']]
        self.departments_collection = self.db[MONGODB_CONFIG['collections']['departments']]
        self.sentiment_collection = self.db[MONGODB_CONFIG['collections']['sentiment']]
        self.metrics_collection = self.db[MONGODB_CONFIG['collections']['metrics']]
        
        self._create_indexes()

    def _connect_to_mongodb(self) -> MongoClient:
        """Create MongoDB connection"""
        try:
            client = MongoClient('mongodb://localhost:27017/')
            # Test the connection
            client.server_info()
            print(f"Successfully connected to MongoDB database: {MONGODB_CONFIG['database']}")
            return client
        except Exception as e:
            print(f"Error connecting to MongoDB: {str(e)}")
            raise

    def _create_indexes(self):
        """Create necessary indexes for all collections"""
        try:
            # Feedback collection indexes
            self.feedback_collection.create_index([("feedback_id", ASCENDING)], unique=True)
            self.feedback_collection.create_index([("department", ASCENDING)])
            self.feedback_collection.create_index([("timestamp", DESCENDING)])
            self.feedback_collection.create_index([("priority", ASCENDING)])
            self.feedback_collection.create_index([("categories.category", ASCENDING)])
            
            # Categories collection indexes
            self.categories_collection.create_index([("category_name", ASCENDING)], unique=True)
            
            # Departments collection indexes
            self.departments_collection.create_index([("department_name", ASCENDING)], unique=True)
            
            # Sentiment collection indexes
            self.sentiment_collection.create_index([("timestamp", DESCENDING)])
            
            # Metrics collection indexes
            self.metrics_collection.create_index([("metric_date", DESCENDING)])
            
            print("Successfully created all database indexes")
        except Exception as e:
            print(f"Error creating indexes: {str(e)}")
            raise

    def store_feedback(self, feedback_data: Dict) -> str:
        """Store processed feedback and update related collections"""
        try:
            # Add storage timestamp
            feedback_data['stored_at'] = datetime.now().isoformat()
            
            # Store main feedback data
            result = self.feedback_collection.update_one(
                {"feedback_id": feedback_data['feedback_id']},
                {"$set": feedback_data},
                upsert=True
            )
            
            # Update category statistics
            self._update_category_stats(feedback_data)
            
            # Update department statistics
            self._update_department_stats(feedback_data)
            
            # Update sentiment trends
            self._update_sentiment_stats(feedback_data)
            
            # Update overall metrics
            self._update_metrics(feedback_data)
            
            return str(result.upserted_id) if result.upserted_id else feedback_data['feedback_id']
            
        except Exception as e:
            print(f"Error storing feedback: {str(e)}")
            raise

    def _update_category_stats(self, feedback_data: Dict):
        """Update category statistics"""
        for category in feedback_data.get('categories', []):
            self.categories_collection.update_one(
                {"category_name": category['category']},
                {
                    "$inc": {"total_count": 1},
                    "$push": {
                        "recent_feedback": {
                            "$each": [{
                                "feedback_id": feedback_data['feedback_id'],
                                "confidence": category['confidence'],
                                "timestamp": feedback_data['timestamp']
                            }],
                            "$sort": {"timestamp": -1},
                            "$slice": 100  # Keep only last 100 entries
                        }
                    }
                },
                upsert=True
            )

    def _update_department_stats(self, feedback_data: Dict):
        """Update department statistics"""
        self.departments_collection.update_one(
            {"department_name": feedback_data['department']},
            {
                "$inc": {"total_feedback": 1},
                "$push": {
                    "recent_feedback": {
                        "$each": [{
                            "feedback_id": feedback_data['feedback_id'],
                            "sentiment": feedback_data['sentiment'],
                            "priority": feedback_data['priority'],
                            "timestamp": feedback_data['timestamp']
                        }],
                        "$sort": {"timestamp": -1},
                        "$slice": 100
                    }
                }
            },
            upsert=True
        )

    def _update_sentiment_stats(self, feedback_data: Dict):
        """Update sentiment trends"""
        self.sentiment_collection.insert_one({
            "feedback_id": feedback_data['feedback_id'],
            "sentiment": feedback_data['sentiment'],
            "confidence": feedback_data['sentiment_confidence'],
            "department": feedback_data['department'],
            "timestamp": feedback_data['timestamp']
        })

    def _update_metrics(self, feedback_data: Dict):
        """Update overall metrics"""
        today = datetime.now().date().isoformat()
        self.metrics_collection.update_one(
            {"metric_date": today},
            {
                "$inc": {
                    "total_feedback": 1,
                    f"priority_{feedback_data['priority']}": 1,
                    f"sentiment_{feedback_data['sentiment'].lower()}": 1
                }
            },
            upsert=True
        )

    def get_feedback_by_id(self, feedback_id: str) -> Dict:
        """Retrieve feedback by ID"""
        return self.feedback_collection.find_one({"feedback_id": feedback_id})

    def get_feedback_by_department(self, department: str) -> List[Dict]:
        """Retrieve feedback by department"""
        return list(self.feedback_collection.find({"department": department}))

    def get_feedback_by_priority(self, priority: str) -> List[Dict]:
        """Retrieve feedback by priority level"""
        return list(self.feedback_collection.find({"priority": priority}))

    def get_feedback_by_category(self, category: str) -> List[Dict]:
        """Retrieve feedback by category"""
        return list(self.feedback_collection.find({
            "categories.category": category
        }))

    def get_feedback_by_date_range(self, start_date: str, end_date: str) -> List[Dict]:
        """Retrieve feedback within a date range"""
        return list(self.feedback_collection.find({
            "timestamp": {
                "$gte": start_date,
                "$lte": end_date
            }
        }))

    def get_feedback_stats(self) -> Dict:
        """Get feedback statistics"""
        return {
            "total_feedback": self.feedback_collection.count_documents({}),
            "by_priority": {
                "high": self.feedback_collection.count_documents({"priority": "high"}),
                "medium": self.feedback_collection.count_documents({"priority": "medium"}),
                "low": self.feedback_collection.count_documents({"priority": "low"})
            },
            "by_department": self._get_department_stats(),
            "by_category": self._get_category_stats()
        }

    def _get_department_stats(self) -> Dict:
        """Get feedback statistics by department"""
        return {
            doc["_id"]: doc["count"]
            for doc in self.feedback_collection.aggregate([
                {"$group": {"_id": "$department", "count": {"$sum": 1}}}
            ])
        }

    def _get_category_stats(self) -> Dict:
        """Get feedback statistics by category"""
        return {
            doc["_id"]: doc["count"]
            for doc in self.feedback_collection.aggregate([
                {"$unwind": "$categories"},
                {"$group": {"_id": "$categories.category", "count": {"$sum": 1}}}
            ])
        } 