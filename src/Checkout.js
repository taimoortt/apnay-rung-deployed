import "./styles.css";
import "./maham.css";
import React, { useState, useEffect } from "react";
import CustomerNavbar from "./CustomerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Link } from "react-router-dom";
const Checkout = () => {

  const usertype = sessionStorage.getItem("TypeOfUser");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ship_address, setShipAddress] = useState("");
  const [bill_address, setBillAddress] = useState("");
  const [additional_info, setAdditionalInfo] = useState("");
  const [payment, setPayment] = useState("");
  const [checkAddress, setCheckAddress] = useState(true);
  let tokenID = sessionStorage.getItem("Token");
  const session = sessionStorage.getItem("logged-in");

  const checkSession = () => {
    if (session === false || session === null || usertype==="seller" || usertype==="admin"){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
  }
  useEffect(() => {
    const getData = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization:
          `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        }
      });
      return response.json();
    };
 
    getData("https://apnay-rung-api.herokuapp.com/customer/info").then(
    (response) => {
      console.log(`checkout response: ${response}`)
      console.log(response);
      setName(response.name);
      setEmail(response.email)
      setPhone(response.phone)
      setShipAddress(response.address)
    }
  );
  }, []);

  const SubmitHandler = (event) => {
    console.log(`submitted form`);
    let state_data = {
      name: name,
      email: email,
      phone: phone,
      shipping_address: ship_address,
      billing_address: bill_address,
      additional_info: additional_info,
      payment: payment
    }
    // console.log(state_data);
    sessionStorage.setItem("customerInformation", JSON.stringify(state_data));
  };
  const NameChangeHandler = (event) => {
    setName(event.target.value);
  };
  const EmailChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const PhoneChangeHandler = (event) => {
    setPhone(event.target.value);
  };
  const ShippingChangeHandler = (event) => {
    setShipAddress(event.target.value);
  };
  const BillingAddressChangeHandler = (event) => {
    console.log(checkAddress)
    if (checkAddress){
      setBillAddress(ship_address);
    }
    else
    {
      setBillAddress("");
    }
    setCheckAddress(!checkAddress);
    console.log(`billing address ${bill_address}`)
  };
  const BillingAddressAdd = (event) => {
    setBillAddress(event.target.value);
  };
  const InfoChangeHandler = (event) => {
    setAdditionalInfo(event.target.value);
  };
  const PaymentChangeHandler = (event) => {
    setPayment(event.target.value);
  };
  return (
    <div className="CheckoutForm">
      {checkSession()}
      <CustomerNavbar />
      <Memory
        panel="Customer Panel "
        page="Shopping Cart"
        current=" Checkout"
      />{" "}
      <div className="min-height-div">
      <h1>Checkout</h1>
      <form className="form-product" onSubmit={SubmitHandler}>
        <p className="label-form"> Customer Name </p>
        <input
          className="input-form"
          type="text"
          name="name"
          value={name}
          onChange={NameChangeHandler}
        ></input>
        <p className="label-form"> Customer Email Address </p>
        <input
          className="input-form"
          type="email"
          name="email"
          value={email}
          onChange={EmailChangeHandler}
        ></input>
        <p className="label-form"> Customer Phone Number </p>
        <input
          className="input-form"
          type="text"
          name="phone"
          value={phone}
          onChange={PhoneChangeHandler}
        ></input>
        <p className="label-form">Shipping Address</p>
        <input
          className="input-form"
          type="text"
          name="ship_address"
          value={ship_address}
          onChange={ShippingChangeHandler}
        ></input>
        <p className="label-form">Billing Address</p>
        <label className="checkbox-form-new">
          <input
            // className="checkbox-form"
            type="checkbox"
            name="check-billing"
            value={bill_address}
            onClick={BillingAddressChangeHandler}
          ></input>
          Same as Shipping Address
        </label>
        <input
          className="input-form"
          type="text"
          name="bill_address"
          value={bill_address}
          onChange={BillingAddressAdd}
        ></input>
        <p className="label-form">Additional Information</p>
        <textarea
          className="input-des"
          type="text"
          name="additional_info"
          placeholder="e.g. Please send in blue color"
          onChange={InfoChangeHandler}
          rows="4"
          cols="50"
        ></textarea>
        <p className="label-form">Payment Method</p>
        <label className="checkbox-form-new">
          <input
            // className="radio-label"
            type="radio"
            name="payment"
            value="Cash on Delivery"
            onClick={PaymentChangeHandler}
          ></input>
          Cash on Delivery
        </label>
        <br />
        <label className="checkbox-form-new">
          <input
            // className="radio-label"
            type="radio"
            name="payment"
            value="Bank Transfer"
            onClick={PaymentChangeHandler}
          ></input>
          Bank Transfer
        </label>
        <p className="label-form-box">
          {" "}
          Please send the Bill Amount to our Bank Account and send the receipt
          to us by mail or by WhatsApp to confirm your order.
          <br /> IBAN: PK48HABB12345678910
        </p>{" "}
        <div className="checkout-buttons">
          <Link to="/ShoppingCart">
          <input
            type="submit"
            className="submit-button2"
            value="Return to Cart"
          ></input>
          </Link>
          <Link to="/OrderConfirmation">
          <input
            type="submit"
            className="submit-button3"
            value="Confirm Order"
            onClick={SubmitHandler}
          ></input>
          </Link>
        </div>
      </form>
      <br />
      <br />
      <br />
      </div>
      <BottomBar />
    </div>
  );
};
export default Checkout;
