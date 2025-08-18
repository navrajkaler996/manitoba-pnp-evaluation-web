import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";

function App() {
  return (
    <BrowserRouter>
      <div className=" bg-white min-h-screen">
        <nav className=" bg-white flex h-[60px] p-4 mb-8"></nav>

        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
