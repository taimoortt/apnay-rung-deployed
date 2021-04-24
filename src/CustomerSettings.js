import "./styles.css";
import CustomerNavbar from "./AdminNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { useState, useEffect } from "react";
import back_image from "./css/back.png";
import background from "./css/settings-bg.jpg"

const CustomerSettings = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [currPass, setCurrPass] = useState();
  const [newPass, setNewPass] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [address, setAddress] = useState();
  const [customerData, setCustomerData] = useState({})
  const [errors, setErrors] = useState({});
  const [check, setCheck] = useState([]);
  const session = sessionStorage.getItem("logged-in");

  let tokenID = sessionStorage.getItem("Token");
  let updatePass = false;
  const usertype = sessionStorage.getItem("TypeOfUser");

  const checkSession = () => {
    if (session === false || session === null || usertype==="seller" || usertype==="admin"){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
  }
  const handleName = (event) => {
    setName(event.target.value);
    setCheck([1]);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
    setCheck([1]);
  };

  const handleCurrPass = (event) => {
    setCurrPass(event.target.value);
    setCheck([1]);
  };

  const handleNewPass = (event) => {
    setNewPass(event.target.value);
    setCheck([1]);
  };

  const handlePhoneNo = (event) => {
    setPhoneNo(event.target.value);
    setCheck([1]);
  };

  const handleAddress = (event) => {
    setAddress(event.target.value);
    setCheck([1]);
  };

  async function verifyPass() {
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/verify",
      {
        method: "POST",
        withCredentials: false,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: currPass
        })
      }
    );
    return response.json();
  }

  useEffect(() => {
    const getData = async (url) => {
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
    };
    getData("https://apnay-rung-api.herokuapp.com/customer/info").then(
    (response) => {
      setCustomerData(response)
      setName(response.name)
      setEmail(response.email)
      setPhoneNo(response.phone)
      setAddress(response.location)
    }
  );
  }, []);

  async function postData() {
    const form = document.getElementById("empty-form");
    const fileObj = new FormData(form);
    fileObj.append("name", name);
    fileObj.append("email", email);
    if (updatePass === true){
      fileObj.append("password", newPass);
      fileObj.append("passwordChanged", true)
    }else{
      fileObj.append("password", "");
      fileObj.append("passwordChanged", false)
    }
    fileObj.append("address", address);
    fileObj.append("phone", phoneNo);

    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/customer/update",
      {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization:
          `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        },
        body: fileObj
      }
    );
    return response;
  }

  const handleBlur = async (e) => {
    e.preventDefault()
    console.log(`in blurrr`)
    const serverResponse = await verifyPass()
    console.log(`printing blur resp`, serverResponse)
    if (serverResponse.verified === true){
      console.log(`wohoo`)
      setErrors({...errors, currPass: '                     '})
      updatePass = true;
    }else{
      console.log(`oh shit`)
      setErrors({...errors, currPass: 'Password is incorrect'})
    }
  }
  const handleBlur2 = async (e) => {
    if (newPass){
      if (!currPass){
        setErrors({...errors, currPass: 'Enter current password first'})
      }else if (newPass.length < 6){
      setErrors({...errors, newPass: 'Must have 6 characters at least'})
    }else{
      setErrors({...errors, newPass: ''})
    }
    }
  }

  const submitHandler = async(e) => {
    e.preventDefault();
    const serverResponse = await postData();
  }

  const displayPage = () => {
    return (
      <div className="settings-container">
          <br />
          <div className="settings-heading">Account Settings</div>
          <br />
          <form
            enctype="multipart/form-data"
            method="POST"
            id="empty-form"
          ></form>
          <form className="settings-form" enctype="multipart/form-data">
            <p className="label-form">Name:</p>
            <input
              className="input-form"
              type="text"
              value={name}
              onChange={handleName}
            />
            <br />
            <p className="label-form">Email:</p>
            <input
              className="input-form"
              type="text"
              value={email}
              onChange={handleEmail}
            ></input>
            <br />
            <span>
            {errors.currPass && (
              <div className="err-settings-currPass">{errors.currPass}</div>
            )}
            {errors.newPass && (
              <div className="err-settings-newPass">{errors.newPass}</div>
            )}
            </span>
            <br />
            <span>
              <label className="label-form-cp">Current Password</label>
              <label className="label-form-np">New Password</label>
            </span>
            <br />
            <span>
              <input
                className="input-form-cp"
                type="password"
                value={currPass}
                onChange={handleCurrPass}
                onBlur = {handleBlur}
              ></input>
              <input
                className="input-form-np"
                type="password"
                value={newPass}
                onChange={handleNewPass}
                onBlur = {handleBlur2}
              ></input>
            </span>
            <br />
            <p className="label-form">Phone Number:</p>
            <input
              className="input-form"
              type="tel"
              value={phoneNo}
              onChange={handlePhoneNo}
            ></input>
            <br />
            <p className="label-form">Address:</p>
            <textarea
              className="input-des"
              type="text"
              value={address}
              onChange={handleAddress}
              rows="4"
              cols="50"
            ></textarea>
              <input type="submit" className="submit-button" value="Save" />
          </form>
          <br />
      </div>
    )
  }

  return (
    <div className="bg-color">
      {checkSession()}
      <CustomerNavbar />
      <Memory panel="Customer Panel " page="" current=" Account Settings" />{" "}
      <div className="min-height-div">
        {
          displayPage()
        }
        <br/>
        <br/>
        </div>
        <BottomBar />
    </div>
  );
};

export default CustomerSettings;
