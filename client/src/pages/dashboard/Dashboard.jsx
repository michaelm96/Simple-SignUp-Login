import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import TableComp from "../../components/Table";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from "@mui/icons-material/LockReset";
import axios from "axios";
import moment from "moment";
import "./dashboard.css";
import SnackbarComp from "../../components/SnackbarComp";

function Dashboard() {
  const [cookies] = useCookies("user");
  const [users, setUsers] = useState([]);
  const [statistic, setStatistic] = useState();
  const [todayActiveSessions, setTodayActiveSessions] = useState();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const users = await axios.get(`${baseURL}/users`, {
        headers: {
          access_token: cookies.user.accessToken,
        },
      });
      const statistic = await axios.get(`${baseURL}/activeSessions/7`, {
        headers: {
          access_token: cookies.user.accessToken,
        },
      });
      const sorted = users.data.response.sort((a, b) => {
        return a.id < b.id ? -1 : 1;
      });
      setUsers(sorted);
      setStatistic(statistic.data.response);
      const activeSessions = statistic.data.response.filter(
        (ele) => moment(ele.lastSession) > moment().subtract(1, "days").toDate()
      );
      setTodayActiveSessions(activeSessions);
    } catch (error) {
      console.log(error, "@init dashboard");
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
      <div className="header">
        <Link to="/profile">
          <AccountCircleIcon
            className="dashIcon"
            sx={{ width: "50px", height: "50px" }}
          />
        </Link>
        <span className="title text">Dashboard</span>
        <Link to="/resetPassword">
          <LockResetIcon
            className="dashIcon"
            sx={{ width: "50px", height: "50px" }}
          />
        </Link>
      </div>
      <div
        className="text"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <span>Total signed up user: {users.length} user(s)</span>
        <span>
          Total user that active in the last 24 hours:{" "}
          {todayActiveSessions?.length} user(s)
        </span>
        <span>
          Average user that active in the last 7 days:{" "}
          {(statistic?.length / 7).toFixed(1)} user(s) / day
        </span>
      </div>
      <TableComp users={users} />
      <SnackbarComp open={open} message={message} status={status} />
    </div>
  );
}

export default Dashboard;
