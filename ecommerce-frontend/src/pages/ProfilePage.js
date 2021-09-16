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

function ProfileScreen({ history }) {
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

  const styles = {
    row: {
      marginLeft: 0,
      marginRight: 0,
    },
    col: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  };
  return (
    <div className="section section-center page">
      <Row>
        <Col md={3} style={styles.col}>
          <ListGroup>
            {userInfo.isAdmin && (
              <ListGroup.Item className="profile-head">
                ADMINISTRATION
              </ListGroup.Item>
            )}
            {userInfo.isAdmin && (
              <ListGroup.Item className="profile-list-li">
                <Link type="button" className="auth-btn" to="/admin/users">
                  <div className="profile-list">USERS</div>
                </Link>
              </ListGroup.Item>
            )}
            {userInfo.isAdmin && (
              <ListGroup.Item className="profile-list-li">
                <Link
                  className="profile-list"
                  type="button"
                  className="auth-btn"
                  to="/admin/products"
                >
                  <div className="profile-list">PRODUCTS</div>
                </Link>
              </ListGroup.Item>
            )}
            {userInfo.isAdmin && (
              <ListGroup.Item className="profile-list-li">
                <Link
                  className="profile-list"
                  type="button"
                  className="auth-btn"
                  to="#"
                >
                  <div className="profile-list">ORDERS</div>
                </Link>
              </ListGroup.Item>
            )}
            {<ListGroup.Item className="profile-head">PROFILE</ListGroup.Item>}
            <ListGroup.Item className="profile-list-li">
              <Link
                className="profile-list"
                type="button"
                className="auth-btn"
                to="/editprofile"
              >
                <div className="profile-list">CHANGE PASSWORD</div>
              </Link>
            </ListGroup.Item>
            <ListGroup.Item className="profile-list-li">
              <Link
                to="/"
                variant="secondary"
                type="btn"
                onClick={logoutHandler}
              >
                {" "}
                <div className="profile-list">LOGOUT</div>
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}
const Wrapper = styled.article`
  .form-control {
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
  }
  @media (prefers-reduced-motion: reduce);
`;
export default ProfileScreen;
