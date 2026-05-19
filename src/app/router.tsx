import MainLayout from "@/app/layout/main-layout";
import LoginPage from "@/pages/auth-page/login-page";
import SignUpPage from "@/pages/auth-page/signup-page";
import FeedbackDetailPage from "@/pages/feedback-page/feddback-detail";
import FeedbackListPage from "@/pages/feedback-page/feedback-list";
import FeedbackOverallPage from "@/pages/feedback-page/feedback-overall";
import InterviewPage from "@/pages/interview-page/interview";
import SettingInterview from "@/pages/interview-page/setting-interview";
import LandingPage from "@/pages/landing-page";
import MainPage from "@/pages/main-page";
import MyPage from "@/pages/my-page";
import NotFound from "@/pages/not-found";
import { createBrowserRouter } from "react-router-dom";

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
        children: [
          {
            path: "list",
            element: <FeedbackListPage />,
          },
          {
            path: "overall/:overviewId",
            element: <FeedbackOverallPage />,
          },
          {
            path: "detail/:feedbackId",
            element: <FeedbackDetailPage />,
          },
        ],
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "setting/interview",
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
