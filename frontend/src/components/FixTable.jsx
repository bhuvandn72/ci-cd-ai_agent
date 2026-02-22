import React from "react";
import { useRun } from "../context/RunContext";

export default function FixTable() {
  const { result } = useRun();
  if (!result?.fixes?.length) return null;

  return (
    <div className="card">
      <h3>Fixes Applied</h3>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Bug Type</th>
            <th>Line</th>
            <th>Commit Message</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {result.fixes.map((fix, i) => (
            <tr key={`${fix.file}-${i}`}>
              <td>{fix.file || "-"}</td>
              <td>{fix.bug_type || "-"}</td>
              <td>{fix.line || "-"}</td>
              <td>{fix.commit_message || "-"}</td>
              <td className={fix.status === "Fixed" ? "ok" : "err"}>
                {fix.status === "Fixed" ? "Fixed" : "Failed"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
