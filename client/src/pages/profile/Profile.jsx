import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SnackbarComp from "../../components/SnackbarComp";
import "./profile.css";

function Profile() {
  const [cookies, _, removeCookie] = useCookies("user");
  const [user, setUser] = useState();
  const [name, setName] = useState();
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const user = await axios.get(`${baseURL}/user`, {
        headers: {
          authentication: cookies.user.accessToken,
        },
      });
      setUser(user.data.response);
      setName(user.data.response.name);
    } catch (error) {
      console.log(error, "@init profile");
      snackbar(true, "error", error.response.data.message);
    }
  };

  const logout = () => {
    removeCookie("user", { path: "/" });
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

  const resetName = async () => {
    try {
      if (!name) {
        snackbar(true, "warning", "Name cannot be empty");
        timeout();
        return;
      }
      const result = await axios.put(
        `${baseURL}/reset/${user.id}`,
        {
          property: "name",
          value: {
            old: "-",
            new: name,
          },
        },
        {
          headers: {
            authentication: cookies.user.accessToken,
          },
        }
      );
      setEdit(false);
      snackbar(true, "success", "Success reset name");
      timeout();
    } catch (error) {
      console.log(error, "@reset name error");
      snackbar(true, "error", error.response.data.message);
      timeout();
    }
  };

  return (
    <div>
      <div className="header">
        <Link to="/dashboard">
          <HomeIcon
            sx={{
              height: "50px",
              width: "50px",
            }}
            className="profIcon"
          />
        </Link>
        <span className="text title">Profile</span>
        <ExitToAppIcon
          sx={{
            height: "50px",
            width: "50px",
          }}
          className="profIcon"
          onClick={() => {
            logout();
          }}
        />
      </div>
      <div>
        {user ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              height: "200px",
              backgroundColor: "rgba(255,255,255, 0.5)",
              margin: "0 30%",
              borderRadius: "30px",
              minWidth: "400px",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "3em",
                boxSizing: "border-box",
              }}
            >
              <TextField
                disabled={!edit}
                id="standard-disabled"
                label="Name"
                value={name}
                variant="standard"
                onChange={(e) => setName(e.target.value)}
                sx={{ width: "300px" }}
              />
              {!edit ? (
                <span
                  style={{
                    position: "absolute",
                    bottom: 10,
                    fontSize: "20px",
                    fontWeight: "bolder",
                    color: "yellow",
                  }}
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Reset
                </span>
              ) : (
                <span
                  style={{
                    position: "absolute",
                    bottom: 10,
                    fontSize: "20px",
                    fontWeight: "bolder",
                    color: "green",
                  }}
                  onClick={() => {
                    resetName();
                  }}
                >
                  Save
                </span>
              )}
            </div>
            <TextField
              disabled
              id="standard-disabled"
              label="Email"
              value={user ? user.email : ""}
              variant="standard"
              sx={{ width: "300px", fontWeight:"bolder" }}
            />
          </div>
        ) : (
          <></>
        )}
        <SnackbarComp open={open} message={message} status={status} />
      </div>
    </div>
  );
}

export default Profile;
