import React, { lazy, Suspense, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { titlePage } from "../lib/titleHead";
import { Creators as TodoActions } from "../redux/TodoRedux";

// Lazy load components
const DashboardModule = lazy(() => import("../components/Dashboard/DashboardModule"));
const Header = lazy(() => import("../layout/Header"));

function Dashboard() {
  const dispatch = useDispatch();
  
  // Gunakan useCallback untuk menghindari pembuatan ulang fungsi di setiap render
  const getActivities = useCallback(() => {
    dispatch(TodoActions.getActivitiesRequest());
  }, [dispatch]);

  useEffect(() => {
    titlePage({ title: "To Do List - Dashboard" });
    getActivities();
  }, [getActivities]);

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <>
        <Header />
        <DashboardModule />
      </>
    </Suspense>
  );
}

export default Dashboard;
