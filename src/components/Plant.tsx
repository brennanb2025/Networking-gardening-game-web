// src/components/Plant.tsx
import React from "react";
import { useDrag } from "react-dnd";
import "./Plant.css";
import { useConfig } from "../config/AppSettings";

interface PlantProps {
  plantType: number;
}

const Plant: React.FC<PlantProps> = ({ plantType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PLANT",
    item: { plantType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Accessing general configuration, including plant images
  const { plantImages } = useConfig();

  return (
    <div
      ref={drag}
      className="plant"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img
        src={plantImages[plantType]}
        alt={`Plant Type ${plantType}`}
        className="plant-image"
      />
    </div>
  );
};

export default Plant;
