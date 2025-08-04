import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React app configured incorrectly");
const root = createRoot(rootElement); // or add ! at the end

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
