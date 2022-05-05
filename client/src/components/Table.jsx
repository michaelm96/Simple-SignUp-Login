import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from "@mui/material";
import moment from "moment";


function TableComp({users}) {
  return (
    <div
    style={{
      margin: "1rem",
      height: "70vh",
      background: "transparent",
    }}
  >
    <TableContainer
      component={Paper}
      sx={{ background: "transparent", border: "5px solid white" }}
    >
      <Table
        sx={{ minWidth: 650, background: "transparent" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "17px", color: "white" }}
            >
              #ID
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "17px", color: "white" }}
              align="center"
            >
              Name
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "17px", color: "white" }}
              align="center"
            >
              Email
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "17px", color: "white" }}
              align="center"
            >
              Sign Up
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "17px", color: "white" }}
              align="center"
            >
              Last Session
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "17px", color: "white" }}
              align="center"
            >
              Times Logged in
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((ele) => (
            <TableRow
              key={ele.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                style={{ color: "white", fontSize: "15px" }}
                component="th"
                scope="ele"
              >
                {ele.id}
              </TableCell>
              <TableCell
                style={{ color: "white", fontSize: "15px" }}
                align="center"
              >
                {ele.name}
              </TableCell>
              <TableCell
                style={{ color: "white", fontSize: "15px" }}
                align="center"
              >
                {ele.email}
              </TableCell>
              <TableCell
                style={{ color: "white", fontSize: "15px" }}
                align="center"
              >
                {moment(ele.createdAt).format("HH:mm | DD-MMMM-YYYY")}
              </TableCell>
              <TableCell
                style={{ color: "white", fontSize: "15px" }}
                align="center"
              >
                {moment(ele.lastSession).format("HH:mm | DD-MMMM-YYYY")}
              </TableCell>
              <TableCell
                style={{ color: "white", fontSize: "15px" }}
                align="center"
              >
                {ele.loggedInTimes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  )
}

export default TableComp