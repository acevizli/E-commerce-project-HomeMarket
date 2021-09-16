import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar, Sidebar, Footer } from "./components";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Home, SingleProduct, Cart, Error, Products } from "./pages";
import UserListScreen from "./pages/UsersPage";
import ProfileScreen from "./pages/ProfilePage";
import UserEditScreen from "./pages/newUserEditPage";
import ProductListScreen from "./pages/ProductListPage";
import ProductEditScreen from "./pages/ProductEditPage";
import CheckoutPage from "./pages/CheckoutPage";
import StripeContainer from "./components/CreditCardPayment/StripeContainer";
import Payment from "./components/CreditCardPayment/Payment";
import EditProfile from "./pages/EditProfilePage";
import Rate from "./components/Rate/Rate";
import Reviews from "./pages/Reviews";
import ReviewScreen from "./pages/ReviewsPage";
import OrderScreen from "./pages/OrderPage";
import OrderListScreen from "./pages/OrderListPage";
import Orders from "./components/Orders/Orders";
import Verify from "./pages/Verify";
function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Sidebar />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <div className="register-page">
              <Register />
            </div>
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/payment" component={StripeContainer} />
          <Route path="/admin/users" component={UserListScreen} />
          <Route path="/admin/products" component={ProductListScreen} />
          <Route path="/admin/reviews" component={ReviewScreen} />
          <Route path="/admin/orders" component={OrderListScreen} />

          <Route exact path="/orders" children={<Orders />} />

          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
          <Route path="/admin/product/:id/edit" component={ProductEditScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/editprofile" component={EditProfile} />
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/user/verify" component={Verify} />
          <Route exact path="/products">
            <Products />
          </Route>
          <Route exact path="/products/:id" children={<SingleProduct />} />
          <Route path="*">
            <Error />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}
export default App;
