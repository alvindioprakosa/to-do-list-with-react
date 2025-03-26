import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Dropdown, Form, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Immutable from "seamless-immutable";
import deleteIcon from "../../assets/images/icon-delete.svg";
import emptyItem from "../../assets/images/empty-item.png";
import { Creators as TodoActions } from "../../redux/TodoRedux";
import ModalAddItem from "../Modals/ModalAddItem";
import ModalToast from "../Modals/ModalToast";
import ModalDelete from "../Modals/ModalDelete";
import ModalEditItem from "../Modals/ModalEditItem";

function TodoDetailModule() {
  const params = useParams().todoId;
  const navigate = useNavigate();
  const titleInput = useRef(null);
  const dispatch = useDispatch();

  const { dataGetActivityDetail, isLoadingGetActivityDetail, dataAddItem, errAddItem, errUpdateItem, dataUpdateItem } = useSelector((state) => state.todo);

  const [isEditTitle, setIsEditTitle] = useState(false);
  const [titleState, setTitleState] = useState("");
  const [listItems, setListItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [modalText, setModalText] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deletedItem, setDeletedItem] = useState(null);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(1);

  useEffect(() => {
    if (dataGetActivityDetail) {
      setTitleState(dataGetActivityDetail?.title);
      setListItems(
        dataGetActivityDetail?.todo_items?.map((item) => ({
          ...item,
          is_active: item?.is_active ?? 1,
        })) || []
      );
    }
  }, [dataGetActivityDetail]);

  useEffect(() => {
    if (dataUpdateItem) dispatch(TodoActions.resetStateTodo());
  }, [dataUpdateItem, dispatch]);

  useEffect(() => {
    if (errAddItem || dataAddItem) {
      setShowToast(true);
      setToastType(errAddItem ? "danger" : "success");
      setModalText(errAddItem || "Item berhasil ditambahkan");
      if (dataAddItem) dispatch(TodoActions.getActivityDetailRequest(params));
    }
  }, [errAddItem, dataAddItem, dispatch, params]);

  useEffect(() => {
    if (errUpdateItem) {
      setShowToast(true);
      setToastType("danger");
      setModalText(errUpdateItem || "Gagal mengedit activity");
    }
  }, [errUpdateItem]);

  useEffect(() => {
    const sortedItems = Immutable.asMutable(listItems).sort((a, b) => {
      switch (activeDropdown) {
        case 1: return b.id - a.id;
        case 2: return a.id - b.id;
        case 3: return a.title.localeCompare(b.title);
        case 4: return b.title.localeCompare(a.title);
        case 5: return b.is_active - a.is_active;
        default: return 0;
      }
    });
    setListItems(sortedItems);
  }, [activeDropdown]);

  const handleEditTitle = () => {
    if (isEditTitle) dispatch(TodoActions.updateActivityRequest({ id: params, data: { title: titleState } }));
    setIsEditTitle(!isEditTitle);
    if (!isEditTitle) setTimeout(() => titleInput.current?.focus(), 100);
  };

  const handleCheckBox = (id) => {
    setListItems(listItems.map(item => item.id === id ? { ...item, is_active: item.is_active === 1 ? 0 : 1 } : item));
    const updatedItem = listItems.find(item => item.id === id);
    dispatch(TodoActions.updateItemRequest({ id, data: { ...updatedItem, is_active: updatedItem.is_active } }));
  };

  const handleDelete = () => {
    dispatch(TodoActions.deleteItemRequest(deletedItem));
    setListItems(listItems.filter(item => item.id !== deletedItem));
  };

  return (
    <div className="container">
      {isLoadingGetActivityDetail ? (
        <Spinner animation="border" role="status" className="spinner-wrapper" />
      ) : (
        <>
          <div className="todo-header">
            <div className="todo-title">
              <div className="icon-back" onClick={() => navigate("/")}></div>
              {isEditTitle ? (
                <input type="text" ref={titleInput} onBlur={handleEditTitle} onChange={(e) => setTitleState(e.target.value)} value={titleState} />
              ) : (
                <h1 onClick={handleEditTitle}>{titleState}</h1>
              )}
              <div className="icon-edit-h" onClick={handleEditTitle}></div>
            </div>
            <Dropdown>
              <Dropdown.Toggle className="btn-sort">
                <div className="icon-sort"></div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {["Terbaru", "Terlama", "A-Z", "Z-A", "Belum Selesai"].map((label, index) => (
                  <Dropdown.Item key={index} onClick={() => setActiveDropdown(index + 1)}>{label}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <button className="btn btn-primary" onClick={() => setShowAddItem(true)}>Tambah</button>
          </div>
          <div className="detail-content">
            {listItems.length === 0 ? (
              <div className="empty-item" onClick={() => setShowAddItem(true)}>
                <img src={emptyItem} alt="empty" />
              </div>
            ) : (
              listItems.map(item => (
                <div key={item.id} className="content-item">
                  <Form.Check checked={item.is_active === 0} onChange={() => handleCheckBox(item.id)} />
                  <span className={item.is_active === 0 ? "todo-done" : ""}>{item.title}</span>
                  <img src={deleteIcon} alt="delete" onClick={() => { setDeletedItem(item.id); setShowDelete(true); }} />
                </div>
              ))
            )}
          </div>
          <ModalAddItem show={showAddItem} handleClose={() => setShowAddItem(false)} />
          <ModalToast type={toastType} text={modalText} show={showToast} handleClose={() => setShowToast(false)} />
          <ModalDelete text={modalText} show={showDelete} handleDelete={handleDelete} handleClose={() => setShowDelete(false)} />
        </>
      )}
    </div>
  );
}

export default TodoDetailModule;