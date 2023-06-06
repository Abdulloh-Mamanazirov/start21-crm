import axios from "axios";
import {ScaleLoader} from "react-spinners"
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Componenets/Sidebar";
import Courses from "./Pages/Courses";
import Groups from "./Pages/Groups";
import GroupStudents from "./Pages/GroupStudents";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import News from "./Pages/News";
import Students from "./Pages/Students";
import Teachers from "./Pages/Teachers";

function App() {
  let navigate = useNavigate();
  let location = useLocation();
  let [loading, setLoading] = useState();

  useEffect(() => {
    let token = localStorage.getItem("start21-token");
    if (!token) return navigate("/log-in");
    async function get() {
      let { data } = await axios.get("/stats");
      setLoading(data);
    }
    get();
  }, []);

  return (
    <>
      {loading === undefined ? (
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <ScaleLoader color="rgb(14, 134, 233)" />
          </div>
        </div>
      ) : (
        <div className="layout">
          {location.pathname !== "/log-in" && <Sidebar />}
          <div>
            <Routes>
              <Route path="/log-in" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupStudents />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/news" element={<News />} />
              <Route path="/students" element={<Students />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
