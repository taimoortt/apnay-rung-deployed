import "./styles.css";
import "./maham.css";
import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
const CreateTutorial = () =>{
    //add post request to send to backend and uncomment Link on submit button
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    let tokenID = sessionStorage.getItem("Token");
    const [msg, setMsg] = useState([``]);
    const [show, setShow] = useState(false);
    const session = sessionStorage.getItem("logged-in");
    const usertype = sessionStorage.getItem("TypeOfUser");

    const checkSession = () => {
        if (session === false || session === null || usertype==="seller" || usertype==="customer"){
          sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
          window.location.href = '/Homepage';
        }
      }
    const SubmitHandler = (event) => {
        event.preventDefault();
        console.log("in submit")
        sendData()
    }
    async function sendData() {
        console.log(`token is ${tokenID}`)
        const response = await fetch(
          "https://apnay-rung-api.herokuapp.com/tutorial/new",
          {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: `Bearer ${tokenID}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                content: link,
                description: description
            })
          }
        );
    
        console.log(response);
        if (response.status === 201) {
          setMsg([`Tutorial Added Successfully!`,`OK`]);
          handleShow();
        } else {
          setMsg([`There was an error adding the tutorial.`, `Back`]);
          handleShow();
        }
      }
    const handleClose = () => {
    setShow(false);
    if(msg[1] === `OK`)
    {
        window.location.href = "/AdminPanel";
    }

    };
    const handleShow = () => setShow(true);

    const titleChangeHandler = (event)=>{
        setTitle(event.target.value);
    }
    const descriptionChangeHandler = (event)=>{
        setDescription(event.target.value);
    }
    const linkChangeHandler = (event)=>{
        setLink(event.target.value);
    }
    return (
        <div>
            {checkSession()}
            <AdminNavbar/>
            <Memory panel="Admin" page="Tutorials" current="Create Tutorial"/>
            <div className="min-height-div" className="image-product">
              <div className="tutorial-container">
              <div className="checkout-heading">Create New Tutorial</div>
                <form className="form-product">
                <p className="label-form"> Title </p>
                <input
                className="input-form"
                type="text"
                name="title"
                placeholder="Enter a title for your video tutorial"
                onChange={titleChangeHandler}
                required
                ></input>
                <p className="label-form">Description</p>
                <textarea
                className="tutorial-des"
                type="text"
                name="description"
                placeholder="Enter descrtiption to explain what the video is about"
                onChange={descriptionChangeHandler}
                rows="4"
                cols="50"
                required
                ></textarea>
                <p className="label-form"> Link ID</p>
                <input
                className="input-form"
                type="text"
                name="link"
                placeholder="Enter Youtube ID of video"
                onChange={linkChangeHandler}
                required
                ></input>
                <div className="checkout-buttons">
                <input
                    type="submit"
                    className="create-tutorial-btn"
                    value="Create"
                    onClick={SubmitHandler}
                ></input>
                </div>
              </form>
              </div>
            </div>
            <BottomBar/>
            <Modal show={show} onHide={handleClose} className="delete-modal">
                <Modal.Header closeButton>
                <Modal.Title>Tutorial</Modal.Title>
                </Modal.Header>
                <Modal.Body>{msg[0]}</Modal.Body>
                <Modal.Footer>
                <Button
                    variant="primary"
                    className="delete-primary"
                    onClick={handleClose}
                >
                    {msg[1] !== "Back" ? <Link to="./AdminPanel"><a>{msg[1]}</a></Link> : msg[1]}
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default CreateTutorial;