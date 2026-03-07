import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import HrPlaceholderPage from "@/pages/HrPlaceholderPage";
import LoginPage from "@/pages/LoginPage";
import WelcomePage from "@/pages/WelcomePage";
import { AuthGuard, GuestGuard } from "@/router/guards";

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <WelcomePage />,
          },
          {
            path: "/hr",
            element: <HrPlaceholderPage />,
          },
        ],
      },
    ],
  },
]);
