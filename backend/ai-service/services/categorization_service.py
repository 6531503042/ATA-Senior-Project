from typing import List, Dict
import gc
from config.categories_config import CATEGORIES
import numpy as np

class CategorizationService:
    def __init__(self, tokenizer, model, device='cpu'):
        self.tokenizer = tokenizer
        self.model = model
        self.categories = CATEGORIES
        self.batch_size = 1
        self.max_length = 128

    def categorize(self, text: str) -> List[Dict]:
        """Categorize feedback into predefined categories"""
        results = []
        try:
            # Process categories one at a time to save memory
            for category in self.categories:
                result = self._process_single_category(text, category)
                if result:
                    results.append(result)
                gc.collect()
            
            return sorted(results, key=lambda x: x['confidence'], reverse=True)
        
        except Exception as e:
            print(f"Error in categorization: {str(e)}")
            return []

    def _process_single_category(self, text: str, category: str) -> Dict:
        try:
            premise = text[:1000]
            hypothesis = f"This feedback is about {category}."
            
            inputs = self.tokenizer(
                premise,
                hypothesis,
                return_tensors="pt",
                truncation=True,
                max_length=self.max_length,
                padding=True
            )
            
            with np.errstate(all='ignore'):
                outputs = self.model(**inputs)
                logits = outputs.logits.detach().cpu().numpy()
                predictions = self._safe_softmax(logits)
                
                entailment_score = float(predictions[0][2])
                
                if entailment_score > 0.5:
                    return {
                        'category': category,
                        'confidence': entailment_score
                    }
            
            del outputs, logits, predictions, inputs
            gc.collect()
            
            return None
                
        except Exception as e:
            print(f"Error processing category {category}: {str(e)}")
            return None

    def _safe_softmax(self, x):
        """Safe softmax implementation to avoid overflow"""
        try:
            import scipy.special
            return scipy.special.softmax(x, axis=1)
        except Exception:
            exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
            return exp_x / np.sum(exp_x, axis=1, keepdims=True)