import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="nav-container">
      <div className="nav-left">
        {/* <span className="nav-brand">EazyBites</span> */}
        <img src="images/EazyBites.png" className="nav-name" alt="logo" />
      </div>
      <div className="nav-center">
        <img src="final_logo.png" alt="Logo" className="nav-logo" />
      </div>
      <div className="nav-right">
        <button className="nav-button">About Us</button>
        <button className="nav-button" onClick={() => navigate("/login")}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
