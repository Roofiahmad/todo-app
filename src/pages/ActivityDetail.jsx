import React, { useRef, useState, useEffect, lazy } from "react";
import { Link, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import { ReactComponent as AddIcon } from "../assets/add.svg";
import { ReactComponent as BackIcon } from "../assets/chevron-left.svg";
import { ReactComponent as EditIcon } from "../assets/edit.svg";
import { ReactComponent as SortIcon } from "../assets/sort.svg";
import { ReactComponent as AscendingIcon } from "../assets/ascending-sort.svg";
import { ReactComponent as DescendingIcon } from "../assets/descending-sort.svg";
import { ReactComponent as NewestIcon } from "../assets/newest.svg";
import { ReactComponent as OldestIcon } from "../assets/oldest.svg";
import { ReactComponent as UnfinishIcon } from "../assets/unfinish-sort.svg";
import { ReactComponent as CheckIcon } from "../assets/sort-applied.svg";

import emptyListImage from "../assets/empty-list.png";
import "./ActivityDetail.scss";

const ItemList = lazy(() => import("../components/ItemList"));
const Alert = lazy(() => import("../components/Alert"));
const ModalCreateList = lazy(() => import("../components/ModalCreateList"));
const ModalEditList = lazy(() => import("../components/ModalEditList"));
const ModalDelete = lazy(() => import("../components/ModalDelete"));

const url = "https://todo.api.devcode.gethired.id/activity-groups";

function useOutsideAlerter(ref, handleClickOutside) {
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function ActivityDetail() {
  const { id: activityId } = useParams();

  const searchInput = useRef(null);
  const editIcon = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [activity, setActivity] = useState({ todo_items: [] });
  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [appliedFilter, setAppliedFilter] = useState("newest");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const listFilter = [
    { icon: <NewestIcon />, text: "Terbaru", key: "newest" },
    { icon: <OldestIcon />, text: "Terlama", key: "oldest" },
    { icon: <AscendingIcon />, text: "A-Z", key: "ascending" },
    { icon: <DescendingIcon />, text: "Z-A", key: "descending" },
    { icon: <UnfinishIcon />, text: "Belum Selesai", key: "unfinish" },
  ];

  //   modal create
  const [isModalCreateShow, setModalCreateShow] = useState(false);

  const handleModalCreateShow = () => {
    setModalCreateShow(true);
  };

  const handleModalCreateClose = () => {
    getActivityDetail();
    setModalCreateShow(false);
  };

  // modal edit
  const [isModalEditShow, setModalEditShow] = useState(false);

  const handleModalEditShow = (item) => {
    setSelectedItem(item);
    setModalEditShow(true);
  };

  const handleModalEditClose = () => {
    getActivityDetail();
    setModalEditShow(false);
  };

  const [isModalDeleteShow, setModalDeleteShow] = useState(false);

  const handleModalDeleteShow = (item) => {
    setSelectedItem(item);
    setModalDeleteShow(true);
  };

  const handleModalDeleteClose = () => {
    setModalDeleteShow(false);
    getActivityDetail();
  };

  function handleFocus() {
    setEditMode(true);
  }

  function onSubmitForm(e) {
    e.preventDefault();
    if (editMode && activity.title !== inputTitle && inputTitle !== "") {
      postUpdateActivity();
    }
  }

  useEffect(() => {
    if (editMode) searchInput.current.focus();
  }, [editMode]);

  const changeHandler = (evt) => {
    setInputTitle(evt.target.value);
  };

  useEffect(() => {
    if (!editMode && activity.title !== inputTitle && inputTitle !== "") {
      postUpdateActivity();
    }
  }, [editMode]);

  useEffect((fetchingActivity = getActivityDetail) => {
    fetchingActivity();
  }, []);

  useEffect(() => {
    handleSelectedFilter(appliedFilter);
  }, [activity]);

  useEffect(() => {
    console.log(filteredList);
  }, [filteredList]);

  function handleClickOutside(event) {
    if (editIcon.current && !editIcon.current.contains(event.target)) {
      setEditMode(false);
    }
  }

  // implement outside click
  useOutsideAlerter(editIcon, handleClickOutside);

  const handleSelectedFilter = (key) => {
    let newFilteredList = [...activity.todo_items];
    setAppliedFilter(key);
    switch (key) {
      case "oldest":
        newFilteredList.sort((a, b) => a.id - b.id);
        break;
      case "newest":
        newFilteredList.sort((a, b) => b.id - a.id);
        break;
      case "ascending":
        newFilteredList.sort((a, b) =>
          a.title.toLowerCase().charCodeAt(0) < b.title.toLowerCase().charCodeAt(0)
            ? -1
            : a.title.toLowerCase().charCodeAt(0) > b.title.toLowerCase().charCodeAt(0)
            ? 1
            : 0
        );
        break;
      case "descending":
        newFilteredList.sort((a, b) =>
          a.title.toLowerCase().charCodeAt(0) < b.title.toLowerCase().charCodeAt(0)
            ? 1
            : a.title.toLowerCase().charCodeAt(0) > b.title.toLowerCase().charCodeAt(0)
            ? -1
            : 0
        );
        break;
      case "unfinish":
        newFilteredList.sort((a, b) => b.is_active - a.is_active);
        break;
      default:
        break;
    }
    console.log(newFilteredList);
    setFilteredList(newFilteredList);
  };

  const getActivityDetail = () => {
    fetch(url + "/" + activityId)
      .then((response) => response.json())
      .then((data) => {
        setActivity(data);
        setInputTitle(data.title);
      })
      .catch((err) => console.log(err));
  };

  const postUpdateActivity = () => {
    fetch(url + "/" + activityId, {
      method: "PATCH",
      body: JSON.stringify({
        title: inputTitle,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setActivity({ ...activity, title: data.title });
        setInputTitle(data.title);
      })
      .catch((err) => console.log(err));
  };

  const deleteList = () => {
    setLoadingDelete(true);
    fetch("https://todo.api.devcode.gethired.id/todo-items/" + selectedItem.id, {
      method: "DELETE",
      body: JSON.stringify({
        title: inputTitle,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(() => {
        getActivityDetail();
        setLoadingDelete(false);
        setShowAlert(true);
      })
      .catch((err) => {
        setLoadingDelete(false);
        console.log(err);
      });
  };

  const updateIsActiveItem = (isActive, itemId) => {
    fetch("https://todo.api.devcode.gethired.id/todo-items/" + itemId, {
      method: "PATCH",
      body: JSON.stringify({
        is_active: isActive,
        _comment: "list of priority is : very-high, high, normal, low, very-low | defalut value is very-high",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(() => {
        getActivityDetail();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="activity-detail">
      <div className=" d-flex justify-content-between align-items-center mt-xl-5 mt-3">
        <div className="navigation d-flex justify-content-between align-items-center">
          <Link to="/">
            <button className="btn todo-back-button me-2" data-cy="todo-back-button">
              <BackIcon className="todo-back-icon" />
            </button>
          </Link>
          {editMode ? (
            <form onSubmit={(e) => onSubmitForm(e)}>
              <input
                style={{ width: editMode ? "100%" : inputTitle.length + 1 + "ch" }}
                onChange={changeHandler}
                ref={searchInput}
                value={inputTitle}
                type="text"
                className="btn todo-title"
                data-cy="todo-title"
              />
            </form>
          ) : (
            <h1 onClick={handleFocus} className="todo-title " data-cy="todo-title">
              {inputTitle}
            </h1>
          )}
          <button className="btn todo-title-edit-button mb-auto mx-4" data-cy="todo-title-edit-button">
            <EditIcon ref={editIcon} className="todo-title-edit-button-icon" />
          </button>
        </div>
        <div className="d-flex ">
          <Dropdown className="me-3">
            <Dropdown.Toggle className="todo-sort-button" variant="outline-secondary" id="dropdown-button" data-cy="todo-sort-button">
              <SortIcon className="arrow-sort" data-cy="arrow-sort" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="sort-parent shadow border rounded">
              {listFilter.map((list, index) => {
                return (
                  <Dropdown.Item
                    onClick={() => handleSelectedFilter(list.key)}
                    key={index}
                    className="sort-selection d-flex justify-content-start align-items-center"
                    data-cy="sort-selection"
                  >
                    <span className="sort-selection-icon" data-cy="sort-selection-icon">
                      {list.icon}
                    </span>
                    <span className="sort-selection-title" data-cy="sort-selection-title">
                      {list.text}
                    </span>
                    {appliedFilter === list.key ? (
                      <span className="sort-selection-selected ms-auto me-4" data-cy="sort-selection-selected">
                        <CheckIcon />
                      </span>
                    ) : (
                      ""
                    )}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <button
            onClick={() => handleModalCreateShow()}
            className="todo-add-button btn btn-primary d-flex align-items-center justify-content-center"
            data-cy="todo-add-button"
          >
            <AddIcon className="me-2 icon" />
            <span className="label">Tambah</span>
          </button>
        </div>
      </div>
      {filteredList.length ? (
        <div className="todo-item-container d-flex flex-column mt-xl-4">
          {filteredList.map((list) => {
            return (
              <ItemList
                key={list.id}
                item={list}
                updateIsActiveItem={updateIsActiveItem}
                handleModalEditShow={handleModalEditShow}
                handleModalDeleteShow={handleModalDeleteShow}
              />
            );
          })}
        </div>
      ) : (
        <div className="image-container">
          <img
            style={{ cursor: "pointer" }}
            onClick={() => handleModalCreateShow()}
            loading="lazy"
            src={emptyListImage}
            alt="empty activity"
            className=" img-fluid"
            data-cy="todo-empty-state"
          />
        </div>
      )}

      <ModalCreateList isModalCreateShow={isModalCreateShow} handleModalCreateClose={handleModalCreateClose} />
      <ModalEditList item={selectedItem} isModalEditShow={isModalEditShow} handleModalEditClose={handleModalEditClose} />
      <ModalDelete
        option="List Item"
        item={selectedItem}
        isModalDeleteShow={isModalDeleteShow}
        handleModalDeleteClose={handleModalDeleteClose}
        deleteList={deleteList}
        loadingDelete={loadingDelete}
      />
      <Alert title={"List Item"} showAlert={showAlert} setShowAlert={setShowAlert} />
    </div>
  );
}
