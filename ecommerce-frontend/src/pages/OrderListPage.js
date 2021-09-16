import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Row, Col } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Message from "../components/message";
import { listReviews } from "../context/product_context_admin";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { FaTrashAlt } from "react-icons/fa";
import { listOrders } from "../context/order_context";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Paginate from "../components/Paginate";
import { FaCheck } from "react-icons/fa";
function OrderListScreen({ history, match }) {
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let keyword = history.location.search;
  if (!keyword) {
    keyword = "";
  }
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(listOrders(keyword));
    }
  }, [userInfo, keyword]);

  const linkButton = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div>
        <LinkContainer to={`/order/${row["_id"]}`}>
          <Button variant="light" className="btn-sm">
            Details
          </Button>
        </LinkContainer>
      </div>
    );
  };
  const refundFormatter = (cell, row, rowIndex, formatExtraData) => {
    return <div>{row.refundRequsted && <FaCheck></FaCheck>}</div>;
  };
  const columns = [
    {
      dataField: "_id",
      text: "ID",
      headerStyle: (colum, colIndex) => {
        return { width: "4.5rem", textAlign: "center" };
      },
    },
    {
      dataField: "user.name",
      text: "user name",
      headerStyle: (colum, colIndex) => {
        return { width: "15rem", textAlign: "center" };
      },
    },
    {
      dataField: "createdAt",
      text: "Order Date",
      headerStyle: (colum, colIndex) => {
        return { width: "20rem", textAlign: "center" };
      },
    },
    {
      dataField: "deliveredAt",
      text: "Deliver Date",
    },
    {
      dataField: "shippingAddress.address",
      text: "Shipping Address",
    },
    {
      dataField: "refundRequested",
      text: "Refund Requested",
      formatter: refundFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "6.2rem", textAlign: "center" };
      },
    },
    {
      dataField: "button",
      formatter: linkButton,
      headerStyle: (colum, colIndex) => {
        return { width: "10rem", textAlign: "center" };
      },
    },
  ];
  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row>

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <ToolkitProvider
            keyField="id"
            data={orders}
            columns={columns}
            bootstrap4={true}
          >
            {(props) => (
              <div>
                <Row>
                  <Col md={{ span: 2, offset: 1 }}></Col>
                </Row>
                <hr />
                <BootstrapTable
                  striped
                  bordered
                  hover
                  responsive
                  className="table-sm"
                  {...props.baseProps}
                />
              </div>
            )}
          </ToolkitProvider>
          <Paginate page={page} pages={pages} to={"/admin/orders/"} />
        </div>
      )}
    </div>
  );
}
export default OrderListScreen;
