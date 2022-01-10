import React, { useEffect, useState, lazy } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as AddIcon } from "../assets/add.svg";
import { ReactComponent as TrashIcon } from "../assets/trash.svg";
import emptyActivityImage from "../assets/activity-empty-state.png";
import "./Home.scss";

const Alert = lazy(() => import("../components/Alert"));
const ModalDelete = lazy(() => import("../components/ModalDelete"));

const url = "https://todo.api.devcode.gethired.id/activity-groups";

export default function Home() {
  const [listItem, setListItem] = useState([]);
  const [isModalDeleteShow, setIsModalDeleteShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [lodingButton, setLoadingButton] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleModalDeleteClose = () => {
    setIsModalDeleteShow(false);
  };

  const handleCreateActivity = () => {
    postActivity();
  };

  const handleDeleteActivity = (activityId) => {
    const filteredItem = listItem.filter((item) => item.id === activityId)[0];

    setSelectedItem(filteredItem);
    setIsModalDeleteShow(true);
  };

  const postActivity = () => {
    setLoadingButton(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        title: "New Activity",
        email: "roofiahmadsidiq@gmail.com",
        _comment: "email digunakan untuk membedakan list data yang digunakan antar aplikasi",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        getListActivity();
        setTimeout(() => {
          setLoadingButton(false);
        }, 300);
      })
      .catch((err) => {
        setLoadingButton(false);
        console.log(err);
      });
  };

  const deleteActivity = () => {
    const activityId = selectedItem.id;
    setLoadingDelete(true);

    fetch(url + "/" + activityId, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(() => {
        getListActivity();
        setShowAlert(true);
        setLoadingDelete(false);
      })
      .catch((err) => {
        setLoadingDelete(false);
        console.log(err);
      });
  };

  const getListActivity = () => {
    setLoadingPage(true);

    fetch(url + "?email=roofiahmadsidiq%40gmail.com", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const listData = data.data.map((list) => {
          return { ...list, formatted_created_at: new Date(list.created_at).toLocaleString("id-ID", { dateStyle: "long" }) };
        });
        setListItem(listData);
        setLoadingPage(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingPage(false);
      });
  };

  useEffect(() => {
    getListActivity();
  }, []);

  return (
    <>
      <div className="Home pb-3">
        <div className="title-container d-flex justify-content-between align-items-center mt-xl-5 mt-3">
          <h2 className="h2 activity-title" data-cy="activity-title">
            Activity
          </h2>
          <button
            onClick={handleCreateActivity}
            className="activity-add-button btn btn-primary d-flex align-items-center justify-content-center"
            data-cy="activity-add-button"
          >
            {lodingButton ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden"></span>
              </div>
            ) : (
              <>
                <AddIcon className=" me-2 icon" />
                <span className=" label">Tambah</span>
              </>
            )}
          </button>
        </div>
        {!listItem.length && !loadingPage ? (
          <div className="container">
            <img
              style={{ cursor: "pointer" }}
              onClick={handleCreateActivity}
              loading="lazy"
              src={emptyActivityImage}
              alt="empty activity"
              className="img-fluid"
              data-cy="activity-empty-state"
            />
          </div>
        ) : (
          <div className="container mt-4">
            <div className="row row-cols-2 row-cols-md-4 gap-3 ">
              {listItem.map((item, index) => {
                return (
                  <div key={item.id} className="card col shadow activity-item" data-cy="activity-item">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <Link style={{ textDecoration: "none", padding: "0px", margin: "0px", width: "100%", flexGrow: 1 }} to={`/detail/${item.id}`}>
                        <div className="card-title activity-item-title" data-cy="activity-item-title">
                          {item.title}
                        </div>
                      </Link>
                      <div className="d-flex justify-content-between align-items-baseline">
                        <p className="card-text activity-item-date" data-cy="activity-item-date">
                          {item.formatted_created_at}
                        </p>
                        <span data-cy="activity-item-delete-button" onClick={() => handleDeleteActivity(item.id)}>
                          <TrashIcon className="delete-icon activity-item-delete-button" role="button" data-cy="activity-item-delete-button" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <ModalDelete
          isModalDeleteShow={isModalDeleteShow}
          handleModalDeleteClose={handleModalDeleteClose}
          deleteActivity={deleteActivity}
          item={selectedItem}
          option={"activity"}
          loadingDelete={loadingDelete}
        />
      </div>
      {loadingPage ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary position-absolute top-50 start-50" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        ""
      )}
      <Alert title={"Activity"} showAlert={showAlert} setShowAlert={setShowAlert} />
    </>
  );
}
