import "./styles.css";
import { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Modal, Button } from "react-bootstrap";

const ViewCustomers = () => {
  const session = sessionStorage.getItem("logged-in");
  let tokenID = sessionStorage.getItem("Token");
  const [state, setState] = useState([
    {
      customer_id: 0,
      name: "",
      email: "",
      address: "",
      phone: null,
      blocked: false
    }
  ]);
  const usertype = sessionStorage.getItem("TypeOfUser");
  const checkSession = () => {
      if (session === false || session === null || usertype==="seller" || usertype==="customer"){
        sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
        window.location.href = '/Homepage';
      }
  }
  const [msg, setMsg] = useState([``]);
  const [show, setShow] = useState(false);
  const [id, setID] = useState(0);
  const [block, setBlock] = useState(false)
  const [callEffect,setCallEffect]= useState(false)
  const handleShow = (message,customerID,blockStatus) => {
    setMsg(message)
    console.log(`customer id is ${customerID}`)
    setID(customerID)
    setBlock(blockStatus)
    setShow(true)
    
  };
  const handleClose = (changeBlock) => {
    setShow(false);
    if(changeBlock===true){
      console.log(`sending to backend`)
      sendData()
    }
  };

  async function sendData() {

    const response = await fetch(
      `https://apnay-rung-api.herokuapp.com/customer/block/${id}`,
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
    if (response.status === 200) {
      setCallEffect(!callEffect)
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

    getData("https://apnay-rung-api.herokuapp.com/customer/all").then(
      (response) => {
        console.log(response);
        setState(response);
      }
    );
  }, [callEffect]);

  const Block = (blockStatus,customerID) => {
    if (blockStatus === false) {
      return (
        <button className="link-v2" onClick={()=>handleShow([`Are you sure you want to block this customer?`,`Dont Block`,`Block Customer`],customerID,blockStatus)}>
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
        <button className="link-v2" onClick={()=>handleShow([`Are you sure you want to unblock this customer?`,`Dont Unblock`,`Unblock Customer`],customerID,blockStatus)}>
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
  const renderTableData = () => {
    return state.map((customer, index) => {
      const { customer_id, name, email, address, phone, blocked } = customer; //destructuring
      return (
        <tr class="data">
          <td>{customer_id}</td>
          <td>{name}</td>
          <td>{email}</td>
          <td>{address}</td>
          <td>{phone}</td>
          <td>{Block(blocked,customer_id)}</td>
        </tr>
      );
    });
  };

  return (
    <div>
      {checkSession()}
      <AdminNavbar />
      <Memory panel="Admin Panel " page="" current=" View All Customers" />{" "}
      <div className="min-height-div">
      <h1>View All Customers </h1>
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

export default ViewCustomers;
