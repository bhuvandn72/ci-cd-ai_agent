import React from "react";
import InputForm from "./components/InputForm";
import RunSummary from "./components/RunSummary";
import ScorePanel from "./components/ScorePanel";
import FixTable from "./components/FixTable";
import Timeline from "./components/Timeline";

export default function App() {
  return (
    <div className="page">
      <h1 className="title">Autonomous CI/CD Healing Agent</h1>
      <p className="subtitle">
        Run repository analysis, autonomous fixes, and CI/CD healing loops.
      </p>
      <div className="grid">
        <InputForm />
        <RunSummary />
        <ScorePanel />
        <Timeline />
      </div>
      <div style={{ marginTop: "14px" }}>
        <FixTable />
      </div>
    </div>
  );
}
