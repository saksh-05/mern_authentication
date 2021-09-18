import React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Signup from "./components/signup";
import { Button, Typography } from "@mui/material";

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
        <Box sx={{ bgcolor: "background.default" }}>
          <Box>
          <Button onClick={colorMode.toggleColorMode}>
            {theme.palette.mode} mode
            <IconButton sx={{ ml: 1 }} color="secondary">
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Button>
          </Box>
          <Signup />
          <Box
            display="inline-flex"
            justifyContent="left"
            alignItems="center"
            color="gray"
            sx={{ m: "auto", width: "40%", ml: "23.8rem" }}
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
