// src/App.tsx
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "./components/Grid";
import PlantMenu from "./components/PlantMenu";
import "./App.css";
import { ConfigProvider } from "./config/AppSettings";


const App: React.FC = () => {
  return (
    <ConfigProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <PlantMenu />
          <Grid />
        </div>
      </DndProvider>
    </ConfigProvider>
  );
};

export default App;
