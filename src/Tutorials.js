import "./styles.css";
import { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Tutorials = () =>{
  const session = sessionStorage.getItem("logged-in");
  let tokenID = sessionStorage.getItem("Token");
  const [state, setState] = useState([
    {
      id: "",
      title: "",
    }
  ]);
  const usertype = sessionStorage.getItem("TypeOfUser");

  const checkSession = () => {
      if (session === false || session === null || usertype==="seller" || usertype==="customer"){
        sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
        window.location.href = '/Homepage';
      }
    }
  const [callEffect,setCallEffect]= useState(false);
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

    getData("https://apnay-rung-api.herokuapp.com/tutorial/all").then(
      (response) => {
        console.log(response);
        setState(response);
      }
    );
  },[callEffect]);

  const updateTutorial= (tutorial) => {
    sessionStorage.removeItem("update_tutorial");
    sessionStorage.setItem("update_tutorial", JSON.stringify(tutorial));
  }

  async function deleteTutorial(tutorialID){
    const response = await fetch(
      `https://apnay-rung-api.herokuapp.com/tutorial/id/${tutorialID}`,
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
    if(changeBlock === true){
      deleteTutorial(id)
    }
  };

  const renderTableData = () => {
    return state.map((tutorial, index) => {
      const { tutorial_id, title } = tutorial; //destructuring
      return (
        <tr className="data">
          <td>{tutorial_id}</td>
          <td>{title}</td>
          <td>
            <Link to="/UpdateTutorial" className="route" onClick={() => updateTutorial(tutorial)}>
            <button className="link-v2">
              Update
            </button>
            </Link>
            |
            <button className="link-v2" onClick={()=>handleShow(tutorial_id)}>
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
      <AdminNavbar />
      <Memory panel=" Admin Panel " page=" Panel " current=" Tutorials " />
      <div className="min-height-div">
      <h1>View All Tutorials </h1>
      <div className="table-responsive">
        <table className="table table-size-tutorials">
          <thead>
            <tr className="top-row">
              <th>Tutorial ID</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
      <br/>
      <br/>
      <br/>
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this tutorial?</Modal.Body>
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
            Delete Tutorial
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Tutorials;