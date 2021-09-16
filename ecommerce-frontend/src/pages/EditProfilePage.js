import { Link } from "react-router-dom";
import React, { useState, useEffect, Grid } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, logout } from "../context/user_context";
import { Row, Col, Card, ListGroup, Button, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loading from "../components/Loading";
import Message from "../components/message";
import styled from "styled-components";
import { updateUserProfile } from "../context/user_context";
import { USER_UPDATE_PROFILE_RESET } from "../actions";
import Popup from "../components/Register/Popup";

function EditProfile({ history }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;
  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success || userInfo.id !== user.id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
        setUserName(user.username);
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          id: user.id,
          name: name,
          email: email,
          password: password,
          username: username,
        })
      );
      setMessage("");
    }
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <Link to="/">
        <div className="back-container margin-up margin-left">
          <i
            className="fa fa-arrow-circle-left fa-3x"
            style={{ color: "navy" }}
          ></i>
          <div className="empty-space big">Go Back </div>
        </div>
      </Link>
      <div className="section section-center page">
        <div className="login-container wide">
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler} className="form-control">
              <Form.Group>
                <Form.Label>
                  <h2> Change Password </h2>
                </Form.Label>
                <div className="edit-profile-title"></div>
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label className="profile-label">Name</Form.Label>
                <Form.Control
                  className="profile-input"
                  required
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label className="profile-label">Email Address</Form.Label>
                <Form.Control
                  className="profile-input"
                  required
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label className="profile-label">New Password</Form.Label>
                <Form.Control
                  className="profile-input"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="passwordConfirm">
                <Form.Label className="profile-label">
                  Confirm Password
                </Form.Label>
                <Form.Control
                  className="profile-input"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <button
                type="submit"
                variant="primary"
                className="profile-button margin-up"
              >
                Update
              </button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
