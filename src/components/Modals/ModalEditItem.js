import React, { useEffect, useState, useCallback } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Select from "react-select";
import { Creators as TodoActions } from "../../redux/TodoRedux";

// Prioritas item (diletakkan di luar untuk efisiensi)
const PRIORITY_OPTIONS = [
  { value: "very-high", label: "Very High" },
  { value: "high", label: "High" },
  { value: "normal", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "very-low", label: "Very Low" },
];

function ModalEditItem({ show, handleClose, title, text, editedItem }) {
  const params = useParams().todoId;
  const dispatch = useDispatch();
  const resetState = () => dispatch(TodoActions.resetStateTodo());
  const updateItem = (data) => dispatch(TodoActions.updateItemRequest(data));
  const getActivityDetail = (data) =>
    dispatch(TodoActions.getActivityDetailRequest(data));

  const { isLoadingUpdateItem, errUpdateItem, dataUpdateItem } = useSelector(
    (state) => state.todo
  );

  const [itemName, setItemName] = useState("");
  const [priority, setPriority] = useState("very-high");
  const [selectState, setSelectState] = useState({});

  // Sync redux response
  useEffect(() => {
    if (errUpdateItem !== null) {
      handleClose();
      resetState();
    } else if (dataUpdateItem && show) {
      getActivityDetail(params);
      handleClose();
      resetState();
    }
  }, [errUpdateItem, dataUpdateItem]);

  // Sync form state with edited item
  useEffect(() => {
    if (editedItem) {
      setItemName(editedItem.title || "");
      setPriority(editedItem.priority || "very-high");
      setSelectState(
        PRIORITY_OPTIONS.find((option) => option.value === editedItem.priority)
      );
    }
  }, [show, editedItem]);

  const formatOptionLabel = ({ value, label }) => (
    <div className="d-flex align-items-center">
      <div className={`label-indicator ${value}`}></div>
      <div>{label}</div>
    </div>
  );

  const handleChangeSelect = useCallback((e) => {
    setSelectState(e);
    setPriority(e.value);
  }, []);

  const submitAdd = () => {
    const trimmedName = itemName.trim();
    if (!trimmedName) return;

    const data = {
      title: trimmedName,
      priority,
      is_active: editedItem.is_active,
    };

    updateItem({ data, id: editedItem.id });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-add-activity"
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      id="ModalUpdate"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="pt-4">
          <h4 className="font-weight-bold">Edit Item</h4>
        </Modal.Title>
        <div className="icon-close" onClick={handleClose}></div>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <label>NAMA LIST ITEM</label>
          <Form.Control
            autoFocus
            onChange={(e) => setItemName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && submitAdd()}
            placeholder="Tambahkan nama Activity"
            value={itemName}
          />
          <label className="mt-3">PRIORITY</label>
          <Select
            formatOptionLabel={formatOptionLabel}
            options={PRIORITY_OPTIONS}
            className="select-priority"
            onChange={handleChangeSelect}
            value={selectState}
            id="UpdateFormPriority"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="pb-4">
        <button
          className="btn btn-primary"
          onClick={submitAdd}
          disabled={itemName.trim() === ""}
          id="UpdateFormSubmit"
        >
          {isLoadingUpdateItem ? (
            <Spinner
              as="span"
              animation="border"
              size="md"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Simpan"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalEditItem;
