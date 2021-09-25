import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Typography,
  Divider,
  Box,
  Button,
  TextField,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import logo from "../resources/devchallenges.svg";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import { userEmailSchema, userPhoneSchema } from "./UserValidation";

const Edituser = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userValues, setUserValue] = useState({
    src: "",
    name: "",
    bio: "",
    phone: 0,
    email: "",
    password: "",
  });

  const [snack, setSnack] = useState({
    fault: false,
    message: "",
    severity: "",
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleValues = (prop) => async (event) => {
    console.log(prop);
    if (prop === "src") {
      setUserValue({
        ...userValues,
        [prop]: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      setUserValue({ ...userValues, [prop]: event.target.value });
    }
    console.log(userValues[prop]);
  };

  const handleSubmit = async () => {
    const emailValid = await userEmailSchema.isValid(userValues);
    const phoneValid = await userPhoneSchema.isValid(userValues);
    if (emailValid && phoneValid) {
      await axios
        .post("/upload", {
          userValues,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else {
      if (!emailValid && !phoneValid)
        setSnack({
          ...snack,
          fault: true,
          severity: "error",
          message: "Invalid entry",
        });
      else if (emailValid && !phoneValid)
        setSnack({
          ...snack,
          fault: true,
          severity: "error",
          message: "Incorrect Email",
        });
      else
        setSnack({
          ...snack,
          fault: true,
          severity: "error",
          message: "Incorrect Phone",
        });
    }
  };

  const handleClose = () => {
    setSnack({ ...snack, fault: false });
  };

  return (
    <>
      <div
        style={{
          color: "white",
          position: "relative",
          top: "-6rem",
          width: "12%",
          marginLeft: "auto",
          right: "9rem",
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
        >
          <Avatar alt="avatar" />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          sx={{ top: "4rem", left: "-8px", width: "13rem" }}
        >
          <MenuItem onClick={handleCloseMenu}>
            <AccountCircle sx={{ marginRight: "1rem" }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <GroupIcon sx={{ marginRight: "1rem" }} />
            Group chat
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseMenu}>
            <LogoutIcon sx={{ marginRight: "1rem" }} />
            logout
          </MenuItem>
        </Menu>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "60%", margin: "auto" }}
      >
        <Card
          sx={{
            display: "inline-flex",
            height: "8rem",
            width: "100%",
            padding: "1rem",
            paddingLeft: "3rem",
            alignItems: "center",
            paddingRight: "3rem",
          }}
        >
          <div style={{ textAlign: "left", flex: "1" }}>
            <Typography variant="h4">Change Info</Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#828282", fontWeight: "400" }}
            >
              Changes will be visible to every services
            </Typography>
          </div>
        </Card>

        <Card
          sx={{
            width: "100%",
            display: "inline-flex",
            paddingLeft: "3rem",
            height: "8rem",
            alignItems: "center",
          }}
        >
          <Card sx={{ width: "6rem", height: "6rem" }}>
            <img
              src={userValues.src}
              alt="profile"
              width="100%"
              height="100%"
            />
            <CameraAltIcon
              sx={{ position: "relative", top: "-4rem", color: "white" }}
            />
          </Card>
          <Box textAlign="left" sx={{ width: "18rem", ml: 4 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleValues("src")}
            />
            <label htmlFor="raised-button-file">
              <Button component="span">Choose Image</Button>
            </label>
          </Box>
        </Card>

        <Card
          sx={{
            width: "100%",
            paddingLeft: "3rem",
            height: "8rem",
            display: "inline-grid",
            textAlign: "center",
            pt: "1rem",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography fontFamily="Noto Sans">Name</Typography>
          </Box>
          <TextField
            id="outlined-basic"
            placeholder="Enter your name..."
            variant="outlined"
            onChange={handleValues("name")}
            sx={{ width: "25rem", mt: "-1.5rem" }}
          />
        </Card>

        <Card
          sx={{
            width: "100%",
            paddingLeft: "3rem",
            height: "15rem",
            display: "inline-grid",
            textAlign: "center",
            pt: "1rem",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography fontFamily="Noto Sans">Bio</Typography>
          </Box>
          <TextField
            id="outlined-textarea"
            placeholder="Enter your bio..."
            onChange={handleValues("bio")}
            multiline
            rows={6}
            sx={{ width: "25rem", mt: "-1.5rem" }}
          />
        </Card>

        <Card
          sx={{
            width: "100%",
            paddingLeft: "3rem",
            height: "8rem",
            display: "inline-grid",
            textAlign: "center",
            pt: "1rem",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography fontFamily="Noto Sans">Phone</Typography>
          </Box>
          <TextField
            id="outlined-basic"
            placeholder="Enter your phone..."
            variant="outlined"
            onChange={handleValues("phone")}
            sx={{ width: "25rem", mt: "-1.5rem" }}
          />
        </Card>

        <Card
          sx={{
            width: "100%",
            paddingLeft: "3rem",
            height: "8rem",
            display: "inline-grid",
            textAlign: "center",
            pt: "1rem",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography fontFamily="Noto Sans">Email</Typography>
          </Box>
          <TextField
            id="outlined-basic"
            placeholder="Enter your email"
            variant="outlined"
            onChange={handleValues("email")}
            sx={{ width: "25rem", mt: "-1.5rem" }}
          />
        </Card>

        <Card
          sx={{
            width: "100%",
            paddingLeft: "3rem",
            height: "8rem",
            display: "inline-grid",
            textAlign: "center",
            pt: "1rem",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography fontFamily="Noto Sans">Password</Typography>
          </Box>
          <TextField
            id="outlined-basic"
            placeholder="Enter your new password"
            variant="outlined"
            onChange={handleValues("password")}
            sx={{ width: "25rem", mt: "-1.5rem" }}
          />
        </Card>
        <Card
          sx={{
            width: "100%",
            paddingLeft: "3rem",
            height: "5rem",
            display: "inline-grid",
            textAlign: "center",
            pt: "1rem",
          }}
        >
          <Link
            to="/userInfo"
            style={{ textDecoration: "none", textAlign: "left" }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "20%", height: "2.5rem" }}
            >
              Save
            </Button>
          </Link>
        </Card>
      </Box>
      <Snackbar
        open={snack.fault}
        autoHideDuration={6000}
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

export default Edituser;
