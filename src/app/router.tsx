import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import NotFound from "@/pages/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
