import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CompleteBookingModal({ show, setShow, booking, onProceedCompletion }) {
  function dismissModal() {
    setShow(false);
  }

  function clickConfirmComplete() {
    dismissModal();
    onProceedCompletion(booking);
  }
  if (booking) {
    return (
      <>
        <Modal show={show} onHide={dismissModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Would you like to complete the following event?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{booking?.location?.name}</Modal.Body>
          <Modal.Footer>
            <Button onClick={dismissModal} variant="secondary">
              Close
            </Button>
            <Button onClick={clickConfirmComplete} variant="primary">
              Sure!
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CompleteBookingModal;
