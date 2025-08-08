import "./AuthNavbar.css";
import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";
import menu_24 from "../assets/menu_24px.png";
import close_24 from "../assets/close_24px.png";
import { Link } from "react-router";

const AuthNavbar = () => {
  

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="nav-logo">
          <img src={logo} alt="logo" />
          <p>DN Store</p>
        </div>
      </Link>



      <div className="nav-login-cart">
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button>Login</button>
        </Link>
       </div>
    </div>
  );
};

export default AuthNavbar;
