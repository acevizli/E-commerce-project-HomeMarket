import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { useState, useEffect } from "react";
import React from "react";
import { refundOrder } from "../../context/order_context";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Message from "../../components/message.js";
import Loading from "../../components/Loading";
import { ORDER_UPDATE_RESET } from "../../actions";
export default function Refund(props) {
  const orderRefund = useSelector((state) => state.orderRefund);
  const { error, loading, order, success } = orderRefund;

  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (success) {
      dispatch({ type: ORDER_UPDATE_RESET });
      history.push("/orders");
    }
  }, [success]);
  const [openTextBox, setOpenTextBox] = useState(false);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(refundOrder(props.id));
  };

  return (
    props.open && (
      <div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div>
            <div className="overlay"></div>
            <div className="refund-container wide">
              <div style={{ display: "flex", marginBottom: 30 }}>
                <div className="refund-header-container">
                  <h1> Refund Order </h1>
                </div>
                <button
                  onClick={props.onClose}
                  onClickCapture={() => setOpenTextBox(false)}
                  className="borderless"
                >
                  <i class="fa fa-times-circle fa-2x"></i>
                </button>
              </div>
              <div className="center">
                <p> Please state why you want to refund your order!</p>
              </div>

              <form className="refund-form" onSubmit={submitHandler}>
                <RadioGroup>
                  <FormControlLabel
                    value="1"
                    control={<Radio onClick={() => setOpenTextBox(false)} />}
                    label="Product is rotten"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio onClick={() => setOpenTextBox(false)} />}
                    label="Product doesn't work as it is supposed to"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio onClick={() => setOpenTextBox(false)} />}
                    label="I gave this order accidentally"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio onClick={() => setOpenTextBox(false)} />}
                    label="Product doesn't look like as it is presented"
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio onClick={() => setOpenTextBox(true)} />}
                    label="Other"
                  />
                </RadioGroup>
                {openTextBox && (
                  <div>
                    <p>Please state why in the area below</p>
                    <textarea />
                  </div>
                )}
                <div className="refund-btn-container">
                  <button className="btn"> Refund </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  );
}
