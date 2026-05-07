import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import NotFound from "../pages/NotFound";

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
