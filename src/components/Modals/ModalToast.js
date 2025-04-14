function ModalToast({ show, handleClose, title, text, type = "success" }) {
  return (
    <div data-cy="modal-information">
      <Modal
        show={show}
        onHide={handleClose}
        className="modal-toast"
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {title && (
          <Modal.Header closeButton>
            <Modal.Title data-cy="modal-information-title">{title}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body onClick={handleClose}>
          <div
            data-cy="modal-information-icon"
            className={type === "success" ? "icon-alert-sm" : "icon-danger-sm"}
          ></div>
          <p className="pl-3 pr-3">{text}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
