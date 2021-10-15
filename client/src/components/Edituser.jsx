import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
  FormControl,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import { userUpdateEmailSchema, userPhoneSchema } from "./UserValidation";
import base_url from "../devpro/Baseurl";
import { signout } from "../auth/auth";

const Edituser = (params) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const [userValues, setUserValue] = useState({
    src: "",
    name: "",
    bio: "",
    phone: "",
    email: "",
    password: "",
    img: "",
  });

  const [snack, setSnack] = useState({
    fault: false,
    message: "",
    severity: "success",
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleValues = (prop) => async (event) => {
    if (prop === "img") {
      setUserValue({
        ...userValues,
        [prop]: URL.createObjectURL(event.target.files[0]),
        src: event.target.files[0],
      });
    } else {
      setUserValue({ ...userValues, [prop]: event.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValid = await userUpdateEmailSchema.isValid(userValues);
    const phoneValid = await userPhoneSchema.isValid(userValues);

    let formData = new FormData();
    formData.append("id", `${params.match.params.id}`);
    formData.append("src", userValues.src);
    formData.append("email", userValues.email);
    formData.append("password", userValues.password);
    formData.append("name", userValues.name);
    formData.append("bio", userValues.bio);
    formData.append("phone", userValues.phone);

    if (emailValid && phoneValid) {
      await axios
        .put(`${base_url}userinfo`, formData)
        .then((res) => {
          setSnack({
            ...snack,
            fault: true,
            severity: "success",
            message: "Update succesfull",
          });
          history.push({
            pathname: `/userInfo/${params.match.params.id}`,
            state: "true",
          });
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
          message: "Incorrect Phone",
        });
      else
        setSnack({
          ...snack,
          fault: true,
          severity: "error",
          message: "Incorrect Email",
        });
    }
  };

  const handleClose = () => {
    setSnack({ ...snack, fault: false });
  };

  return (
    <>
      <Box
        sx={{
          color: "white",
          position: "relative",
          top: { xs: "-4.6rem", lg: "-5rem" },
          width: "12%",
          marginLeft: "auto",
          right: { xs: "3rem", lg: "9rem" },
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
        >
          <Avatar
            alt="avatar"
            src={userValues.src}
            sx={{
              width: { xs: "35px", lg: "40px" },
              height: { xs: "35px", lg: "40px" },
            }}
          />
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
          onClose={() => {
            setAnchorEl(null);
          }}
          sx={{ top: "4rem", left: "-8px", width: "13rem" }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              history.push(`/userInfo/${params.match.params.id}`);
            }}
          >
            <AccountCircle sx={{ marginRight: "1rem" }} />
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <GroupIcon sx={{ marginRight: "1rem" }} />
            Group chat
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              signout(() => {
                history.push({
                  pathname: "/",
                  params: {
                    message: "logout",
                  },
                });
              });
            }}
          >
            <LogoutIcon sx={{ marginRight: "1rem" }} />
            logout
          </MenuItem>
        </Menu>
      </Box>
      <Box
        component="form"
        // encType="multipart/form-data"
        onSubmit={handleSubmit}
        sx={{ width: { lg: "60%", sm: "100%" }, margin: "auto" }}
      >
        <Card
          sx={{
            display: "inline-flex",
            height: "8rem",
            width: "100%",
            p: "1rem",
            pl: { lg: "3rem" },
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
        <FormControl sx={{ width: "100%" }}>
          <Card
            sx={{
              width: "100%",
              display: "inline-flex",
              p: "1rem",
              pl: { lg: "3rem" },
              height: "8rem",
              alignItems: "center",
            }}
          >
            <Card sx={{ width: "6rem", height: "6rem" }}>
              <img
                src={userValues.img}
                alt={userValues.img}
                width="100%"
                height="100%"
              />
              <CameraAltIcon
                sx={{ position: "relative", top: "-4rem", color: "white" }}
              />
            </Card>
            <Box
              textAlign="left"
              sx={{ width: { xs: "10rem", lg: "18rem" }, ml: 4 }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="file-input"
                multiple
                type="file"
                onChange={handleValues("img")}
              />
              <label htmlFor="file-input">
                <Button component="span">Choose Image</Button>
              </label>
            </Box>
          </Card>
        </FormControl>

        <FormControl sx={{ width: "100%" }}>
          <Card
            sx={{
              width: "100%",
              p: "1rem",
              pl: { lg: "3rem" },
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
              sx={{ width: { xs: "19.5rem", lg: "25rem" }, mt: "-0.5rem" }}
            />
          </Card>
        </FormControl>

        <FormControl sx={{ width: "100%" }}>
          <Card
            sx={{
              width: "100%",
              p: "1rem",
              pl: { lg: "3rem" },
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
              sx={{ width: { xs: "19.5rem", lg: "25rem" }, mt: "-0.5rem" }}
            />
          </Card>
        </FormControl>

        <FormControl sx={{ width: "100%" }}>
          <Card
            sx={{
              width: "100%",
              p: "1rem",
              pl: { lg: "3rem" },
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
              sx={{ width: { xs: "19.5rem", lg: "25rem" }, mt: "-0.5rem" }}
            />
          </Card>
        </FormControl>

        <FormControl sx={{ width: "100%" }}>
          <Card
            sx={{
              width: "100%",
              p: "1rem",
              pl: { lg: "3rem" },
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
              sx={{ width: { xs: "19.5rem", lg: "25rem" }, mt: "-0.5rem" }}
            />
          </Card>
        </FormControl>

        <FormControl sx={{ width: "100%" }}>
          <Card
            sx={{
              width: "100%",
              p: "1rem",
              pl: { lg: "3rem" },
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
              sx={{ width: { xs: "19.5rem", lg: "25rem" }, mt: "-0.5rem" }}
            />
          </Card>
        </FormControl>

        <Card
          sx={{
            width: "100%",
            p: "1rem",
            pl: { lg: "3rem" },
            height: "5rem",
            display: "inline-grid",
            textAlign: "center",
            pt: "1rem",
            position: "relative",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            sx={{ width: "20%", height: "2.5rem" }}
          >
            Save
          </Button>
        </Card>
      </Box>
      <Snackbar
        open={snack.fault}
        autoHideDuration={1000000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="filled" severity={snack.severity} onClose={handleClose}>
          {snack.severity}
          {" : "}
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Edituser;
