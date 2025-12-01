import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { SoftBodyPage } from "./pages/soft-body/soft-body.tsx";
import { AgentPage } from "./pages/agent/agent.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AgentPage />,
  },
  {
    path: "/soft-body",
    element: <SoftBodyPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>
);
