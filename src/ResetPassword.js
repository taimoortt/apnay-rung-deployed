// import { useState, useEffect } from "react";
import Logo from "./css/logo.png";
// import SignUpCustomer from "./SignUpCustomer";
// import SignupSuccess from "./SignupSuccessCustomer";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./styles.css";
import "./taimoor.css";

const ResetPassword = () => {
  const [values, setValues] = useState({
    password1: "",
    password2: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [check, setCheck] = useState([])

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (isSubmitted === true) {
      setShow(true);
    }
  };
  const submitForm = () => {
    setIsSubmitted(true);
  };
  const handleClick = () => {
    if (Object.keys(errors).length === 0) {
      window.location.href = "/Login";
    } else {
      window.location.href = "/ForgotPassword";
    }
  };

  const validate = () => {
    let errors = {};

    if (!values.password1) {
      errors.answer1 = "password required";
    } else if (values.password1.length < 6) {
      errors.password = "Password needs to be 6 characters or more";
    }
    if (!values.password2) {
      errors.password2 = "password required";
    } else if (values.password2.length < 6) {
      errors.password2 = "Password needs to be 6 characters or more";
    } else if (values.password2 !== values.password1) {
      errors.password2 = "Passwords do not match";
    }
    return errors;
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    setErrors(validate(values));
    setIsSubmitting(true);

    if (check.length > 0 && values.password2!==""){
      console.log(`ugh here`);

      const updatePass = await postData(values.password1);

      if (updatePass.status === 202) {
        window.location.href = "/Login";
      }
    }else{

    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      submitForm();
    }
  }, [errors]);

  const changeHandler = (e) => {
    console.log(`hello im here`);
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
    console.log(values);
    setCheck([1])
  };
  async function postData(password) {
    const userEmail = sessionStorage.getItem("Email");
    console.log(`printing email`, userEmail);
    const temp = {
      email: userEmail,
      password: password
    };
    console.log(temp);
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/resetpassword",
      {
        method: "POST",
        withCredentials: false,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(temp)
      }
    );
    return response;
  }
  const displayPage = () => {
    return (
      <div>
        <div>
          <form onSubmit={submitHandler}>
            <Link to ="/Homepage">
            <img src={Logo} className="reset-pass-logo" alt="our logo" />
            </Link>
            <div className="forgot-pass-heading">Reset Password</div>
            <br />
            <div>
              {errors.password1 && (
                <div className="err-centre">{errors.password1}</div>
              )}
            </div>
            <div className="form-inputs">
              <input
                type="password"
                name="password1"
                className="reset-label-form"
                placeholder="enter new password "
                value={values.password1}
                onChange={changeHandler}
              />
            </div>
            <div>
              {errors.password2 && (
                <div className="err-centre">{errors.password2}</div>
              )}
            </div>
            <div className="form-inputs">
              <input
                type="password"
                name="password2"
                className="reset-label-form"
                placeholder="re-type password"
                value={values.password2}
                onChange={changeHandler}
              />
            </div>

            <button className="next-step-btn" type="submit">
              Set Password
            </button>
            <br />
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="image">
      <div className="reset-pass-content">
        {/* {!isSubmitted ? <LoginForm submitForm={submitForm} /> : <LoginForm />} */}
        {!isSubmitted ? displayPage() : ""}
      </div>
    </div>
  );
};

export default ResetPassword;
