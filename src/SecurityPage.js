import Logo from "./css/logo.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QuestionAnswer } from "@material-ui/icons";
import { Modal, Button} from "react-bootstrap";


const TempSecurity = () => {
  const [button, setButton] = useState(`true`);

  const questions = {
    questionsArray: [
      "Choose a security question",
      "What is the name of your friend?",
      "What is your birth city?",
      "What is your favorite color?"
    ]
  };
  const [values, setValues] = useState({
    question1: "",
    answer1: "",
    question2: "",
    answer2: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.href = "/SignupCustomer";

    
  }
  const handleShow = () => setShow(true);


  const submitForm = () => {
    // setIsSubmitted(true);
  };

  const switchButton = () => {
    setButton(!button);
  };

  const validate = () => {
    let errors = {};

    if (!values.question1) {
      errors.question1 = "select question";
    } else if (values.question1 === "Choose a security question") {
      errors.question1 = "select question";
    }
    if (!values.question2) {
      errors.question2 = "select question";
    } else if (values.question2 === "Choose a security question") {
      errors.question2 = "select question";
    } else if (values.question2 === values.question1) {
      errors.question2 = "questions must be different";
    }

    if (!values.answer1) {
      errors.answer1 = "answer required";
      //shows errors if .com or incorrect email not added
    }

    if (!values.answer2) {
      errors.answer2 = "answer required";
    }

    return errors;
  };
  const changeHandler = (e) => {
    console.log(`hello im here`);
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
    console.log(values);
  };
  
  async function sendNotification() {

    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/notification/new",
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title:`A new customer has signed up. Please visit View Customers for more details.`,
          type:"message", 
          details: null, 
          admin_id : 1
        })
      }
    );

    console.log(`response from notification`, response)
    window.location.href = "/Login";
  }

  const submitHandler = async (e) => {
    console.log(`in submit handler`);
    e.preventDefault();

    setErrors(validate(values));
    setIsSubmitting(true);
    const serverResponse = await postData();
    console.log(`got here`);
    console.log(serverResponse);
    if (serverResponse.status === 201) {
      sendNotification()
    }else if (serverResponse.status === 400){
      handleShow()
    }
  };
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      submitForm();
    }
  }, [errors]);

  // const handleClick = () => {
  //   if (Object.keys(errors).length === 0 && isSubmitted) {
  //     window.location.href = "/Login";
  //   }
  // };
  async function postData() {
    console.log(`in post data`);
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    console.log(userInfo);
    console.log(values);
    const question1 = values.question1;
    const answer1 = values.answer1;
    const question2 = values.question2;
    const answer2 = values.answer2;
    const questions_data = {
      [question1]: answer1,
      [question2]: answer2
    };
    const temp = {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
      address: userInfo.address,
      phone: userInfo.phone,
      sec_questions: JSON.stringify(questions_data)
    };
    console.log(temp);
    // console.log(questions_data);
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/customer/new",
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsIm5hbWUiOiJUYWltb29yIFRhcmlxIiwidHlwZU9mVXNlciI6ImN1c3RvbWVyIiwiaWF0IjoxNjE2OTYxNzMwfQ.Dn0FATITkhrR7e5tkp_XAmdPfp-FKJGzdskczt9k2fw",
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
        <form onSubmit={submitHandler}>
          <Link to="./Homepage">
          <img src={Logo} className="cnic-logo" alt="our logo" />
          </Link>
          <div className="security-heading">Sign up</div>
          <div class="btn-group" role="group" aria-label="Basic example">
            <Link to="/SecurityPage">
              <input
                type="submit"
                value="Customer"
                className={`btn${button}`}
                onClick={switchButton}
                style={{ borderRadius: "5px 0px 0px 5px" }}
              />
            </Link>
            <Link to="/SignupSeller">
              <input
                type="submit"
                value="Seller"
                className={`btn${!button}`}
                onClick={switchButton}
                style={{ borderRadius: "0px 5px 5px 0px" }}
              />
            </Link>
          </div>
          <br />
          <br />
          <div>
            {errors.question1 && (
              <div className="err-left">{errors.question1}</div>
            )}
            {errors.answer1 && (
              <div className="err-right">{errors.answer1} </div>
            )}
          </div>
          <br />
          <div className="form-inputs-security">
            <select
              className="security-form-left"
              name="question1"
              onChange={changeHandler}
            >
              {questions.questionsArray.map((question) => (
                <option
                  title={question}
                  // name="question1"
                  // onChange={changeHandler}
                  value={question}
                >
                  {question}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="answer1"
              className="security-form-right"
              placeholder="answer"
              value={values.answer1}
              onChange={changeHandler}
            />
          </div>
          <br />
          <br />
          <div>
            {errors.question2 && (
              <div className="err-left">{errors.question2} </div>
            )}
            {errors.answer2 && (
              <div className="err-right">{errors.answer2} </div>
            )}
          </div>
          <br />
          <div className="form-inputs-security">
            <select
              className="security-form-left"
              name="question2"
              onChange={changeHandler}
            >
              {questions.questionsArray.map((question) => (
                <option title={question} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="answer2"
              className="security-form-right"
              placeholder="answer"
              value={values.answer2}
              onChange={changeHandler}
            />
          </div>
          <button className="next-step-btn" type="submit">
            Sign Up
          </button>
          <br />
          <div className="orlogin">
            Or
            <Link to="/Login"> Log in</Link>
          </div>
        </form>
      </div>
    );
  };
  return (
    <div className="image">
      <div className="security-content">
        {!isSubmitted ? displayPage() : ""}
        {/* <SignupSuccess /> */}
      </div>
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton className="modal-heading">
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>An account exists with this email.</Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TempSecurity;
