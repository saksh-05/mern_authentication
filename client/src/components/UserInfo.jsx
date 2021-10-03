import {
  Typography,
  Snackbar,
  Alert,
  Button,
  Menu,
  IconButton,
  MenuItem,
  Avatar,
  Divider,
  Card,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import { useHistory } from "react-router";
import base_url from "../devpro/Baseurl";
import { signout } from "../auth/auth";

const UserInfo = (params) => {
  console.log(params);
  const theme = useTheme();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [userValues, setUserValue] = useState({
    src: "../resources/devchallenges.svg",
    name: "",
    bio: "",
    phone: "",
    email: "",
    password: "",
  });

  const [snack, setSnack] = useState({
    fault: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setSnack({ ...snack, fault: false });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const updateSnack = (msg) => {
    console.log(msg);
    setSnack({
      ...snack,
      fault: true,
      message: msg,
      severity: "success",
    });
    params.location.state = false;
    // setTimeout(() => {
    //   setSnack({
    //     ...snack,
    //     fault: false,
    //   });
    //   params.location.state = false;
    // }, 3000);
  };

  useEffect(() => {
    async function getUser() {
      await axios
        .get(`${base_url}userinfo`, {
          params: {
            id: `${params.match.params.id}`,
          },
        })
        .then((res) => {
          const { bio, name, email, phone, src } = res.data.user;
          console.log(bio, name, email, phone);
          const ar = src.startsWith("https://") ? src.split(":") : src;
          console.log(ar[0]);
          setUserValue({
            src: ar[0] !== "https" ? `${base_url}` + ar[0] : src,
            name: name === undefined ? userValues.name : name,
            email: email === undefined ? userValues.email : email,
            bio:
              bio === undefined || bio === "undefined" ? userValues.bio : bio,
            phone: phone === undefined ? userValues.phone : phone,
          });
          console.log(userValues);
          console.log(res);
        })
        .catch((err) => console.log(err));

      if (params.location.params !== undefined) {
        updateSnack("Success login");
      }
      if (params.location.state) {
        updateSnack("Update Success");
        params.location.state = false;
      }
      console.log("user info useeffect");
    }
    getUser();
    console.log("user info ");
  }, [params.location.params, params.match.params.id]);

  return (
    <>
      <div
        style={{
          color: "white",
          position: "relative",
          top: "-5rem",
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
          color="inherit"
        >
          <Avatar alt="avatar" src={userValues.src} />
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              signout(() => {
                history.push({
                  pathname: "/",
                  params: {
                    fault: true,
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
      </div>

      <Box sx={{ position: "relative", top: "-3rem" }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Noto Sans",
            fontSize: " 2.5rem",
            color: theme.palette.mode === "light" ? "black" : "white",
          }}
        >
          Personal Info
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Noto Sans",
            color: theme.palette.mode === "light" ? "black" : "white",
          }}
        >
          Basic info like your name and photo
        </Typography>
      </Box>
      <Card sx={{ width: "60%", margin: "auto" }}>
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
            <Typography variant="h4">Profile</Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "#828282", fontWeight: "400" }}
            >
              Some info may be visible to other people
            </Typography>
          </div>
          <Card sx={{ borderRadius: "1rem" }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "1rem",
                width: "6rem",
                color: "#828282",
                border: "1px solid #828282",
              }}
              onClick={() => {
                history.push({
                  pathname: `/editUser/${params.match.params.id}`,
                });
              }}
            >
              Edit
            </Button>
          </Card>
        </Card>
        <Divider />
        <Card
          sx={{
            width: "100%",
            display: "inline-flex",
            paddingLeft: "3rem",
            height: "8rem",
            alignItems: "center",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography
              fontFamily="Noto Sans"
              sx={{ fontWeight: "600", color: "#BDBDBD" }}
            >
              Photo
            </Typography>
          </Box>
          <Card sx={{ width: "6rem", height: "6rem" }}>
            <img src={userValues.src} alt="profile" width="80px" />
          </Card>
        </Card>
        <Divider />
        <Card
          sx={{
            width: "100%",
            display: "inline-flex",
            paddingLeft: "3rem",
            height: "8rem",
            alignItems: "center",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography
              fontFamily="Noto Sans"
              sx={{ fontWeight: "600", color: "#BDBDBD" }}
            >
              Name
            </Typography>
          </Box>
          <Typography variant="h5" fontFamily="Noto Sans">
            {userValues.name}
          </Typography>
        </Card>
        <Divider />
        <Card
          sx={{
            width: "100%",
            display: "inline-flex",
            paddingLeft: "3rem",
            height: "8rem",
            alignItems: "center",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography
              fontFamily="Noto Sans"
              sx={{ fontWeight: "600", color: "#BDBDBD" }}
            >
              Bio
            </Typography>
          </Box>
          <Typography variant="h5" fontFamily="Noto Sans">
            {userValues.bio}
          </Typography>
        </Card>
        <Divider />
        <Card
          sx={{
            width: "100%",
            display: "inline-flex",
            paddingLeft: "3rem",
            height: "8rem",
            alignItems: "center",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography
              fontFamily="Noto Sans"
              sx={{ fontWeight: "600", color: "#BDBDBD" }}
            >
              Phone
            </Typography>
          </Box>
          <Typography variant="h5" fontFamily="Noto Sans">
            {userValues.phone}
          </Typography>
        </Card>
        <Divider />
        <Card
          sx={{
            width: "100%",
            display: "inline-flex",
            paddingLeft: "3rem",
            height: "8rem",
            alignItems: "center",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography
              fontFamily="Noto Sans"
              sx={{ fontWeight: "600", color: "#BDBDBD" }}
            >
              Email
            </Typography>
          </Box>
          <Typography variant="h5" fontFamily="Noto Sans">
            {userValues.email}
          </Typography>
        </Card>
        <Divider />
        <Card
          sx={{
            width: "100%",
            display: "inline-flex",
            paddingLeft: "3rem",
            height: "8rem",
            alignItems: "center",
          }}
        >
          <Box textAlign="left" sx={{ width: "18rem" }}>
            <Typography
              fontFamily="Noto Sans"
              sx={{ fontWeight: "600", color: "#BDBDBD" }}
            >
              Password
            </Typography>
          </Box>
          <Typography variant="h5" fontFamily="Noto Sans">
            **********
          </Typography>
        </Card>
        <Divider />
      </Card>
      <Snackbar
        open={snack.fault}
        autoHideDuration={3000}
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

export default UserInfo;
