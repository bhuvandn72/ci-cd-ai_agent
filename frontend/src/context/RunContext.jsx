import React, { createContext, useContext, useMemo, useState } from "react";

const RunContext = createContext(null);

export function RunProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const value = useMemo(
    () => ({ loading, setLoading, result, setResult }),
    [loading, result]
  );
  return <RunContext.Provider value={value}>{children}</RunContext.Provider>;
}

export function useRun() {
  const ctx = useContext(RunContext);
  if (!ctx) {
    throw new Error("useRun must be used inside RunProvider");
  }
  return ctx;
}
