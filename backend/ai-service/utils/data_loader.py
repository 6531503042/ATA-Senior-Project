import json
from typing import List, Dict
from datetime import datetime

class FeedbackDataLoader:
    def __init__(self, data_path: str):
        self.data_path = data_path

    def load_feedback_data(self) -> List[Dict]:
        """Load feedback data from JSON file"""
        try:
            with open(self.data_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                return data['feedback_data']
        except Exception as e:
            print(f"Error loading feedback data: {str(e)}")
            return []

    def get_feedback_by_department(self, department: str) -> List[Dict]:
        """Filter feedback by department"""
        all_feedback = self.load_feedback_data()
        return [f for f in all_feedback if f['department'].lower() == department.lower()]

    def get_feedback_by_date_range(self, start_date: str, end_date: str) -> List[Dict]:
        """Filter feedback by date range"""
        all_feedback = self.load_feedback_data()
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        
        return [
            f for f in all_feedback 
            if start <= datetime.fromisoformat(f['timestamp']) <= end
        ] 