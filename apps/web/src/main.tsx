// Geliştirmede ?mockdrive ile sahte Drive yüklenir (src/dev/mock-drive.ts).
if (import.meta.env.DEV && location.search.includes("mockdrive")) await import("./dev/mock-drive");
if (import.meta.env.DEV && location.search.includes("demo")) await import("./dev/demo");
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
