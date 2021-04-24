import "./styles.css";
import { useState, useEffect } from "react";
import SellerNavbar from "./SellerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Inventory = () => {
  let tokenID = sessionStorage.getItem("Token");

  const session = sessionStorage.getItem("logged-in");
  const [state, setState] = useState([]);

  const [callEffect,setCallEffect]= useState(false)
  const usertype = sessionStorage.getItem("TypeOfUser");
  const [empty,SetEmpty]=useState(false)

  const checkSession = () => {
      if (session === false || session === null || usertype==="admin" || usertype==="customer"){
        sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
        window.location.href = '/Homepage';
      }
    }
  useEffect(() => {
    async function getData(url) {
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
    }

    console.log(`hello jee`)
    getData("https://apnay-rung-api.herokuapp.com/inventory/all/mine").then(
      (response) => {
        console.log(response)
        console.log(`length`,response.length)
        if(response.length===0)
        {
          SetEmpty(true)
        }
        setState(response);
        
      }
    );
  }, [callEffect]);

  const viewProduct = (product) => {
    sessionStorage.removeItem("productID");
    sessionStorage.setItem("productID", JSON.stringify(product));
  }; //add product to local storage

  const updateProduct= (product) => {
    sessionStorage.removeItem("update_product");
    sessionStorage.setItem("update_product", JSON.stringify(product));
  }

  async function deleteProduct(itemID){
    const response = await fetch(
      `https://apnay-rung-api.herokuapp.com/inventory/id/${itemID}`,
      {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);

    if (response.status === 200 || response.status === 201 || response.status === 202) {
      console.log(`processed ${!callEffect}`)
      setCallEffect(!callEffect)
    } 
  }

  const [show, setShow] = useState(false);
  const [id, setID] = useState(0);

  const handleShow = (itemID) => {
    setID(itemID)
    setShow(true)
    
  };
  const handleClose = (changeBlock) => {
    setShow(false);
    if(changeBlock===true){
      deleteProduct(id)
    }
    
  };
  const renderTableData = () => {
    return state.map((product, index) => {
      const { item_id, image, title, stock, price, quantityInStock } = product; //destructuring
      return (
        <tr className="data">
          <td>
            <img src={image} alt="Italian Trulli" id="image" />
          </td>
          <td>{title}</td>
          <td>{price}</td>
          <td>{stock}</td>
          <td>
            <Link to="/Product" className="route" onClick={() => viewProduct(product)}>
              <button className="link-v2">
                View
              </button>
            </Link>
            |
            <Link to="/UpdateProduct" className="route" onClick={() => updateProduct(product)}>
            <button className="link-v2">
              Update
            </button>
            </Link>
            |
            <button className="link-v2" onClick={()=>handleShow(item_id)}>
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      {checkSession()}
      <SellerNavbar />
      <Memory panel="Seller Panel" page="" current="Inventory" />{" "}
      <div className="min-height-div">
      <h1>Inventory </h1>
      <div className="table-responsive">
        <table className="table table-size">
          <thead>
            <tr className="top-row">
              <th>Product</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Block</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
        <Button
            variant="secondary"
            className="delete-secondary"
            onClick={()=>handleClose(false)}
          >
            Don't Delete
          </Button>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={()=>handleClose(true)}
          >
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={empty} onHide={()=>handleClose(false)} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Inventory is Empty!</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have not added any products yet</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={()=>handleClose(false)}
          >
            <Link to="./AddProduct">Add Products</Link>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Inventory;
