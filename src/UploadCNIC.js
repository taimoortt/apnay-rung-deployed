import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./css/logo.png";

const UploadCNIC = () => {
  const [values, setValues] = useState({
    fileName: "click here to choose file",
    file: "",
    question1: "",
    answer1: "",
    question2: "",
    answer2: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [check, setCheck] = useState([]);
  const [button, setButton] = useState(`true`);


  const submitForm = () => {
    //setIsSubmitted(true);
  };

  const questions = {
    questionsArray: [
      "choose a security question",
      "What is the name of your friend?",
      "What is your birth city?",
      "What is your favorite color?"
    ]
  };

  const validate = () => {
    let errors = {};

    if (!values.file) {
      errors.file = "Image is required";
    }
    if (!values.question1) {
      errors.question1 = "Select question";
    } else if (values.question1 === "Choose a security question") {
      errors.question1 = "Select question";
    }
    if (!values.question2) {
      errors.question2 = "Select question";
    } else if (values.question2 === "Choose a security question") {
      errors.question2 = "Select question";
    } else if (values.question2 === values.question1) {
      errors.question2 = "Questions must be different";
    }
    if (!values.answer1) {
      errors.answer1 = "Answer required";
    }
    if (!values.answer2) {
      errors.answer2 = "Answer required";
    }
    return errors;
  };
  //sends the image file to backend
  const handleUpload = () => {
    const fileObj = new FormData();
    fileObj.append("cnic-image", values.file, values.fileName);
    // console.log(picture);
  };
  const handleClick = () => {
    if (Object.keys(errors).length === 0) {
      window.location.href = "/Login";
    }
  };

  const changeHandler = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
    console.log(values);

    if (values.file !== 'file'){
      setCheck([1]);
    }
  };

  const fileHandler = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.files[0],
      tempFile: e.target.files[0].name
    });
    values.tempFile = values.file.name;
    console.log(values);
  };

  async function sendNotification() {

    const response = await fetch(
      "http://apnay-rung-api.herokuapp.com/notification/new",
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik11aGFtbWFkIFJvaGFuIEh1c3NhaW4iLCJ0eXBlT2ZVc2VyIjoiYWRtaW4iLCJpYXQiOjE2MTY4NDE4MTZ9.HJvh_8caLMReaDmJFCEklgtP9u86usbNIZ4FxOrIawk`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title:`A new seller has signed up. Please visit Approve Sellers for more details.`,
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
    e.preventDefault();

    setErrors(validate(values));
    setIsSubmitting(true);
    let serverResponse; 
    if (check.length > 0){
      serverResponse = await postData();
      console.log(`got here`);
      console.log(serverResponse);
      if (serverResponse.status === 201) {
        console.log(`finally here`);
        sendNotification()
        
      }
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      submitForm();
    }
  }, [errors]);

  async function postData() {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    console.log(`in post data`);
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
    // const temp = {
    //   name: userInfo.name,
    //   email: userInfo.email,
    //   password: userInfo.password,
    //   address: userInfo.address,
    //   cnic_image: values.file,
    //   phone: userInfo.phone,
    //   sec_questions: JSON.stringify(questions_data)
    // };
    const form = document.getElementById("empty-form");
    const fileObj = new FormData(form);
    fileObj.append("name", userInfo.name);
    fileObj.append("email", userInfo.email);
    fileObj.append("password", userInfo.password);
    fileObj.append("cnic_image", values.file, values.fileName);
    fileObj.append("location", userInfo.address);
    fileObj.append("sec_questions", JSON.stringify(questions_data));

    // console.log(temp);
    // console.log(questions_data);
    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/seller/new",
      {
        method: "POST",
        body: fileObj
      }
    );
    return response;
  }

  const setFile = () => {
    if (values.tempFile){
      values.fileName = values.tempFile
    }
  }

  const switchButton = () => {
    setButton(!button);
  };

  const displayPage = () => {
    return (
      <div>
        <form
          enctype="multipart/form-data"
          method="POST"
          id="empty-form"
        ></form>
        <form onSubmit={submitHandler} enctype="multipart/form-data">
          <Link to="/Homepage">
          <img src={Logo} className="cnic-logo" alt="our logo" />
          </Link>
          <div className="cnic-heading">Sign up</div>
          <div class="btn-group" role="group" aria-label="Basic example">
            <Link to="/SignupCustomer">
              <input type="submit" value="Customer" className={`btn${!button}`}
                onClick={switchButton}
                style={{ borderRadius: "5px 0px 0px 5px" }}/>
            </Link>
            <Link to="/SignupSeller">
              <input type="submit" value="Seller" className={`btn${button}`}
                onClick={switchButton}
                style={{ borderRadius: "0px 5px 5px 0px" }}/>
            </Link>
          </div>
          <br />
          <br />
          <div>
            {errors.file && <div className="err-left">{errors.file}</div>}
          </div>
          <br />
          <span>
            <label for="upload-photo" className="upload-file-label">
              {values.fileName}
            </label>
            <input
              type="file"
              name="file"
              accept="image/*, application/pdf"
              onChange={fileHandler}
              id="upload-photo"
            />
            <button className="upload-btn" onClick = {setFile}>Upload</button>
            {/* <input type="submit" className="next-step-btn" value="Sign Up" /> */}

          </span>
          <br />
          <br />

          <div>
            {errors.question1 && (
              <div className="err-left">{errors.question1}</div>
            )}
            {errors.answer1 && (
              <div className="err-right">{errors.answer1}</div>
            )}
          </div>
          <br />
          <span className="form-inputs">
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
          </span>
          <br />
          <br />

          <div>
            {errors.question2 && (
              <div className="err-left">{errors.question2}</div>
            )}
            {errors.answer2 && (
              <div className="err-right">{errors.answer2}</div>
            )}
          </div>
          <br />
          <span className="form-inputs">
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
          </span>
          <input type="submit" className="next-step-btn" value="Sign Up" />
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
      <div className="cnic-content">
        {!isSubmitted ? displayPage() : ""}
        {/* <SignupSuccess /> */}
      </div>
    </div>
  );
};

export default UploadCNIC;
