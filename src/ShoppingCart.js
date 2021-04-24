import "./styles.css";
import "./momina.css";
import CustomerNavbar from "./CustomerNavbar";
import HomeNavbar from "./HomeNavbar";

import Memory from "./Memory";
import BottomBar from "./BottomBar";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useState, useRef, useEffect } from "react";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";


const Counter = (props) => {
  const [qty, setQuantity] = useState(props.qty);

  const increment = async () => {
    if(qty!==props.maxQty)
    {
      setQuantity((qty) => qty + 1);
      props.costFunc(props.totalBill + props.price);
  
      let storage = await JSON.parse(sessionStorage.getItem("shoppingCart"));
      storage[props.ind].quantity = 1 + storage[props.ind].quantity;
      // console.log(storage[props.ind].quantity);
      sessionStorage.removeItem("shoppingCart");
      sessionStorage.setItem("shoppingCart", JSON.stringify(storage));
      props.stateFunc(storage);
    }
    else{
      props.showFunc(true);
    }

  };
  const decrement = async () => {
    if (qty >1) {
      setQuantity((qty) => qty - 1);
      props.costFunc(props.totalBill - props.price);

      let storage = await JSON.parse(sessionStorage.getItem("shoppingCart"));
      storage[props.ind].quantity = storage[props.ind].quantity - 1;
      // console.log(storage[props.ind].quantity);
      sessionStorage.removeItem("shoppingCart");
      sessionStorage.setItem("shoppingCart", JSON.stringify(storage));
      props.stateFunc(storage);
    }
  };

  return (
    <div key={props.qty} class="quantity-box">
      <p id="qty">{qty}</p>
      <div class="increment-button">
        <button class="increment-button" onClick={increment}>
          {" "}
          <KeyboardArrowUpIcon
            style={{
              fontSize: "small"
            }}
          />{" "}
        </button>
        <button class="increment-button" onClick={decrement}>
          {" "}
          <KeyboardArrowDownIcon
            style={{
              fontSize: "small"
            }}
          />{" "}
        </button>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  const fromsessionStorage = JSON.parse(sessionStorage.getItem("shoppingCart"));
  const [state, setState] = useState(fromsessionStorage);
  const [total, setTotal] = useState(0);
  let tokenID = sessionStorage.getItem("Token");
  const usertype = sessionStorage.getItem("TypeOfUser");
  const [msg2, setMsg2] = useState([``]);
  const [panel, setPanel] = useState("");
  // const usertype = sessionStorage.getItem("TypeOfUser");

  // const checkSession = () => {
  //   if (usertype==="admin" || usertype==="seller"){
  //     sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
  //     window.location.href = '/Homepage';
  //   }
  // }

  //The below block of code will give the initial total bill before any increments/decrements
  const GetNavbar = () =>{
    if (tokenID === null){
      return (
        <HomeNavbar/>
      )
    }
    else if (usertype === "customer"){
      return(
        <CustomerNavbar/>
      )
    }
  }
  
  const getBill = () =>{
    let cost = 0;
    try {
      state.map((product, index) => {
        const { productID, productTitle, quantity, price } = product;
        cost = cost + quantity * price;
      });
    } catch {}
    return cost
  }
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [indexDelete, setIndex] = useState(0);

  
  const [exceed, setExceed]= useState(false)

  const showQtyExceed= () => {
    setExceed(true)
  }

  const closeQtyExceed= () => {
    setExceed(false)
  }

  const handleClose = (isDelete) => {
    setShow(false);
    if (isDelete) {
      let copyState = state.slice();
      copyState.splice(indexDelete, 1);
      sessionStorage.removeItem("shoppingCart");
      sessionStorage.setItem("shoppingCart", JSON.stringify(copyState));
      setState(copyState);
    }
  };
  const handleShow = (index) => {
    setIndex(index);
    setShow(true);
  };
  const handleShow2 = () => setShow2(true);
  const renderTableData = () => {
    try {
      return state.map((product, index) => {
        const { productID, productTitle, quantity, price, image, totalQuantity } = product; //destructuring
        // console.log(quantity);
        let ind = index;

        return (
          <tr className="data">
            <td><img className="shoppingCart-image" src={image} alt="Logo" /></td>
            <td>{productTitle}</td>
            <td>
              <Counter
                key={quantity}
                qty={quantity}
                costFunc={setTotal}
                totalBill={total}
                price={price}
                ind={ind}
                stateFunc={setState}
                maxQty={totalQuantity}
                showFunc={setExceed}
                // closeModal={()=>this.handleClose()}
              />
            </td>
            <td>PKR {price}</td>
            <td>PKR {quantity * price}</td>
            <td>
              <a
                href="#top"
                to="/ShoppingCart"
                className="link"
                onClick={() => handleShow(ind)}
              >
                Delete
              </a>
            </td>
          </tr>
        );
      });
    } catch {
      return (
        <div>
          {/* CART IS EMPTY */}
          <Modal
            show={true}
            onHide={() => handleClose(false)}
            className="delete-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Empty</Modal.Title>
            </Modal.Header>
            <Modal.Body>Shopping cart is empty</Modal.Body>
            <Modal.Footer>
              <Link to="/Catalog">
                <Button
                  variant="primary"
                  onClick={() => handleClose(false)}
                  className="delete-primary"
                >
                  Buy Products
                </Button>
              </Link>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  };
  const handleClose2 = () => {
    setShow2(false);
    if(msg2[1] === `Back`)
    {
      window.location.href = "/ShoppingCart";
    }

  };
  const checkLoggedIn = () =>{
    if (tokenID !== null){
      window.location.href = '/Checkout';
    }
    else
    {
      setMsg2([`You must Log In to continue to Checkout.`, `Back`]);
      handleShow2();
    }
  }
  const PanelCheck = () =>{
    if (usertype === "customer"){
      console.log(`type of user`)
      return "Customer"
    } 
    return ""
  }

  return (
    <div>
      {GetNavbar()}
      <Memory panel={PanelCheck} page="" current=" Shopping Cart" />{" "}
      <div className="min-height-div">
      <h1>Shopping Cart</h1>
      <div className="table-responsive">
        <table className="table table-size">
          <thead>
            <tr className="top-row">
              <th>Product</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Delete Product</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
      <div className="totalBill">Total: {getBill()}</div>
      <div className="outer">
        <div className="inner">
          <Link to="/Catalog">
            <input
              type="submit"
              className="continueShopping-button"
              value="Continue Shopping"
            ></input>
          </Link>
        </div>
        <div className="inner">
            <input
              type="submit"
              className="checkout-button"
              value="Checkout"
              onClick={()=>checkLoggedIn()}
            ></input>
        </div>
      </div>
      </div>
      <BottomBar />
      <Modal
        show={show}
        onHide={() => handleClose(false)}
        className="delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleClose(false)}
            className="delete-secondary"
          >
            Don't Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => handleClose(true)}
            className="delete-primary"
          >
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={handleClose2} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg2[0]}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={()=>handleClose2()}
          >
         {msg2[1] !== "Back" ? <Link to="./ShoppingCart">{msg2[1]}</Link> : msg2[1]}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={exceed} onHide={closeQtyExceed} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Unavailable</Modal.Title>
        </Modal.Header>
        <Modal.Body>The required quantity is not available.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={()=>closeQtyExceed()}
          >
          Back
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ShoppingCart;
