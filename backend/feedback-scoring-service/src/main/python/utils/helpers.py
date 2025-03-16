import json
import logging
import time
import functools
import asyncio
from typing import Dict, List, Any, Callable, Optional, Union
import numpy as np
from datetime import datetime

# Configure logger
logger = logging.getLogger(__name__)

def timed(func):
    """
    Decorator to measure and log the execution time of a function
    
    Args:
        func: The function to time
        
    Returns:
        Wrapped function that logs execution time
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        logger.debug(f"Function {func.__name__} took {end_time - start_time:.4f} seconds to run")
        return result
    return wrapper

def async_timed(func):
    """
    Decorator to measure and log the execution time of an async function
    
    Args:
        func: The async function to time
        
    Returns:
        Wrapped async function that logs execution time
    """
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        end_time = time.time()
        logger.debug(f"Async function {func.__name__} took {end_time - start_time:.4f} seconds to run")
        return result
    return wrapper

def retry(max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0, exceptions: tuple = (Exception,)):
    """
    Decorator for retrying a function if it raises specified exceptions
    
    Args:
        max_retries: Maximum number of retries
        delay: Initial delay between retries in seconds
        backoff: Backoff multiplier for delay
        exceptions: Tuple of exceptions to catch and retry
        
    Returns:
        Decorated function with retry logic
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            mtries, mdelay = max_retries, delay
            while mtries > 0:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    mtries -= 1
                    if mtries == 0:
                        raise
                    
                    logger.warning(f"Function {func.__name__} failed with {str(e)}. Retrying in {mdelay} seconds...")
                    time.sleep(mdelay)
                    mdelay *= backoff
            return func(*args, **kwargs)
        return wrapper
    return decorator

def async_retry(max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0, exceptions: tuple = (Exception,)):
    """
    Decorator for retrying an async function if it raises specified exceptions
    
    Args:
        max_retries: Maximum number of retries
        delay: Initial delay between retries in seconds
        backoff: Backoff multiplier for delay
        exceptions: Tuple of exceptions to catch and retry
        
    Returns:
        Decorated async function with retry logic
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            mtries, mdelay = max_retries, delay
            while mtries > 0:
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    mtries -= 1
                    if mtries == 0:
                        raise
                    
                    logger.warning(f"Async function {func.__name__} failed with {str(e)}. Retrying in {mdelay} seconds...")
                    await asyncio.sleep(mdelay)
                    mdelay *= backoff
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def batch_process(items: List[Any], batch_size: int = 10) -> List[List[Any]]:
    """
    Split a list of items into batches for processing
    
    Args:
        items: List of items to batch
        batch_size: Size of each batch
        
    Returns:
        List of batches, where each batch is a list of items
    """
    return [items[i:i + batch_size] for i in range(0, len(items), batch_size)]

def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """
    Safely load a JSON string, returning a default value if parsing fails
    
    Args:
        json_str: JSON string to parse
        default: Default value to return if parsing fails
        
    Returns:
        Parsed JSON object or default value
    """
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError) as e:
        logger.warning(f"Error parsing JSON: {str(e)}")
        return default

def format_timestamp(timestamp: Optional[Union[str, datetime, float]] = None) -> str:
    """
    Format a timestamp as an ISO 8601 string
    
    Args:
        timestamp: Timestamp to format (string, datetime, or float)
                  If None, current time is used
        
    Returns:
        Formatted timestamp string
    """
    if timestamp is None:
        dt = datetime.now()
    elif isinstance(timestamp, str):
        try:
            dt = datetime.fromisoformat(timestamp)
        except ValueError:
            # Try parsing as float
            try:
                dt = datetime.fromtimestamp(float(timestamp))
            except ValueError:
                logger.warning(f"Could not parse timestamp: {timestamp}")
                dt = datetime.now()
    elif isinstance(timestamp, datetime):
        dt = timestamp
    elif isinstance(timestamp, (int, float)):
        dt = datetime.fromtimestamp(timestamp)
    else:
        logger.warning(f"Unsupported timestamp type: {type(timestamp)}")
        dt = datetime.now()
        
    return dt.isoformat()

def normalize_score(score: float, min_val: float = 0.0, max_val: float = 1.0, 
                   target_min: float = 0.0, target_max: float = 100.0) -> float:
    """
    Normalize a score to a target range
    
    Args:
        score: Score to normalize
        min_val: Minimum value in original range
        max_val: Maximum value in original range
        target_min: Minimum value in target range
        target_max: Maximum value in target range
        
    Returns:
        Normalized score in target range
    """
    # Clip the score to the original range
    score = max(min_val, min(max_val, score))
    
    # Normalize to target range
    normalized = ((score - min_val) / (max_val - min_val)) * (target_max - target_min) + target_min
    
    # Round to one decimal place
    return round(normalized, 1)

def extract_keywords(text: str, max_keywords: int = 5) -> List[str]:
    """
    Extract keywords from text using simple frequency analysis
    
    Args:
        text: Text to extract keywords from
        max_keywords: Maximum number of keywords to extract
        
    Returns:
        List of extracted keywords
    """
    # This is a simple implementation
    # In a production system, you would use a more sophisticated approach
    if not text:
        return []
        
    # Convert to lowercase and split into words
    words = text.lower().split()
    
    # Remove common stop words (a very basic list)
    stop_words = {"the", "a", "an", "and", "or", "but", "is", "are", "was", "were", 
                 "in", "on", "at", "to", "for", "with", "by", "about", "of", "this", 
                 "that", "these", "those", "it", "they", "them", "their", "i", "we", "you"}
    
    # Count word frequencies
    word_counts = {}
    for word in words:
        # Remove punctuation
        word = word.strip(".,;:!?\"'()[]{}")
        if word and word not in stop_words and len(word) > 2:
            word_counts[word] = word_counts.get(word, 0) + 1
    
    # Sort by frequency
    sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Return top keywords
    return [word for word, count in sorted_words[:max_keywords]] 