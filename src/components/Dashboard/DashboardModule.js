import dayjs from "dayjs";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/images/icon-delete.svg";
import emptyItem from "../../assets/images/empty-activity.png";
import ModalDelete from "../Modals/ModalDelete";
import ModalToast from "../Modals/ModalToast";
import "dayjs/locale/id";
import { Creators as TodoActions } from "../../redux/TodoRedux";

function DashboardModule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Gunakan useCallback agar fungsi tidak dibuat ulang di setiap render
  const getActivities = useCallback(() => dispatch(TodoActions.getActivitiesRequest()), [dispatch]);
  const addActivity = useCallback(() => {
    dispatch(TodoActions.addActivityRequest({ title: "New Activity", email: "mail.yanafriyoko@gmail.com" }));
  }, [dispatch]);

  // Ambil data dari Redux Store
  const {
    dataGetActivities,
    errGetActivities,
    isLoadingGetActivities,
    dataAddActivity,
    errAddActivity,
    dataDeleteActivity,
    errDeleteActivity,
    isLoadingAddActivity,
  } = useSelector((state) => state.todo);

  // State untuk modal
  const [showDelete, setShowDelete] = useState(false);
  const [modalText, setModalText] = useState("Activity berhasil dihapus");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("danger");
  const [deletedActivity, setDeletedActivity] = useState("");

  // Gunakan useEffect untuk menangani perubahan data dari Redux
  useEffect(() => {
    if (errAddActivity || errGetActivities || errDeleteActivity) {
      setShowToast(true);
      setToastType("danger");
      setModalText(errAddActivity || errGetActivities || errDeleteActivity || "Terjadi kesalahan.");
    }
    if (dataAddActivity || dataDeleteActivity) {
      getActivities();
      setShowToast(true);
      setToastType("success");
      setModalText(dataDeleteActivity ? "Activity berhasil dihapus" : "Activity berhasil ditambahkan");
    }
  }, [errAddActivity, errGetActivities, errDeleteActivity, dataAddActivity, dataDeleteActivity, getActivities]);

  // Menggunakan useMemo untuk menghindari perhitungan ulang yang tidak perlu
  const activities = useMemo(() => dataGetActivities?.data || [], [dataGetActivities]);

  // Handler untuk modal delete
  const handleClickDelete = (item) => {
    setShowDelete(true);
    setModalText(`<p>Apakah anda yakin menghapus activity <strong>“${item?.title}”</strong>?</p>`);
    setDeletedActivity(item?.id);
  };

  return (
    <div className="container">
      <div className="todo-header">
        <h1 data-cy="activity-title">Activity</h1>
        <button className="btn btn-primary" data-cy="activity-add-button" onClick={addActivity}>
          {isLoadingAddActivity ? (
            <Spinner as="span" animation="border" size="md" role="status" aria-hidden="true" />
          ) : (
            <>
              <span className="icon-plus"></span> Tambah
            </>
          )}
        </button>
      </div>

      <div className="dashboard-content">
        {isLoadingGetActivities ? (
          <div className="spinner-wrapper">
            <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-item" data-cy="activity-empty-state">
            <img src={emptyItem} alt="empty" onClick={addActivity} />
          </div>
        ) : (
          <div className="row">
            {activities.map((item, key) => (
              <div key={item.id} className="col-3">
                <div className="activity-card" data-cy="activity-item" id={`itemTodo${key}`}>
                  <div className="activity-body" onClick={() => navigate(`/detail/${item.id}`)}>
                    <h4 data-cy="activity-item-title">{item.title}</h4>
                  </div>
                  <div className="card-footer">
                    <span data-cy="activity-item-date">
                      {dayjs(item.created_at).locale("id").format("DD MMMM YYYY")}
                    </span>
                    <img src={deleteIcon} onClick={() => handleClickDelete(item)} alt="delete" data-cy="activity-item-delete-button" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalDelete text={modalText} show={showDelete} deletedItem={deletedActivity} handleClose={() => setShowDelete(false)} />
      <ModalToast type={toastType} text={modalText} show={showToast} handleClose={() => setShowToast(false)} />
    </div>
  );
}

export default DashboardModule;
