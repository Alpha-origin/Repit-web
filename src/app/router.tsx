import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import RouteErrorPage from "@/pages/error-page";
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
const InterviewCompletedPage = lazy(
  () => import("@/pages/interview-page/completed")
);
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
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/loading",
    element: <Loading />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/main",
    element: <MainLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "interview/completed",
        element: <InterviewCompletedPage />,
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
    errorElement: <RouteErrorPage />,
  },
]);

export default router;
