import type { Session, KnowledgeDoc, Message } from "../types";

export const MOCK_SESSIONS: Session[] = [
  {
    id: "mock-1",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    duration: 2340,
    avg_engagement: 78,
    emotion_distribution: { focused: 65, bored: 15, frustrated: 8, neutral: 12 },
    topic: "Machine Learning Basics",
  },
  {
    id: "mock-2",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    duration: 1800,
    avg_engagement: 62,
    emotion_distribution: { focused: 48, bored: 30, frustrated: 12, neutral: 10 },
    topic: "Neural Networks",
  },
  {
    id: "mock-3",
    date: new Date(Date.now() - 86400000 * 9).toISOString(),
    duration: 3120,
    avg_engagement: 85,
    emotion_distribution: { focused: 72, bored: 10, frustrated: 5, neutral: 13 },
    topic: "Gradient Descent",
  },
];

export const MOCK_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: "doc-1",
    filename: "machine_learning_basics.pdf",
    page_count: 24,
    upload_date: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: "ready",
    chunks_count: 48,
  },
  {
    id: "doc-2",
    filename: "neural_networks_intro.pdf",
    page_count: 16,
    upload_date: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: "ready",
    chunks_count: 32,
  },
  {
    id: "doc-3",
    filename: "deep_learning_guide.pdf",
    page_count: 38,
    upload_date: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: "ready",
    chunks_count: 76,
  },
];

export const MOCK_CHAT_MESSAGES: Message[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Hello! I'm AdaptIQ, your AI tutor. What would you like to learn today? I can see you're ready to focus — let's dive in!",
    emotion: "focused",
    timestamp: new Date(Date.now() - 60000),
  },
];

export const DEMO_EMOTION_CYCLE: Array<{ emotion: "focused" | "bored" | "frustrated" | "neutral"; engagementBase: number }> = [
  { emotion: "focused", engagementBase: 82 },
  { emotion: "bored", engagementBase: 52 },
  { emotion: "focused", engagementBase: 78 },
  { emotion: "frustrated", engagementBase: 45 },
  { emotion: "focused", engagementBase: 88 },
  { emotion: "neutral", engagementBase: 65 },
];

export const DEMO_RESPONSES: Record<string, string[]> = {
  focused: [
    "Great question! Let's explore this concept together. Machine learning models learn by adjusting weights based on errors. Can you think of how this mirrors human learning?",
    "Excellent thinking! Neural networks are inspired by the brain. Each layer extracts increasingly abstract features. What do you think the first layer might detect in an image?",
    "You're on the right track! Gradient descent finds the minimum of a loss function by iteratively moving in the direction of steepest descent. How does the learning rate affect this process?",
  ],
  bored: [
    "Did you know? The first neural network was inspired by a paper on how neurons in the human brain fire — back in 1943! What aspect of AI fascinates you most?",
    "Here's a wild fact: GPT-4 has more parameters than there are stars in the Milky Way galaxy. What would YOU teach an AI if you could?",
    "Fun perspective: every time Netflix recommends a show, a neural network is making predictions about your taste. How do you think it learned your preferences?",
  ],
  frustrated: [
    "No worries, let's break this down step by step:\n1. First, forget everything complicated\n2. Think of AI as pattern recognition\n3. It sees examples, finds patterns, makes predictions\n\nWhich step feels unclear?",
    "No worries, let's break this down step by step:\n1. A loss function measures how wrong the model is\n2. We want to make it as small as possible\n3. Gradient descent is the tool we use\n\nDoes step 1 make sense so far?",
  ],
  neutral: [
    "Interesting! Let me give you a clear explanation. The key idea here is that machines can learn from data without being explicitly programmed. What examples of this have you seen in daily life?",
    "Good topic to explore. Think of a decision tree like a flowchart of yes/no questions. At each node, the model asks a question about the data. What kind of questions do you think work best?",
  ],
};
