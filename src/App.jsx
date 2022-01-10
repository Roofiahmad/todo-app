import * as React from "react";
import { lazy } from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./pages/Home"));
const ActivityDetail = lazy(() => import("./pages/ActivityDetail"));

function App() {
  return (
    <div className="App">
      <header className="bg-primary header-background" data-cy="header-background">
        <h1 data-cy="header-title" className="header-title">
          TO DO LIST APP
        </h1>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <React.Suspense fallback={<>...</>}>
              <Home />
            </React.Suspense>
          }
        />
        <Route
          path="/detail/:id"
          element={
            <React.Suspense fallback={<>...</>}>
              <ActivityDetail />
            </React.Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
