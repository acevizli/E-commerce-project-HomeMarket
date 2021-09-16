import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Message from "../components/message";
import {
  listProductDetails,
  updateProduct,
} from "../context/product_context_admin";
import { PRODUCT_UPDATE_RESET } from "../actions";
import axios from "axios";

function ProductEditScreen({ match, history }) {
  const productId = match.params.id;

  const [name, setName] = useState("");
  var [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setCountInStock] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo.isAdmin) {
      history.push("/login");
    }
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/products");
    } else {
      if (!product.name || product.id !== Number(productId)) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.inStock);
        setDescription(product.description);
        setFeatured(product.featured);
      }
    }
  }, [dispatch, product, productId, history, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    price = (price * (100 - Discount)) / 100;
    dispatch(
      updateProduct({
        id: productId,
        name,
        price,
        image,
        brand,
        category,
        inStock,
        description,
        featured,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("productid", productId);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "/api/products/upload/",
        formData,
        config
      );

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <Link to="/admin/products">
        <div className="back-container">
          <i
            className="fa fa-arrow-circle-left fa-3x"
            style={{ color: "navy" }}
          ></i>
          <div className="empty-space big">Go Back </div>
        </div>
      </Link>

      <div className="edit-product-container">
        {loading || loadingUpdate ? (
          <Loading />
        ) : error || errorUpdate ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="register-form-container">
            <div className="register-title">Edit Product</div>
            <form onSubmit={submitHandler}>
              {error && <Message variant="danger">{error}</Message>}
              <div className="register-user-details">
                <div className="register-input-box prof">
                  <span className="register-details">Name</span>
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={userInfo.isSalesManager}
                  />
                </div>
                <div className="register-input-box  prof">
                  <span className="register-details">Stock Count</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock"
                    name="Stock"
                    value={inStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    disabled={userInfo.isSalesManager}
                  />
                </div>
                <div className="register-input-box  prof">
                  <span className="register-details">Image URL</span>
                  <input
                    type="text"
                    placeholder="image"
                    name="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    disabled={true}
                  />
                </div>
                <div className="register-input-box  prof">
                  <span className="register-details">Category</span>
                  <input
                    type="text"
                    placeholder="Category"
                    name="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={userInfo.isSalesManager}
                  />
                </div>
                <div className="register-input-box prof">
                  <span className="register-details">Price</span>
                  <input
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={!userInfo.isSalesManager}
                  />
                </div>

                <div className="register-input-box  prof">
                  <span className="register-details">Discount</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Discount"
                    name="Discount"
                    value={Discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    disabled={!userInfo.isSalesManager}
                  />
                </div>
                <form className="login-input-box  prof">
                  <span className="register-details">image-file</span>
                  <input
                    type="file"
                    placeholder="image-file"
                    name="image-file"
                    custom
                    onChange={uploadFileHandler}
                    disabled={userInfo.isSalesManager}
                  />
                </form>
                <div className="login-check-box">
                  <span className="register-details">featured</span>
                  <input
                    type="checkbox"
                    placeholder="check"
                    name="check"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    disabled={userInfo.isSalesManager}
                  />
                </div>
              </div>
              <div className="register-button">
                <input type="submit" value="Update"></input>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductEditScreen;
