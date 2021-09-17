import React from "react";
import { Card, Box, CardContent,Button } from "@mui/material";
import logo from "../resources/devchallenges.svg";

const signup = () => {
  return (
    <div>
      <Card sx={{ mx: "auto", width: "40%", height: "5rem" }}>
        <CardContent>
          <img src={logo} alt="logo" />
          <Box component="form">
            <Button variant='contained'>Sign up for code </Button>
            <Button>login</Button>
            signup form</Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default signup;
