import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { saveShippingAddress } from "../../context/order_context";
import { createOrder } from "../../context/order_context";
import { ORDER_CREATE_RESET } from "../../actions";
import { useCartContext } from "../../context/cart_context";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Loading from "../../components/Loading";
import Message from "../../components/message";
function Payment(props) {
  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#000",
        fontWeight: 200,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": { color: "#fce883" },
        "::placeholder": { color: "#000" },
      },
      invalid: {
        iconColor: "#ff0000",
        color: "#ff0000",
      },
    },
  };

  const ship = useSelector((state) => state.ship);
  const { shippingAddress } = ship;

  const stripe = useStripe();
  const elements = useElements();
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, loading, success } = orderCreate;

  const { cart, total_items, total_amount, shipping_fee, clearCart } =
    useCartContext();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [card, setCard] = useState();
  const [CardName, setCardName] = useState();
  const [CardNumber, setCardNumber] = useState();
  const [exdate, setDate] = useState();
  const [cvv, setCVV] = useState();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const history = useHistory();
  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    if (success) {
      dispatch(clearCart);
      dispatch({ type: ORDER_CREATE_RESET });
      history.push(`/order/${order._id}`);
    }
  }, [success, history, userInfo]);

  const [name, setFullName] = useState(userInfo ? userInfo.name : "");
  const [email, setEmail] = useState(userInfo ? userInfo.email : "");
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      console.log(paymentMethod);
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      dispatch(
        createOrder({
          orderItems: cart,
          shippingAddress: shippingAddress,
          totalItem: total_items,
          shippingPrice: shipping_fee,
          totalPrice: total_amount + shipping_fee,
          paymentMethod: paymentMethod,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="payment">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <h2 className="payment-h2"> Checkout </h2>
      <div className="row">
        {loading ? (
          <Loading />
        ) : (
          <div className="col-75">
            {error ? <Message variant="danger">{error}</Message> : <div />}
            <div className="payment-container">
              <form onSubmit={submitHandler}>
                <div className="row">
                  <div className="col-50">
                    <h3>Billing Adress</h3>

                    <label className="payment-label">
                      {" "}
                      <i className="fa fa-user"></i> Full Name{" "}
                    </label>
                    <input
                      className="payment-input"
                      type="text"
                      placeholder="John M. Doe"
                      value={name}
                      onChange={(e) => setFullName(e.target.value)}
                    />

                    <label className="payment-label">
                      {" "}
                      <i className="fa fa-envelope"></i>Email{" "}
                    </label>
                    <input
                      className="payment-input"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="payment-label">
                      {" "}
                      <i className="fa fa-address-card"></i>Address{" "}
                    </label>
                    <input
                      className="payment-input"
                      type="text"
                      placeholder="42th street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />

                    <label className="payment-label">
                      {" "}
                      <i className="fa fa-university"></i>City{" "}
                    </label>
                    <input
                      className="payment-input"
                      type="text"
                      placeholder="Istanbul"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />

                    <div className="row">
                      <div className="col-50">
                        <label className="payment-label">State</label>
                        <input
                          className="payment-input"
                          type="text"
                          placeholder="Turkey"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </div>
                      <div className="col-50">
                        <label className="payment-label">Zip</label>
                        <input
                          className="payment-input"
                          type="number"
                          placeholder="38000"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-50">
                    <h3>Payment</h3>
                    <label className="payment-label"> Accepted Cards</label>
                    <div
                      className="icon-container"
                      style={{ "font-size": "17px" }}
                    >
                      <i
                        className="fa fa-cc-visa fa-2x"
                        aria-hidden={true}
                        style={{ color: "navy" }}
                        style={{ color: "blue" }}
                      ></i>
                      <div className="empty-space"></div>
                      <i
                        className="fa fa-cc-amex fa-2x"
                        aria-hidden={true}
                        style={{ color: "blue" }}
                      ></i>
                      <div className="empty-space"></div>
                      <i
                        className="fa fa-cc-mastercard fa-2x"
                        aria-hidden={true}
                        style={{ color: "red" }}
                      ></i>
                      <div className="empty-space"></div>
                      <i
                        className="fa fa-cc-discover fa-2x"
                        aria-hidden={true}
                        style={{ color: "orange" }}
                      ></i>
                      <div className="empty-space"></div>
                    </div>
                    <label className="payment-label">Name on Card</label>
                    <input
                      className="payment-input"
                      type="text"
                      placeholder="John Moe Doe"
                      value={CardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                    <fieldset className="FormGroup">
                      <div className="FormRow">
                        <CardElement options={CARD_OPTIONS} />
                      </div>
                    </fieldset>
                  </div>
                </div>
                <label className="payment-label">
                  {" "}
                  <input type="checkbox" checked="checked" /> Shipping address
                  same as billing{" "}
                </label>
                <input className="payment-btn" type="submit" value="continue" />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
