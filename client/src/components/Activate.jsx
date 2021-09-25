import React, { useEffect, useState } from "react";
import base_url from "../devpro/baseurl";
import axios from "axios";
import { Alert, Button, Card, Snackbar,Link } from "@mui/material";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router";

const Activate = ({ match }) => {
  console.log(match);
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    token: "",
  });

  const [snack, setSnack] = useState({
    fault: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const token = match.params.token;
    const { email } = jwt.decode(token);
    if (token) {
      setFormData({ ...formData, email, token });
    }
    console.log(email, token);
  }, [match.params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { token } = formData;
    await axios
      .post(`${base_url}user/signup/activation`, {
        token,
      })
      .then((res) => {
        console.log(res);
        if (res.data.message === "user added") {
          history.push("/userInfo");
        } else if (res.data.message === "user exist") {
          history.push("/login");
        } else if (res.data.message === "link expired") {
          setSnack({
            ...snack,
            fault: true,
            message: "Link expired singup again",
            severity: "info",
          });
        } else {
          setSnack({
            ...snack,
            fault: true,
            message: "Incorrect details",
            severity: "error",
          });
        }
        setFormData({ ...formData, email: "", token: "" });
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setSnack({ ...snack, fault: false });
  };
  return (
    <>
      <Card sx={{ mx: "auto", width: "40%", p: 4, textAlign: "left",display:'grid' }}>
        <Button variant="contained"  onClick={handleSubmit} sx={{margin:'1rem'}}> 
          Activate account
        </Button>
        <Link href="/signup" sx={{textDecoration:'none'}} mx={{padding:'1rem'}} >
          <Button variant="contained" sx={{width:'100%'}}>Sign Up</Button>
        </Link>
      </Card>
      <Snackbar
        open={snack.fault}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snack.severity} onClose={handleClose}>
          {snack.severity}:{snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Activate;
