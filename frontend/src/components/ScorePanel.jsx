import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useRun } from "../context/RunContext";

export default function ScorePanel() {
  const { result } = useRun();
  if (!result?.score) return null;

  const data = [
    { name: "Base", value: result.score.base },
    { name: "Bonus", value: result.score.speed_bonus },
    { name: "Penalty", value: -result.score.penalty },
    { name: "Final", value: result.score.final }
  ];

  return (
    <div className="card">
      <h3>Score</h3>
      <p>
        Base: {result.score.base} | Speed Bonus: +{result.score.speed_bonus} |
        Penalty: -{result.score.penalty}
      </p>
      <p>
        <b>Final Score: {result.score.final}</b>
      </p>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" fill="#1e7d60" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
