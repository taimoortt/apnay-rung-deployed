import Logo from "./css/logo.png";
import { Link } from "react-router-dom";
import { useState} from "react";
import { Modal, Button} from "react-bootstrap";

const TempLogin = () => {
  //storing user's entered fields
  const [values, setValues] = useState({
    email: "",
    password: ""
  });


  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);


  const [check, setCheck] = useState([])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => {
    setShow1(true)
  };

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  //routes to catalog page if validation clears


  //storing user's state
  const changeHandler = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
    if (e.target.name === "email") {
      sessionStorage.setItem("Email", e.target.value);
    }
    setCheck([1]);
  };

  //checks for errors upon submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors(validate(values));
    const serverResponse = await getData();
    console.log(serverResponse);
    if (check.length > 0) {
      if (serverResponse.verified === true) {
        console.log(`got here`);
        const token = serverResponse.accessToken;
        sessionStorage.setItem("Token", token);
        sessionStorage.setItem("Email", values.email);
        sessionStorage.setItem("TypeOfUser", serverResponse.typeOfUser);
        sessionStorage.setItem("logged-in", true);
        if (serverResponse.typeOfUser === "customer") {
          window.location.href = "/Homepage";
        } else if (serverResponse.typeOfUser === "seller") {
          window.location.href = "/SellerPanel";
        }else if (serverResponse.typeOfUser === "admin"){
          window.location.href = "/AdminPanel";
        }
      }else{
        if (serverResponse.hasOwnProperty('approved')) {
          console.log(`in approval false`)
          if (serverResponse.approved === false){
            handleShow2()
          }
        }else{
          errors.password = "password is incorrect";
          handleShow();

        }

 
      }
    } 
  };

  //performs checks for input
  const validate = () => {
    let errors = {};

    if (!values.email) {
      errors.email = "Email required";
      //shows errors if .com or incorrect email not added
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password needs to be 6 characters or more";
    }

    return errors;
  };
  //fetching data from the server
  async function getData() {
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/verify",
      {
        method: "POST",
        withCredentials: false,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      }
    );
    // console.log(response.json());
    return response.json();
  }

  const handleForget = async (e) => {
    // e.preventDefault();
    console.log(`hello`); 
    console.log(`printing check`,check)
    console.log(`printing check length`, check.length)

    if (check.length === 0){
      console.log(`in if of handle`)
      handleShow1();
    }else{
      console.log(`im hereee`)
      const userQuestions = await postData();
      console.log(`printing user questions`,userQuestions);
      sessionStorage.setItem("Question1", userQuestions[0]);
      sessionStorage.setItem("Question2", userQuestions[1]);
      window.location.href = "/ForgotPassword"
    }

  };
  async function postData() {
    console.log(`im in postData`);
    const userEmail = sessionStorage.getItem("Email");
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/securityquestions",
      {
        method: "POST",
        withCredentials: false,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail
        })
      }
    );
    return response.json();
  }

  const displayPage = () => {
    return (
      <div>
        <form className="form" onSubmit={submitHandler}>
          <Link to="/Homepage">
          <img src={Logo} className="login-img" alt="our logo" />
          </Link>
          <div className="login-heading">Log in</div>
          <br />
          <br />
          <div>
            {errors.email && <div className="err-centre">{errors.email}</div>}
          </div>
          <div className="form-inputs">
            <input
              type="email"
              name="email"
              className="login-label-form"
              placeholder="email"
              value={values.email}
              onChange={changeHandler}
            />
          </div>
          <br />
          <div>
            {errors.password && (
              <div className="err-centre">{errors.password}</div>
            )}
          </div>
          <div className="form-inputs">
            <input
              type="password"
              name="password"
              className="login-label-form"
              placeholder="password"
              value={values.password}
              onChange={changeHandler}
            />
          </div>
          <span>
            <Link
              className="forgot-password-link"
              onClick={handleForget}
            >
              Forgot password?
            </Link>
          </span>
          <button className="next-step-btn" type="submit">
            Login
          </button>
          <br />
          <span className="orlogin-option-signup">
            Or
            <Link to="/SignupCustomer"> Sign up</Link>
          </span>
        </form>
      </div>
    );
  };

  return (
    <div className="image">
      <div className="content-login">{!isSubmitted ? displayPage() : ""}</div>
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Incorrect Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your email or password is incorrect. Please try again.</Modal.Body>
        <Modal.Footer>
          <Link to="/Login">
            <Button
              variant="primary"
              type="submit"
              className="delete-primary"
              onClick={handleClose}
            >
            Okay
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
      <Modal show={show1} onHide={handleClose1} className="delete-modal">
        <Modal.Header closeButton className="modal-heading">
          <Modal.Title>Password reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>You need to enter your email.</Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={handleClose2} className="delete-modal">
        <Modal.Header closeButton className="modal-heading">
          <Modal.Title>Approval pending </Modal.Title>
        </Modal.Header>
        <Modal.Body>Sorry! Your account has not been approved by Apnay Rung yet.</Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>

      
    </div>
  );
};
export default TempLogin;
