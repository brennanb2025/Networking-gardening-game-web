import React, { createContext, useContext } from "react";

// Define the general configuration interface
interface Config {
  rows: number;
  columns: number;
  plantImages: { [key: number]: string };
  outreachColorRanges: {
    lessThanZero: string;
    zeroToTen: string;
    tenToThirty: string;
    aboveThirty: string;
  };
}

// Default configuration values
const defaultConfig: Config = {
  rows: 20,
  columns: 20,
  plantImages: {
    1: "/plants/cactus.png",
    2: "/plants/redwood.png",
    3: "/plants/evergreen.png",
    4: "/plants/strawberry.png",
    5: "/plants/flower_bush.png",
  },
  outreachColorRanges: {
    lessThanZero: "#ff000050", // Color for less than 0 days (red)
    zeroToTen: "#ffff0050", // Color for 0 to 10 days (yellow)
    tenToThirty: "#00ff0050", // Color for 10 to 30 days (green)
    aboveThirty: "#0000ff50",  // Color for more than 30 days (blue)
  },
};

// Create the context
const ConfigContext = createContext<Config | undefined>(undefined);

// Create a provider component
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfigContext.Provider value={defaultConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

// Create a custom hook to use the context
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
