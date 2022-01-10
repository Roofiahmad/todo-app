import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Select, { components } from "react-select";
import axios from "axios";

import { ReactComponent as CloseIcon } from "../assets/close.svg";
import ListOption from "./ListOption";
import "./ModalCreate.scss";

const url = "https://todo.api.devcode.gethired.id/todo-items";
const priorityList = [
  { id: 1, value: "very-high" },
  { id: 2, value: "high" },
  { id: 3, value: "normal" },
  { id: 4, value: "low" },
  { id: 5, value: "very-low" },
];

export default function ModalCreateList({ mode = "", item = {}, isModalListShow, handleModalListClose }) {
  const { id: activityId } = useParams();
  const [title, setTitle] = useState(" ");
  const [priority, setPriority] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

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

  const handlePriorityInput = (selectedValue) => {
    console.log(selectedValue);
    const newPriorityInput = oldItemPriority({ priority: selectedValue });
    setPriority(newPriorityInput);
  };

  const handleTitleInput = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
  };
  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const onSaveData = (e) => {
    e.preventDefault();
    console.log(priority);
    console.log(e);
    // const inputTitle = e.target["title"].value;
    // const inputOption = e.target[2].value;
    if (!title || isEmptyObject(priority)) return console.log("field cant be empty");
    // if (!inputTitle || !inputOption) return console.log("field cant be empty");
    if (mode === "edit") return postEditItem();
    return postNewItem();
  };

  const postNewItem = () => {
    setIsloading(true);
    axios
      .post(url + "/", {
        title: title,
        activity_group_id: activityId,
        priority: priority.value,
        _comment: "list of priority is : very-high, high, normal, low, very-low | defalut value is very-high",
      })
      .then(({ data }) => {
        setTitle("");
        setPriority(options[0]);
        setTimeout(() => {
          setIsloading(false);
          handleModalListClose();
        }, 300);
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err);
      });
  };

  const postEditItem = () => {
    setIsloading(true);
    axios
      .patch(url + "/" + item.id, {
        title: title,
        activity_group_id: activityId,
        priority: priority.value,
        _comment: "list of priority is : very-high, high, normal, low, very-low | defalut value is very-high",
      })
      .then(({ data }) => {
        setTitle("");
        setPriority(options[0]);
        setTimeout(() => {
          setIsloading(false);
          handleModalListClose();
        }, 300);
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err);
      });
  };

  const oldItemPriority = (item) => {
    const oldPriority = options.filter((option) => option.value === item.priority)[0];
    return oldPriority;
  };

  useEffect(() => {
    if (mode === "edit") {
      setTitle(item.title);
      setPriority(oldItemPriority(item));
    } else {
      setTitle("");
      setPriority(options[0]);
    }
  }, [mode]);

  useEffect(() => {
    if (title.trim() !== "" && !isEmptyObject(priority)) {
      if (isDisabled) {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(true);
    }
  }, [title, priority]);

  const addDataAcceptance = (Component, dataAcceptance) => (props) =>
    <Component {...props} innerProps={Object.assign({}, props.innerProps, { "data-cy": dataAcceptance })} />;

  return (
    <Modal show={isModalListShow} onHide={handleModalListClose} data-cy="modal-add" dialogClassName="modal-add">
      <form onSubmit={(e) => onSaveData(e)}>
        <Modal.Header>
          <Modal.Title data-cy="modal-add-title" className="modal-add-title">
            Tambah List Item
          </Modal.Title>
          <CloseIcon role="button" className="modal-add-close-button" onClick={handleModalListClose} data-cy="modal-add-close-button" />
        </Modal.Header>
        <Modal.Body>
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
            name="title"
            value={title}
          />
          <label className="modal-add-priority-title" data-cy="modal-add-priority-title" htmlFor="priority">
            Priority
          </label>
          {/* <Select
            name="priority"
            className="modal-add-priority-dropdown"
            defaultValue={mode === "edit" ? oldItemPriority(item) : options[0]}
            options={options}
            styles={colourStyles}
            onChange={handlePriorityInput}
            components={{
              IndicatorSeparator: () => null,
              Option: addDataAcceptance(components.Option, "modal-add-priority-item"),
              Control: addDataAcceptance(components.Control, "modal-add-priority-dropdown"),
            }}
          /> */}
          <div className="w-1/3">
            <ListOption lists={priorityList} data={priority.value} onChange={handlePriorityInput} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={isDisabled} className="modal-add-save-button" data-cy="modal-add-save-button" variant="primary" type="submit">
            {isLoading ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden"></span>
              </div>
            ) : (
              "Simpan"
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
