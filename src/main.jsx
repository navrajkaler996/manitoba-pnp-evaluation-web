import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  ScrapedDataContext,
  ScrapedDataProvider,
} from "./context/ScrappedDataContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ScrapedDataProvider>
      <App />
    </ScrapedDataProvider>
  </StrictMode>
);
