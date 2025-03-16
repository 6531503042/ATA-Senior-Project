from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import traceback
import os

# Import API routes
from api.routes import router
from config.settings import (
    CORS_ORIGINS, CORS_METHODS, CORS_HEADERS,
    API_HOST, API_PORT, API_RELOAD, API_WORKERS
)
import core.train_model as train_model

# Get logger
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="Feedback Scoring Service",
    description="AI-powered feedback analysis service",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
)

# Include API routes
app.include_router(router)

@app.on_event("startup")
async def startup_event():
    """Initialize the feedback scoring service on startup."""
    try:
        logger.info("Starting up the Feedback Scoring Service")
        if not os.path.exists("models"):
            logger.info("Models not found. Training new models...")
            train_model.main()
        else:
            logger.info("Loading existing models...")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for all unhandled exceptions."""
    logger.error(f"Global error handler caught: {str(exc)}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "message": str(exc)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host=API_HOST, 
        port=API_PORT, 
        reload=API_RELOAD,
        workers=API_WORKERS
    ) 