/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useSalaries } from "hooks/useSalaries";

import DAILogo from "svg/DAILogo";

const TableWithdrawals = ({ account }) => {
  const [events, setEvents] = useState([]);
  const { fetchUserSalaryWithdrawalHistory } = useSalaries();

  const fetchData = async () => {
    const events = await fetchUserSalaryWithdrawalHistory(account);
    setEvents(events);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        style={{
          color: "white",
          textTransform: "uppercase",
          letterSpacing: 1,
          textAlign: "left",
          marginTop: 50,
          marginBottom: 20,
          display: "block",
          fontWeight: "bold",
          fontSize: 25,
        }}
        component="span"
      >
        Latest withdrawals
      </Typography>
      <TableContainer component={Paper} style={{ marginBottom: 100 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">WITHDRAWAL DATE</StyledTableCell>
              <StyledTableCell align="left">OF MONTHS</StyledTableCell>
              <StyledTableCell align="right">TOTAL WITHDRAWN</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((row) => (
              <StyledTableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align="left">{row.date}</StyledTableCell>
                <StyledTableCell align="left">{row.months}</StyledTableCell>
                <StyledTableCell align="right">
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    <DAILogo style={{ width: 25, marginRight: 5 }} />
                    {row.amount}
                  </span>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#2c2c2c",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "theme.palette.common.black",
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

export default TableWithdrawals;
