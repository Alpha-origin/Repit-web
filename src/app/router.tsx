import { createBrowserRouter } from "react-router-dom";
import App from "@/pages/App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <div>페이지를 찾을 수 없어요!</div>, // 404 page
  },
]);

export default router;
