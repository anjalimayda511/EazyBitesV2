import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/Hero/HeroSection";

function App() {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    </>
  );
}

export default App;