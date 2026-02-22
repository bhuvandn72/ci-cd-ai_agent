import React, { useState } from "react";
import axios from "axios";
import { useRun } from "../context/RunContext";

const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function InputForm() {
  const { loading, setLoading, setResult } = useRun();
  const [repoUrl, setRepoUrl] = useState("");
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [error, setError] = useState("");

  async function runAgent(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/run-agent`, {
        repo_url: repoUrl,
        team_name: teamName,
        leader_name: leaderName
      });
      setResult(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Run failed. Check backend logs."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Input</h3>
      <form onSubmit={runAgent}>
        <input
          placeholder="GitHub Repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
        />
        <input
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <input
          placeholder="Team Leader Name"
          value={leaderName}
          onChange={(e) => setLeaderName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Running Agent..." : "Run Agent"}
        </button>
      </form>
      {error ? <p className="err">{error}</p> : null}
    </div>
  );
}
