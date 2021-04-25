import HomeNavbar from "./HomeNavbar";
import CustomerNavbar from "./CustomerNavbar";
import AdminNavbar from "./AdminNavbar";
import SellerNavbar from "./SellerNavbar";
import Memory from "./Memory";
import Logo from "./css/logo.png"
import BottomBar from "./BottomBar";
import "./vafa.css";

const AboutUs = () => {
    const tokenID = sessionStorage.getItem("Token");
    const usertype = sessionStorage.getItem("TypeOfUser");

    const GetNavbar = () =>{
        if (tokenID === null){
          return (
            <HomeNavbar/>
          )
        }
        else if (usertype === "customer"){
          return(
            <CustomerNavbar/>
          )
        }
        else if (usertype === "admin"){
          return (
            <AdminNavbar/>
          )
        }
        else if (usertype === "seller"){
          return (
            <SellerNavbar/>
          )
        }
    }

    return(
        <div>
            {GetNavbar()}
            <Memory panel="About Us "/>
            <div className="min-height-div">
            <div className="artisans-heading">About Us</div>
            <div className="who-are-we-div">
                <span>
                <img className="who-are-we-logo" src={Logo} alt="our-logo"/>
                <div className="who-are-we-heading">Who are we?</div>
                <div className="who-are-we-text">Apnay Rung is a platform which strives to empower Pakistan’s local artists. Through our website, we provide an online marketplace and make our local art accessibele to people all over the world. 
                <br />Apnay Rung is an online shopping portal for Pakistani handicrafts where artisans can sell their craft  and where people can buy a variety of regionally diverse handicrafts from a single place. The main  motivation behind the platform is to promote Pakistan’s regional crafts while allowing artisans to  make a better income from their craft as well.  </div>
                </span>
            </div>

            <div className="vision">
                <div className="our-vision-heading">Our Vision</div>
                <br />
                <br />
                <div className="slogan-text">In recent years, growing westernization has caused Pakistan’s local handicrafts to be abandoned,  posing a threat to both our local artisans and the sacred crafts themselves. This project aims to  correct this by providing a platform to the artisans which will help them popularize these handicrafts  and present them to the world at large.  
                This is a new product that will act as a middleman between local Pakistani artisans and consumers who want to purchase their products. The website will allow artisans to add their products to the  website’s product catalog. It will allow consumers to browse the products in the catalog, know more  about the artisans that make the products, add products to a virtual shopping cart, and place orders. The website will then inform the artisan of the order that has been placed so that the product can be delivered to the consumer. 
                </div>
            </div>
            <div className="name-story">
                <div className="our-vision-heading">The story beind the name,<i> Apnay Rung</i> </div>
                <br />
                <br />
                <div className="slogan-text">In recent years, growing westernization has caused Pakistan’s local handicrafts to be abandoned,  posing a threat to both our local artisans and the sacred crafts themselves. This project aims to  correct this by providing a platform to the artisans which will help them popularize these handicrafts  and present them to the world at large. Apnay Rung specially thanks <a className="ack" href="https://www.vceela.com/" >Vceela</a>, <a className="ack" href="https://womart.pk/">Womart</a>, and <a className="ack" href="https://unsplash.com/">Unsplash</a> for inspiration while building this project.
                </div>
                <br />
                <br />
                <br />

            </div>
          </div>
        <BottomBar />
      
        
        </div>
    )




}

export default AboutUs; 