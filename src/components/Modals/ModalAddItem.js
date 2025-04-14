import React, { useEffect, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Select from "react-select";
import { Creators as TodoActions } from "../../redux/TodoRedux";

function ModalAddItem({ show, handleClose }) {
  const params = useParams().todoId;
  const dispatch = useDispatch();

  const addItem = (data) => dispatch(TodoActions.addItemRequest(data));
  const resetState = () => dispatch(TodoActions.resetStateTodo());

  const { isLoadingAddItem, errAddItem, dataAddItem } = useSelector(
    (state) => state.todo
  );

  const [itemName, setItemName] = useState("");
  const [priority, setPriority] = useState("very-high");
  const [selectState, setSelectState] = useState({
    value: "very-high",
    label: "Very High",
  });

  const options = [
    { value: "very-high", label: "Very High" },
    { value: "high", label: "High" },
    { value: "normal", label: "Medium" },
    { value: "low", label: "Low" },
    { value: "very-low", label: "Very Low" },
  ];

  useEffect(() => {
    if (errAddItem !== null || dataAddItem) {
      handleClose();
      resetState();
      setItemName("");
      setPriority("very-high");
      setSelectState({ value: "very-high", label: "Very High" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errAddItem, dataAddItem]);

  const formatOptionLabel = ({ value, label }) => (
    <div data-cy="modal-add-priority-item" className="d-flex align-items-center">
      <div className={`label-indicator ${value} mr-2`} />
      <div>{label}</div>
    </div>
  );

  const DropdownIndicator = () => (
    <div data-cy="modal-add-priority-dropdown" className="icon-dropdown mr-2" />
  );

  const handleSubmit = () => {
    const data = {
      title: itemName,
      activity_group_id: params,
      priority,
    };
    addItem(data);
  };

  const handleSelectChange = (option) => {
    setPriority(option.value);
    setSelectState(option);
  };

  return (
    <div data-cy="modal-add">
      <Modal
        show={show}
        onHide={handleClose}
        className="modal-add-activity"
        size="md"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="pt-4 d-flex justify-content-between w-100">
            <h4 className="font-weight-bold" data-cy="modal-add-title">
              Tambah List Item
            </h4>
            <div
              className="icon-close"
              onClick={handleClose}
              data-cy="modal-add-close-button"
              role="button"
            />
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <label data-cy="modal-add-name-title">NAMA LIST ITEM</label>
            <div data-cy="modal-add-name-input">
              <Form.Control
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Tambahkan nama Activity"
                id="AddFormTitle"
                value={itemName}
              />
            </div>

            <label className="mt-3" data-cy="modal-add-priority-title">
              PRIORITY
            </label>
            <Select
              options={options}
              className="select-priority"
              formatOptionLabel={formatOptionLabel}
              components={{ DropdownIndicator }}
              value={selectState}
              onChange={handleSelectChange}
              id="AddFormPriority"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="pb-4">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={itemName.trim() === ""}
            id="AddFormSubmit"
            data-cy="modal-add-save-button"
          >
            {isLoadingAddItem ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Simpan"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalAddItem;
