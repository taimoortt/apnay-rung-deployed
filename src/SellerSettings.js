import "./styles.css";
import SellerNavbar from "./SellerNavbar";
import Memory from "./Memory";
import "./styles.css";
import { useState, useEffect } from "react";
import DefaultImg from "./css/upload-picture.jpeg"
import { Modal, Button} from "react-bootstrap";
import BottomBar from "./BottomBar";



const SellerSettings = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [currPass, setCurrPass] = useState();
  const [newPass, setNewPass] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [address, setAddress] = useState();
  const [sellerData, setSellerData] = useState({})
  const [errors, setErrors] = useState({});
  const [bio, setBio] = useState();
  const [picture, setPicture] = useState([]);
  const [showPicture, setShowPicture] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [updatePass, setUpdatePass] = useState(false)



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  
  
  let tokenID = sessionStorage.getItem("Token");
  // let updatePass = false;
  const session = sessionStorage.getItem("logged-in");
  const usertype = sessionStorage.getItem("TypeOfUser");

  const checkSession = () => {
    if (session === false || session === null || usertype==="admin" || usertype==="customer"){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
  }



  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleCurrPass = (event) => {
    console.log(`printing pass`, event.target.value)
    setCurrPass(event.target.value);
  };

  const handleNewPass = (event) => {
    setNewPass(event.target.value);
  };

  const handlePhoneNo = (event) => {
    setPhoneNo(event.target.value);
  };

  const handleAddress = (event) => {
    setAddress(event.target.value);
  };

  const handleBio = (event) => {
    setBio(event.target.value);
  }

  async function sendPicture() {
    const form = document.getElementById("empty-form");
    const fileObj = new FormData(form);
    console.log(picture[picture.length-1])
    fileObj.append("profile_picture", picture[picture.length-1]);
    // console.log(temp);
    // console.log(questions_data);
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/seller/update/profile_picture",
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization:
          `Bearer ${tokenID}`,
        },
        body: fileObj
      }
    );
    return response;
  }

  const handlePicture = (event) => {
    console.log(`picture`, picture)
    setPicture([...picture,event.target.files[0]])
    setShowPicture([...picture,URL.createObjectURL(event.target.files[0])])
  }

  async function postData() {
    let passChanged = false
    if (updatePass){
      passChanged = true
    }else{
      setNewPass("")
      passChanged = false
    }
    const temp = {
      name: name, 
      email: email, 
      password: newPass, 
      passwordChanged: passChanged, 
      location: address, 
      phone: phoneNo, 
      bio: bio
    }
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/seller/update",
      {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization:
          `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(temp)
      }
    );
    return response;
  }

  const submitHandler = async(e) => {
    console.log(`in submit handler`)

    e.preventDefault()

    const serverResponse = await postData()
    const serverResponsePicture = await sendPicture()

    console.log(serverResponse)
    console.log(serverResponsePicture)
    if (serverResponse.status === 400){
      console.log(`in bad request`)
      const responseJSON = await serverResponse.json()
      console.log(responseJSON)
      const wrongfields = responseJSON.wrongFields
      if (wrongfields.includes("email") === true){
        console.log(`in wrong email`)
        handleShow()
      }
    }else if (serverResponsePicture.status === 500){
      console.log(`in empty piture`)
      const check = picture[0].split(':')
      console.log(`printing chekc`, check)
      if (check[0] !=="https"){
        handleShow1()
      }else{
        console.log(`im ready to leave`)
      window.location.href = "/SellerPanel";
      }
    }else{
      console.log(`im ready to leave`)
      window.location.href = "/SellerPanel";
    }
  }

  const handleBlur = async (e) => {
    e.preventDefault()
    console.log(`in blurrr`)
    const serverResponse = await verifyPass()
    console.log(`printing blur resp`, serverResponse)
    if (serverResponse.verified === true){
      console.log(`wohoo`)
      setErrors({...errors, currPass: '                     '})
      setUpdatePass(true)
    }else{
      console.log(`oh shit`)
      setErrors({...errors, currPass: 'Password is incorrect'})
    }
  }

  const handleBlur2 = async (e) => {
    console.log(`in new pass blurrr`)
    if (newPass){
      console.log(`curr pass`, currPass)
      if (!currPass){
        setErrors({...errors, currPass: 'Enter current password first'})
      }else if (newPass.length < 6){
      setErrors({...errors, newPass: 'Must have 6 characters at least'})
    }else{
      setErrors({...errors, newPass: ''})

    }
  }
  }

  async function verifyPass() {
    const temp ={
      email: email, 
      password: currPass
    }
    console.log(`temp`, temp)
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/verify",
      {
        method: "POST",
        withCredentials: false,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(temp)
      }
    );
    // console.log(response.json());
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
    getData("https://apnay-rung-api.herokuapp.com/seller/info").then(
    (response) => {
      setSellerData(response)
      console.log(`printing response`,response)
      setName(response.name)
      console.log(`printing name`, name)
      setEmail(response.email)
      setPhoneNo(response.phone)
      setAddress(response.location)
      setBio(response.bio)
      if (response.profile_picture === null){
        setPicture([...picture,DefaultImg])
        setShowPicture([...showPicture, DefaultImg])
      }else{
        setPicture([...picture,response.profile_picture])
        setShowPicture([...showPicture, response.profile_picture])

      }
    }
  );
  }, []);


  const displayPage = () => {
    return (
      <div className="settings-container-seller ">
          <br />
          <div className="settings-heading">Account Settings</div>
          <br />
          <form
            enctype="multipart/form-data"
            method="POST"
            id="empty-form"
          ></form>
          <form className="settings-form" onSubmit={submitHandler} enctype="multipart/form-data">
            <span>
                <div className="upload-photo-div">
                    <input
                        className="seller-settings-img"
                        type="image"
                        src={showPicture[showPicture.length-1]}
                    />
                </div>
                <div className="label-name-seller-settings">Name</div>
                <input
                    className="name-form-seller-settings"
                    type="text"
                    value={name}
                    onChange={handleName}
                    required
                />     
                <br />
                <p className="label-email-seller-settings">Email</p>
                <input
                    className="email-form-seller-settings"
                    type="email"
                    value={email}
                    onChange={handleEmail}
                    required
                />
                <input
                    type="file"
                    name="file"
                    accept="image/*, application/pdf"
                    id="upload-photo-seller"
                    onChange={handlePicture}
                />
                <label for="upload-photo-seller" className = "upload-photo-seller-settings">
                    change picture
                </label> 
              </span>
            <br />
            <p className="label-form">To update your password, add:</p>
            <span>
            {errors.currPass && (
              <div className="err-settings-currPass">{errors.currPass}</div>
            )}
            {errors.newPass && (
              <div className="err-settings-newPass">{errors.newPass}</div>
            )}
            </span>
            <br/>
            <span className="password-div">
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
                onBlur={handleBlur}
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
            <p className="label-form">Phone Number</p>
            <input
              className="input-form"
              type="tel"
              value={phoneNo}
              onChange={handlePhoneNo}
              required
            ></input>
            <br />
            <p className="label-form">Province</p>
            <input
              className="input-form"
              type="text"
              value={address}
              onChange={handleAddress}
              required
            ></input>
            <br />
            <p className="label-form">Add/Update bio</p>
            <textarea
              className="input-des"
              type="text"
              value={bio}
              onChange={handleBio}
              rows="4"
              cols="50"
              required
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
      <SellerNavbar />
      <Memory panel="Customer Panel " page="" current=" Account Settings" />{" "}
      {/* when three links needed in panel, include a '/' in the middle 'page' argument */}
      <div className="min-height-div image-settings">
        {
          displayPage()
        }

        <br/>
        <br/>
        </div>
        <BottomBar />
        <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton className="modal-heading">
          <Modal.Title>Invalid Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>This email is already taken.</Modal.Body>
      </Modal>

      <Modal show={show1} onHide={handleClose1} className="delete-modal">
        <Modal.Header closeButton className="modal-heading">
          <Modal.Title>Add profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>Profile picture is missing</Modal.Body>
      </Modal>
    </div>
  );




}

export default SellerSettings;
