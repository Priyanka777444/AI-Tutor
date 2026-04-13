"""
AdaptIQ RAG Engine
==================
LangChain + FAISS vector store for PDF ingestion and semantic retrieval.
"""

import os
from typing import Optional
import faiss
import numpy as np


class RAGEngine:
    """
    Manages PDF ingestion, embedding, and retrieval using FAISS.
    Uses sentence-transformers for local embeddings (no API cost).
    """

    def __init__(self, index_path: str = "./faiss_index"):
        self.index_path = index_path
        self.chunks: list[str] = []
        self.index: Optional[faiss.IndexFlatIP] = None
        self.embedding_dim = 384
        self._load_sample_data()

    def _get_embedder(self):
        from sentence_transformers import SentenceTransformer
        if not hasattr(self, "_embedder"):
            self._embedder = SentenceTransformer("all-MiniLM-L6-v2")
        return self._embedder

    def _load_sample_data(self):
        """Pre-load sample ML content for demo purposes."""
        sample_chunks = [
            "Supervised learning is a type of machine learning where the algorithm learns from labeled training data. Common algorithms include linear regression, decision trees, and support vector machines.",
            "A neural network consists of layers of interconnected nodes called neurons. The input layer receives data, hidden layers transform it using activation functions, and the output layer produces the final prediction.",
            "Gradient descent is an optimization algorithm used to minimize the loss function by iteratively adjusting model weights in the direction of the negative gradient.",
            "Backpropagation computes gradients of the loss function with respect to each weight using the chain rule of calculus, enabling efficient training of deep neural networks.",
            "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data. Regularization techniques like dropout and L2 penalty help prevent overfitting.",
            "The learning rate is a hyperparameter that controls how much the model weights are updated during training. Too high causes instability; too low causes slow convergence.",
        ]
        self.chunks.extend(sample_chunks)
        embedder = self._get_embedder()
        embeddings = embedder.encode(sample_chunks, normalize_embeddings=True)
        self.index = faiss.IndexFlatIP(self.embedding_dim)
        self.index.add(np.array(embeddings, dtype=np.float32))

    def add_pdf(self, pdf_bytes: bytes, filename: str) -> int:
        """Chunk a PDF and add embeddings to the FAISS index."""
        import io
        from pypdf import PdfReader
        from langchain.text_splitter import RecursiveCharacterTextSplitter

        reader = PdfReader(io.BytesIO(pdf_bytes))
        full_text = "\n".join(page.extract_text() or "" for page in reader.pages)

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        new_chunks = splitter.split_text(full_text)

        if not new_chunks:
            return 0

        embedder = self._get_embedder()
        embeddings = embedder.encode(new_chunks, normalize_embeddings=True)

        if self.index is None:
            self.index = faiss.IndexFlatIP(self.embedding_dim)

        self.index.add(np.array(embeddings, dtype=np.float32))
        self.chunks.extend(new_chunks)

        return len(new_chunks)

    def retrieve(self, query: str, k: int = 3) -> list[str]:
        """Retrieve the top-k most relevant chunks for a query."""
        if self.index is None or not self.chunks:
            return []

        embedder = self._get_embedder()
        query_embedding = embedder.encode([query], normalize_embeddings=True)

        k = min(k, len(self.chunks))
        distances, indices = self.index.search(
            np.array(query_embedding, dtype=np.float32), k
        )

        return [self.chunks[i] for i in indices[0] if i < len(self.chunks)]
