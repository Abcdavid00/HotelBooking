import "./app.scss";
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getLocalStorage } from "./functions/asyncStorageFunctions";

import { Home, Login, List, Single, New } from "./pages";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";
import Announce from "./components/announce/Announce";
import HomeHotel from "./ContainerAdminHotel/Home/Home";
import { AdminInputs, HotelInputs } from "./formSource";

import { GetAllOrders } from "./middlewares/order";
import { GetAllHotels } from "./middlewares/hotel";
import { GetAllUsers } from "./middlewares/user";
import { CheckLogin } from "./middlewares/auth";
import { GetAllAdmins } from "./middlewares/admin";

import {
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
  setTotalAdmin,
  setUserInfo,
  setStateSidebar,
  setIsLoading,
  setAnnouncement,
  defaultAnnouncement,
} from "./redux/Slices/Global";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo, isLoading } = useSelector((state) => state.global);

  useEffect(() => {
    GetAllHotels().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalHotel(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllOrders().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalOrder(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllUsers().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalUser(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllAdmins().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalAdmin(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getLocalStorage("token").then((res) => {
      if (res) {
        CheckLogin(res).then((res) => {
          if (res.status === 200) {
            dispatch(setUserInfo(res.data.data.admin));
            dispatch(setIsLoading(false));
          } else {
            dispatch(setUserInfo(""));
            dispatch(setIsLoading(false));
            dispatch(
              setAnnouncement({
                message: "Please login to continue!",
                type: "error",
                id: Math.random(),
              })
            );
            setTimeout(() => {
              dispatch(defaultAnnouncement());
            }, 3000);
          }
        });
      } else {
        dispatch(setUserInfo(""));
        dispatch(setIsLoading(false));
        dispatch(
          setAnnouncement({
            message: "Please login to continue!",
            type: "error",
            id: Math.random(),
          })
        );
        setTimeout(() => {
          dispatch(defaultAnnouncement());
        }, 3000);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (userInfo.roll === "adminapp") {
      const currentpath = location.pathname;
      if (currentpath === "/") {
        dispatch(setStateSidebar("Dashboard"));
      } else if (currentpath.split("/")[1] === "user") {
        dispatch(setStateSidebar("Users"));
      } else if (currentpath.split("/")[1] === "admin") {
        dispatch(setStateSidebar("Admin"));
      } else if (currentpath.split("/")[1] === "hotel") {
        dispatch(setStateSidebar("Hotels"));
      } else if (currentpath.split("/")[1] === "booking")
        dispatch(setStateSidebar("Bookings"));
    }
  }, [location.pathname, userInfo.roll, dispatch]);

  return (
    <div className="app">
      {isLoading ? (
        <></>
      ) : userInfo.roll === "adminapp" ? (
        <>
          <div className="main">
            {userInfo && <SideBar />}
            <div className="container">
              {userInfo && <NavBar />}
              <Routes>
                <Route path="/">
                  <Route
                    path="/"
                    element={userInfo ? <Home /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="login"
                    element={userInfo ? <Navigate to="/" /> : <Login />}
                  />

                  <Route path="user">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":userId"
                      element={userInfo ? <Single /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="admin">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":adminId"
                      element={userInfo ? <Single /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="new"
                      element={
                        userInfo ? (
                          <New title={"Add New Admin"} inputs={AdminInputs} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                  </Route>

                  <Route path="booking">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="hotel">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":hotelId"
                      element={userInfo ? <Single /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="new"
                      element={
                        userInfo ? (
                          <New title={"Add New Hotel"} inputs={HotelInputs} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                  </Route>
                </Route>

                <Route
                  path="*"
                  element={
                    <h1>
                      <div className="notfound">
                        <div className="notfound-404">
                          <h1>404</h1>
                        </div>
                      </div>
                    </h1>
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="main">
            {userInfo && <SideBar />}
            <div className="container">
              {userInfo && <NavBar />}
              <Routes>
                <Route path="/">
                  <Route
                    path="/"
                    element={
                      userInfo ? <HomeHotel /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="login"
                    element={userInfo ? <Navigate to="/" /> : <Login />}
                  />

                  <Route path="users">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="admins">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="user">
                    <Route
                      path=":userId"
                      element={userInfo ? <Single /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="hotels">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":hotelId"
                      element={userInfo ? <Single /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="new"
                      element={userInfo ? <New /> : <Navigate to="/login" />}
                    />
                  </Route>
                </Route>

                <Route
                  path="*"
                  element={
                    <h1>
                      <div className="notfound">
                        <div className="notfound-404">
                          <h1>404</h1>
                        </div>
                      </div>
                    </h1>
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      )}
      <Announce />
    </div>
  );
}

export default App;
