import React, { useEffect, useState } from "react";
import {
  Alert,
  TextField,
  Button,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { coproductionProcessesApi } from "__api__";

const ApplytoCoproductionDialog = ({ open, handleClose }) => {
  const { selectedPubliccoproduction } = useSelector((state) => state.general);

  useEffect(() => {
    clearFields();
  }, [open]);

  // State variables
  const [razon, setRazon] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations:
    if (!validateForm()) {
      return;
    }

    //Got all admin emails:
    const adminEmails = selectedPubliccoproduction.administrators.map(
      (admin) => admin.email
    );

    // Sens the email with this information
    const infotoSend = {
      razon: razon,
      processId: selectedPubliccoproduction.id,
      coproductionName: selectedPubliccoproduction.name,
      link: '/dashboard/coproductionprocesses/'+selectedPubliccoproduction.id+'/team',
      adminEmails: adminEmails,
    };
    //alert(JSON.stringify(infotoSend));
    console.log(infotoSend);

    coproductionProcessesApi.emailApplyToBeContributor(infotoSend);
    alert('Message sent successfully!')
    clearFields();
    handleClose();
  };

  // Form cancellation handler
  const handleCancel = (e) => {
    e.preventDefault();

    // Clearing form fields
    clearFields();
    handleClose();
  };

  const clearFields = () => {
    setRazon("");
  };

  // Form validation function
  const validateForm = () => {
    let valid = true;

    // Validations:
    if (razon === "") {
      setIsError(true);
      setErrorMessage(
        "Include a short description of your interest in this co-production process"
      );
      valid = false;
    }
    // Clearing error message and resetting error state
    if (valid) {
      setErrorMessage("");
      setIsError(false);
    }

    return valid;
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ mt: 1,fontWeight: "bold" }}>
        Apply to this co-production process
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InputLabel
                id="add-contribution-label"
                sx={{ m: 1, fontWeight: "bold" }}
              >
                {"Explain why you would like to join this co-production process" + "."}
              </InputLabel>
              <TextField
                fullWidth
                label="Type your answer here"
                name="Razon"
                onChange={(e) => {
                  setRazon(e.target.value);
                  validateForm();
                }}
                value={razon}
                variant="outlined"
                multiline
                rows={4}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        {isError && (
          <Alert variant="outlined" severity="error" sx={{ m: 1 }}>
            {errorMessage}
          </Alert>
        )}
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplytoCoproductionDialog;
