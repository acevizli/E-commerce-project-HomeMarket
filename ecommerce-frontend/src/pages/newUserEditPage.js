import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Message from "../components/message";
import { getUserDetails, updateUser } from "../context/user_context";
import { USER_UPDATE_RESET } from "../actions";
import styled from "styled-components";
function UserEditScreen({ match, history }) {
  const userId = match.params.id;

  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSalesManager, setisSalesManager] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo.isAdmin) {
      history.push("/login");
    }
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push("/admin/users");
    } else {
      if (!user.name || user.id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setUserName(user.username);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
        setisSalesManager(user.isAdmin && user.isSalesManager);
      }
    }
  }, [user, userId, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        id: user.id,
        username,
        name,
        email,
        isAdmin,
        isSalesManager,
      })
    );
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <Link to="/admin/users">
        <div className="back-container">
          <i
            className="fa fa-arrow-circle-left fa-3x"
            style={{ color: "navy" }}
          ></i>
          <div className="empty-space big">Go Back </div>
        </div>
      </Link>

      <div className="user-edit-page">
        {loadingUpdate || loading ? (
          <Loading />
        ) : errorUpdate || error ? (
          <Message variant="danger">{error ? error : errorUpdate}</Message>
        ) : (
          <div className="register-form-container user-edit-container">
            <div className="register-title">Edit Product</div>
            <form onSubmit={submitHandler}>
              {error && <Message variant="danger">{error}</Message>}
              <div className="register-user-details">
                <div className="register-input-box prof">
                  <span className="register-details">Name</span>
                  <input
                    type="text"
                    placeholder="John"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="register-input-box prof">
                  <span className="register-details">User Name</span>
                  <input
                    type="text"
                    placeholder="JDoe"
                    name="username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="register-input-box  prof">
                  <span className="register-details">Email</span>
                  <input
                    type="text"
                    placeholder="johnDoe@gmail.com"
                    name="image"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="login-check-box">
                  <span className="register-details">Admin</span>
                  <input
                    type="checkbox"
                    placeholder="check"
                    name="check"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                </div>
                <div className="login-check-box">
                  <span className="register-details">Sales Manager</span>
                  <input
                    type="checkbox"
                    placeholder="check"
                    name="check"
                    checked={isSalesManager}
                    onChange={(e) => setisSalesManager(e.target.checked)}
                  />
                </div>
              </div>
              <div className="register-button">
                <input type="submit" value="Update"></input>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
export default UserEditScreen;
