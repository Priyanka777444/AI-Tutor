import { useState, useRef } from "react";
import { Upload, FileText, Trash2, CheckCircle, Clock, Search, AlertCircle, BookOpen } from "lucide-react";
import type { KnowledgeDoc } from "../types";
import { MOCK_KNOWLEDGE_DOCS } from "../lib/mockData";

const SAMPLE_CHUNKS = [
  {
    doc: "machine_learning_basics.pdf",
    text: "Supervised learning is a type of machine learning where the algorithm learns from labeled training data to make predictions or classifications on new, unseen data.",
    score: 0.94,
  },
  {
    doc: "neural_networks_intro.pdf",
    text: "A neural network consists of layers of interconnected nodes (neurons) that process information. The input layer receives data, hidden layers transform it, and the output layer produces predictions.",
    score: 0.87,
  },
  {
    doc: "deep_learning_guide.pdf",
    text: "Backpropagation is the algorithm used to train neural networks by computing gradients of the loss function with respect to each weight using the chain rule of calculus.",
    score: 0.81,
  },
];

function StatusBadge({ status }: { status: KnowledgeDoc["status"] }) {
  if (status === "ready")
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-400">
        <CheckCircle size={12} /> Ready
      </span>
    );
  if (status === "processing")
    return (
      <span className="flex items-center gap-1 text-xs text-yellow-400">
        <Clock size={12} className="animate-spin" /> Processing
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs text-red-400">
      <AlertCircle size={12} /> Error
    </span>
  );
}

export function Knowledge() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(MOCK_KNOWLEDGE_DOCS);
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof SAMPLE_CHUNKS | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".pdf")) return;
    const newDoc: KnowledgeDoc = {
      id: Math.random().toString(36).slice(2),
      filename: file.name,
      page_count: Math.floor(Math.random() * 30) + 5,
      upload_date: new Date().toISOString(),
      status: "processing",
      chunks_count: 0,
    };
    setDocs((prev) => [newDoc, ...prev]);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === newDoc.id
            ? { ...d, status: "ready", chunks_count: Math.floor(Math.random() * 60) + 20 }
            : d
        )
      );
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 900));
    setSearchResults(SAMPLE_CHUNKS);
    setIsSearching(false);
  };

  const removeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  const totalChunks = docs.filter((d) => d.status === "ready").reduce((a, d) => a + d.chunks_count, 0);

  return (
    <div className="min-h-screen bg-[#0f0f13] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Knowledge Base</h1>
          <p className="text-white/40 text-sm">Upload PDFs to power RAG-based answers during your sessions</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Documents", value: docs.length, sub: `${docs.filter((d) => d.status === "ready").length} ready` },
            { label: "Total Chunks", value: totalChunks, sub: "Vector embeddings" },
            { label: "Total Pages", value: docs.reduce((a, d) => a + d.page_count, 0), sub: "Indexed content" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
              <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
              <div className="text-sm text-white/60">{label}</div>
              <div className="text-xs text-white/30 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
            dragOver
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-white/10 hover:border-indigo-500/50 hover:bg-white/2"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
          <Upload size={36} className={`mx-auto mb-3 ${dragOver ? "text-indigo-400" : "text-white/20"}`} />
          <p className={`font-medium mb-1 ${dragOver ? "text-indigo-400" : "text-white/50"}`}>
            {dragOver ? "Drop to upload" : "Drag & drop PDF here"}
          </p>
          <p className="text-sm text-white/30">or click to browse — PDF files only</p>
        </div>

        <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl mb-6">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Uploaded Documents</h2>
            </div>
            <span className="text-xs text-white/30">{docs.length} files</span>
          </div>

          {docs.length === 0 ? (
            <div className="py-12 text-center text-white/30 text-sm">
              No documents yet. Upload a PDF to get started.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{doc.filename}</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {doc.page_count} pages · {doc.chunks_count} chunks · {formatDate(doc.upload_date)}
                    </p>
                  </div>
                  <StatusBadge status={doc.status} />
                  <button
                    onClick={() => removeDoc(doc.id)}
                    className="text-white/20 hover:text-red-400 transition-colors p-1.5"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Search size={16} className="text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Test Retrieval</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search your knowledge base..."
              className="flex-1 bg-[#12121a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {searchResults && (
            <div className="space-y-3">
              <p className="text-xs text-white/40">Top 3 matching chunks:</p>
              {searchResults.map((result, i) => (
                <div key={i} className="bg-[#12121a] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-indigo-400 font-medium">{result.doc}</span>
                    <span className="text-xs text-emerald-400 font-medium">{(result.score * 100).toFixed(0)}% match</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{result.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
