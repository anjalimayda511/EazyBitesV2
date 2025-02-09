import React from "react";
import "./Navbar.css";

const Navbar = () => {
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
        <button className="nav-button">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
