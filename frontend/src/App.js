import Compiler from "./pages/Compiler/index";
import "./App.css";
import SignIn from "./pages/Login/Login";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import SignUp from "./pages/Login/Signup";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./features/auth/authSlice";
import { useEffect } from "react";
import Loader from "./pages/Loader/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProblemList from "./pages/Problems";
import StatementPage from "./pages/StatementPage";
import Navbar from "./pages/Navbar";
import Competitions from "./pages/Competitions";
import Competition from "./pages/Competitions/Competition";
import axios from "axios";
import { urlConstants } from "./apis";
import { getConfig } from "./utils/getConfig";
import ProfilePage from "./pages/Profile";
import Admin from "./pages/Admin";
import CompetitionStatement from "./pages/Competitions/Problems/Statement";
import CompetitionProblem from "./pages/Competitions/Problems/Statement";

function App() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifyUser = async () => {
    let user = JSON.parse(localStorage.getItem("user"))?.user;
    if (user) {
      try {
        await axios.post(
          urlConstants.getProblem,
          {
            id: "656612ed7552afc6bcbda006",
          },
          getConfig()
        );
        dispatch(loginSuccess({ user }));
      } catch (e) {
        localStorage.removeItem("user");
        dispatch(logout());
      }
    } else {
      localStorage.removeItem("user");
      dispatch(logout());
    }
  };

  const handleBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app">
      {/* <Compiler /> */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {isAuthenticated ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/statement/:id" element={<StatementPage />} />
            <Route
              path="/competition/statement/:id"
              element={<CompetitionProblem />}
            />
            <Route index element={<Navigate replace to="/problems" />} />

            <Route path="/problems" index element={<ProblemList />} />
            {/* <Route path="/problem/:id" element={<Problem />} /> */}
            <Route path="/admin/*" element={<Admin />} />

            <Route path="/compiler" element={<Compiler />} />
            <Route path="/competition/:id" element={<Competition />} />

            <Route path="/competitions" element={<Competitions />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="*" element={<Navigate replace to="/problems" />} />
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            <Route index element={<Navigate replace to="/signin" />} />
            <Route path="/signin" element={<SignIn />} />

            <Route path="/signup" element={<SignUp />} />

            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
