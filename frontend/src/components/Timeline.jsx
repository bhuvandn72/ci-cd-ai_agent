import React from "react";
import { useRun } from "../context/RunContext";

export default function Timeline() {
  const { result } = useRun();
  if (!result?.timeline?.length) return null;

  return (
    <div className="card">
      <h3>CI/CD Timeline</h3>
      <table>
        <thead>
          <tr>
            <th>Iteration</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {result.timeline.map((item) => (
            <tr key={`${item.iteration}-${item.timestamp}`}>
              <td>
                {item.iteration}/{result.iterations}
              </td>
              <td className={item.status === "success" ? "ok" : "err"}>
                {item.status}
              </td>
              <td>{item.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
