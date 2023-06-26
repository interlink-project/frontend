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
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateProcess } from "slices/process";
import useMounted from "hooks/useMounted";

import { coproductionProcessesApi } from "__api__";

const MakePublicDialog = ({ open, handleClose, switchEvent }) => {

  const mounted = useMounted();

  const { process } = useSelector(
    (state) => state.process
  );

  const [isPublic, setIsPublic] = useState(
    process.is_public
  );

  useEffect(() => {
    clearFields();
  }, [open]);

  const dispatch = useDispatch()

  // State variables
  const [requirements, setRequirements] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [logotype, setLogotype] = useState(null);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations:
    if (!validateForm()) {
      return;
    }

    // Set the requirements field of coproduction
    // and Make it public

    setIsPublic(!isPublic);
    
    //Hide guide startup checklist
    const values = { is_public: !isPublic, requirements: requirements };
    

    try {
      dispatch(
        updateProcess({
          id: process.id,
          data: values,
          logotype,
          onSuccess: () => {
            if (mounted.current) {
              console.log(process);
            }
          },
        })
      );
    } catch (err) {
      console.error(err);
    }

    switchEvent();
    
    //alert('Message sent successfully!')
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
    setRequirements("");
  };

  // Form validation function
  const validateForm = () => {
    let valid = true;

    // Validations:
    if (requirements === "") {
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
      Specification of personnel requirements
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
            <Grid item xs={12} >
              <InputLabel
                id="add-contribution-label"
                sx={{ m: 1, fontWeight: "bold", whiteSpace: "normal"  }}
              >
                

                {"We're keen to understand the ideal personnel profile for our co-production process. Could you please outline the essential skills, background, and experience you believe are crucial for contributors" + "?"}
               
                
                
              </InputLabel>
              <TextField
                fullWidth
                label="Type your answer here"
                name="Requirements"
                onChange={(e) => {
                  setRequirements(e.target.value);
                  validateForm();
                }}
                value={requirements}
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

export default MakePublicDialog;
