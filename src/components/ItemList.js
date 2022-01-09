import React, { useEffect, useState } from "react";
import { ReactComponent as EditIcon } from "../assets/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";

import "./ItemList.scss";

const options = {
  "very-high": "#ED4C5C",
  high: "#F8A541",
  normal: "#00A790",
  low: "#428BC1",
  "very-low": "#8942C1",
};

export default function ItemList({ updateIsActiveItem, item, handleModalListShow, handleModalDeleteShow }) {
  const [isCheckbox, setIsCheckbox] = useState(!item.is_active);

  const handleCheckboxChange = () => {
    const isActive = item.is_active ? 0 : 1;
    setIsCheckbox(isActive);
    updateIsActiveItem(isActive, item.id);
  };

  return (
    <div className="todo-item d-flex align-items-center shadow-sm mb-xl-2 px-xl-4" data-cy="todo-item">
      <input
        onChange={() => handleCheckboxChange()}
        className="form-check-input todo-item-checkbox m-0"
        type="checkbox"
        checked={isCheckbox}
        data-cy="todo-item-checkbox"
      />
      <span
        style={{ backgroundColor: options[item.priority] }}
        className="todo-item-priority-indicator"
        data-cy="todo-item-priority-indicator"
      ></span>
      <label className={`todo-item-title ${isCheckbox ? "unactive" : ""}`} data-cy="todo-item-title">
        {item.title}
      </label>
      <span onClick={() => handleModalListShow("edit", item)} role="button" className="todo-item-edit-button" data-cy="todo-item-edit-button">
        <EditIcon className="todo-item-edit-button-icon" />
      </span>
      <span onClick={() => handleModalDeleteShow(item)} role="button" className="todo-item-delete-button" data-cy="todo-item-delete-button">
        <DeleteIcon className="todo-item-delete-button-icon" />
      </span>
    </div>
  );
}
