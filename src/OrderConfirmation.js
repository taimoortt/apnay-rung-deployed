import "./styles.css";
import "./momina.css";
import CustomerNavbar from "./CustomerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  const fromsessionStorage = JSON.parse(sessionStorage.getItem("shoppingCart"));
  const customerInfo = JSON.parse(sessionStorage.getItem("customerInformation"));
  const [state, setState] = useState(fromsessionStorage);
  let tokenID = sessionStorage.getItem("Token");
  const[sellers, setSellers] = useState([])
  const session = sessionStorage.getItem("logged-in");
  let total = 0;
  let items = [];

  let address = customerInfo.shipping_address;

  const infoObject = () => {
    fromsessionStorage.map((product, index) => {
      if (items.length === 0) {
        // console.log(items);
        let subtotal = product.quantity * product.price;
        items[0] = [product.productID, product.quantity, subtotal];
      } else {
        let subtotal = product.quantity * product.price;
        items.push([product.productID, product.quantity, subtotal]);
      }
    });
  };
  const usertype = sessionStorage.getItem("TypeOfUser");

  const checkSession = () => {
      if (session === false || session === null || usertype==="seller" || usertype==="admin"){
        sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
        window.location.href = '/Homepage';
      }
    }

  const renderBill = () => {
    let bill = 0;
    state.map((product, index) => {
      const { productID, productTitle, quantity, price } = product;
      bill = bill + quantity * price;
    });
    total = bill;
    return bill;
  };

  const renderTableData = () => {
    return state.map((product, index) => {
      const { productID, productTitle, quantity, price, image } = product;
      return (
        <tr className="data">
          <td><img className="shoppingCart-image" src={image} alt="Logo" /></td>
          <td>{productTitle}</td>
          <td>{quantity}</td>
          <td>{price}</td>
          <td>{quantity * price}</td>
        </tr>
      );
    });
  };

  const [msg, setMsg] = useState([``]);

  async function sendNotification(id) {

    sellers.map( async (id,index)=>{
      const response = await fetch(
        "https://apnay-rung-api.herokuapp.com/notification/new",
        {
          method: "POST",
          withCredentials: true,
          credentials: "include",
          headers: {
            // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik11aGFtbWFkIFJvaGFuIEh1c3NhaW4iLCJ0eXBlT2ZVc2VyIjoiYWRtaW4iLCJpYXQiOjE2MTY4NDE4MTZ9.HJvh_8caLMReaDmJFCEklgtP9u86usbNIZ4FxOrIawk`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title:"A new order has been placed. Please visit Current Orders for more details.", 
            type:"message", 
            details: null, 
            seller_id : id
          })
        }
      );
  
      console.log(`response from notification`, response)
    })
  }

  const isPresent= (sellerID,arr) => {

    console.log(`items length is ${arr.length}`)
    for(let i=0; i< arr.length; i++){
      if(arr[i]===sellerID)
      {
        return true
      }
    }
    return false
  } //if item is already present

  const extractSellers=()=>{

    let allSellers=[]
    state.map((product,index)=>{
      const { sellerID } = product;
      let isTrue= isPresent(sellerID,allSellers)
      if(isTrue===false){
        console.log(`is true ${isTrue}`)
        allSellers.push(sellerID)
      }
    })

    console.log(`all sellers are ${allSellers}`)
    setSellers(allSellers)
    
  }

  async function sendData() {
    infoObject();
    console.log(`token is  ${tokenID}`)
    console.log(items)
    console.log(total)
    // console.log(cust)
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/order/new",
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items,
          totalamount: total,
          delivery_status: "processing",
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          billing_address: customerInfo.billing_address,
          shipping_address: customerInfo.shipping_address,
          payment_method: customerInfo.payment
        })
      }
    );

    console.log(response);

    if (response.status === 201 || response.status === 200 || response.status === 202) {
      
      setMsg([`You order has been placed.`, `Back to Home`]);
      handleShow();
      extractSellers()
      sendNotification()
      sessionStorage.removeItem("shoppingCart");
      sessionStorage.removeItem("customerInformation");
    } else {
      setMsg([`Your order could not be placed.Try again.`, `Back`]);
      handleShow();
    }
  }
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    if(msg[1]===`Back to Home`)
    {
      window.location.href = "/Homepage";
    }

  };

  const handleShow = () => setShow(true);
  return (
    <div>
      {checkSession()}
      <CustomerNavbar />
      <Memory
        panel="Customer Panel "
        page="Shopping Cart / Checkout /"
        current=" Order Confirmation"
      />{" "}
      {/* when three links needed in panel, include a '/' in the middle 'page' argument */}
      <div className="min-height-div">
      <h1>Order Confirmation</h1>
      <h2>Order Details</h2>
      <div className="table-responsive">
        <table className="table table-size">
          <thead>
            <tr className="top-row">
              <th>Product</th>
              <th>Product Title</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
      <div className="totalBill">
        <br />
        Total: {renderBill()}
        <br />
      </div>
      <div className="shippingAddress">
        <h3>Shipping address</h3>
        {address}
      </div>
      <input
        type="submit"
        className="confirmOrder-button-v2"
        value="Confirm Order"
        onClick={sendData}
      ></input>
      </div>
      <br/>
      <br/>
      <br/>

      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Order confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[0]}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={handleClose}
          >
            {msg[1] !== "Back" ? <Link to="./Homepage"><a>{msg[1]}</a></Link> : msg[1]}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default OrderConfirmation;
