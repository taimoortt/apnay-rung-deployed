import "./styles.css";
import "./taimoor.css";
// Common Pages
import Homepage from "./Homepage.js";
import Product from "./Product.js";
import Catalog from "./Catalog";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Artisans from "./Artisans.js";
import AddReview from "./AddReview";
import AboutUs from "./AboutUs";
import Notifications from "./Notifications"

// Admin Pages
import AdminPanel from "./AdminPanel";
import ViewOrders from "./ViewOrders";
import QueryForms from "./QueryForms";
import ViewSellers from "./ViewSellers"
import ViewAllProducts from "./ViewAllProducts";
import AdminSettings from "./AdminSettings";
import CreateTutorial from "./CreateTutorial";
import Tutorials from "./Tutorials";
import UpdateTutorial from "./UpdateTutorial";
import ViewCustomers from "./ViewCustomers";
import ApproveSellers from "./ApproveSellers";

// Customer Pages
import CustomerPanel from "./CustomerPanel";
import ShoppingCart from "./ShoppingCart";
import Checkout from "./Checkout";
import SignupCustomer from "./SignUpCustomer";
import SecurityPage from "./SecurityPage";
import OrderConfirmation from "./OrderConfirmation";
import CustomerSettings from "./CustomerSettings";
import AddQuery from "./AddQuery";

// Seller Pages
import SellerPanel from "./SellerPanel";
import SignupSeller from "./SignUpSeller";
import UploadCNIC from "./UploadCNIC";
import SellerSettings from "./SellerSettings";
import ViewTutorials from "./ViewTutorials";
import Inventory from "./Inventory";
import UpdateProduct from "./UpdateProduct";
import ViewCurrentOrders from "./ViewCurrentOrders";
import AddProduct from "./AddProduct";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
export default function App() {
  return (
    <Router>
      <Switch>
        <div className="App">
          {/* //  Admin Pages */}
          <Route path="/AdminPanel" exact component={AdminPanel} />
          <Route path="/ViewOrders" exact component={ViewOrders} />
          <Route path="/QueryForms" exact component={QueryForms} />
          <Route path="/ViewSellers" exact component={ViewSellers} />
          <Route path="/ViewAllProducts" exact component={ViewAllProducts} />
          <Route path="/AdminSettings" exact component={AdminSettings} />
          <Route path="/CreateTutorial" exact component={CreateTutorial} />
          <Route path="/Tutorials" exact component={Tutorials} />
          <Route path="/UpdateTutorial" exact component={UpdateTutorial} />
          <Route path="/ViewCustomers" exact component={ViewCustomers} />
          <Route path="/ApproveSellers" exact component={ApproveSellers} />





          {/* Customer Pages */}
          <Route path="/CustomerPanel" exact component={CustomerPanel} />
          <Route path="/ShoppingCart" exact component={ShoppingCart} />
          <Route path="/Checkout" exact component={Checkout} />
          <Route path="/OrderConfirmation" exact component={OrderConfirmation} />
          <Route path="/SignupCustomer" exact component={SignupCustomer} />
          <Route path="/SecurityPage" exact component={SecurityPage} />
          <Route path="/CustomerSettings" exact component={CustomerSettings} />
          <Route path="/AddReview" exact component={AddReview}/>
          <Route path="/AddQuery" exact component={AddQuery}/>

          


          {/* Sellers Pages */}
          <Route path="/SellerPanel" exact component={SellerPanel} />
          <Route path="/SignupSeller" exact component={SignupSeller} />
          <Route path="/UploadCNIC" exact component={UploadCNIC} />
          <Route path="/SellerSettings" exact component={SellerSettings} />
          <Route path="/ViewTutorials" exact component={ViewTutorials} />
          <Route path="/Inventory" exact component={Inventory} />
          <Route path="/UpdateProduct" exact component={UpdateProduct} />
          <Route path="/AddProduct" exact component={AddProduct} />
          <Route path="/ViewCurrentOrders" exact component={ViewCurrentOrders} />





          {/* Common Pages */}
          <Route path="/" exact component={Homepage} />
          <Route path="/Homepage" exact component={Homepage} />
          <Route path="/Catalog" exact component={Catalog} />
          <Route path="/Product" exact component={Product} />
          <Route path="/Login" exact component={Login} />
          <Route path="/ForgotPassword" exact component={ForgotPassword} />
          <Route path="/ResetPassword" exact component={ResetPassword} />
          <Route path="/Artisans" exact component={Artisans} />
          <Route path="/AboutUs" exact component={AboutUs} />
          <Route path="/Notifications" exact component={Notifications} />




        </div>
      </Switch>
    </Router>
  );
}