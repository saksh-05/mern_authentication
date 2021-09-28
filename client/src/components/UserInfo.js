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
import logo from "../resources/devchallenges.svg";
import { useHistory } from "react-router";
import base_url from "../devpro/baseurl";

const UserInfo = (params) => {
  console.log(params);
  const theme = useTheme();
  const history = useHistory();

  const [userValues, setUserValue] = useState({
    src: "",
    name: "",
    bio: "",
    phone: "",
    email: "",
    password: "",
  });

  const [snack, setSnack] = useState({
    fault: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    axios
      .get(`${base_url}userinfo`, {
        params: {
          id: `${params.match.params.id}`,
        },
      })
      .then((res) => {
        const { bio, name, email, phone, src } = res.data.user;
        console.log(bio, name, email,phone);
        const ar = src.split(":");
        console.log(ar[0]);
        setUserValue({
          src: ar[0] !== "https" ? `${base_url}` + userValues.src : src,
          name: name === "undefined" ? "" : name,
          email: email === "undefined" ? "" : res.data.user.email,
          bio: bio === "undefined" ? "" : bio,
          phone:( phone === "undefined" || phone.length < 10 )? "" : phone,
        });
        console.log(userValues);
        console.log(res);
      })
      .catch((err) => console.log(err));

    if (params.location.params !== undefined) {
      setSnack({
        ...snack,
        fault: true,
        message: "Success login",
        severity: "success",
      });
    }
  }, [params.location.params]);

  const handleClose = () => {
    setSnack({ ...snack, fault: false });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  // if(!params.location.params.fault){
  //   setSnack({...snack,fault:})

  // }

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
          <MenuItem onClick={handleCloseMenu}>
            <LogoutIcon sx={{ marginRight: "1rem" }} />
            logout
          </MenuItem>
        </Menu>
      </div>

      <Box>
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
                history.push(`/editUser/${params.match.params.id}`);
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
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserInfo;
