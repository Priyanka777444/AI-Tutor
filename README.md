# AdaptIQ — AI Tutor That Actually Sees You

AdaptIQ is a full-stack, multi-modal AI tutoring web application that watches your engagement in real-time via webcam, detects emotional states (focused, bored, frustrated), and dynamically adapts how it teaches — simplifying explanations when you're stuck, injecting curiosity when you're bored, and asking follow-up questions when engagement drops.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React)                      │
│                                                             │
│  ┌──────────────────┐        ┌────────────────────────┐    │
│  │   Webcam Panel   │        │      Chat Panel        │    │
│  │  ┌────────────┐  │        │  ┌──────────────────┐  │    │
│  │  │ Emotion    │  │        │  │  GPT-4o Messages  │  │    │
│  │  │ Detection  │  │  ───►  │  │  Adaptive Tone   │  │    │
│  │  │ (Simulated)│  │        │  │  RAG Context     │  │    │
│  │  └────────────┘  │        │  └──────────────────┘  │    │
│  │  ┌────────────┐  │        │  ┌──────────────────┐  │    │
│  │  │ Engagement │  │        │  │  Whisper STT     │  │    │
│  │  │   Gauge    │  │        │  │  Web Speech TTS  │  │    │
│  │  └────────────┘  │        │  └──────────────────┘  │    │
│  └──────────────────┘        └────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                        │
│                                                             │
│  ┌──────────────────┐    ┌─────────────────────────────┐   │
│  │  Supabase Auth   │    │      Edge Functions         │   │
│  │  (Anonymous)     │    │  ┌────────────────────────┐ │   │
│  └──────────────────┘    │  │  adaptiq-chat          │ │   │
│                           │  │  → Llama 3 + System    │ │   │
│  ┌──────────────────┐    │  │    Prompt Adaptation   │ │   │
│  │  PostgreSQL DB   │    │  └────────────────────────┘ │   │
│  │  - sessions      │    │  ┌────────────────────────┐ │   │
│  │  - chat_messages │    │  │  adaptiq-transcribe    │ │   │
│  │  - knowledge_docs│    │  │  → Groq API            │ │   │
│  └──────────────────┘    │  └────────────────────────┘ │   │
│                           └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Local / Optional)             │
│  main.py  ←→  rag.py (LangChain + FAISS + Sentence         │
│                         Transformers)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup Instructions

### Frontend (React + Vite)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173` by default.

### Backend (Optional — FastAPI)

The cloud version uses Supabase Edge Functions for all AI operations. The FastAPI backend is provided for local development or self-hosting.

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

---

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example` if present):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the FastAPI backend, set:

```bash
export GROQ_API_KEY=your-groq-key
export OPENAI_API_KEY=sk-your-openai-key
```

For the Supabase Edge Functions, the `GROQ_API_KEY` and `OPENAI_API_KEY` can be set via the Supabase dashboard under Project Settings → Edge Functions → Secrets. Alternatively, paste your keys in the **Settings** page of the app — they're stored locally in your browser and sent with each request.

---

## Adding Your Own PDF to the Knowledge Base

1. Navigate to the **Knowledge** page (`/knowledge`)
2. Drag and drop your PDF onto the upload zone, or click to browse
3. Wait for the status to change from **Processing** to **Ready**
4. The document is now chunked and embedded — the AI will reference it automatically during sessions

To test retrieval, use the **Search** box at the bottom of the Knowledge page to find the top 3 matching text chunks for any query.

---

## Demo Mode

Demo Mode simulates a full learning session without requiring a camera or API keys.

**To toggle Demo Mode:**
- Click the lightning bolt icon (⚡) at the bottom of the sidebar navigation
- When active, it glows amber

**What Demo Mode does:**
- Cycles through emotion states every 8 seconds: Focused → Bored → Focused → Frustrated → Focused → Neutral
- Adds realistic noise to engagement scores (45–92% range)
- Returns pre-written AI responses tailored to each emotion state
- Pre-loads 3 sample knowledge documents about Machine Learning
- Shows 3 pre-filled sessions in the Analytics page

Demo Mode is enabled by default when you first open the app.

---

## Pages Overview

| Page | Path | Description |
|------|------|-------------|
| Landing | `/` | Hero page, feature overview, CTA |
| Session | `/session` | Main tutoring interface with webcam + chat |
| Knowledge | `/knowledge` | PDF upload and RAG retrieval testing |
| Analytics | `/analytics` | Session history, emotion charts, topic cloud |
| Settings | `/settings` | API key, teaching style, TTS toggle |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| UI Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router v6 |
| Auth | Supabase Anonymous Auth |
| Database | Supabase PostgreSQL |
| AI Backend | Supabase Edge Functions (Deno) |
| LLM | Groq Llama 3 |
| Speech STT | OpenAI Whisper API |
| Speech TTS | Web Speech API (SpeechSynthesis) |
| RAG (local) | LangChain + FAISS + Sentence Transformers |
| Font | Inter (Google Fonts) |
