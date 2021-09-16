import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Row, Col } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Message from "../components/message";
import {
  listReviews,
  updateReview,
  deleteReview,
} from "../context/product_context_admin";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { FaCheck, FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

function ReviewScreen({ history, match }) {
  const reviewList = useSelector((state) => state.reviewList);
  const { loading, error, reviews } = reviewList;

  const reviewDelete = useSelector((state) => state.reviewDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = reviewDelete;

  const reviewUpdate = useSelector((state) => state.reviewUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = reviewUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!userInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(listReviews());
    }
  }, [successDelete, successUpdate, userInfo]);

  const approveHandler = (id) => {
    dispatch(
      updateReview({
        _id: id,
        approved: true,
      })
    );
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteReview(id));
    }
  };
  const linkButton = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div>
        <Button
          variant="light"
          className="btn-sm"
          onClick={() => approveHandler(row["_id"])}
        >
          Approve
        </Button>
        <Button
          variant="danger"
          className="btn-sm"
          onClick={() => deleteHandler(row["_id"])}
        >
          <FaTrashAlt></FaTrashAlt>
        </Button>
      </div>
    );
  };
  const featuredFormatter = (cell, row, rowIndex, formatExtraData) => {
    return <div>{row.approved && <FaCheck></FaCheck>}</div>;
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
      dataField: "product",
      text: "product ID",
      headerStyle: (colum, colIndex) => {
        return { width: "5.5rem", textAlign: "center" };
      },
    },
    {
      dataField: "user",
      text: "User ID",
      headerStyle: (colum, colIndex) => {
        return { width: "4.5rem", textAlign: "center" };
      },
    },
    {
      dataField: "name",
      text: "Name of User",
      headerStyle: (colum, colIndex) => {
        return { width: "11rem", textAlign: "center" };
      },
    },
    {
      dataField: "comment",
      text: "Comment",
    },
    {
      dataField: "approved",
      text: "Approved",
      formatter: featuredFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "9rem", textAlign: "center" };
      },
    },
    {
      dataField: "rating",
      text: "Rating",
      headerStyle: (colum, colIndex) => {
        return { width: "5rem", textAlign: "center" };
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
          <h1>Reviews</h1>
        </Col>
      </Row>

      {loading || loadingUpdate || loadingDelete ? (
        <Loading />
      ) : error || errorUpdate || errorDelete ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <ToolkitProvider
            keyField="id"
            data={reviews}
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
        </div>
      )}
    </div>
  );
}
export default ReviewScreen;
