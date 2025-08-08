import { useMemo, useState } from "react";
import "../pages/Css/LoginSignup.css";
import facebook_icon from "../components/assets/Facebook.svg";
import google_icon from "../components/assets/google.svg";
import logo from "../components/assets/logo.png"
import {
  makeLoginHandler,
  makeSignupHandler,
  oauthLogin,
} from "../lib/authClient";
import { Link, useLocation, useNavigate } from "react-router";

const LoginSignup = () => {
  const [mode, setMode] = useState("login");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const handleSubmit = useMemo(
    () =>
      mode === "login"
        ? makeLoginHandler({
            onSuccess: () => navigate(from, { replace: true }),
            onError: setErr,
            setPending,
          })
        : makeSignupHandler({
            onSuccess: () => navigate(from, { replace: true }),
            onError: setErr,
            setPending,
          }),
    [mode, from]
  );

  const handleOAuth = async (provider) => {
    try {
      setPending(true);
      await oauthLogin(provider);
      navigate(from, { replace: true });
    } catch (e) {
      setErr(e?.message || "Social login failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <Link to={"/"} style={({ textDecoration: "none", color: "black" })}>
          <div className="header-logo">
            <img src={logo} alt="" />
            <p>DN Store</p>
          </div>
        </Link>
        <h1>{mode === "login" ? "Login" : "Sign Up"}</h1>

        <form className="loginsignup-fields" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input name="name" type="text" placeholder="Your Name" required />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            minLength={6}
            required
          />
          {mode === "signup" && (
            <input
              name="confirm"
              type="password"
              placeholder="Confirm Password"
              minLength={6}
              required
            />
          )}
          {mode === "signup" && (
            <div className="loginsignup-agree">
              <input type="checkbox" required />
              <p>
                By continuing I agree to the terms of use and privacy policy
              </p>
            </div>
          )}
          <button type="submit" disabled={pending}>
            {pending ? "Please wait…" : mode === "login" ? "Login" : "Continue"}
          </button>

          {err && <p className="error">{err}</p>}
        </form>

        <p className="loginsignup-login">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <span
                onClick={() => {
                  setErr("");
                  setMode("signup");
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setErr("");
                  setMode("login");
                }}
              >
                Login Here
              </span>
            </>
          )}
        </p>

        {mode === "login" && (
          <div className="social-auth">
            <div
              className="divider"
              style={{ margin: "12px 0", textAlign: "center" }}
            >
              <span>or continue with</span>
            </div>
            <div className="social-buttons" style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="social-btn google"
                onClick={() => handleOAuth("google")}
                disabled={pending}
              >
                <img src={google_icon} alt="" />
                <p>Google</p>
              </button>

              <button
                type="button"
                className="social-btn facebook"
                onClick={() => handleOAuth("facebook")}
                disabled={pending}
              >
                <img src={facebook_icon} alt="" />
                <p>Facebook</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
