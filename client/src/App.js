import React from "react";
import { Route, Switch } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EditUser from "./components/Edituser";
import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import UserInfo from "./components/UserInfo";
import Activate from "./components/Activate";
import dlogo from "./resources/devchallenges-light.svg";
import logo from "./resources/devchallenges.svg";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const App = () => {
  const [mode, setMode] = React.useState("light");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <AppBar position="static" sx={{ px: "1rem" ,}}>
          <Toolbar>
            {theme.palette.mode === "light" ? (
              <img src={logo} alt="logo" width="192px" />
            ) : (
              <img src={dlogo} alt="dark logo" width="192px" />
            )}

            <Box
              sx={{
                textAlign: "right",
                height: "2rem",
                flex: "1",
              }}
            >
              <Button
                disableRipple
                disableTouchRipple
                disableFocusRipple
                sx={{
                  border: `1px solid ${
                    theme.palette.mode === "dark" ? "yellow" : "black"
                  }`,
                  color: theme.palette.mode === "dark" ? "yellow" : "black",
                  height: "2rem",
                }}
                onClick={colorMode.toggleColorMode}
              >
                {theme.palette.mode} mode
                <IconButton sx={{ ml: 1 }} color="inherit">
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            bgcolor: "background.default",
            textAlign: "center",
            p: "1rem",
            pb: 3,
          }}
          disableripple
        >
          <Switch>
            {/* <Route path="/signup" component={Signup} /> */}
            <Route path="/login" component={Login}>
              {/* {" "}
            <Breed data={val} /> */}
            </Route>
            <Route path="/userInfo/:id" component={UserInfo}></Route>
            <Route
              path="/activate/:token"
              render={(props) => <Activate {...props} />}
            />
            <Route path="/editUser/:id" component={EditUser} />
            <Route path="/" component={Signup}>
              {/* {" "} */}
              {/* <Homepage data={val} /> */}
            </Route>
          </Switch>
          <Box
            display="inline-flex"
            justifyContent="left"
            alignItems="center"
            color="gray"
            sx={{ m: "auto", width: "40%", textAlign: "left" }}
          >
            <Typography sx={{ flex: "1" }}>Create by Saurabh</Typography>
            <Typography>devChallenges.io</Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
