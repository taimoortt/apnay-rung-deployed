import "./styles.css";
import "./momina.css";
import AdminNavbar from "./AdminNavbar";
import { useState, useEffect } from "react";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { Modal, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.css";
const ViewSellers = () => {
  const session = sessionStorage.getItem("logged-in");
  const usertype = sessionStorage.getItem("TypeOfUser");
  const checkSession = () => {
      if (session === false || session === null || usertype==="seller" || usertype==="customer"){
        sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
        window.location.href = '/Homepage';
      }
  }

  const [state, setState] = useState([
    {
      seller_id: 0,
      name: "",
      email: "",
      cnic: "",
      location: "",
      bio: null,
      weeklyartisan: false,
      blocked: true,
      profile_picture: null
    }
  ]);

  const [msg, setMsg] = useState([``]);

  const [show, setShow] = useState(false);

  const [id, setID] = useState(0);

  const [block, setBlock] = useState(false)

  const [callEffect,setCallEffect]= useState(false)

  const handleShow = (message,sellerID,blockStatus) => {
    setMsg(message)
    setID(sellerID)
    setBlock(blockStatus)
    setShow(true)
    
  };
  const handleClose = (changeBlock) => {
    setShow(false);
    if(changeBlock==true){
      console.log(`sending to backend`)
      sendData()
    }
    
  };

  async function sendData() {

    const response = await fetch(
      `https://apnay-rung-api.herokuapp.com/seller/block/${id}`,
      {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik11aGFtbWFkIFJvaGFuIEh1c3NhaW4iLCJ0eXBlT2ZVc2VyIjoiYWRtaW4iLCJpYXQiOjE2MTY4NDE4MTZ9.HJvh_8caLMReaDmJFCEklgtP9u86usbNIZ4FxOrIawk`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);

    if (response.status === 200) {
      
      console.log(`processed ${!callEffect}`)
      setCallEffect(!callEffect)
    }  
  }

  async function sendSpotlight(sellerID) {

    const response = await fetch(
      ` https://apnay-rung-api.herokuapp.com/seller/spotlight/${sellerID}`,
      {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik11aGFtbWFkIFJvaGFuIEh1c3NhaW4iLCJ0eXBlT2ZVc2VyIjoiYWRtaW4iLCJpYXQiOjE2MTY4NDE4MTZ9.HJvh_8caLMReaDmJFCEklgtP9u86usbNIZ4FxOrIawk`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);

    if (response.status === 200 || response.status===202) {
      
      console.log(`processed ${!callEffect}`)
      setCallEffect(!callEffect)
    }  
  }

  useEffect(() => {

    const filterSeller= (response) => {
      let allSellers=[]
      response.map((seller,index)=>{
        const {approved}= seller
        if(approved===true){
          try{
            allSellers.push(seller)
          }
          catch{
            allSellers[0]=seller
          }
        }
      })
      return allSellers
    }

    async function getData(url) {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik11aGFtbWFkIFJvaGFuIEh1c3NhaW4iLCJ0eXBlT2ZVc2VyIjoiYWRtaW4iLCJpYXQiOjE2MTY4NDE4MTZ9.HJvh_8caLMReaDmJFCEklgtP9u86usbNIZ4FxOrIawk",
          "Content-Type": "application/json"
        }
      });

      return response.json();
    }

    getData("https://apnay-rung-api.herokuapp.com/seller/all").then(
      (response) => {
        console.log(response);
        const sellers= filterSeller(response)
        setState(sellers);
        console.log(state)
      }
    );
  }, [callEffect]);

  const Block = (blockStatus,sellerID) => {
    if (blockStatus === false) {
      return (
        <button className="link-v2" onClick={()=>handleShow([`Are you sure you want to block this Seller?`,`Dont Block`,`Block Seller`],sellerID,blockStatus)}>
          <PersonAddDisabledIcon
            style={{
              fontSize: "medium"
            }}
          />
          Block
        </button>
      );
    } else {
      return (
        <button className="link-v2" onClick={()=>handleShow([`Are you sure you want to unblock this Seller?`,`Dont Unblock`,`Unblock Seller`],sellerID,blockStatus)}>
          <PersonAddIcon
            style={{
              fontSize: "medium"
            }}
          />
          Unblock
        </button>
      );
    }
  };

  const Spotlight = (weeklyartisan,sellerID) => {
    if (weeklyartisan === false) {
      return (
        <button className="link-v2" onClick={()=>sendSpotlight(sellerID)}>
          <FlashOnIcon
            style={{
              fontSize: "medium"
            }}
          />
          Spotlight
        </button>
      );
    } else {
      return (
        <button className="link-v2" onClick={()=>sendSpotlight(sellerID)}>
          <FlashOnIcon
            style={{
              fontSize: "medium"
            }}
          />
          Remove Spotlight
        </button>
      );
    }
  };
  const renderTableData = () => {
    return state.map((seller, index) => {
      const {
        seller_id,
        name,
        email,
        cnic,
        location,
        bio,
        weeklyartisan,
        blocked,
        profile_picture,
        phone
      } = seller; //destructuring
      return (
        <tr class="data">
          <td>{seller_id}</td>
          <td>{name}</td>
          <td>{email}</td>
          <td>{location}</td>
          <td>{phone}</td>
          <td>
            {Block(blocked,seller_id)}
            <br></br>
            {Spotlight(weeklyartisan,seller_id)}
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <AdminNavbar />
      <Memory panel="Admin Panel " page="" current=" View Sellers" />{" "}
      {/* when three links needed in panel, include a '/' in the middle 'page' argument */}
      <div className="min-height-div">
      <h1>View Sellers </h1>
      <div class="table-responsive">
        <table class="table table-size">
          <thead>
            <tr class="top-row">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
      <br />
      <br />
      <br />
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Block</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[0]}</Modal.Body>
        <Modal.Footer>
        <Button
            variant="secondary"
            className="delete-secondary"
            onClick={()=>handleClose(false)}
          >
            {msg[1]}
            {/* {msg[1] !== "Dont Unblock" ? <Link to="./ViewSellers">{msg[1]}</Link> : msg[1]} */}
          </Button>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={()=>handleClose(true)}
          >
            {msg[2]}
            {/* {msg[2] !== "Dont block" ? <Link to="./ViewSellers">{msg[2]}</Link> : msg[2]} */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewSellers;
