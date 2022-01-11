import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Select, { components } from "react-select";

import { ReactComponent as CloseIcon } from "../assets/close.svg";
import "./ModalCreate.scss";

const url = "https://todo.api.devcode.gethired.id/todo-items";

export default function ModalCreateList({ isModalCreateShow, handleModalCreateClose, getActivityDetail }) {
  const { id: activityId } = useParams();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const modalContent = useRef(null);

  const options = [
    { value: "very-high", label: "Very High", color: "#ED4C5C" },
    { value: "high", label: "High", color: "#F8A541" },
    { value: "normal", label: "Medium", color: "#00A790" },
    { value: "low", label: "Low", color: "#428BC1" },
    { value: "very-low", label: "Very Low", color: "#8942C1" },
  ];

  const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white", height: "52px", padding: "0px 5px", border: "1px solid #E5E5E5" }),
    option: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    input: (styles) => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

  const handleClearValue = () => {
    setPriority(options[0]);
    setTitle("");
    handleModalCreateClose();
  };

  const handlePriorityInput = (selectedValue) => {
    setPriority(selectedValue);
  };

  const handleTitleInput = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
  };

  const handleClickOutside = (event) => {
    if (!modalContent.current.contains(event.target)) handleModalCreateClose();
  };

  const onSaveData = () => {
    postNewItem();
  };

  const postNewItem = () => {
    if (!title.trim()) throw Error("field cant empty");
    setIsloading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        title: title,
        activity_group_id: activityId,
        priority: priority.value,
        _comment: "list of priority is : very-high, high, normal, low, very-low | defalut value is very-high",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTitle("");
        setPriority(options[0]);
        getActivityDetail();
        setTimeout(() => {
          setIsloading(false);
          handleClearValue();
        }, 300);
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("create disabled", !title, title);
  }, [title, priority, isLoading, isModalCreateShow]);

  const addDataAcceptance = (Component, dataAcceptance) => (props) =>
    <Component {...props} innerProps={Object.assign({}, props.innerProps, { "data-cy": dataAcceptance })} />;

  return isModalCreateShow ? (
    <div className="modal bg-modal" onClick={handleClickOutside} data-cy="modal-add">
      <div className="modal-content" ref={modalContent}>
        <div className="modal-header">
          <p data-cy="modal-add-title" className="modal-add-title">
            Tambah List Item
          </p>
          <CloseIcon role="button" className="modal-add-close-button" onClick={handleClearValue} data-cy="modal-add-close-button" />
        </div>
        <div className="modal-body">
          <label className="modal-add-name-title" data-cy="modal-add-name-title" htmlFor="listname">
            Nama List Item
          </label>
          <input
            onChange={handleTitleInput}
            className="form-control modal-add-name-input"
            placeholder="Tambahkan nama list item"
            data-cy="modal-add-name-input"
            id="listname"
            type="text"
            value={title}
          />
          <label className="modal-add-priority-title" data-cy="modal-add-priority-title" htmlFor="priority">
            Priority
          </label>
          <Select
            className="modal-add-priority-dropdown"
            defaultValue={options[0]}
            options={options}
            styles={colourStyles}
            onChange={handlePriorityInput}
            components={{
              IndicatorSeparator: () => null,
              Option: addDataAcceptance(components.Option, "modal-add-priority-item"),
              Control: addDataAcceptance(components.Control, "modal-add-priority-dropdown"),
            }}
          />
        </div>
        <div className="modal-footer">
          <button
            onClick={() => onSaveData()}
            disabled={!title}
            className="modal-add-save-button btn btn-primary"
            data-cy="modal-add-save-button"
            variant="primary"
            type="submit"
          >
            {isLoading ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden"></span>
              </div>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
