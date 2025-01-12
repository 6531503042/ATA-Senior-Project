1. First, create a new virtual environment with Python 3.10 (which has better compatibility):
```
# If you don't have Python 3.10 installed, install it first
# On macOS with Homebrew:
brew install python@3.10

# Create virtual environment with Python 3.10
python3.10 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

2. Install the required packages:
```
pip install -r requirements.txt
```

3. Upgrade pip and install wheel:
```
pip install --upgrade pip wheel

pip install wheel
```
If you still encounter issues, we can try an alternative approach using conda:
```
# Create conda environment
conda create -n feedback_analyzer python=3.10
conda activate feedback_analyzer

# Install PyTorch
conda install pytorch cpuonly -c pytorch

# Install other requirements
pip install transformers==4.36.2 pandas scipy protobuf==3.20.3 sentencepiece

```
After setting up the environment successfully, you can run the program with:
```
python main.py
```
