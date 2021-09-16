import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/message";
import Loading from "../components/Loading";
import {
  getOrderDetails,
  deleteOrder,
  deliverOrder,
} from "../context/order_context";
import { ORDER_DELIVER_RESET, ORDER_DELETE_RESET } from "../actions";
import ReactImage from "react-image-wrapper";
import Refund from "../components/refund/refund";

function GetOrderItem(OrderItem) {
  return (
    <div className="item-row">
      <p className="item-name">{OrderItem.name} :</p>{" "}
      <p className="item-price">{OrderItem.price * OrderItem.qty}₺</p>
    </div>
  );
}

function GetItems(OrderItem) {
  return (
    <tr>
      <td className="orders-td">
        {" "}
        <ReactImage
          src={OrderItem.image}
          width={50}
          height={50}
          keepAspectRatio={true}
        ></ReactImage>{" "}
      </td>
      <td className="orders-td">
        {" "}
        <p> {OrderItem.name} </p>
      </td>
      <td className="orders-td">
        {" "}
        <p className="order-amount"> {OrderItem.qty} </p>{" "}
      </td>
      <td className="orders-td">
        {" "}
        <p className="order-amount">{OrderItem.price}₺ </p>{" "}
      </td>
    </tr>
  );
}

function OrderScreen({ match, history }) {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const [refundOpen, setRefundOpen] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    error: deleteError,
    loading: deleteLoading,
    success: deleteSuccess,
  } = orderDelete;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    if (!order || order._id !== Number(orderId) || successDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });

      dispatch(getOrderDetails(orderId));
    }
    if (successDeliver) {
      history.push("/admin/orders");
    }
    if (deleteSuccess) {
      dispatch({ type: ORDER_DELETE_RESET });
      history.push("/admin/orders/");
    }
  }, [dispatch, order, orderId, successPay, successDeliver, deleteSuccess]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to refund this order?")) {
      dispatch(deleteOrder(id));
    }
  };
  return loading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div className="order-page">
      <div className="order-page-left">
        <div className="ordered-items-container">
          <div className="ordered-items-header">
            {" "}
            <p> YOUR ORDER</p>{" "}
          </div>
          <div className="ordered-items">
            {order.orderItems.map(GetOrderItem)}
          </div>
          <div className="ordered-items-total-price">
            Total Price: {order.itemsPrice}₺
          </div>
        </div>
        <div className="order-refund" style={{ marginRight: 0 }}>
          {!userInfo.isAdmin ? (
            <div>
              <p>
                {" "}
                If you are having troubles with your purchase you can refund.{" "}
              </p>
              <button className="btn" onClick={() => setRefundOpen(true)}>
                {" "}
                Refund{" "}
              </button>
            </div>
          ) : userInfo.isSalesManager && order.refundRequsted ? (
            <div className="refund-btn-container">
              <button className="btn" onClick={() => deleteHandler(order._id)}>
                Accept Refund
              </button>
            </div>
          ) : !userInfo.isSalesManager && !order.isDelivered ? (
            <div className="refund-btn-container">
              <button className="btn" onClick={deliverHandler}>
                {" "}
                Mark as Delivered{" "}
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div></div>
      <div className="order-page-right orders-table-container">
        <table className="orders-table">
          <thead className="orders-table-head order-item-table">
            <tr>
              <th>Product</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Individual Price</th>
            </tr>
          </thead>
          <tbody className="orders-table-body">
            {order.orderItems.map(GetItems)}
          </tbody>
        </table>
      </div>
      <Refund
        open={refundOpen}
        id={order._id}
        onClose={() => setRefundOpen(false)}
      />
    </div>
  );
}

export default OrderScreen;
