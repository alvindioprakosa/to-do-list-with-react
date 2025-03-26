import React, { lazy, Suspense, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom"; // Gunakan `react-router-dom`
import { titlePage } from "../lib/titleHead";
import { Creators as TodoActions } from "../redux/TodoRedux";

// Lazy load components
const TodoDetailModule = lazy(() => import("../components/TodoDetail/TodoDetailModule"));
const Header = lazy(() => import("../layout/Header"));

function TodoDetail() {
  const { todoId } = useParams(); // Destructuring lebih jelas
  const dispatch = useDispatch();

  // Gunakan useCallback agar tidak membuat ulang fungsi setiap render
  const getTodoDetail = useCallback((id) => {
    dispatch(TodoActions.getActivityDetailRequest(id));
  }, [dispatch]);

  useEffect(() => {
    titlePage({ title: "To Do List - Detail" });
    if (todoId) {
      getTodoDetail(todoId);
    }
  }, [todoId, getTodoDetail]); // Tambahkan dependency

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <>
        <Header />
        <TodoDetailModule />
      </>
    </Suspense>
  );
}

export default TodoDetail;
