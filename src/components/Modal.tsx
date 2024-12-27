import React, { useState, useEffect } from "react";
import "./Modal.css";
import { PlantObject } from "../objects/Plant";
import { Outreach } from "../objects/Outreach";
import { useConfig } from "../config/AppSettings";
import { SpecialOutreach } from "../objects/SpecialOutreach";

interface ModalProps {
  userid: number;
  plant: PlantObject | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ userid, plant, onClose }) => {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [outreachDuration, setOutreachDuration] = useState("");
  const [timeDiffDays, setTimeDiffDays] = useState<number | null>(null);

  const [nextOutreachNotes, setNextOutreachNotes] = useState<string>("");
  const [pastOutreaches, setPastOutreaches] = useState<Outreach[]>([]);
  const [specialOutreaches, setSpecialOutreaches] = useState<SpecialOutreach[]>([]);
  const [addSpecialOutreachNotes, setAddSpecialOutreachNotes] = useState<string>("");
  const [addSpecialOutreachDate, setAddSpecialOutreachDate] = useState<string>(
      new Date().toISOString().split("T")[0]
  );

  // Accessing general configuration, including plant images
  const { plantImages } = useConfig();

  useEffect(() => {
    if (plant) {
      setName(plant.name);
      setNotes(plant.notes);
      setOutreachDuration(plant.outreachDurationDays.toString());

      fetchOutreaches();
      fetchSpecialOutreaches();

      // Calculate the difference in days
      // TODO: Why +2?
      const daysDiff = Math.floor((new Date(plant.nextOutreachTime).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 2;
      setTimeDiffDays(daysDiff);
    }
  }, [plant]);


  if (!plant) return null;


  const fetchOutreaches = async () => {
    try {
      const response = await fetch(
            "http://localhost:8080/getoutreachesbyplantid?plantId=" + plant.id!.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      });
      if (!response.ok) {
        throw new Error("Failed to get outreaches");
      }
      const pastOutreaches: Outreach[] = await response.json();
      setPastOutreaches(pastOutreaches);
    } catch (error) {
      console.error("Error fetching past outreaches:", error);
    }
  }

  const fetchSpecialOutreaches = async () => {
    try {
      const response = await fetch(
            "http://localhost:8080/getspecialoutreachesbyplantid?plantId=" + plant.id!.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      });
      if (!response.ok) {
        throw new Error("Failed to get special outreaches");
      }
      const specialOutreaches: SpecialOutreach[] = await response.json();
      setSpecialOutreaches(specialOutreaches);
    } catch (error) {
      console.error("Error fetching past outreaches:", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/updateplantinfo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          id: plant.id!.toString(),
          name: name,
          notes: notes,
        }).toString(),
      });

      const responseUpdateOutreach = await fetch("http://localhost:8080/updateplantoutreachdurationdays", {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          id: plant.id!.toString(),
          outreachDurationDays: outreachDuration
        }).toString(),
      });

      if (!response.ok) {
        console.error("Failed to update plant data", response.statusText);
      } else {
        console.log("Plant data updated successfully");
      }
      if (!responseUpdateOutreach.ok) {
        console.error("Failed to update plant outreach", response.statusText);
      } else {
        console.log("Plant outreach updated successfully");
      }
      if (response.ok || responseUpdateOutreach.ok) {
        const response = await fetch("http://localhost:8080/getplantbyid?id=" + plant.id!.toString());
        if (!response.ok) {
          throw new Error("Failed to fetch plant");
        }
        const newPlant: PlantObject = await response.json();
        console.log(newPlant);
        plant.name = newPlant.name;
        plant.nextOutreachTime = newPlant.nextOutreachTime;
        plant.notes = newPlant.notes;
        plant.outreachDurationDays = newPlant.outreachDurationDays;
      }
    } catch (error) {
      console.error("Error updating plant:", error);
    }
    onClose();
  };

  const handleSubmitNextOutreachForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/addoutreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: userid.toString(),
          plantId: plant.id!.toString(),
          contents: nextOutreachNotes,
        }).toString(),
      });

      if (!response.ok) {
        console.error("Failed to add outreach", response.statusText);
      } else {
        console.log("Outreach added successfully.");
      }
    } catch (error) {
      console.error("Error adding outreach", error);
    }
    // fetchOutreaches();
    onClose();
  };

  const handleSubmitAddSpecialOutreachForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/addspecialoutreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userId: userid.toString(),
          plantId: plant.id!.toString(),
          notes: addSpecialOutreachNotes,
          outreachTime: addSpecialOutreachDate.toString()
        }).toString(),
      });

      if (!response.ok) {
        console.error("Failed to add special outreach", response.statusText);
      } else {
        console.log("Special outreach added successfully.");
      }
    } catch (error) {
      console.error("Error adding special outreach", error);
    }
    fetchSpecialOutreaches();
    // onClose();
  };

  const handleSubmitCompleteSpecialOutreachForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/completespecialoutreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          specialOutreachId: "1",
          notes: "TODO"
        }).toString(),
      });

      if (!response.ok) {
        console.error("Failed to complete special outreach", response.statusText);
      } else {
        console.log("Special outreach complete successfully.");
      }
    } catch (error) {
      console.error("Error completing special outreach", error);
    }
    fetchSpecialOutreaches();
    // onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          <div className="profile-column">
            <form onSubmit={handleSubmit} className="plant-details-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about the contact"
                />
              </div>
              <div className="form-group">
                <label htmlFor="outreachDuration">Outreach Duration (days)</label>
                <input
                  type="number"
                  id="outreachDuration"
                  value={outreachDuration}
                  onChange={(e) => setOutreachDuration(e.target.value)}
                />
              </div>
              <button type="submit" className="save-button" disabled={!name && !notes}>
                Save
              </button>
            </form>
            <div className="plant-display">
              {/* <img
                className="plant-image"
                src={plantImages[plant.plantType]}
                alt={`Plant Type ${plant.plantType}`}
              /> */}
              {timeDiffDays !== null && (
                <p className="time-diff-text">Reach out in: {timeDiffDays} days</p>
              )}
            </div>
          </div>
          <div className="outreach-column">
            <div>
              <label htmlFor="nextOutreachTime">Next Outreach Time</label>
              <input
                type="date"
                id="nextOutreachTime"
                value={plant.nextOutreachTime}
                // onChange={(e) => setNextOutreachTime(e.target.value)}
              />
            </div>
            <form onSubmit={handleSubmitNextOutreachForm} className="plant-outreach-form">
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={nextOutreachNotes}
                  onChange={(e) => setNextOutreachNotes(e.target.value)}
                  placeholder="When you complete the next outreach, add notes here."
                />
              </div>
              <button type="submit" className="save-button">
                Record outreach for {plant.nextOutreachTime}
              </button>
            </form>

            <br/><br/>Add special outreach:
            <form onSubmit={handleSubmitAddSpecialOutreachForm} className="plant-special-outreach-form">
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={addSpecialOutreachNotes}
                  onChange={(e) => setAddSpecialOutreachNotes(e.target.value)}
                  placeholder="What is this special outreach for?"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="addSpecialOutreachDate">Date</label>
                <input
                  type="date"
                  id="addSpecialOutreachDate"
                  value={addSpecialOutreachDate}
                  onChange={(e) => setAddSpecialOutreachDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="save-button">
                Add special outreach
              </button>
            </form>



            <br/><br/>
            History of outreaches (normal):
            {pastOutreaches.length === 0 && " None"}
            {pastOutreaches.map((outreach, index) => (
              <div key={index}>
                Time: {outreach.creationDatetime}<br/>
                Notes: {outreach.contents}
                <br/><br/>
              </div>
            ))}

            All special outreaches: (TODO: GET COMPLETION NOTES FOR PAST ONES)
            {specialOutreaches.length === 0 && " None"}
            {specialOutreaches.map((specialOutreach, index) => (
              <div key={index}>
                Time: {specialOutreach.creationDatetime}<br/>
                Notes: {specialOutreach.notes}<br/>
                {specialOutreach.completed ? "Completed" : "Not completed"}
                {/* Complete special outreach: */}
                {!specialOutreach.completed && 
                  <form onSubmit={handleSubmitCompleteSpecialOutreachForm} className="plant-complete-special-outreach-form">
                  <input value={specialOutreach.id} hidden /> 
                  <div className="form-group">
                    <label htmlFor="specialOutreachCompletionNotes">Notes (TODO)</label>
                    <textarea
                      id="specialOutreachCompletionNotes"
                      value={addSpecialOutreachNotes}
                      onChange={(e) => setAddSpecialOutreachNotes(e.target.value)}
                      placeholder="Add notes for this special outreach."
                      required
                    />
                  </div>
                  
                  <button type="submit" className="save-button">
                    Complete special outreach
                  </button>
                </form>
                }
                <br/><br/>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
