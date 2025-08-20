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
import Result from "./pages/Result";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className=" bg-white min-h-screen">
        <Navbar />

        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
