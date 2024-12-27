import React, { useState } from "react";
import "./Modal.css";

interface PlantInputModalProps {
  onSubmit: (name: string, notes: string, outreachDurationDays: number, nextOutreachTime: string) => void;
  onClose: () => void;
}

const PlantInputModal: React.FC<PlantInputModalProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [outreachDurationDays, setOutreachDurationDays] = useState(0);
  const [nextOutreachTime, setNextOutreachTime] = useState<string>(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, notes, outreachDurationDays, nextOutreachTime);
    onClose(); // Close modal after submitting
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="plant-details-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                required
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
                value={outreachDurationDays}
                onChange={(e) => setOutreachDurationDays(Number(e.target.value))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nextOutreachTime">Next Outreach Time</label>
              <input
                type="date"
                id="nextOutreachTime"
                value={nextOutreachTime}
                onChange={(e) => setNextOutreachTime(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="save-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlantInputModal;
