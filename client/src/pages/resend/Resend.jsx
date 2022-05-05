import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SnackbarComp from "../../components/SnackbarComp";

function Resend() {
  const params = useParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!params.email) {
      navigate("/login");
      return;
    }
    setEmail(params.email);
  }, []);

  const resend = async () => {
    setLoading(true);
    if (disable) {
      snackbar(true, "error", "Please wait for 5 seconds");
      timeout();
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${baseURL}/resend`, {
        email,
      });
      snackbar(true, "success", "Successfully resend email");
      timeout();
      setDisable(true);
      setLoading(false);
      setTimeout(() => {
        setDisable(false);
        setOpen(false);
      }, 5000);
    } catch (error) {
      console.log(error, "@resend error");
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
      <div
        className="text"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <span style={{ fontSize: "30px", height: "10vh" }}> Resend </span>
        <div
          style={{
            height: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "column",
            width:"30vw"
          }}
        >
          <span className="text">
            Please check your email, or if you haven't received any. you can
            clik button below to resend
          </span>
          <Button
            variant="contained"
            onClick={() => {
              resend();
            }}
          >
            {loading ? "Loading..." : "Resend Email Verification"}
          </Button>
          <a href="/login" className="text">
            Back to Login page
          </a>
          <SnackbarComp open={open} message={message} status={status} />
        </div>
      </div>
    </div>
  );
}

export default Resend;
