from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import os
import gc

def load_sentiment_analyzer(device='cpu'):
    try:
        # Set smaller batch size and max length
        analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=device,
            batch_size=1,
            max_length=256  # Reduced max length
        )
        gc.collect()
        return analyzer
    except Exception as e:
        print(f"Error loading sentiment analyzer: {str(e)}")
        raise

def load_category_models(device='cpu'):
    try:
        # Disable offline mode since we need to download models
        if 'TRANSFORMERS_OFFLINE' in os.environ:
            del os.environ['TRANSFORMERS_OFFLINE']
        
        # Load tokenizer with memory efficient settings
        tokenizer = AutoTokenizer.from_pretrained(
            "facebook/bart-large-mnli",
            use_fast=True,
            local_files_only=False,
            model_max_length=256  # Limit max length
        )
        gc.collect()
        
        # Load model without device_map and torch_dtype
        model = AutoModelForSequenceClassification.from_pretrained(
            "facebook/bart-large-mnli",
            local_files_only=False
        )
        gc.collect()
        
        return tokenizer, model
    except Exception as e:
        print(f"Error loading category models: {str(e)}")
        raise