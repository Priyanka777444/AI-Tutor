/*
  # AdaptIQ Core Database Schema

  ## Overview
  Creates the foundational tables for the AdaptIQ AI Tutor application.

  ## New Tables

  ### sessions
  Stores each tutoring session with engagement and emotion data.
  - id: unique session identifier
  - user_id: links to auth.users (anonymous or authenticated)
  - date: when the session occurred
  - duration: session length in seconds
  - avg_engagement: average engagement score (0-100)
  - emotion_distribution: JSON breakdown of time spent in each emotion state
  - topic: detected or entered topic for the session

  ### chat_messages
  Stores all chat messages within sessions.
  - id: unique message identifier
  - session_id: foreign key to sessions
  - user_id: for RLS
  - role: 'user' or 'assistant'
  - content: message text
  - emotion: detected emotion at time of message
  - timestamp: when message was sent

  ### knowledge_docs
  Tracks uploaded PDF documents for the RAG knowledge base.
  - id: unique document identifier
  - user_id: for RLS
  - filename: original file name
  - page_count: number of pages in PDF
  - upload_date: when uploaded
  - status: 'processing' | 'ready' | 'error'
  - chunks_count: number of text chunks created

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data via auth.uid() check
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date timestamptz DEFAULT now(),
  duration integer DEFAULT 0,
  avg_engagement integer DEFAULT 0,
  emotion_distribution jsonb DEFAULT '{"focused":0,"bored":0,"frustrated":0,"neutral":0}',
  topic text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  emotion text DEFAULT 'neutral',
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS knowledge_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  page_count integer DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  chunks_count integer DEFAULT 0
);

ALTER TABLE knowledge_docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own knowledge docs"
  ON knowledge_docs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own knowledge docs"
  ON knowledge_docs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own knowledge docs"
  ON knowledge_docs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own knowledge docs"
  ON knowledge_docs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_user_id ON knowledge_docs(user_id);
