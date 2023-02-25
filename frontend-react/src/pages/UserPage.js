/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { useWeb3React } from "@web3-react/core";

import { useSalaries } from "hooks/useSalaries";
import { useDAI } from "hooks/useDAI";

import { HeaderUser, TableWithdrawals } from "components";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import Typography from "@mui/material/Typography";

import { warningNotification, successNotification } from "notifications";

const UserPage = () => {
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState(null);
  const [balance, setBalance] = useState(0);
  const [calcs, setCalcs] = useState({
    finalBalanceToWithdraw: 0.0,
    monthsCount: 0,
  });

  const { account } = useWeb3React();

  const { fetchBalanceOf } = useDAI();
  const { fetchEmployeeSalary, fetchCalculateWithdrawal, withdraw } =
    useSalaries();

  const updateBalance = async () => {
    const bal = await fetchBalanceOf(account);
    setBalance(bal);
  };

  const getUserSalary = async () => {
    const sal = await fetchEmployeeSalary(account);
    setSalary(sal);
  };

  const getWithDrawalCalc = async () => {
    const { finalBalanceToWithdraw, monthsCount } =
      await fetchCalculateWithdrawal(account);

    setCalcs({ finalBalanceToWithdraw, monthsCount });
  };

  useEffect(() => {
    getUserSalary();
    updateBalance();
    getWithDrawalCalc();
  }, [account]);

  const handleClick = async () => {
    const trx = await withdraw(setLoading);
    const error = R.pathOr(null, ["err", "error", "message"], trx);

    if (error) {
      warningNotification(error);
    } else {
      successNotification("Accumulated salary successfully withdrawn");
      updateBalance();
      getWithDrawalCalc();
    }
  };

  if (salary == 0.0) {
    return (
      <Alert severity="warning" variant="filled" style={{ fontSize: 25 }}>
        <AlertTitle>Error</AlertTitle>
        You do not appear to be an employee of this company, you are not
        authorized to view.
      </Alert>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        style={{
          color: "white",
          textTransform: "uppercase",
          letterSpacing: 1,
          textAlign: "left",
          marginTop: 0,
          marginBottom: 30,
          fontWeight: "bold",
          fontSize: 25,
        }}
      >
        User dashboard
      </Typography>
      <HeaderUser
        balance={balance}
        salary={salary}
        finalBalanceToWithdraw={calcs.finalBalanceToWithdraw}
        monthsCount={calcs.monthsCount}
      />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <LoadingButton
          loading={loading}
          disabled={calcs.finalBalanceToWithdraw == 0}
          size="large"
          variant="contained"
          color={"info"}
          startIcon={<CallReceivedIcon />}
          onClick={handleClick}
          style={{ marginTop: 15, height: 60 }}
        >
          Withdraw accumulated salary
        </LoadingButton>
      </div>

      <TableWithdrawals account={account} />
    </>
  );
};

export default UserPage;
