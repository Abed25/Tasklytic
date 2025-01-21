import React, { createContext, useState, useEffect, useContext } from "react";

// Create a Context for screen width
const ScreenWidthContext = createContext();

// Create a Provider component
export const ScreenWidthProvider = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener on mount
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScreenWidthContext.Provider value={width}>
      {children}
    </ScreenWidthContext.Provider>
  );
};

// Custom hook to use screen width context
export const useScreenWidth = () => {
  return useContext(ScreenWidthContext);
};
