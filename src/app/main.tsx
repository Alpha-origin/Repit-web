import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "../pages/App.tsx";
import "../shared/index.css";
import { theme } from "../style/theme";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
);
