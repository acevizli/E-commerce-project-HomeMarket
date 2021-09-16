import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Row, Col } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Message from "../components/message";
import Paginate from "../components/Paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../context/product_context_admin";
import { PRODUCT_CREATE_RESET } from "../actions";
import { FaCheck, FaEdit, FaTrashAlt } from "react-icons/fa";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

function ProductListScreen({ history, match }) {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let keyword = history.location.search;
  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct.id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    keyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };
  const linkButton = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div>
        <LinkContainer to={`/admin/product/${row["id"]}/edit`}>
          <Button variant="light" className="btn-sm">
            <FaEdit></FaEdit>
          </Button>
        </LinkContainer>

        {!userInfo.isSalesManager && (
          <Button
            variant="danger"
            className="btn-sm"
            onClick={() => deleteHandler(row["id"])}
          >
            <FaTrashAlt></FaTrashAlt>
          </Button>
        )}
      </div>
    );
  };
  const featuredFormatter = (cell, row, rowIndex, formatExtraData) => {
    return <div>{row.featured && <FaCheck></FaCheck>}</div>;
  };
  const columns = [
    {
      dataField: "id",
      text: "ID",
      headerStyle: (colum, colIndex) => {
        return { width: "4.5rem", textAlign: "center" };
      },
    },
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "price",
      text: "Price",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "5.8rem", textAlign: "center" };
      },
    },
    {
      dataField: "category",
      text: "Category",
    },
    {
      dataField: "brand",
      text: "Brand",
    },
    {
      dataField: "inStock",
      text: "Stock Count",
      headerStyle: (colum, colIndex) => {
        return { width: "5.8rem", textAlign: "center" };
      },
    },
    {
      dataField: "featured",
      text: "Featured",
      formatter: featuredFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "5.8rem", textAlign: "center" };
      },
    },
    {
      dataField: "button",
      formatter: linkButton,
      headerStyle: (colum, colIndex) => {
        return { width: "7rem", textAlign: "center" };
      },
    },
  ];
  const { SearchBar } = Search;
  const rowStyle = (row, rowIndex) => {
    if (row.price == 0) {
      return { backgroundColor: "red" };
    }
  };
  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        {!userInfo.isSalesManager && (
          <Col md={{ span: 2, offset: 2 }}>
            <Button className="my-3" onClick={createProductHandler}>
              <i className="fas fa-plus"></i> Create Product
            </Button>
          </Col>
        )}
      </Row>

      {loadingDelete && <Loading />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loadingCreate && <Loading />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <ToolkitProvider
            keyField="id"
            data={products}
            columns={columns}
            bootstrap4={true}
            search
          >
            {(props) => (
              <div>
                <Row>
                  <Col md={{ span: 2, offset: 1 }}>
                    <SearchBar {...props.searchProps} />
                  </Col>
                </Row>
                <hr />
                <BootstrapTable
                  striped
                  bordered
                  hover
                  responsive
                  className="table-sm"
                  {...props.baseProps}
                  rowStyle={rowStyle}
                />
              </div>
            )}
          </ToolkitProvider>

          <Paginate pages={pages} page={page} isAdmin={true} />
        </div>
      )}
    </div>
  );
}
export default ProductListScreen;
