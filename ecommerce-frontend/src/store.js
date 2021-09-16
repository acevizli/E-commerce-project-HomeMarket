import {
  userDeleteReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateReducer,
  userUpdateProfileReducer,
} from "./reducers/user_reducer";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productDetailsReducer,
  productReviewCreateReducer,
  ReviewListReducer,
  reviewDeleteReducer,
  reviewUpdateReducer,
} from "./reducers/product_reducer_admin";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer,
  shipReducer,
  orderRefundReducer,
  orderDeleteReducer,
} from "./reducers/order_reducer";
const reducer = combineReducers({
  userLogin: userLoginReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userRegister: userRegisterReducer,

  productList: productListReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDetails: productDetailsReducer,
  productReviewCreate: productReviewCreateReducer,
  reviewList: ReviewListReducer,
  reviewUpdate: reviewUpdateReducer,
  reviewDelete: reviewDeleteReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,
  orderRefund: orderRefundReducer,
  orderDelete: orderDeleteReducer,
  ship: shipReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  userRegister: { userInfo: userInfoFromStorage },
  ship: { shippingAddress: shippingAddressFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
