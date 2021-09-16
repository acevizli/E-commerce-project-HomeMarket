import React, { Component } from "react";
import HomePageLink from "../Login/HomePageLink";
import LoginLink from "./LoginLink";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { register } from "../../context/user_context.js";
import Message from "../../components/message.js";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import ErrorPage from "../../pages/ErrorPage.js";
function RegisterForm() {
  const history = useHistory();
  const location = useLocation();

  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
    if (error) {
      setMessage({ error });
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      setMessage("");
      dispatch(register(name, username, email, password));
    }
  };
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="register-form-container">
          <div className="register-title">Registration</div>

          <form onSubmit={submitHandler}>
            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            <div className="register-user-details">
              <div className="register-input-box">
                <span className="register-details">Name</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
              <div className="register-input-box">
                <span className="register-details">Surname</span>
                <input
                  type="text"
                  placeholder="Enter your surname"
                  required
                  name="surname"
                  value={surname}
                  onChange={(e) => setSurName(e.target.value)}
                ></input>
              </div>
              <div className="register-input-box">
                <span className="register-details">Username</span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  required
                  name="username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                ></input>
              </div>
              <div className="register-input-box">
                <span className="register-details">Email</span>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              <div className="register-input-box">
                <span className="register-details">Password</span>
                <input
                  type="password"
                  placeholder="Enter your possword"
                  required
                  name="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
              <div className="register-input-box">
                <span className="register-details">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  required
                  name="password2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="register-button">
              <input type="submit" value="Register"></input>
            </div>
          </form>

          <div className="link-container">
            <LoginLink />
            <HomePageLink />
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
