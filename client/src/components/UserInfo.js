import {
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const rows = [1, 2, 3, 4, 5, 6];

const UserInfo = () => {
  return (
    <>
      <Box>
        <Typography variant="h2">Personal Info</Typography>
        <Typography variant="h6">
          Basic info like your name and photo
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ width: "60%" }}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
                <Typography variant='h4'>Profile</Typography>
                <Typography variant='subtitle2'>Some info may be visible to other people</Typography>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {" "}
                <TableCell component="th" scope="row">
                  {row}
                </TableCell>
                <TableCell align="right">{row}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserInfo;
