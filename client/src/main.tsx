import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Providers from "./context/providers.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/pages/error.tsx";
import Login from "./components/pages/login.tsx";
import Home from "./components/pages/home.tsx";
import SignUp from "./components/pages/signup.tsx";
import Dashboard from "./components/pages/dashboard.tsx";
import MotionContainer from "./components/layout/motion-container.tsx";
import Shorten from "./components/pages/shorten.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Providers>
        <App />
      </Providers>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: (
          <MotionContainer>
            <Login />
          </MotionContainer>
        ),
      },
      {
        path: "/",
        element: (
          <MotionContainer>
            <Home />
          </MotionContainer>
        ),
      },
      {
        path: "/signup",
        element: (
          <MotionContainer>
            <SignUp />
          </MotionContainer>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <MotionContainer>
            <Dashboard />
          </MotionContainer>
        ),
      },
      {
        path: "/shorten",
        element: (
          <MotionContainer>
            <Shorten />
          </MotionContainer>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
