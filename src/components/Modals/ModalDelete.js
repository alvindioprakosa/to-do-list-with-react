import React, { useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import alertIcon from "../../assets/images/icon-alert.svg";
import { Creators as TodoActions } from "../../redux/TodoRedux";

function ModalDelete({
  show,
  handleClose,
  title,
  text,
  deletedItem,
  handleDelete,
}) {
  const dispatch = useDispatch();

  // Redux Actions
  const deleteActivity = (data) =>
    dispatch(TodoActions.deleteActivityRequest(data));
  const resetState = () => dispatch(TodoActions.resetStateTodo());

  // Redux States
  const {
    isLoadingDeleteActivity,
    dataDeleteActivity,
    errDeleteActivity,
    isLoadingDeleteItem,
    dataDeleteItem,
    errDeleteItem,
  } = useSelector((state) => state.todo);

  // Handle when delete activity succeeds or fails
  useEffect(() => {
    if (dataDeleteActivity || errDeleteActivity) {
      handleClose();
      resetState();
    }
  }, [dataDeleteActivity, errDeleteActivity]);

  // Handle when delete item succeeds or fails
  useEffect(() => {
    if (dataDeleteItem || errDeleteItem) {
      handleClose();
      resetState();
    }
  }, [dataDeleteItem, errDeleteItem]);

  const handleClickDelete = () => {
    if (handleDelete) {
      handleDelete(); // Custom handler (misal: delete item)
    } else {
      deleteActivity(deletedItem); // Default handler (activity)
    }
  };

  const isLoading = isLoadingDeleteActivity || isLoadingDeleteItem;

  return (
    <div data-cy="modal-delete">
      <Modal
        show={show}
        onHide={handleClose}
        className="modal-delete"
        size="md"
        centered
        id="ModalDelete"
        data-cy="todo-modal-delete"
      >
        <Modal.Header>
          <Modal.Title className="d-flex align-items-center gap-3 pt-4">
            <img
              src={alertIcon}
              alt="alert"
              data-cy="modal-delete-icon"
              style={{ width: 24, height: 24 }}
            />
            <h4 className="font-weight-bold" data-cy="modal-delete-title">
              {title}
            </h4>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p
            className="px-3"
            dangerouslySetInnerHTML={{ __html: text }}
          ></p>
        </Modal.Body>

        <Modal.Footer className="pb-4">
          <button
            className="btn btn-secondary"
            data-cy="modal-delete-cancel-button"
            onClick={handleClose}
          >
            Batal
          </button>

          <button
            className="btn btn-danger"
            data-cy="modal-delete-confirm-button"
            onClick={handleClickDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Hapus"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalDelete;
