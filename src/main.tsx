import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import App from "./App.tsx";
import TanstackProvider from "./components/providers/tanstack-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackProvider>
      <App />
    </TanstackProvider>
  </StrictMode>,
);
