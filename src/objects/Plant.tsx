export interface PlantObject {
    id: number | null;
    userId: number;
    plantType: number;
    name: string;
    notes: string;
    outreachDurationDays: number;
    nextOutreachTime: string;
    stage: number;
    xCoord: number;
    yCoord: number;
    creationDatetime: string;
}

export const CreateNewPlant = (
    userId: number,
    plantType: number,
    name: string,
    notes: string,
    outreachDurationDays: number,
    nextOutreachTime: string,
    stage: number,
    xCoord: number,
    yCoord: number
  ): PlantObject => {
    return {
      id: null,
      userId,
      plantType,
      name,
      notes,
      outreachDurationDays,
      nextOutreachTime,
      stage,
      xCoord,
      yCoord,
      creationDatetime: new Date().toISOString(),
    };
  };