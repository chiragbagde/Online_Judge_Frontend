import {
  createBrowserRouter,
  redirect,
  Navigate,
  Outlet,
  useLocation,
  useNavigationType
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Navbar from "./pages/Navbar";

import Home from "./pages/Home";
import SignIn from "./pages/Login/Login";
import SignUp from "./pages/Login/Signup";
import ForgotPassword from "./pages/Login/forgot-password";
import ProblemList from "./pages/Problems";
import Problem from "./pages/Problems";
import StatementPage from "./pages/StatementPage";
import Competitions from "./pages/Competitions";
import Competition from "./pages/Competitions/Competition";
import CompetitionProblem from "./pages/Competitions/Problems/Statement";
import Admin from "./pages/Admin";
import Compiler from "./pages/Compiler";
import ProfilePage from "./views/profile";
import Analytics from "./pages/Analytics";
import BlogsComponent from "./pages/Blogs";
import BlogForm from "./pages/Blogs/BlogForm";
import BlogDetail from "./pages/Blogs/BlogDetail";
import LearningJourneys from "./pages/LearningJourneys";
import Community from "./pages/Community";
import LessonContent from './pages/LearningJourneys/LessonContent';
import ModuleContent from './pages/LearningJourneys/ModuleContent';

const checkAuth = () =>
  !!(localStorage.getItem("user") && localStorage.getItem("token"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Only scroll to top on route changes that aren't popstate (back/forward)
    if (navType !== 'POP') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname, navType]);

  return null;
};

const AppLayout = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const isAuth = user || checkAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {isAuth && <Navbar />}
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <SignIn />,
        loader: () => (checkAuth() ? redirect("/home") : null),
      },
      {
        path: "signup",
        element: <SignUp />,
        loader: () => (checkAuth() ? redirect("/home") : null),
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
        loader: () => (checkAuth() ? redirect("/home") : null),
      },

      {
        path: "home",
        element: <Home />,
        loader: () => (!checkAuth() ? redirect("/") : null),
      },
      {
        path: "problems",
        children: [
          {
            index: true,
            element: <ProblemList />,
            loader: () => (!checkAuth() ? redirect("/") : null),
          },
          {
            path: "search",
            element: <Problem />,
            loader: () => (!checkAuth() ? redirect("/") : null),
          },
          {
            path: "statement/:id",
            element: <StatementPage />,
            loader: () => (!checkAuth() ? redirect("/") : null),
          },
        ],
      },
      {
        path: "competitions",
        children: [
          {
            index: true,
            element: <Competitions />,
            loader: () => (!checkAuth() ? redirect("/") : null),
          },
          {
            path: ":id",
            element: <Competition />,
            loader: () => (!checkAuth() ? redirect("/") : null),
          },
          {
            path: ":c_id/statement/:id",
            element: <CompetitionProblem />,
            loader: () => (!checkAuth() ? redirect("/") : null),
          },
        ],
      },
      {
        path: "statement/*",
        element: <CompetitionProblem />,
        loader: () => (!checkAuth() ? redirect("/") : null),
      },
      {
        path: "blogs",
        children: [
          {
            index: true,
            element: <BlogsComponent />,
            loader: () => (checkAuth() ? null : redirect("/")),
          },
          {
            path: "new",
            element: <BlogForm />,
            loader: () => (checkAuth() ? null : redirect("/")),
          },
          {
            path: ":slug",
            element: <BlogDetail />,
            loader: () => checkAuth() || redirect("/signin")
          },
          {
            path: "edit/:id/:slug",
            element: <BlogForm editMode={true} />,
            loader: () => checkAuth() || redirect("/signin")
          }
        ]
      },
      {
        path: "admin/*",
        element: <Admin />,
        loader: () => (!checkAuth() ? redirect("/") : null),
      },
      {
        path: "compiler",
        element: <Compiler />,
        loader: () => (!checkAuth() ? redirect("/") : null),
      },
      {
        path: "profile",
        element: <ProfilePage />,
        loader: () => (!checkAuth() ? redirect("/") : null),
      },
      {
        path: "analytics",
        element: <Analytics />,
        loader: () => (!checkAuth() ? redirect("/") : null),
      },
      {
        path: "learning-journeys",
        children: [
          {
            index: true,
            element: <LearningJourneys />
          },
          {
            path: ':pathId',
            element: <LearningJourneys />
          },
          {
            path: ':pathId/modules/:moduleId',
            element: <ModuleContent />
          },
          {
            path: ':pathId/modules/:moduleId/lessons/:lessonId',
            element: <LessonContent />
          }
        ],
      },
      {
        path: "community",
        element: <Community />,
        loader: () => (!checkAuth() ? redirect("/") : null),
      },

      // Fallback route
      {
        path: "*",
        element: <Navigate to={checkAuth() ? "/home" : "/"} replace />,
      },
    ],
  },
]);
