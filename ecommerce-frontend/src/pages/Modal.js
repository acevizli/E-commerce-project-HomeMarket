import { Link, useHistory } from "react-router-dom";
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

export default function Modal({ open, onClose, isAdmin }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const history = useHistory();

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (!userInfo && open) {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  if (!open) return null;
  return (
    <div>
      <ListGroup onMouseLeave={onClose}>
        {<ListGroup.Item className="profile-head left">PROFILE</ListGroup.Item>}
        {userInfo && !userInfo.isAdmin && (
          <ListGroup.Item className="profile-list-li">
            <Link
              className="profile-list"
              type="button"
              className="auth-btn"
              to="/orders"
              onClickCapture={onClose}
            >
              <div className="profile-list">MY ORDERS</div>
            </Link>
          </ListGroup.Item>
        )}
        <ListGroup.Item className="profile-list-li">
          <Link
            className="profile-list"
            type="button"
            className="auth-btn"
            to="/editprofile"
            onClickCapture={onClose}
          >
            <div className="profile-list">CHANGE PASSWORD</div>
          </Link>
        </ListGroup.Item>
        <ListGroup.Item className="profile-list-li">
          <Link to="/" variant="secondary" type="btn" onClick={logoutHandler}>
            {" "}
            <div className="profile-list left  ">LOGOUT</div>
          </Link>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

const temp = `{isAdmin = userInfo.isAdmin}
{isAdmin && (
    <ListGroup.Item className="profile-head left">ADMINISTRATION</ListGroup.Item>)
}
{isAdmin && (
    <ListGroup.Item className="profile-list-li">
        <Link type="button" className="auth-btn" to="/admin/users" onClickCapture={onClose}>
            <div className="profile-list">USERS</div></Link>
    </ListGroup.Item>)
}
{isAdmin && (
    <ListGroup.Item className="profile-list-li">
        <Link className="profile-list" type="button" className="auth-btn" to="/admin/products" onClickCapture={onClose}>
            <div className="profile-list">PRODUCTS</div></Link>
    </ListGroup.Item>)
}
{isAdmin && (
    <ListGroup.Item className="profile-list-li">
        <Link className="profile-list" type="button" className="auth-btn" to="#" onClickCapture={onClose}>
            <div className="profile-list">ORDERS</div></Link>
    </ListGroup.Item>)
}`;
