import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputProps,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import { useCookies } from "react-cookie";
import axios from "axios";
import SnackbarComp from "../../components/SnackbarComp";

function ResetPassword() {
  const [cookies] = useCookies("user");
  const [oldPass, setOldPass] = useState("");
  const [oldPassFieldDisabled, setOldPassFieldDisabled] = useState();
  const [user, setUser] = useState();
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const baseURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const result = await axios.get(`${baseURL}/oldPass`, {
        headers: {
          authentication: cookies.user.accessToken,
        },
      });
      const user = await axios.get(`${baseURL}/user`, {
        headers: {
          authentication: cookies.user.accessToken,
        },
      });
      setUser(user.data.response);
      setOldPassFieldDisabled(result.data);

      if (result.data.response.disable) {
        setOldPass("oauth");
      }
    } catch (error) {
      console.log(error, "@reset password error");
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

  const submit = async () => {
    try {
      const require1 = matchingPass(newPass, newPass2);
      const require2 = regexCheck(newPass);
      if (require1 && require2) {
        const res = await axios.put(
          `${baseURL}/reset/${user.id}`,
          {
            property: "password",
            value: {
              old: oldPass,
              new: newPass,
            },
          },
          {
            headers: {
              authentication: cookies.user.accessToken,
            },
          }
        );

        if (res.status === 200) {
          snackbar(true, "success", "reset is success");
          timeout();
          setOldPass("");
          setNewPass("");
          setNewPass2("");
        }
      }
    } catch (error) {
      console.log(error, "@submit reset password error");
      snackbar(true, "error", error.response.data.message);
      timeout();
    }
  };

  const regexCheck = (str) => {
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    if (!pattern.test(str)) {
      snackbar(
        true,
        "warning",
        "New password should have at least 1 uppercase, 1 lowercase, 1 special character, and minimum 8 characters length"
      );
      timeout();
      return false;
    }
    return true;
  };

  const matchingPass = (str1, str2) => {
    if (str1 !== str2) {
      snackbar(
        true,
        "warning",
        "Your new password and one you re-enter should be match"
      );
      timeout();
      return false;
    }
    return true;
  };

  return (
    <>
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
          <span className="text title">Reset Password</span>
          <Link to="/dashboard" style={{ opacity: 0, cursor: "context-menu" }}>
            <HomeIcon
              sx={{
                height: "50px",
                width: "50px",
                cursor: "context-menu",
              }}
              className="profIcon"
            />
          </Link>
        </div>
        <FormControl
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0 37.5%",
            justifyContent: "space-between",
            height: "250px",
            backgroundColor: "rgba(255,255,255, 0.2)",
            padding: "1.75rem",
            borderRadius: "20px",
          }}
        >
          {oldPassFieldDisabled && oldPassFieldDisabled.response.disable ? (
            <TextField
              id="oldPass"
              label="old password"
              disabled={oldPassFieldDisabled.response.disable}
              value={oldPassFieldDisabled.message}
              type="text"
            />
          ) : (
            <TextField
              id="oldPassword"
              label="Old Password"
              value={oldPass}
              disabled={false}
              onChange={(e) => setOldPass(e.target.value)}
              type={visible1 ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setVisible1(!visible1)}
                    >
                      {visible1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <TextField
            id="newPass1"
            label="New password"
            value={newPass}
            disabled={false}
            onChange={(e) => setNewPass(e.target.value)}
            type={visible2 ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setVisible2(!visible2)}
                  >
                    {visible2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="newPass2"
            label="Re-enter new password"
            value={newPass2}
            disabled={false}
            onChange={(e) => setNewPass2(e.target.value)}
            type={visible3 ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setVisible3(!visible3)}
                  >
                    {visible3 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              submit();
            }}
          >
            Submit
          </Button>
        </FormControl>
        <SnackbarComp open={open} message={message} status={status} />
      </div>
    </>
  );
}

export default ResetPassword;
