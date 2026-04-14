import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { theme } from "../style/theme"; 
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>,
);