import React, { useState, useEffect } from "react";
import GridCell from "./GridCell";
import Modal from "./Modal";
import PlantInputModal from "./PlantInputModal"; // Import the new modal
import { useConfig } from "../config/AppSettings";
import { PlantObject, CreateNewPlant } from "../objects/Plant";
import "./Grid.css";

const Grid: React.FC = () => {
  const { rows, columns } = useConfig(); 
  const GRID_SIZE = rows * columns;

  const [grid, setGrid] = useState<(PlantObject | null)[]>(Array(GRID_SIZE).fill(null));
  const [selectedPlant, setSelectedPlant] = useState<PlantObject | null>(null);
  const [isInputModalOpen, setInputModalOpen] = useState(false); // State for input modal
  const [droppingPlantType, setDroppingPlantType] = useState<number | null>(null); // Track the plant type being dropped
  const [droppingPlantX, setDroppingPlantX] = useState<number | null>(null);
  const [droppingPlantY, setDroppingPlantY] = useState<number | null>(null);
  const [userid, setUserid] = useState<number>(1);

  // Fetch plants from the server
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://localhost:8080/getplantsbyuserid?userid=1");
        if (!response.ok) {
          throw new Error("Failed to fetch plants");
        }
        const plants: PlantObject[] = await response.json();
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          plants.forEach((plant) => {
            const index = plant.yCoord * rows + plant.xCoord;
            newGrid[index] = plant;
          });
          return newGrid;
        });
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlants();
  }, [rows]);

  const handleDrop = (plantType: number, index: number) => {
    // Extract grid coordinates from the index
    const xCoord = index % columns;
    const yCoord = Math.floor(index / columns);
    setDroppingPlantX(xCoord);
    setDroppingPlantY(yCoord);

    if (grid[index]) {
      alert("That space already contains a plant!");
      return;
    }

    // Set the plant type and open the input modal
    setDroppingPlantType(plantType);
    setInputModalOpen(true);

    const tempPlantObject = CreateNewPlant(
        1, // userId
        plantType,
        "", // Temporary name
        "", // Temporary notes
        100, // Default outreach duration days
        new Date().toISOString().split('T')[0], // Default next outreach time to today
        1, // stage
        xCoord,
        yCoord
    );

    // Temporarily set the grid to show the plant type while entering information
    setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[index] = tempPlantObject; // Update the grid with the temporary plant
        return newGrid;
    });
  };

  const handleInputModalSubmit = async (name: string, notes: string, outreachDurationDays: number, nextOutreachTime: string) => {
    const newPlantObject = CreateNewPlant(
      1, // userId
      droppingPlantType!,
      name,
      notes,
      outreachDurationDays,
      nextOutreachTime,
      1, // stage
      droppingPlantX!, // use captured coordinates
      droppingPlantY! // use captured coordinates
    );

    const index = droppingPlantY! * columns + droppingPlantX!;

    // Make the POST request
    try {
      const response = await fetch("http://localhost:8080/addplant", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: newPlantObject.userId.toString(),
          plantType: newPlantObject.plantType.toString(),
          name: newPlantObject.name,
          notes: newPlantObject.notes,
          outreachDurationDays: newPlantObject.outreachDurationDays.toString(),
          nextOutreachTime: newPlantObject.nextOutreachTime,
          stage: newPlantObject.stage.toString(),
          xCoord: newPlantObject.xCoord.toString(),
          yCoord: newPlantObject.yCoord.toString(),
        }).toString(),
      });

      if (!response.ok) {
        console.error("Failed to add plant", response.statusText);
      } else {
        const id: number = await response.json();
        newPlantObject.id = id;
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[index] = newPlantObject; // Update the grid with the new plant
          return newGrid;
        });
        console.log("Plant added successfully");
      }
    } catch (error) {
      console.error("Error adding plant:", error);
    }
  };

  const handleCellClick = (plant: PlantObject | null) => {
    setSelectedPlant(plant);
  };

  const closeModal = () => {
    setSelectedPlant(null);
  };

  const closeInputModal = () => {
    setInputModalOpen(false);
    const index = droppingPlantY! * columns + droppingPlantX!;
    setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[index] = null; // Remove the plant from the grid by setting it to null
        return newGrid;
      });
    setDroppingPlantType(null); // Reset the dropping plant info
    setDroppingPlantX(null);
    setDroppingPlantY(null);
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {grid.map((plant, index) => {
          // Check if the plant is temporary by comparing against the droppingPlant coordinates
          const isTemporary = (droppingPlantX === (index % columns) && droppingPlantY === Math.floor(index / columns));
          return (
            <GridCell
              key={index}
              plant={plant}
              index={index}
              onDrop={handleDrop}
              onClick={handleCellClick}
              isTemporary={isTemporary} // Pass the isTemporary prop
            />
          );
        })}
      </div>
      <Modal userid={userid} plant={selectedPlant} onClose={closeModal} />
      {isInputModalOpen && (
        <PlantInputModal onSubmit={handleInputModalSubmit} onClose={closeInputModal} />
      )}
    </div>
  );
};

export default Grid;
