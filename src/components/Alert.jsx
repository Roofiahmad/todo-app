import React, { useRef } from "react";
import { ReactComponent as ExclamationIcon } from "../assets/exclamation.svg";

import "./Alert.scss";

export default function Alert({ title = "", showAlert, setShowAlert }) {
  const modalContent = useRef(null);

  const handleClickOutside = (event) => {
    if (!modalContent.current.contains(event.target)) setShowAlert();
  };

  return (
    <>
      {showAlert ? (
        <div className="bg-modal alert-container" onClick={handleClickOutside}>
          <div className="modal-content" ref={modalContent}>
            <div className="alert" data-cy="modal-information">
              <ExclamationIcon className="modal-information-icon" data-cy="modal-information-icon" />
              <p className="modal-information-title" data-cy="modal-information-title">
                {title} Berhasil Dihapus
              </p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
