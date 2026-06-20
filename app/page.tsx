"use client";

import { useState } from "react";
import { MODEL_OPTIONS, type ModelKey } from "@/lib/models";

export default function HomePage() {
  const [adminPassword, setAdminPassword] = useState("");
  const [model, setModel] = useState<ModelKey>("fal-kling-30-pro");
  const [prompt, setPrompt] = useState("A realistic UGC fashion video, smooth handheld camera movement, consistent character and product, cinematic lighting, high detail.");
  const [imageUrl, setImageUrl] = useState("");
  const [motionUrl, setMotionUrl] = useState("");
  const [duration, setDuration] = useState("5");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword, model, prompt, imageUrl, motionUrl, duration: Number(duration), aspectRatio })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generate failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Kling Motion Control Tool</h1>
      <p className="small">Pilih model Kling 2.6 / 3.0 dari fal.ai atau Replicate. API key aman di server Vercel.</p>
      <div className="card grid">
        <label>Password Admin</label>
        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="ADMIN_PASSWORD" />

        <label>Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value as ModelKey)}>
          {MODEL_OPTIONS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>

        <label>Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />

        <label>Image URL / Start Image URL</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://...jpg/png" />

        <label>Motion Video URL / Reference Video URL</label>
        <input value={motionUrl} onChange={(e) => setMotionUrl(e.target.value)} placeholder="https://...mp4" />

        <label>Durasi</label>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="5">5 detik</option>
          <option value="10">10 detik</option>
        </select>

        <label>Rasio</label>
        <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
          <option value="9:16">9:16</option>
          <option value="16:9">16:9</option>
          <option value="1:1">1:1</option>
        </select>

        <button onClick={handleGenerate} disabled={loading}>{loading ? "Generating..." : "Generate Video"}</button>

        {error && <div className="result">Error: {error}</div>}
        {result && <div className="result">{JSON.stringify(result, null, 2)}</div>}
      </div>
    </main>
  );
}
