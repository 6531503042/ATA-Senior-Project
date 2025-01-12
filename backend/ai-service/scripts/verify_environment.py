import sys
import os
from pathlib import Path

def verify_environment():
    print("Current working directory:", os.getcwd())
    print("\nPython executable:", sys.executable)
    print("\nPython path:")
    for path in sys.path:
        print(f"  - {path}")
    
    print("\nChecking required packages:")
    packages = [
        'pymongo',
        'torch',
        'transformers',
        'numpy',
        'pandas',
        'scipy',
        'python-dotenv'
    ]
    
    for package in packages:
        try:
            module = __import__(package)
            print(f"✓ {package} (version: {module.__version__})")
        except ImportError:
            print(f"✗ {package} (not installed)")
        except AttributeError:
            print(f"✓ {package} (version unknown)")

if __name__ == "__main__":
    verify_environment() 