import * as React from "react";
import { useState } from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ActivityDetail from "./pages/ActivityDetail";

function App() {
  return (
    <div className="App">
      <header className="bg-primary header-background" data-cy="header-background">
        <h1 data-cy="header-title" className="header-title">
          to do list app
        </h1>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<ActivityDetail />} />
      </Routes>
    </div>
  );
}

export default App;
