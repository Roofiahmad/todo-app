import React, { useRef } from "react";
import { ReactComponent as WarningIcon } from "../assets/warning.svg";

import "./ModalDelete.scss";

export default function ModalDelete({
  loadingDelete,
  isModalDeleteShow,
  handleModalDeleteClose,
  deleteActivity,
  deleteList,
  option = "",
  item = {},
}) {
  const deleteOption = {
    activity: deleteActivity,
    "List Item": deleteList,
  };

  const modalContent = useRef(null);

  const handleDeleteItem = () => {
    const execute = deleteOption[option];
    execute();
    handleModalDeleteClose();
  };

  const handleClickOutside = (event) => {
    if (!modalContent.current.contains(event.target)) handleModalDeleteClose();
  };

  return isModalDeleteShow ? (
    <div className="modal bg-modal modal-delete" data-cy="modal-delete" onClick={handleClickOutside}>
      <div className="modal-content" ref={modalContent}>
        <div className="modal-header">
          <WarningIcon className="modal-delete-icon" data-cy="modal-delete-icon" />
          <p className="modal-delete-title" data-cy="modal-delete-title">
            Apakah anda yakin menghapus {option} <span>"{item.title}" ?</span>
          </p>
        </div>
        <div className="modal-footer">
          <button className="modal-delete-cancel-button btn btn-secondary" data-cy="modal-delete-cancel-button" onClick={handleModalDeleteClose}>
            Batal
          </button>
          <button className="modal-delete-confirm-button btn btn-danger" data-cy="modal-delete-confirm-button" onClick={handleDeleteItem}>
            {loadingDelete ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
