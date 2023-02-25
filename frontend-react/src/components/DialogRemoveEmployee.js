import React, { useState } from "react";
import * as R from "ramda";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import { useSalaries } from "hooks/useSalaries";
import { warningNotification } from "notifications";

export default function DialogRemoveEmployee({
  open,
  handleClose,
  updateTotalEmployees,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: null });

  const { removeEmployee } = useSalaries();

  const handleSubmit = async () => {
    setLoading(true);

    const trx = await removeEmployee(form.address, setLoading);

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
        <DialogTitle>Remove Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The employee will be permanently removed after collecting his last
            pay. You should remove the employee after the day he should receive
            his last pay
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
        </DialogContent>
        <DialogActions>
          <Button color="inherit" variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            color="warning"
            variant="contained"
            onClick={handleSubmit}
          >
            Remove Employee
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
