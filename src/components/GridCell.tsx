import React from "react";
import { useDrop } from "react-dnd";
import { PlantObject } from "../objects/Plant";
import "./GridCell.css";
import { useConfig } from "../config/AppSettings";

interface GridCellProps {
  plant: PlantObject | null;
  index: number;
  onDrop: (plantType: number, index: number) => void;
  onClick: (plant: PlantObject | null) => void;
  isTemporary?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({ plant, index, onDrop, onClick, isTemporary }) => {
  const { plantImages, outreachColorRanges } = useConfig(); 
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "PLANT",
    drop: (item: { plantType: number }) => {
      onDrop(item.plantType, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Calculate the difference in days
  const timeDiffDays = plant // TODO: why +2?
    ? Math.floor((new Date(plant.nextOutreachTime).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 2
    : null;

  // Function to get the color based on the time difference
  const getIconColor = (days: number | null): string => {
    if (days === null) return "transparent"; // No color if no days difference
    if (days < 0) return outreachColorRanges.lessThanZero;
    if (days >= 0 && days <= 10) return outreachColorRanges.zeroToTen;
    if (days > 10 && days <= 30) return outreachColorRanges.tenToThirty;
    return outreachColorRanges.aboveThirty; // For days > 30
  };

  return (
    <div
      ref={drop}
      className={`grid-cell ${isOver && canDrop ? "drag-over" : ""} ${plant ? "occupied" : ""}`}
      onClick={() => onClick(plant)} // Open the modal on click
    >
      {plant ? (
        <>
          <img
            src={plantImages[plant.plantType]}
            alt={`Plant type ${plant.plantType}`}
            className="plant-image"
          />
          {!isTemporary && timeDiffDays !== null && (
            <div 
              className="time-diff-circle" 
              style={{ backgroundColor: getIconColor(timeDiffDays) }} // Set the background color based on the time difference
            >
              {timeDiffDays}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default GridCell;
