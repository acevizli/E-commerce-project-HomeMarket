import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listMyOrders } from "../../context/order_context";
import Message from "../../components/message.js";
import Loading from "../../components/Loading";
function OrderMapping(order) {
  return (
    <tr>
      <Link to={"/order/" + order._id} className="none">
        <td className="orders-td"> {order.createdAt.slice(0, 10)} </td>
        <td className="orders-td">
          {" "}
          <p className="order-amount"> {order.totalPrice} </p>
        </td>
        <td className="orders-td">
          {" "}
          <p className="order-amount"> {order.shippingPrice} </p>{" "}
        </td>
        <td className="orders-td">
          {" "}
          {order.refundRequsted ? (
            <p className="status status-refunding">Refunding </p>
          ) : order.isDelivered ? (
            <p className="status status-delivered">
              delivered at {order.deliveredAt.slice(0, 10)}
            </p>
          ) : (
            <p className="status status-not-delivered"> Not yet delivered </p>
          )}
        </td>
      </Link>
    </tr>
  );
}

export default function Orders(props) {
  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      dispatch(listMyOrders());
    }
  }, [dispatch, history, userInfo]);
  return (
    <div class="orders-table-container">
      {loadingOrders ? (
        <Loading />
      ) : errorOrders ? (
        <Message variant="danger">{errorOrders}</Message>
      ) : (
        <table className="orders-table">
          <thead className="orders-table-head">
            <tr>
              <Link className="none none-head">
                <th>Ordered At</th>
                <th>Price</th>
                <th>Shipping Fee</th>
                <th>Status</th>
              </Link>
            </tr>
          </thead>
          <tbody className="orders-table-body">
            {orders.map(OrderMapping)}
          </tbody>
        </table>
      )}
    </div>
  );
}
