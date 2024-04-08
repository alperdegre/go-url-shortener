import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Providers from "./components/context/providers.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/pages/error.tsx";
import Login from "./components/pages/login.tsx";
import Home from "./components/pages/home.tsx";
import SignUp from "./components/pages/signup.tsx";
import Dashboard from "./components/pages/dashboard.tsx";
import About from "./components/pages/about.tsx";
import MotionContainer from "./components/layout/motion-container.tsx";

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
        path: "/about",
        element: (
          <MotionContainer>
            <About />
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
