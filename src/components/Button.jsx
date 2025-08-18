import React from "react";

// Define the props interface for clarity and type-checking

// The Button component as a functional React component
const Button = ({ text, onPress, disabled = false }) => {
  return (
    // The button element with Tailwind classes for styling
    <button
      onClick={onPress}
      disabled={disabled}
      className={`
        w-12/12
        h-[50px]
        flex 
        items-center 
        justify-center 
        rounded
        shadow-md 
        font-semibold 
        text-base 
        text-black 
   

        transition-colors
        duration-100
        hover:cursor-pointer
        hover:text-white
        uppercase
       tracking-wider
        
        // Conditional styling based on the 'disabled' prop
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-tint-light hover:bg-tint-dark"
        }
      `}>
      {text}
    </button>
  );
};

export default Button;
