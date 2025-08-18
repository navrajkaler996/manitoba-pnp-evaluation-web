import React from "react";

// Import the image directly. This path assumes the image is in src/assets
import manitobaImage from "../assets/manitoba-welcome-screen.png";
import { useNavigate } from "react-router-dom";

// Placeholder for a navigation function.

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log("Get Started button pressed!");

    navigate("/questionnaire");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 font-nunito-regular">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto mt-[10px]">
        <img
          src={manitobaImage}
          alt="Manitoba Welcome Screen"
          className="w-3/5 h-[300px] object-contain mb-10"
        />

        <div className="px-2">
          <h1 className="font-semibold text-2xl tracking-wide mb-4">
            Hoping to secure a {"\n"}Manitoba Provincial nomination?
          </h1>
          <p className="font-semibold text-base tracking-wide text-gray-600 mt-8">
            Take a free evaluation {"\n"}to know what are your chances!
          </p>
        </div>
      </div>

      <div className="fixed bottom-16">
        <button
          onClick={handleGetStarted}
          className="bg-tint-light text-black font-semibold py-3 px-30 uppercase tracking-wide  shadow-lg hover:bg-tint-dark hover:cursor-pointer hover:text-white transition-colors duration-100">
          Get started
        </button>
      </div>
    </div>
  );
};

export default Home;
