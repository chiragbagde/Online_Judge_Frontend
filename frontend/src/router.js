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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const UnprotectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const AppLayout = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {isAuthenticated && <Navbar />}
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
        element: <UnprotectedRoute><SignIn /></UnprotectedRoute>,
      },
      {
        path: "signup",
        element: <UnprotectedRoute><SignUp /></UnprotectedRoute>,
      },
      {
        path: "forgot-password",
        element: <UnprotectedRoute><ForgotPassword /></"UnprotectedRoute">,
      },
      {
        path: "home",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: "problems",
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <ProblemList />,
          },
          {
            path: "search",
            element: <Problem />,
          },
          {
            path: "statement/:id",
            element: <StatementPage />,
          },
        ],
      },
      {
        path: "competitions",
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Competitions />,
          },
          {
            path: ":id",
            element: <Competition />,
          },
          {
            path: ":c_id/statement/:id",
            element: <CompetitionProblem />,
          },
        ],
      },
      {
        path: "statement/*",
        element: <ProtectedRoute><CompetitionProblem /></ProtectedRoute>,
      },
      {
        path: "blogs",
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <BlogsComponent />,
          },
          {
            path: "new",
            element: <BlogForm />,
          },
          {
            path: ":slug",
            element: <BlogDetail />,
          },
          {
            path: "edit/:id/:slug",
            element: <BlogForm editMode={true} />,
          }
        ]
      },
      {
        path: "admin/*",
        element: <ProtectedRoute><Admin /></ProtectedRoute>,
      },
      {
        path: "compiler",
        element: <ProtectedRoute><Compiler /></ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: "analytics",
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: "learning-journeys",
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
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
        element: <ProtectedRoute><Community /></ProtectedRoute>,
      },
      {
        path: "*",
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);
