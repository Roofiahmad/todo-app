import React from "react";
import { Button, Modal } from "react-bootstrap";
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

  const handleDeleteItem = () => {
    const execute = deleteOption[option];
    execute();
  };

  return (
    <div className="modal-delete-container">
      <Modal show={isModalDeleteShow} onHide={handleModalDeleteClose} className="modal-delete" data-cy="modal-delete">
        <Modal.Header>
          <Modal.Title>
            <WarningIcon className="modal-delete-icon" data-cy="modal-delete-icon" />
            <p className="modal-delete-title" data-cy="modal-delete-title">
              Apakah anda yakin menghapus {option} <span>"{item.title}" ?</span>
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button className="modal-delete-cancel-button" data-cy="modal-delete-cancel-button" variant="secondary" onClick={handleModalDeleteClose}>
            Batal
          </Button>
          <Button className="modal-delete-confirm-button" data-cy="modal-delete-confirm-button" variant="danger" onClick={handleDeleteItem}>
            {loadingDelete ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Hapus"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
