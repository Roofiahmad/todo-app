import React from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as ExclamationIcon } from "../assets/exclamation.svg";

import "./Alert.scss";

export default function Alert({ title = "", showAlert, setShowAlert }) {
  return (
    <Modal show={showAlert} onHide={() => setShowAlert(false)} className="alert-container">
      <div className="alert" data-cy="modal-information">
        <ExclamationIcon className="modal-information-icon" data-cy="modal-information-icon" />
        <p className="modal-information-title" data-cy="modal-information-title">
          {title} Berhasil Dihapus
        </p>
      </div>
    </Modal>
  );
}
