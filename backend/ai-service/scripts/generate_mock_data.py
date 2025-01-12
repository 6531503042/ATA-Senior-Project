import os
import sys

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.mock_data_generator import MockDataGenerator

def main():
    # Create mock_data directory if it doesn't exist
    os.makedirs('data/mock_data', exist_ok=True)
    
    # Initialize generator and create 100 records
    generator = MockDataGenerator()
    output_file = 'data/mock_data/feedback_dataset_100.json'
    generator.generate_and_save(100, output_file)

if __name__ == "__main__":
    main() 