import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/auth-page/login-page";
import SignUpPage from "@/pages/auth-page/signup-page";
import MainLayout from "@/app/layout/main-layout";
import MainPage from "@/pages/main-page";
import InterviewPage from "@/pages/interview-page/interview";
import FeedbackPage from "@/pages/feedback";
import MyPage from "@/pages/mypage";
import SettingInterview from "@/pages/interview-page/setting-interview";
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
    path: "/main",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "interview",
        element: <InterviewPage />,
      },
      {
        path: "feedback",
        element: <FeedbackPage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "before/interview",
        element: <SettingInterview />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
