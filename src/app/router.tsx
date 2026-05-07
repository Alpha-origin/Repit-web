import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/auth-page/login-page";
import SignUpPage from "@/pages/auth-page/signup-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
