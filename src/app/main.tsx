import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import { GlobalStyle } from "@/app/styles/GlobalStyle";
import { theme } from "@/app/styles/theme";
import {Suspense} from "react";
import Loading from "@/shared/components/loading";

import router from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
    <GlobalStyle />
  </ThemeProvider>,
);
