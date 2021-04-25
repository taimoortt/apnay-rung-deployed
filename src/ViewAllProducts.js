import "./styles.css";
import AdminNavbar from "./AdminNavbar";
import Memory from "./Memory";
import BottomBar from "./BottomBar";
import AddBoxIcon from "@material-ui/icons/AddBox";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import {useState,useEffect} from 'react';
import { FeaturedPlayList } from "@material-ui/icons";


const ViewAllProducts = () => {
  const tokenID = sessionStorage.getItem("Token");
  const session = sessionStorage.getItem("logged-in");
  const [state, setState] = useState([
    {
      item_id: 0,
      title: "T",
      description: "",
      category: "",
      featured: false,
      seller_id: 0,
      seller_name: "",
      price: 0,
      stock: 0,
      image: ""
      }
  ]);
  const [callEffect,setCallEffect]= useState(false)
  const usertype = sessionStorage.getItem("TypeOfUser");
  const checkSession = () => {
      if (session === false || session === null || usertype==="seller" || usertype==="customer"){
        sessionStorage.setItem("msg",JSON.stringify("Please Log in to Continue"))
        window.location.href = '/Homepage';
      }
  }

  useEffect(() => {
    const getData = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: false
        });
      return response.json();
    };
    getData("https://apnay-rung-api.herokuapp.com/inventory/all").then(
    (response) => {
      console.log(`printing response`, response)
      setState(response)
    }
  );
  }, []);

  async function sendNotification(sellerID,title) {

    const response = await fetch(
      "https://apnay-rung-api.herokuapp.com/notification/new",
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik11aGFtbWFkIFJvaGFuIEh1c3NhaW4iLCJ0eXBlT2ZVc2VyIjoiYWRtaW4iLCJpYXQiOjE2MTY4NDE4MTZ9.HJvh_8caLMReaDmJFCEklgtP9u86usbNIZ4FxOrIawk`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title:`Congratulations! Your product ${title} has been added to featured products.`,
          type:"message", 
          details: null, 
          seller_id : sellerID
        })
      }
    );

    console.log(`response from notification`, response)

  }

  const makeFeatured = async(id,sellerID,title) => {
    const response = await fetch(
      ` https://apnay-rung-api.herokuapp.com/inventory/featured/set/${id}`,
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

    console.log(`printing in featured`, response);

    if (response.status === 200 || response.status===202) {
      
      sendNotification(sellerID,title)
      console.log(`processed ${!callEffect}`)
      setCallEffect(!callEffect)
    } 

  }

  const removeFeatured = async (id) => {
    const response = await fetch(
      ` https://apnay-rung-api.herokuapp.com/inventory/featured/remove/${id}`,
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

    console.log(`printing in featured`, response);

    if (response.status === 200 || response.status===202) {
      
      console.log(`processed ${!callEffect}`)
      setCallEffect(!callEffect)
    } 
  }

  const Featured = (isFeatured,id,sellerID,title) => {
    console.log(`printing is featured`, isFeatured)
    if (isFeatured === false){
      return (
        <a href="#delete" className="link" style={{whiteSpace:"nowrap"}} onClick= {() => makeFeatured(id,sellerID,title)}>
          <FlashOnIcon
            style={{
              fontSize: "medium"
            }}
          />
          Add to Featured 
        </a>
      );
    } else {
      return (
        <a href="#delete" className="link" style={{whiteSpace:"nowrap"}} onClick = {() => removeFeatured(id)}>
          <FlashOnIcon
            style={{
              fontSize: "medium"
            }}
          />
          Remove from Featured
        </a>
      );
    }
  };

  useEffect(() => {
    async function getData(url) {
      const response = await fetch(url, {
        method: "GET",
        withCredentials: false
      });

      return response.json();
    }

    getData("https://apnay-rung-api.herokuapp.com/inventory/all").then(
      (response) => {
        console.log(response);
        setState(response);
      }
    );
  }, [callEffect]);
  
  

  const renderTableData = () => {
    return state.map((product, index) => {
      const {
      item_id,
      title,
      description,
      category,
      featured,
      seller_id,
      seller_name,
      price,
      stock,
      image
      } = product; //destructuring
      return (
        <tr className="data">
          <td><img src={image} alt={title} id="image"/></td>
          <td style={{whiteSpace:"nowrap"}}>{title}</td>
          <td>{seller_id}</td>
          <td style={{whiteSpace:"nowrap"}}>{seller_name}</td>
          <td>{category}</td>
          <td>{price}</td>
          <td>{stock}</td>
          <td>
            {Featured(featured,item_id,seller_id,title)}
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      {checkSession()}
      <AdminNavbar />
      <Memory panel="Admin Panel " page="" current=" View All Products" />{" "}
      {/* when three links needed in panel, include a '/' in the middle 'page' argument */}
      <div className="min-height-div">
      <h1>View All Products</h1>
      <div className="table-responsive">
        <table className="table table-size">
          <thead>
            <tr className="top-row">
              <th>Product</th>
              <th style={{whiteSpace:"nowrap"}}>Product Title</th>
              <th style={{whiteSpace:"nowrap"}}>Seller ID</th>
              <th>Seller Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
      </div>
      <BottomBar />
    </div>
  );
};
export default ViewAllProducts;
