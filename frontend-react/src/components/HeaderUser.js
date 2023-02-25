import React from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";

import DAILogo from "svg/DAILogo";

import { formatCurrency } from "utils/generic";

const HeaderUser = ({
  balance,
  salary = 0.0,
  finalBalanceToWithdraw,
  monthsCount,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card style={{ background: "#f5ac37" }}>
          <CardContent>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              Monthly Salary
            </Typography>
            <Typography variant="h4">
              <span style={{ display: "flex" }}>
                <DAILogo style={{ width: 30, marginRight: 5 }} />
                {formatCurrency(salary)}
              </span>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={8}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              Current Balance
            </Typography>
            <Typography variant="h4">
              <span style={{ display: "flex" }}>
                <DAILogo style={{ width: 30, marginRight: 5 }} />
                {formatCurrency(balance)}
              </span>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              Accumulated Salary withdrawable
              <Tooltip
                title="Your paycheck is cumulative, this means you can choose to withdraw a paycheck every month or after several months. If you withdraw less often you will have lower transaction costs."
                arrow
              >
                <HelpIcon style={{ marginLeft: 10 }} />
              </Tooltip>
            </Typography>
            <Typography variant="h4">
              <span style={{ display: "flex" }}>
                <DAILogo style={{ width: 30, marginRight: 5 }} />
                {formatCurrency(finalBalanceToWithdraw)}
              </span>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              Accumulated Months
            </Typography>
            <Typography variant="h4">{monthsCount}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HeaderUser;
