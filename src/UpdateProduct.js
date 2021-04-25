import "./styles.css";
import React, { useState } from "react";
import SellerNavbar from "./SellerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const UpdateProduct = () => {
  let productData = JSON.parse(sessionStorage.getItem("update_product"))
  const session = sessionStorage.getItem("logged-in");
  let tokenID = sessionStorage.getItem("Token");
  const [msg, setMsg] = useState([``]);
  const [imageUpdate, setImageUpdate] = useState(false);
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({
    fileName:"Click here to add image"
  });
  const [title, setTitle] = useState(productData.title);
  const [description, setDescription] = useState(productData.description);
  const [category, setCategory] = useState(productData.category);
  const [price, setPrice] = useState(productData.price);
  const [stock, setStock] = useState(productData.stock);
  const usertype = sessionStorage.getItem("TypeOfUser");

  const checkSession = () => {
      if (session === false || session === null || usertype==="customer" || usertype==="admin"){
        sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
        window.location.href = '/Homepage';
      }
    }
  const SubmitHandler = async(event) => {
    event.preventDefault();
    let img_response = 0;
    if (imageUpdate){
      img_response = await sendImage();
    }
    let response = await sendData();
    if(response){
      console.log(response)
    }
    
    console.log(img_response)
    if (response.status === 201 || response.status === 200 || response.status === 202) {
      setMsg([`Product updated successfully!`, `OK`]);
      handleShow();
      sessionStorage.removeItem("update_product");
    }
     else {
      setMsg([`There was an error while updating the product.`, `Back`]);
      handleShow();
    }
  }
  async function sendImage() { //to submit data to the backend
    const form = document.getElementById("empty-form");
    const fileObj = new FormData(form);
    fileObj.append("image", values.image, values.fileName);
    console.log(fileObj)
    try{
      const response = await fetch(
        `https://apnay-rung-api.herokuapp.com/inventory/update/image/${productData.item_id}`,
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
  async function sendData() { //to submit data to the backend
    console.log(`token is ${tokenID}`)
    console.log(typeof(productData.item_id))
    const response = await fetch(
      `https://apnay-rung-api.herokuapp.com/inventory/update/${productData.item_id}`,
      {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: 
          `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          description: description,
          category: category,
          price: price,
          stock: stock
        })
      }
    );
    console.log(response);
    return response;
  }

  const fileHandler = (e) => {
    e.preventDefault();
    console.log(e.target.files[0])
    setValues({
      ...values,
      [e.target.name]: e.target.files[0],
      tempFile: e.target.files[0].name
    });
    values.tempFile = values.fileName;
    console.log(values);
  };
  const setFile = (event) => {
    event.preventDefault();
    setImageUpdate(true)
    if (values.tempFile){
      values.fileName = values.tempFile
    }
  }
  const handleClose = () => {
    setShow(false);
    if(msg[1] === `OK`)
    {
        window.location.href = "/Inventory";
    }
  };
  const handleShow = () => setShow(true);

  const TitleChangeHandler = (event) => {
    setTitle(event.target.value);
  };
  const DescriptionChangeHandler = (event) => {
    setDescription(event.target.value);
  };
  const CategoryChangeHandler = (event) => {
    setCategory(event.target.value);
  };
  const PriceChangeHandler = (event) => {
    setPrice(event.target.value);
  };
  const StockChangeHandler = (event) => {
    setStock(event.target.value);
  };
  return (
    <div className="productForm">
      {checkSession()}
      <SellerNavbar />
      <Memory panel="Seller Panel " page="" current=" Update Product" />{" "}
      <div className="min-height-div" className="image-product">
      <div className="product-container">
      <div className="product-heading">Update Product</div>
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
          value={title}
          onChange={TitleChangeHandler}
          required
        ></input>
        <p className="label-form"> Product Description </p>
        <textarea
          className="input-des"
          type="text"
          name="description"
          value={description}
          onChange={DescriptionChangeHandler}
          rows="4"
          cols="50"
          required
        ></textarea>
        <p className="label-form"> Product Category </p>
        <select
          className="category-dropdown-update"
          name="category"
          value={category}
          onChange={CategoryChangeHandler}
          required
        >
          
          <option value="Bags">Bags</option>
          <option value="Clothing">Clothing</option>
          <option value="Decor">Decor</option>
          <option value="Footwear">Footwear</option>
          <option value="Jewellery">Jewellery</option>
          <option value="Crockery">Crockery</option>
        </select>
        <p className="label-form">Upload Product Image</p>
        <div>
            <label for="upload-photo" className="upload-file-product">
              {values.fileName}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*, application/pdf"
              onChange={fileHandler}
              id="upload-photo"
            />
            <button className="upload" onClick={(e)=>{setFile(e)}}>Upload</button>
          </div>
        <p className="label-form">Product Price</p>
        <input
          className="input-form"
          type="number"
          name="price"
          value={price}
          onChange={PriceChangeHandler}
          required
        ></input>
        <p className="label-form">Number of Pieces in Stock</p>
        <input
          className="input-form"
          type="number"
          name="stock"
          value={stock}
          onChange={StockChangeHandler}
          required
        ></input>
        <br />
          <input
            type="submit"
            className="update-button2"
            value="Update"
          ></input>
      </form>
      </div>
      <br/>
      <br/>
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
        <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[0]}</Modal.Body>
        <Modal.Footer>
        <Button
            variant="primary"
            className="delete-primary"
            onClick={handleClose}
        >
            {msg[1] !== "Back" ? <Link to="/Inventory"><a>{msg[1]}</a></Link> : msg[1]}
        </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default UpdateProduct;
