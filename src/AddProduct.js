import "./styles.css";
import "./momina.css";
import "./vafa.css";
import React, { useState } from "react";
import SellerNavbar from "./SellerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const usertype = sessionStorage.getItem("TypeOfUser");
  const session = sessionStorage.getItem("logged-in");
  let tokenID = sessionStorage.getItem("Token");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [values, setValues] = useState({
    fileName:"Click here to choose file",
    file: "",
  });
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [msg, setMsg] = useState([``]);
  const [show, setShow] = useState(false);

  const checkSession = () => {
    if (session === false || session === null || usertype==="admin" || usertype==="customer"){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
  }
  const SubmitHandler = async(event) => {
    event.preventDefault();
    setPrice(parseInt(price))
    setStock(parseInt(stock))
    console.log("in submit")
    let response;
    response = await sendData();
    console.log("coming p")
    console.log(response)
    if (response.status === 201 || response.status === 200) {
      setMsg([`Product added to inventory successfully!`, `Back to My Panel`]);
      handleShow();
    } else {
      setMsg([`There was an error while adding the product.`, `Back`]);
      handleShow();
    }
  }

  const fileHandler = (e) => {
    console.log(e.target.files[0])
    setValues({
      ...values,
      [e.target.name]: e.target.files[0],
      tempFile: e.target.files[0].name
    });
    values.tempFile = values.file.name;
    // values.tempFile = values.file.name;
    console.log(values);
  };

  const setFile = () => {
    if (values.tempFile){
      values.fileName = values.tempFile
    }
  }
  async function sendData() { //to submit data to the backend
    // console.log(`token is ${tokenID}`)
    const form = document.getElementById("empty-form");
    const fileObj = new FormData(form);
    console.log(title,description, category)
    fileObj.append("title", title);
    fileObj.append("description", description);
    fileObj.append("category", category);
    fileObj.append("image", values.file, values.fileName);
    fileObj.append("price", price);
    fileObj.append("stock", stock);
    console.log("IM ERERREER")
    console.log(fileObj)
    try{
      const response = await fetch(
        "https://apnay-rung-api.herokuapp.com/inventory/new",
        {
          method: "POST",
          withCredentials: true,
          credentials: "include",
          headers: {Authorization:
            `Bearer ${tokenID}`
          },
          body: fileObj
        }  
      );
      return response; 
    }
    catch(err){
      console.log(err)
    }
  }
  const handleClose = () => {
    setShow(false);
    if(msg[1] === `Back to My Panel`)
    {
      window.location.href = "/SellerPanel";
    }

  };
  const handleShow = () => setShow(true);
  const TitleChangeHandler = (event) => {
    // console.log("in title", event.target.value)
    setTitle(event.target.value);
    console.log("in title", title)
  };
  const DescriptionChangeHandler = (event) => {
    setDescription(event.target.value);
  };
  const CategoryChangeHandler = (event) => {
    setCategory(event.target.value);
  };
  const PriceChangeHandler = (event) => {
    console.log(values)
    setPrice(event.target.value);
  };
  const StockChangeHandler = (event) => {
    setStock(event.target.value);
  };

  return (
    <div>
      {checkSession()}
      <SellerNavbar />
      <Memory panel="Seller Panel " page="" current=" Add Product" />{" "}
      <div className="min-height-div" className="image-product">
        <div className="product-container">
      <div className="product-heading">Add Product</div>
      <form
          enctype="multipart/form-data"
          method="POST"
          id="empty-form"
        ></form>
      <form className="form-product" enctype="multipart/form-data" onSubmit={SubmitHandler}>
        <p className="label-form"> Product Title </p>
        <input
          className="input-form"
          type="text"
          name="title"
          placeholder="e.g. Shawl"
          onChange={TitleChangeHandler}
          required
        ></input>
        <p className="label-form"> Product Description </p>
        <textarea
          className="input-des"
          type="text"
          name="description"
          placeholder="e.g. Color: purple, Length: 2m"
          onChange={DescriptionChangeHandler}
          rows="4"
          cols="50"
          required
        ></textarea>
        <p className="label-form"> Product Category </p>
        <select
          className="category-dropdown"
          name="category"
          // value="Bags"
          onChange={CategoryChangeHandler}
        >
          <option value="">--</option>
          <option value="Bags">Bags</option>
          <option value="Decor">Decor</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
          <option value="Jewellery">Jewellery</option>
          <option value="Crockery">Crockery</option>
        </select>
        <p className="label-form">Upload Product Image</p>
        <span>
            <label for="upload-photo" className="upload-file-product">
              {values.fileName}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*, application/pdf"
              placeholder="Click here to choose image"
              onChange={fileHandler}
              id="upload-photo"
              required
            />
            <button className="upload" onClick = {setFile}>Upload</button>
          </span>
        <p className="label-form">Product Price</p>
        <input
          className="input-form"
          type="number"
          name="price"
          placeholder="e.g. 2000"
          onChange={PriceChangeHandler}
          required
        ></input>
        <p className="label-form">Number of Pieces in Stock</p>
        <input
          className="input-form"
          type="number"
          name="stock"
          placeholder="e.g. 20"
          onChange={StockChangeHandler}
          required
        ></input>
        <br />
        <div className="checkout-buttons">
          <input
            type="submit"
            className="submit-button2"
            value="Done"
          ></input>
        </div>
      </form>
      </div>
      <br/>
      <br/>
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[0]}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={handleClose}
          >
            {msg[1] !== "Back" ? <Link to="./SellerPanel"><a>{msg[1]}</a></Link> : msg[1]}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default AddProduct;
