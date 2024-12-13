import { useEffect, createContext, useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import HomePage from "./Pages/Homepage.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import Timepicker from "./Pages/Timepicker.jsx";
import Viewer from "./Pages/viewer.jsx";
import Alldata from "./Pages/Alldata.jsx";

import Spin from "./Pages/Spin.jsx";
import Reflection from "./Pages/Reflections.jsx";

export default function App() {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/Signup" element={<Signup />} />
      <Route exact path="/Login" element={<Login />} />
      <Route exact path="/Time" element={<Timepicker />} />
      <Route exact path="/view" element={<Viewer />} />
      <Route exact path="/data" element={<Alldata />} />
      <Route exact path="/s" element={<Spin />} />
      <Route exact path="/Reflect" element={<Reflection />} />
    </Routes>
  );
}
