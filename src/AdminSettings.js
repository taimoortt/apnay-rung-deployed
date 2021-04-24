import "./styles.css";
import "./vafa.css";
import AdminNavbar from "./AdminNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import { useState, useEffect} from "react";
import back_image from "./css/back.png";

const AdminSettings = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [currPass, setCurrPass] = useState();
  const [newPass, setNewPass] = useState();
  const [errors, setErrors] = useState({});
  let tokenID = sessionStorage.getItem("Token");
  let updatePass = false;
  const session = sessionStorage.getItem("logged-in");
  const usertype = sessionStorage.getItem("TypeOfUser");

  const checkSession = () => {
    if (session === false || session === null || usertype==="seller" || usertype==="customer"){
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
    setCurrPass(event.target.value);
  };

  const handleNewPass = (event) => {
    setNewPass(event.target.value);
  };

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
    // console.log(response.json());
    return response.json();
  }

  return (
    <div className="bg-color">
      {checkSession()}
      <AdminNavbar />
      <Memory panel="Admin Panel" page="" current="Account Settings" />{" "}

      <div className="min-height-div">
      <div className="settings-container-admin">
        <br />
          <div className="settings-heading">Account Settings</div>
      <br />
      <br />
      <form className="settings-form">
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
        <br />
        <span>
            {errors.currPass && (
              <div className="err-settings-currPass">{errors.currPass}</div>
            )}
            {errors.newPass && (
              <div className="err-settings-newPass">{errors.newPass}</div>
            )}
            </span>
        <span>
          <label className="label-form-cp">Current Password:</label>
          <label className="label-form-np">New Password:</label>
        </span>
        <br />
        <span>
          <input
            className="input-form-cp"
            type="text"
            value={currPass}
            onBlur = {handleBlur}
            onChange={handleCurrPass}
          ></input>
          <input
            className="input-form-np"
            type="text"
            value={newPass}
            onBlur = {handleBlur2}
            onChange={handleNewPass}
          ></input>
        </span>
      </form>
      <br />
      <input type="submit" className="submit-button" value="Save"></input>
      </div>
      </div>
      <BottomBar style={{backgroundColor:"#2e2e2e"}}/>
    </div>
  );
};

export default AdminSettings;
