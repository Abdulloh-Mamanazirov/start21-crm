import { DarkMode, LightMode } from "@mui/icons-material";
import React, { useState } from "react";

const Navbar = (props) => {
  let [theme,setTheme]=useState(true)
  function handleTheme(e){
    setTheme(!theme)
    localStorage.setItem("crm-theme",theme ? "dark" : "light")
  }
  return (
    <div className="sticky top-0 z-50 py-3 bg-gray-200 flex items-center justify-around">
      <span className="text-4xl font-semibold">{props.title}</span>
      <span className="text-xl font-bold text-blue-500">
        {new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate()}
        .
        {new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1}
        .{new Date().getFullYear()}
      </span>
      <span onClick={handleTheme} className="bg-white p-2 px-2.5 rounded-full grid place-items-center hover:bg-gray-400 hover:text-white">
        {theme ? <LightMode/> : <DarkMode />}
      </span>
    </div>
  );
};

export default Navbar;
