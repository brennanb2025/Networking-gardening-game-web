// src/components/PlantMenu.tsx
import React from "react";
import Plant from "./Plant";
import "./PlantMenu.css";

const PlantMenu: React.FC = () => {
  const plants = [1,2,3,4,5]

  return (
    <div className="plant-menu">
      {plants.map((plant, index) => (
        <Plant key={index} plantType={plant} />
      ))}
    </div>
  );
};

export default PlantMenu;
