import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

import { ReactComponent as CloseIcon } from "../assets/close.svg";
import "./ModalCreate.scss";

const url = "https://todo.api.devcode.gethired.id/todo-items";

export default function ModalCreateList({ mode = "", item = {}, isModalListShow, handleModalListClose }) {
  const { id: activityId } = useParams();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState({});
  const [isLoading, setIsloading] = useState(false);

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
    setPriority(selectedValue);
  };

  const handleTitleInput = (event) => {
    const title = event.target.value;
    setTitle(title);
  };

  const onSaveData = () => {
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
    const oldTitle = item.title;
    setTitle(oldTitle);
  }, [item]);

  return (
    <Modal show={isModalListShow} onHide={handleModalListClose} data-cy="modal-add" dialogClassName="modal-add">
      <Modal.Header>
        <Modal.Title data-cy="modal-add-title" className="modal-add-title">
          Tambah List Item
        </Modal.Title>
        <CloseIcon role="button" className="modal-add-close-button" onClick={handleModalListClose} data-cy="modal-add-close-button" />
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        <label className="modal-add-name-title" data-cy="modal-add-name-title" for="listname">
          Nama List Item
        </label>
        <input
          onChange={handleTitleInput}
          className="form-control modal-add-name-input"
          placeholder="Tambahkan Nama List Item"
          data-cy="modal-add-name-input"
          id="listname"
          type="text"
          value={title}
        />
        <label className="modal-add-priority-title" data-cy="modal-add-priority-title" for="priority">
          Priority
        </label>
        <Select
          className="modal-add-priority-dropdown"
          data-cy="modal-add-priority-dropdown"
          defaultValue={mode === "edit" ? oldItemPriority(item) : options[0]}
          options={options}
          styles={colourStyles}
          onChange={handlePriorityInput}
          components={{
            IndicatorSeparator: () => null,
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="modal-add-save-button" data-cy="modal-add-save-button" variant="primary" onClick={() => onSaveData()}>
          {isLoading ? (
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden"></span>
            </div>
          ) : (
            "Simpan"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}