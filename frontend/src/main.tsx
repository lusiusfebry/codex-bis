import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@/index.css";
import { Toaster } from "@/components/ui/toaster";
import { router } from "@/router";
import { useAuthStore } from "@/stores/authStore";

async function bootstrap() {
  await useAuthStore.getState().initializeAuth();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster />
    </React.StrictMode>,
  );
}

void bootstrap();
