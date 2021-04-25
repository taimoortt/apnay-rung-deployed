import "./styles.css";
import "./momina.css";
import AdminNavbar from "./AdminNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ApproveSellers = () => {
  const session = sessionStorage.getItem("logged-in");
  const usertype = sessionStorage.getItem("TypeOfUser");
  let tokenID = sessionStorage.getItem("Token");
  const [state, setState] = useState([]);
  const [empty,SetEmpty]=useState(false)
  const checkSession = () => {
    if (session === false || session === null || usertype==="seller" || usertype==="customer"){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
  }

  const [callEffect,setCallEffect]= useState(false)
  const [approval, setApprove] = useState(`approve`)
  const [id, setID] = useState(0);

  async function sendData() {

    const response = await fetch(
      `https://apnay-rung-api.herokuapp.com/seller/${approval}/${id} `,
      {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);

    if (response.status === 200 || response.status === 201 || response.status === 202 ) {
      console.log(`processed ${!callEffect}`)
      setCallEffect(!callEffect)
    }  
  }

  const [showPicture, setPictureModal] = useState(false);
  const [cnic, setCnic]=useState()
  const [url, setURL]= useState(0)

  async function getImage(seller_id) {
    setURL(`https://apnay-rung-api.herokuapp.com/seller/cnic/${seller_id}`)
    setPictureModal(true)
  }

  async function sendNotification() {


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
          title:"Your account has been approved. You can now sell products!", 
          type:"message", 
          details: null, 
          seller_id : id
        })
      }
    );

    console.log(`response from notification`, response)

  }
  const [msg, setMsg] = useState([``]);
  const [show, setShow] = useState(false);
  
  const handleShow = (message,sellerID,approvalStatus) => {
    setMsg(message)
    setID(sellerID)
    setApprove(approvalStatus)
    setShow(true)
    
  };
  const handleClose = (changeBlock) => {
    setShow(false)
    SetEmpty(false)
    console.log(`approval is ${approval}`)
    if(changeBlock === true){
      console.log(`sending to backend`)
      
      sendData()
      if(approval===`approve`)
      {
        sendNotification()
      }
    }
    else if(approval===`empty`)
    {
      console.log(`mein empty mein hun :()`)
      window.location.href = "/AdminPanel";
    }
  };


  const closePicture= () => {
    setPictureModal(false);
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

    getData("https://apnay-rung-api.herokuapp.com/seller/all/unapproved").then(
      (response) => {
        if(response.length===0)
        {
          setApprove(`empty`)
          SetEmpty(true)
        }
        setState(response);
      }
    );
  }, [callEffect]);


  const renderTableData = () => {
    return state.map((seller, index) => {
      const { seller_id, name, email, location, cnic } = seller; //destructuring
      return (
        <tr className="data">
          <td>{seller_id}</td>
          <td>{name}</td>
          <td>{email}</td>
          <td>{location}</td>
          <td>
            <button className="link-v2" onClick={()=>getImage(seller_id)}>
              View Image
            </button>
          </td>
          <td>
            <button className="link-v2" onClick={()=>handleShow([`Are you sure you want to approve this seller`,`Don't Approve`,`Approve Seller`],seller_id,`approve`)}>
              Approve
            </button>
            |
            <button className="link-v2" onClick={()=>handleShow([`Are you sure you want to reject this seller`,`Don't Reject`,`Reject Seller`],seller_id,`disapprove`)}>
              Reject
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
      <Memory panel="Admin Panel " page="" current=" Approve Sellers" />{" "}
      <div className="min-height-div">
      <h1>Approve Sellers</h1>
      <div className="table-responsive">
        <table className="table table-size">
          <thead>
            <tr className="top-row">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>CNIC Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      </div>
      <BottomBar />
      <Modal show={showPicture} onHide={closePicture} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>CNIC Image</Modal.Title>
        </Modal.Header>
        <Modal.Body><img className="shoppingCart-image" src={url} alt="Logo" /></Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Seller Approval</Modal.Title>
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

      <Modal show={empty} onHide={()=>handleClose(false)} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>No New Sellers</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have no new requests to process.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={()=>handleClose(false)}
          >
            <Link to="./AdminPanel">Return to Panel</Link>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ApproveSellers;
