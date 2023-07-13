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
import { useSelector } from "react-redux";

import { coproductionProcessesApi } from "__api__";
import { useTranslation } from "react-i18next";
import { inArray } from "jquery";

const LinkDialog = ({ open, handleClose, title, sub_text, imp_text, submitText="Submit" }) => {
  const { t } = useTranslation();
  const { selectedPubliccoproduction } = useSelector((state) => state.general);
 console.log(imp_text)
  useEffect(() => {
    clearFields();
  }, [open]);

  // State variables

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations:
    if (!validateForm()) {
      return;
    }

    

    //Todo Submit Event
    
    if ("clipboard" in navigator) {

      const copied=await navigator.clipboard.writeText(imp_text);
      //alert('Message sent successfully!')
      clearFields();
      handleClose();
      return copied
      
    } else {
      const copied=document.execCommand("copy", true, imp_text);
      //alert('Message sent successfully!')
      clearFields();
      handleClose();
      return copied
    }
    
  };

  // Form cancellation handler
  const handleCancel = (e) => {
    e.preventDefault();

    // Clearing form fields
    clearFields();
    handleClose();
  };

  const clearFields = () => {
    //setValue("");
  };

  // Form validation function
  const validateForm = () => {
    let valid = true;

    // Validations:
    if (imp_text === "") {
      setIsError(true);
      setErrorMessage(
        t("Include a short description of your interest in this co-production process")
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
        {t(title)}
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
                

                {t(sub_text) + "."}
               
                
              </InputLabel>
              <TextField
                fullWidth
                label="Type your answer here"
                name="Value"
                // onChange={(e) => {
                //   setValue(e.target.value);
                //   validateForm();
                // }}
                value={imp_text}
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
        <Button onClick={handleCancel}>{t("Cancel")}</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
        {t(submitText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkDialog;
