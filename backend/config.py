import os
from pathlib import Path
from dotenv import load_dotenv

# Define root and backend env paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent

# Load server-side environment variables
# Server secrets must strictly stay on the backend and are never returned to clients
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(BACKEND_DIR / ".env")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://xjculsqvgwxebatfagne.supabase.co")
# Server-side database access token
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY", "")

def get_active_ai_provider() -> tuple[str, str]:
    """
    Internal helper to determine the pre-configured backend AI provider.
    Secret credentials are kept purely on the server and are NEVER exposed to the frontend.
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        return "openai", openai_key

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key:
        return "gemini", gemini_key

    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_key:
        return "anthropic", anthropic_key

    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        return "groq", groq_key

    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_key:
        return "openrouter", openrouter_key

    return "workos_engine", ""
