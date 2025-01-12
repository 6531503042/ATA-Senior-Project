import os
import sys
from pathlib import Path

# Add virtual environment site-packages to Python path
venv_path = Path(__file__).parent.parent / "venv" / "lib" / "python3.11" / "site-packages"
sys.path.append(str(venv_path))

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from pymongo import MongoClient
from config.database_config import MONGODB_CONFIG

def test_mongodb_connection():
    try:
        # Create a MongoDB client
        client = MongoClient('mongodb://localhost:27017/')
        
        # Test the connection
        client.server_info()
        print("Successfully connected to MongoDB!")
        
        # Get database
        db = client[MONGODB_CONFIG['database']]
        print(f"Connected to database: {MONGODB_CONFIG['database']}")
        
        # Test all collections
        for collection_name in MONGODB_CONFIG['collections'].values():
            collection = db[collection_name]
            
            # Insert a test document
            test_doc = {
                "test": "connection",
                "collection": collection_name
            }
            result = collection.insert_one(test_doc)
            print(f"Successfully inserted test document in {collection_name}!")
            
            # Clean up
            collection.delete_one({"test": "connection"})
            print(f"Successfully cleaned up test document from {collection_name}!")
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Make sure MongoDB is running:")
        print("   brew services list  # Check if MongoDB is running")
        print("   brew services start mongodb-community  # Start if needed")
        print("\n2. Check MongoDB installation:")
        print("   mongosh --version  # Should show MongoDB version")
        print("\n3. Try connecting manually:")
        print("   mongosh  # Should open MongoDB shell")

if __name__ == "__main__":
    test_mongodb_connection() 