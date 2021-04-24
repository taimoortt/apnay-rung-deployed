import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Logo from "./css/logo.png";

import { Link } from "react-router-dom";

const SignupSeller = () => {
  const [values, setValues] = useState({
    userName: "",
    email: "",
    password: "",
    password2: "",
    address: "",
    phonenumber: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [button, setButton] = useState(`true`);

  const provinces = {
    provincesArray: [
      "choose your province",
      "Punjab",
      "Sindh",
      "Balochistan", 
      "KPK", 
      "Kashmir", 
      "Gilgit-Baltistan"
    ]
  };

  const validate = () => {
    let errors = {};

    if (!values.userName.trim()) {
      errors.userName = "Your name is required";
    }

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
    if (!values.password2) {
      errors.password2 = "Password is required";
    } else if (values.password2 !== values.password) {
      errors.password2 = "Passwords do not match";
    }

    if (!values.address) {
      errors.address = "Address required";
    }else if (values.address === "Choose your province") {
      errors.address = "Address required";
    }

    if (!values.phonenumber) {
      errors.phonenumber = "Phone number required";
    } else if (values.phonenumber.length < 10) {
      errors.phonenumber = "Phone number needs 10 digits";
    }

    return errors;
  };
  const submitForm = () => {
    setIsSubmitted(true);
    // postData();
    const tempObject = {
      name: values.userName,
      email: values.email,
      password: values.password,
      address: values.address,
      phone: values.phonenumber
    };
    sessionStorage.getItem("userInfo");
    sessionStorage.setItem("userInfo", JSON.stringify(tempObject));
    window.location.href = "/UploadCNIC";
  };

  const switchButton = () => {
    setButton(!button);
  };

  // const handleClick = () => {
  //   if (Object.keys(errors).length === 0) {
  //     window.location.href = "/SecurityPage";
  //   }
  // };
  const changeHandler = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };
  const submitHandler = (e) => {
    e.preventDefault();

    setErrors(validate(values));
    setIsSubmitting(true);
  };
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      submitForm();
    }
  }, [errors]);


  const displayPage = () => {
    return (
      <div>
        <form onSubmit={submitHandler}>
          <Link to="/Homepage">
            <img src={Logo} className="signup-img" alt="our logo" />
          </Link>
          <div className="signup-heading">
            <p>Sign up</p>
          </div>
          <div class="btn-group" role="group" aria-label="Basic example">
            <Link to="/SignupCustomer">
              <input
                type="submit"
                value="Customer"
                className={`btn${!button}`}
                onClick={switchButton}
                style={{ borderRadius: "5px 0px 0px 5px" }}
              />
            </Link>
            <Link to="/SignupSeller">
              <input
                type="submit"
                value="Seller"
                className={`btn${button}`}
                onClick={switchButton}
                style={{ borderRadius: "0px 5px 5px 0px" }}
              />
            </Link>
          </div>
          <br />
          <br />
          <div>
            {errors.userName && (
              <div className="err-left">{errors.userName}</div>
            )}
            {errors.email && <div className="err-right">{errors.email} </div>}
          </div>
          <br />
          <div />
          <div className="form-inputs-security">
            <input
              type="text"
              name="userName"
              className="signup-label-form-left"
              placeholder="full name"
              value={values.userName}
              onChange={changeHandler}
            />
            <input
              type="email"
              name="email"
              className="signup-label-form-right"
              placeholder="email"
              value={values.email}
              onChange={changeHandler}
            />
          </div>
          <br />
          <div>
            {errors.password && (
              <div className="err-left">{errors.password} </div>
            )}
            {errors.password2 && (
              <div className="err-right">{errors.password2} </div>
            )}
          </div>
          <br />
          <div className="form-inputs-security">
            <input
              type="password"
              name="password"
              className="signup-label-form-left"
              placeholder="password"
              value={values.password1}
              onChange={changeHandler}
            />
            <input
              type="password"
              name="password2"
              className="signup-label-form-right"
              placeholder="re-type password"
              value={values.password2}
              onChange={changeHandler}
            />
          </div>
          <br />
          <div>
            {errors.address && (
              <div className="err-left">{errors.address} </div>
            )}
            {errors.phonenumber && (
              <div className="err-right">{errors.phonenumber} </div>
            )}
          </div>
          <br />
          <div className="form-inputs-security">
            {/* <input
              type="text"
              name="address"
              className="signup-label-form-left"
              placeholder="province"
              value={values.address}
              onChange={changeHandler}
            /> */}
            <select
              className="provinces-div"
              name="address"
              onChange={changeHandler}
            >
              {provinces.provincesArray.map((province) => (
                <option
                  title={province}
                  // name="question1"
                  // onChange={changeHandler}
                  value={province}
                >
                  {province}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phonenumber"
              className="signup-label-form-right"
              placeholder="phone number"
              value={values.phonenumber}
              onChange={changeHandler}
            />
          </div>
          <button className="next-step-btn" type="submit">
            Next Step
          </button>
          <br />
          <span className="orlogin">
            Or
            <Link to="/Login"> Log in</Link>
          </span>
        </form>
      </div>
    );
  };

  return (
    <div className="image">
      <div className="content-seller">
        {!isSubmitted ? displayPage() : ""}
        {/* <SignupSuccess /> */}
      </div>
    </div>
  );
};

export default SignupSeller;
