import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Loading from "@/shared/components/loading";

// Layout
const MainLayout = lazy(() => import("@/app/layout/main-layout"));

// Auth
const LoginPage = lazy(() => import("@/pages/auth-page/login-page"));
const SignUpPage = lazy(() => import("@/pages/auth-page/signup-page"));

// Landing
const LandingPage = lazy(() => import("@/pages/landing-page"));

// Main
const MainPage = lazy(() => import("@/pages/main-page"));
const MyPage = lazy(() => import("@/pages/my-page"));

// Interview
const InterviewPage = lazy(() => import("@/pages/interview-page/interview"));
const SettingInterview = lazy(
  () => import("@/pages/interview-page/setting-interview")
);

// Feedback
const FeedbackListPage = lazy(
  () => import("@/pages/feedback-page/feedback-list")
);
const FeedbackOverallPage = lazy(
  () => import("@/pages/feedback-page/feedback-overall")
);
const FeedbackDetailPage = lazy(
  () => import("@/pages/feedback-page/feedback-detail")
);

// Error
const NotFound = lazy(() => import("@/pages/not-found"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/loading",
    element: <Loading />,
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
        path: "interview/:id",
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
            path: "overall/:id",
            element: <FeedbackOverallPage />,
          },
          {
            path: "detail/:id",
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
