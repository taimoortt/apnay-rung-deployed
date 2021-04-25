import "./styles.css";
import "./momina.css";
import "./maham.css";
import "./vafa.css";
import CustomerNavbar from "./CustomerNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const Star = ({ starId, rating, onMouseEnter, onMouseLeave, onClick }) => {
  let styleClass = "star-rating-blank";
  if (rating && rating >= starId) {
    styleClass = "star-rating-filled";
  }

  return (
    <div
      className="star"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <svg
        height="20px"
        width="20px"
        class={styleClass}
        viewBox="0 0 20 20"
        data-rating="1"
      >
        <polygon
          stroke-width="0"
          points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
        />
      </svg>
    </div>
  );
};

const AddReview = () => {
  const usertype = sessionStorage.getItem("TypeOfUser");
  const [state, setState] = useState([]);
  let tokenID = sessionStorage.getItem("Token");
  const session = sessionStorage.getItem("logged-in");
  const [callEffect,setCallEffect]= useState(false)
  const [empty,SetEmpty]=useState(false)
  const [ind, setIndex] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [allReviews,setReview]=useState([])
  const [allProducts, setProducts]=useState([])
  const [isFilled,setFilled]=useState(false)
  let Reviews=[]
  let id=0
  let itemLength=0
  const checkSession = () => {
    if (session === false || session === null || usertype==="seller" || usertype==="admin"){
      sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
      window.location.href = '/Homepage';
    }
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

    const filterOrders= (response) => {
      let allOrders=[]
      response.map((order,index)=>{
        const {cancelled,review}= order
        if(review.length===0){
          try{
            allOrders.push(order)
          }
          catch{
            allOrders[0]=order
          }
        }
      })
      return allOrders
    }
 
    getData("https://apnay-rung-api.herokuapp.com/order/all").then(
    (response) => {
      console.log(`customer navbar response: ${response}`)
      const orders= filterOrders(response)
      if(orders.length===0)
      {
        SetEmpty(true)
      }
      setState(orders);
      // setIndex(0)
      console.log(state)
      console.log(`ind is ${ind} ${orders.length}`)
      if(ind===orders.length)
      {
        setIndex((prev)=> prev-1)
      }
    }
  );
  }, [callEffect]);

  const NextPage = () => {
    if(ind <= state.length-2){
      setReviewText("")
      setReview([])
      setProducts([])
      setIndex((prev)=> prev+1)

    }
  }

  const PrevPage = () => {
    if(ind>0){
      setReviewText("")
      setReview([])
      setProducts([])
      setIndex((prev)=> prev-1)
    }
  }

  const getID = () => {
    try{
      let order= state[ind]
      return order.order_id
    }catch{}
  }

  const getItemLength = () => {
    try{
      let order= state[ind]
      return (order.items).length
    }catch{}
  }
  let temp=[]

  const isPresent= (product,arr) => {

    console.log(`items length is ${arr.length}`)
    for(let i=0; i< arr.length; i++){
      let oneItem= arr[i]
      console.log(`ispresent ${oneItem}`)
      if(oneItem[0]===product)
      {
        console.log(i)
        return i
      }
    }
    return null
  } //if item is already present

  const ratingChanged = (newRating,itemIndex) => {
    console.log(`rating ${newRating}`);
    let order= state[ind]

    let item= (order.items)[itemIndex]
    try{
      let copyState= [...allProducts]
      let isTrue=isPresent(item[0],copyState)
      // let isTrue=null
      if(isTrue===null){ //the item is being added for the first time
        temp=[item[0],newRating]
        setProducts([...allProducts,temp])
      }
      else{
        let copy= [...allProducts]
        temp= copy[isTrue]
        temp[1]=newRating
        console.log(`ratigntemp is now ${temp}`)
        copy[isTrue]=temp
        setProducts(copy)
      }
    }catch{
    }
    console.log(`items after rating ${allProducts}`)
  };

  const reviewChangeHandler = (event,itemIndex) =>{
    let text= event.target.value
    setReviewText(event.target.value)   
  }
  const reviewSetting = (itemIndex)=>{
    // event.preventDefault()
    let order= state[ind]

    let item= (order.items)[itemIndex]
    try{
      let copyState= [...allReviews]
      let isTrue=isPresent(item[0],copyState)
      console.log(`item id is ${item[0]}`)
      if(isTrue===null){
        let newReview= [item[0],reviewText]
        setReview([...allReviews,newReview])
      }
      else{
        let copy= [...allReviews]
        temp= copy[isTrue]
        temp[1]= reviewText
        console.log(`review temp is now ${temp}`)
        copy[isTrue]=temp
        setReview(copy)
      }
    }catch{
    }

    console.log(`items after review ${allReviews}`)
  }

  const renderTableData = () => {
    try{
      let order = state[ind]
      // console.log(`id is ${order.order_id}`)
      id= order.order_id
      return (order.items).map((product, index) => {
        if(product[3]!=="Item Deleted"){
          return (
            <tr className="data">
              <td><img className="shoppingCart-image" src={product[4]} alt="Logo" /></td>
              <td>{product[3]}</td>
              <td>  
                <ReactStars
                className="rating-stars"
                count={5}
                onChange={(value)=>ratingChanged(value,index)}
                size={24}
                activeColor="#d67d20"
                key={callEffect}
                />
              </td>
              <td>
                <form className="form-product">
                <input
                  key={callEffect}
                  className="input-form"
                  type="text"
                  name="review"
                  placeholder="e.g. good"
                  onChange={(event)=>reviewChangeHandler(event,index)}
                  // onBlur={(event)=>reviewSetting(event,index)}
                  onBlur={() => {
                    setTimeout(() => reviewSetting(index),5);
                  }}
                ></input>
  
                </form>
              </td>
            </tr>
          );
        }
        else{
          return(
            <tr className="data">
              <td>This product is no longer available.</td> 
              <td></td>
              <td></td>
              <td></td>
            </tr>
          )
        }

      });
    }catch{}
  };

  const [msg, setMsg] = useState([``]);

  const makeItemObject = () =>{

    let rating= [...allProducts];
    let reviews= [...allReviews];
    let ratingAndReview=[]
    let reviewFound= false

    if(rating.length<getItemLength())
    {
      setMsg([`Please enter a rating for all products`,`Back`])
      handleShow()
    }
    else
    {
      for(let i=0; i<rating.length;i++)
      {
        for(let j=0;j<reviews.length;j++)
        {
          if(rating[i][0]===reviews[j][0])
          {
            reviewFound= true
            console.log(`here`)
            let temp=[rating[i][0],rating[i][1],reviews[j][1]]
            ratingAndReview.push(temp)
          }
        }
  
        if(reviewFound===false)
        {
          let temp=[rating[i][0],rating[i][1],""]
          ratingAndReview.push(temp)
        }
        reviewFound= false
      }
  
      console.log(`final sending array is ${ratingAndReview}`)
      rating=[]
      reviews=[]
      sendData(ratingAndReview)
      
    }


    
  }

  async function sendData(items) {
    console.log(`token is  ${tokenID}`)
    console.log(items)
    let order = state[ind]
    console.log(`order id of sending data is `,order.order_id)

    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/order/review/new",
      {
        method: "PATCH",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${tokenID}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "order_id": order.order_id,
          "review": items
        })
      }
    );

    console.log(response);

    if (response.status === 201 || response.status === 200) {
      
      setMsg([`Your review has been placed.`, `Back`]);
      handleShow();
      // console.log(`processed ${!callEffect}`)
      setReviewText("")
      setReview([])
      setProducts([])
      setCallEffect(!callEffect)
      // setCallEffect(!callEffect)
      // setReviewText("")
      // setReview([])
      // NextPage();
    } else {
      setMsg([`Your review could not be placed.Try again.`, `Back`]);
      handleShow();
    }
  }
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    console.log(`msg is ${msg[0]}`)
    console.log(`emoty is ${empty}`)
    // if(msg[0]===`Your review has been placed.`)
    // {
    //   console.log(`msg is ${msg[0]}`)
    //   console.log(`in if condition`)
    //   setReviewText("")
    //   setReview([])
    //   setCallEffect(!callEffect)
    // }
    if(empty===true){
      SetEmpty(false)
      window.location.href = "/CustomerPanel"; 
    }
  };

  const handleShow = () => setShow(true);
  return (
    <div >
      {checkSession()}
      <CustomerNavbar />
      <Memory
        panel="Customer Panel "
        page=""
        current=" Add Review"
      />
      <div className="min-height-div">
      <h1>Add Review</h1>
      <div className="order-id-review">Order ID : {getID()}</div>
      <div className="number-of-items">Number of Items : {getItemLength()} </div>
      <div className="table-responsive">
        <table className="table table-size">
          <thead>
            <tr className="top-row">
              <th>Product</th>
              <th>Product Name</th>
              <th>Rating</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>

      <button
        type="submit"
        className="confirmOrder-button-v2"
        onClick={makeItemObject}
      >Submit</button>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button className="page-next-review" onClick={NextPage}>Next Page</button>
      <button className="page-prev" onClick={PrevPage}>Previous Page</button>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      </div>
      <BottomBar />
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg[0]}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="delete-primary"
            onClick={handleClose}
          >
            {msg[1] !== "Back" ? <Link to="./CustomerPanel"><a>{msg[1]}</a></Link> : msg[1]}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={empty}
        onHide={() => handleClose()}
        className="delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>No orders available</Modal.Title>
        </Modal.Header>
        <Modal.Body>There are no orders available for review.</Modal.Body>
        <Modal.Footer>
          <Link to="/CustomerPanel">
            <Button
              variant="primary"
              onClick={() => handleClose()}
              className="delete-primary"
            >
              Back to Panel
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default AddReview;
