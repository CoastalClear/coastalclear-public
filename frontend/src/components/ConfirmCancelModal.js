import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmCancelModal({ show, setShow, booking, onConfirmCancel }) {
  function dismissModal() {
    setShow(false);
  }

  function clickConfirmCancel() {
    dismissModal();
    onConfirmCancel(booking);
  }
  if (booking && Object.keys(booking).length != 0) {
    return (
      <>
        <Modal show={show} onHide={dismissModal}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel the following event?</Modal.Title>
          </Modal.Header>
          <Modal.Body>{booking.location.name}</Modal.Body>
          <Modal.Footer>
            <Button onClick={dismissModal} variant="secondary">
              Close
            </Button>
            <Button onClick={clickConfirmCancel} variant="primary">
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else {
    return <></>;
  }
}

export default ConfirmCancelModal;
