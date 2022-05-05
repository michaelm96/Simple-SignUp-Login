import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import Slide from "@mui/material/Slide"

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function SnackbarComp(props) {
  const [open, setOpen] = useState(props.open);
  const [status, setStatus] = useState(props.status);
  const [message, setMessage] = useState(props.message);
  const [transition, setTransition] = useState({
    Transition: ""
  });

  useEffect(() => {
    setTransition({Transition: SlideTransition});
    setStatus(props.status);
    setMessage(props.message);
    setOpen(props.open);
  }, [props]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={transition.Transition}
      key={"SlideTransition"}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarComp;
