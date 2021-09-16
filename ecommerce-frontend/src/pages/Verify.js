import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Loading from "../components/Loading";
import Message from "../components/message";
import axios from "axios";
import { updateUserProfile } from "../context/user_context";
function Verify({ history }) {
  const [verifing, setVerifing] = useState(true);
  const [data, setData] = useState();
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  let token = history.location.search;
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    async function getVerification() {
      try {
        const { data } = await axios.get(`/api/users/verify${token}`, config);
        setData(data);
        if (userInfo) {
          console.log(userInfo);
          dispatch(
            updateUserProfile({
              id: userInfo.id,
              name: userInfo.name,
              email: userInfo.email,
              password: "",
              username: userInfo.username,
            })
          );
          setVerifing(false);
        }
      } catch (err) {
        setData(err);
        setVerifing(false);
      }
    }
    getVerification();
  }, [dispatch]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Row className="">
        <Col className="col">
          {verifing ? (
            <Loading />
          ) : (
            <Message variant="secondary">{data.detail}</Message>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Verify;
