import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { GoogleLogin } from "react-google-login";
import {
  Button,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import "./signTemplate.css";
import { useNavigate } from "react-router-dom";
import SnackbarComp from "../../components/SnackbarComp";

function SignTemplate(props) {
  const [sign] = useState(props.type);
  const [_, setCookie] = useCookies("user");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const callback = async (res) => {
    try {
      let result;
      if (res.googleId) {
        result = await axios.post(`${baseURL}/googleLogin`, {
          idToken: res.tokenId,
        });
      } else {
        result = await axios.post(`${baseURL}/facebookLogin`, {
          token: res.accessToken,
          email: res.email,
        });
      }
      setCookie(
        "user",
        { accessToken: result.data.response.access_token },
        { path: "/", maxAge: 86400 }
      );
    } catch (error) {
      console.log(error, `@${res.googleId ? "google" : "facebook"} Error`);
      snackbar(true, "error", `There is error with ${res.googleId ? "google" : "facebook"} login`);
      timeout();
    }
  };

  const login = async () => {
    try {
      if (!email) {
        setStatus("warning");
        setMessage("Email should not be empty");
        setOpen(true);
        timeout();
        return;
      }
      if (!regexCheck(password)) {
        return;
      }
      const result = await axios.post(`${baseURL}/login`, {
        email,
        password,
      });
      setCookie(
        "user",
        { accessToken: result.data.response.access_token },
        { path: "/", maxAge: 86400 }
      );
      navigate("/dashboard");
    } catch (error) {
      console.log(error, "@login error");
      snackbar(true, "error", error.response.data.message);
      timeout()
      if (error.response.status === 307) {
        navigate(`/resend/${email}`);
      }
    }
  };

  const register = async () => {
    try {
      if (!email) {
        snackbar(true, "warning", "Email should not be empty");
        timeout();
        return;
      }
      if (!regexCheck(password)) {
        return;
      }
      const result = await axios.post(`${baseURL}/register`, {
        email,
        password,
      });
      navigate(`/resend/${email}`);
    } catch (error) {
      console.log(error, "@register error");
      snackbar(true, "error", error.response.data.message);
      timeout()
    }
  };

  const timeout = () => {
    setTimeout(() => {
      snackbar(false, "", "");
    }, 4000);
  };

  const snackbar = (open, status, message) => {
    setStatus(status);
    setMessage(message);
    setOpen(open);
  };

  const regexCheck = (str) => {
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    if (!pattern.test(str)) {
      snackbar(true, "warning", "Password should have at least 1 uppercase, 1 lowercase, 1 special character, and minimum 8 characters length")
      timeout();
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <div className="text title">
        <span>Simple App</span>
      </div>
      <div className="form">
        <div className="loginForm">
          <span
            className="text"
            style={{
              fontWeight: "bolder",
              fontSize: "32px",
              marginBottom: "1rem",
            }}
          >
            {sign.charAt(0).toUpperCase() + sign.slice(1)}
          </span>
          <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
          <Input
            id="standard-adornment-password"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={visible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            variant="contained"
            onClick={() => {
              sign === "login" ? login() : register();
            }}
            size="medium"
          >
            {sign.charAt(0).toUpperCase() + sign.slice(1)}
          </Button>
        </div>
        <div className="text" style={{ fontSize: "24px" }}>
          <span>or</span>
        </div>
        <div className="SSO">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={callback}
            onFailure={callback}
            style={{ backgroundColor: "red" }}
            size="small"
            />
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            // onClick={}
            scope="public_profile,email"
            callback={callback}
            icon="fa-facebook"
            style={{ width: "10px" }}
            size="medium"
          />
        </div>
      </div>
      {sign === "login" ? (
        <Link
          onClick={() => {
            navigate("/register");
          }}
          style={{ color: "white" }}
        >
          Wanna sign up? Register here
        </Link>
      ) : (
        <Link
          onClick={() => {
            navigate("/login");
          }}
          style={{ color: "white" }}
        >
          Have an account? Sign in here
        </Link>
      )}
      <SnackbarComp open={open} message={message} status={status} />
    </div>
  );
}

export default SignTemplate;
