import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "*",
    element: <div>페이지를 찾을 수 없어요!</div>, // 404 page
  }
]);

export default router;
