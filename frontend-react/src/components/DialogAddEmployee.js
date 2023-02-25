import React, { useState } from "react";
import * as R from "ramda";
import { parseEther } from "@ethersproject/units";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import LoadingButton from "@mui/lab/LoadingButton";

import DAILogo from "svg/DAILogo";

import { useSalaries } from "hooks/useSalaries";

import { warningNotification } from "notifications";

export default function DialogAddEmployee({
  open,
  handleClose,
  updateTotalEmployees,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: null, amount: null });

  const { addNewEmployee } = useSalaries();

  const handleSubmit = async () => {
    setLoading(true);

    const trx = await addNewEmployee(
      form.address,
      parseEther(form.amount.toString()),
      setLoading
    );

    const error = R.pathOr(null, ["err", "error", "message"], trx);

    if (error) {
      warningNotification(error);
    }

    updateTotalEmployees();
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add new Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set a monthly salary to an employee (every 30 days)
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Employee Address"
            value={form.address}
            onChange={(event) =>
              setForm((s) => ({ ...s, address: event.target.value }))
            }
            type="text"
            fullWidth
            variant="standard"
          />

          <FormControl
            fullWidth
            sx={{ m: 1 }}
            variant="standard"
            style={{ marginLeft: 0, marginRight: 0, marginTop: 30 }}
          >
            <InputLabel htmlFor="standard-adornment-amount">
              Monthly Salary
            </InputLabel>
            <Input
              autoFocus
              margin="dense"
              type="number"
              id="standard-adornment-amount"
              value={form.amount}
              onChange={(event) =>
                setForm((s) => ({ ...s, amount: event.target.value }))
              }
              startAdornment={
                <InputAdornment position="start">
                  <DAILogo style={{ width: 23 }} />
                </InputAdornment>
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            Add Employee
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
