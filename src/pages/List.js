import React from "react";
import { ReactComponent as AddIcon } from "../assets/add.svg";

export default function List() {
  return (
    <div>
      <div className="title-container d-flex justify-content-between align-items-center mt-xl-5 mt-3">
        <h2 className="h2 activity-title" data-cy="activity-title">
          Activity
        </h2>
        <button className="activity-add-button btn btn-primary d-flex align-items-center justify-content-center" data-cy="activity-add-button">
          <AddIcon className=" me-2 icon" />
          <span className=" label">Tambah</span>
        </button>
      </div>
    </div>
  );
}
