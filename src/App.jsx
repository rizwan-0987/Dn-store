import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import LoginSignup from "./pages/LoginSignup";
import Footer from "./components/Footer/Footer";
import men_banner from "./components/assets/banner_mens.png"
import women_banner from "./components/assets/banner_women.png";
import kids_banner from "./components/assets/banner_kids.png";
import AuthNavbar from "./components/AuthNavbar/AuthNavbar";





function AppContent() {
  const location = useLocation();
  const path = location.pathname;

  const isAuthPage = path === "/login"; 
  const showMainNavbar = !isAuthPage;

  return (
    <>
      {showMainNavbar ? <Navbar /> :null}

      <Routes>
        <Route path="/" element={<Shop />} />
        <Route
          path="/men"
          element={<ShopCategory banner={men_banner} category="men" />}
        />
        <Route
          path="/women"
          element={<ShopCategory banner={women_banner} category="women" />}
        />
        <Route
          path="/kids"
          element={<ShopCategory banner={kids_banner} category="kid" />}
        />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>

      {showMainNavbar && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
export default App;
