import time
from typing import List, Dict, Optional
from collections import defaultdict
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, constr
from .ai_service import generate_chat_response
from .database import get_live_grounding_context

app = FastAPI(
    title="WorkOS Outcome Intelligence Server",
    description="Domain-restricted educational outcome intelligence backend with live Supabase grounding.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory rate limiter per IP (max 30 requests per minute)
RATE_LIMIT_MAX = 30
RATE_LIMIT_WINDOW = 60
request_records: Dict[str, List[float]] = defaultdict(list)

def enforce_rate_limit(client_ip: str):
    now = time.time()
    # Filter timestamps older than the window
    request_records[client_ip] = [t for t in request_records[client_ip] if now - t < RATE_LIMIT_WINDOW]
    if len(request_records[client_ip]) >= RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a moment before sending more inquiries."
        )
    request_records[client_ip].append(now)

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$", description="Role of the message author")
    content: str = Field(..., min_length=1, max_length=3000, description="Message text")

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., min_items=1, max_items=50)
    workspace: Optional[str] = "National Skills Programme"

@app.get("/api/health")
async def health_check():
    """
    Public health check returning service operational status.
    Never exposes internal credentials, secret keys, or environment variables.
    """
    return {
        "status": "ok",
        "service": "WorkOS Outcome Intelligence Server",
        "timestamp": int(time.time())
    }

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest, request: Request):
    """
    Domain-restricted AI chat endpoint.
    Processes inquiries strictly regarding education, learning, training programs,
    courses, trainees, and platform outcome data.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    # Sanitize and prepare messages
    dict_messages = [{"role": m.role, "content": m.content.strip()} for m in req.messages]

    try:
        response = await generate_chat_response(dict_messages)
        return {
            "success": True,
            "reply": response["reply"],
            "confidence": response.get("confidence", "High"),
            "suggested_action": response.get("suggested_action")
        }
    except Exception as e:
        # Log error safely without exposing secret credentials
        print(f"Error handling chat inquiry: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while analyzing the outcome data. Please try again."
        )

@app.get("/api/context/summary")
async def context_summary():
    """
    Returns aggregated public educational and training summary metrics from the database.
    """
    context = await get_live_grounding_context()
    return {
        "success": True,
        "metrics": context.get("metrics", {})
    }
