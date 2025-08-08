import { useState, useContext, useEffect } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";
import menu_24 from "../assets/menu_24px.png";
import close_24 from "../assets/close_24px.png";
import { Link, useNavigate } from "react-router";
import { ShopContext } from "../../Context/ShopContext";
import { getCurrentUser, logout, onAuthChange } from "../../lib/authClient"; 

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const [menu, setMenu] = useState("shop");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return unsubscribe;
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const newState = !prev;
      document.body.classList.toggle("menu-open", newState);
      return newState;
    });
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/"); 
  };

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="nav-logo">
          <img src={logo} alt="logo" />
          <p>DN Store</p>
        </div>
      </Link>

      {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

      <ul className={`nav-menu ${menuOpen ? "nav-menu-visible" : ""}`}>
        <div className="nav-menu-header">
          <img src={logo} alt="Logo" className="nav-menu-logo" />
          <img
            src={close_24}
            alt="Close Menu"
            className="nav-menu-close"
            onClick={closeMenu}
          />
        </div>
        <li
          onClick={() => {
            setMenu("shop");
            closeMenu();
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Shop
          </Link>
          {menu === "shop" && <hr />}
        </li>
        <li
          onClick={() => {
            setMenu("men");
            closeMenu();
          }}
        >
          <Link to="/men" style={{ textDecoration: "none" }}>
            Men
          </Link>
          {menu === "men" && <hr />}
        </li>
        <li
          onClick={() => {
            setMenu("women");
            closeMenu();
          }}
        >
          <Link to="/women" style={{ textDecoration: "none" }}>
            Women
          </Link>
          {menu === "women" && <hr />}
        </li>
        <li
          onClick={() => {
            setMenu("kids");
            closeMenu();
          }}
        >
          <Link to="/kids" style={{ textDecoration: "none" }}>
            Kids
          </Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
        </Link>

        <div className="nav-cart-count">{getTotalCartItems()}</div>

        <img
          className="nav-dropdown"
          onClick={toggleMenu}
          src={menuOpen ? close_24 : menu_24}
          alt="menu"
        />
      </div>
    </div>
  );
};

export default Navbar;
