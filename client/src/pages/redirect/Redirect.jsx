import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import SnackbarComp from "../../components/SnackbarComp";

function Redirect() {
  const { hash } = useParams();
  const [_, setCookie] = useCookies("user");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const result = await axios.post(`${baseURL}/check`, {
        hash
      });
      setCookie(
        "user",
        { accessToken: result.data.response.access_token },
        { path: "/", maxAge: 86400 }
      );
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000)
    } catch (error) {
      console.log(error, "@init redirect");
      snackbar(true, "error", error.response.data.message);
      timeout();
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

  return (
    <div>
      <div className="text">
        <h1>Please wait</h1>
        <h3>You are being redirected....</h3>
      </div>
      <SnackbarComp open={open} status={status} message={message} />
    </div>
  );
}

export default Redirect;
