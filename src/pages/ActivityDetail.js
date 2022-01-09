import React, { useRef, useState, useEffect, lazy } from "react";
import { Link, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

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

const ModalCreateList = lazy(() => import("../components/ModalCreateList"));
const ItemList = lazy(() => import("../components/ItemList"));
const Alert = lazy(() => import("../components/Alert"));
const ModalDelete = lazy(() => import("../components/ModalDelete"));

const url = "https://todo.api.devcode.gethired.id/activity-groups";

export default function ActivityDetail() {
  const { id: activityId } = useParams();

  const searchInput = useRef(null);
  const editIcon = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [activity, setActivity] = useState({ todo_items: [] });
  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [modalListMode, setModalListMode] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("newest");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [debounce, setDebounce] = useState(null);

  const listFilter = [
    { icon: <NewestIcon />, text: "Terbaru", key: "newest" },
    { icon: <OldestIcon />, text: "Terlama", key: "oldest" },
    { icon: <AscendingIcon />, text: "A-Z", key: "ascending" },
    { icon: <DescendingIcon />, text: "Z-A", key: "descending" },
    { icon: <UnfinishIcon />, text: "Belum Selesai", key: "unfinish" },
  ];

  //   modal
  const [isModalListShow, setModalListShow] = useState(false);

  const handleModalListClose = () => {
    setModalListShow(false);
    setSelectedItem({});
    setModalListMode("");
    getActivityDetail();
  };
  const handleModalListShow = (mode, item) => {
    setSelectedItem(item);
    setModalListMode(mode);
    setModalListShow(true);
  };

  const [isModalDeleteShow, setModalDeleteShow] = useState(false);
  const handleModalDeleteClose = () => {
    setModalDeleteShow(false);
    setSelectedItem({});
    setModalListMode("");
    getActivityDetail();
  };
  const handleModalDeleteShow = (item) => {
    setSelectedItem(item);
    setModalDeleteShow(true);
  };

  function handleFocus() {
    setEditMode(true);
    searchInput.current.focus();
  }
  const changeHandler = (evt) => {
    if (evt.target.value.trim() === "") return;
    setInputTitle(evt.target.value);
  };

  useEffect(() => {
    if (activity.title !== inputTitle && inputTitle !== "") {
      if (debounce) {
        clearTimeout(debounce);
      }
      setDebounce(
        setTimeout(() => {
          postUpdateActivity();
        }, 100)
      );
    }
    return () => {
      clearTimeout(debounce);
    };
  }, [inputTitle]);

  useEffect(() => {
    getActivityDetail();
  }, []);

  // const handleOutside = (evt) => {
  //   const isEdited = editIcon.current.contains(evt.target);
  //   console.log(inputTitle);
  //   if (!isEdited) {
  //     setEditMode(false);
  //     if (activity.title !== inputTitle) {
  //       postUpdateActivity();
  //     }
  //   }
  // };

  // implement outside click
  useOutsideAlerter(editIcon);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setEditMode(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

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
        newFilteredList.sort((a, b) => {
          let x = a.title.toLowerCase();
          let y = b.title.toLowerCase();
          if (x < y) return -1;
          if (x > y) return 1;
          return 0;
        });
        break;
      case "descending":
        newFilteredList.sort((a, b) => {
          let x = a.title.toLowerCase();
          let y = b.title.toLowerCase();
          if (x > y) return -1;
          if (x < y) return 1;
          return 0;
        });
        break;
      case "unfinish":
        newFilteredList.sort((a, b) => b.is_active - a.is_active);
        break;
      default:
        break;
    }

    setFilteredList(newFilteredList);
  };

  const getActivityDetail = () => {
    axios
      .get(url + "/" + activityId)
      .then(({ data }) => {
        setActivity(data);
        setInputTitle(data.title);
        setFilteredList(data.todo_items);
      })
      .catch((err) => console.log(err));
  };

  const postUpdateActivity = () => {
    axios
      .patch(url + "/" + activityId, {
        title: inputTitle,
      })
      .then(({ data }) => {
        setActivity({ ...activity, title: data.title });
        setInputTitle(data.title);
      })
      .catch((err) => console.log(err));
  };

  const deleteList = () => {
    setLoadingDelete(true);
    axios
      .delete("https://todo.api.devcode.gethired.id/todo-items/" + selectedItem.id)
      .then((response) => {
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
    axios
      .patch("https://todo.api.devcode.gethired.id/todo-items/" + itemId, {
        is_active: isActive,
        _comment: "list of priority is : very-high, high, normal, low, very-low | defalut value is very-high",
      })
      .then(({ data }) => {
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
          <input
            style={{ width: editMode ? "100%" : inputTitle.length + 1 + "ch" }}
            onChange={changeHandler}
            ref={searchInput}
            value={inputTitle}
            type="text"
            className="btn todo-title"
            data-cy="todo-title"
          />
          <button ref={editIcon} onClick={handleFocus} className="btn todo-title-edit-button mb-auto mx-4" data-cy="todo-title-edit-button">
            <EditIcon className="todo-title-edit-button-icon" />
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
            onClick={() => handleModalListShow("create", {})}
            className="todo-add-button btn btn-primary d-flex align-items-center justify-content-center"
            data-cy="todo-add-button"
          >
            <AddIcon className="me-2 icon" />
            <span className=" label">Tambah</span>
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
                handleModalListShow={handleModalListShow}
                handleModalDeleteShow={handleModalDeleteShow}
              />
            );
          })}
        </div>
      ) : (
        <div className="image-container">
          <img loading="lazy" src={emptyListImage} alt="empty activity" className=" img-fluid" data-cy="todo-empty-state" />
        </div>
      )}

      <ModalCreateList mode={modalListMode} item={selectedItem} isModalListShow={isModalListShow} handleModalListClose={handleModalListClose} />
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
