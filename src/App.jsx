import { useEffect, createContext, useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import HomePage from './Pages/Homepage.jsx'
import Signup from './Pages/Signup.jsx'
import Login from "./Pages/Login.jsx";
import Timepicker from "./Pages/Timepicker.jsx";
import Viewer from "./Pages/viewer.jsx"
import Alldata from "./Pages/Alldata.jsx";
import Admin from "./Pages/Admin.jsx"
import Spin from "./Pages/Spin.jsx"


export const Context = createContext();

export default function App() {

const [isLogin, setIsLogin] = useState(false); 
 

 


useEffect(() => {
  // Check if the value is already true in localStorage
  const storedValue = localStorage.getItem('isLogin') === 'true';
  if (storedValue) {
    setIsLogin(true); // Set state to true if stored value is true
  }
}, []);

  return(
    
      <Context.Provider value={[isLogin, setIsLogin]}>
        <Routes>
          
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/Signup" element={<Signup />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/Time" element={<Timepicker />} />
          <Route exact path="/view" element={<Viewer />} />
          <Route exact path="/data" element={<Alldata />} />
          <Route exact path="/Admin" element={<Admin />} />
          <Route exact path="/s" element={<Spin />} />
          
          
        </Routes>
      </Context.Provider>

  )
}