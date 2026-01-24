import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FlappyFish from "./components/game/FlappyFish";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlappyFish />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
