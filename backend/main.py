"""
AdaptIQ FastAPI Backend
=======================
Reference implementation for production deployment.
In the cloud version, these endpoints are served by Supabase Edge Functions.

To run locally:
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import os

from rag import RAGEngine

app = FastAPI(title="AdaptIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = RAGEngine()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    emotion: Optional[str] = "neutral"
    engagement_score: Optional[int] = 75
    history: Optional[list[ChatMessage]] = []


@app.get("/")
async def health_check():
    return {"status": "ok", "service": "AdaptIQ API"}


@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    """Transcribe audio using OpenAI Whisper API."""
    import openai
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    audio_bytes = await audio.read()

    try:
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=(audio.filename or "audio.webm", audio_bytes, "audio/webm"),
            language="en",
        )
        return {"transcript": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and embed a PDF into the FAISS vector store."""
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    pdf_bytes = await file.read()

    try:
        chunks_added = rag.add_pdf(pdf_bytes, file.filename)
        return {"status": "success", "chunks_added": chunks_added, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat with the AI tutor using RAG-enhanced responses."""
    import openai
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    relevant_chunks = rag.retrieve(request.message, k=3)
    context = "\n\n".join(relevant_chunks) if relevant_chunks else "No specific context available."

    system_prompt = f"""You are AdaptIQ, a patient and adaptive AI tutor using the Socratic method.
Only use the provided context to answer questions. If context is insufficient, say so clearly.

Current student emotion: {request.emotion}
Current engagement score: {request.engagement_score}%

Context from knowledge base:
{context}"""

    if request.emotion == "frustrated":
        system_prompt += "\n\nThe student is frustrated. Break down your answer into numbered steps. Use very simple language. Start with 'No worries, let\\'s break this down:'"
    elif request.emotion == "bored":
        system_prompt += "\n\nThe student seems disengaged. Start with a surprising fact or analogy. Keep the response under 100 words."

    if request.engagement_score and request.engagement_score < 40:
        system_prompt += "\n\nEngagement is low. Ask the student a direct question at the end to re-engage them."

    messages = [{"role": "system", "content": system_prompt}]
    for msg in (request.history or [])[-6:]:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": request.message})

    def generate():
        stream = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=500,
            temperature=0.7,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield f"data: {delta}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/api/sessions")
async def get_sessions():
    """Return mock session history."""
    from datetime import datetime, timedelta
    return [
        {
            "id": "session-1",
            "date": (datetime.now() - timedelta(days=2)).isoformat(),
            "duration": 2340,
            "avg_engagement": 78,
            "emotion_distribution": {"focused": 65, "bored": 15, "frustrated": 8, "neutral": 12},
            "topic": "Machine Learning Basics",
        },
        {
            "id": "session-2",
            "date": (datetime.now() - timedelta(days=5)).isoformat(),
            "duration": 1800,
            "avg_engagement": 62,
            "emotion_distribution": {"focused": 48, "bored": 30, "frustrated": 12, "neutral": 10},
            "topic": "Neural Networks",
        },
    ]
