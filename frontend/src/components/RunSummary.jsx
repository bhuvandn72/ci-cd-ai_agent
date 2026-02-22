import React from "react";
import { useRun } from "../context/RunContext";

export default function RunSummary() {
  const { result } = useRun();
  if (!result) return null;
  const badgeClass = result.ci_status === "PASSED" ? "passed" : "failed";

  return (
    <div className="card">
      <h3>Run Summary</h3>
      <p>
        <b>Repository:</b> {result.repo_url}
      </p>
      <p>
        <b>Team:</b> {result.team_name}
      </p>
      <p>
        <b>Leader:</b> {result.leader_name}
      </p>
      <p>
        <b>Branch:</b> {result.branch_name}
      </p>
      <p>
        <b>Failures:</b> {result.total_failures} | <b>Fixes:</b>{" "}
        {result.fixes_applied}
      </p>
      <p>
        <b>Time:</b> {result.time_taken}s
      </p>
      <span className={`status ${badgeClass}`}>{result.ci_status}</span>
    </div>
  );
}
