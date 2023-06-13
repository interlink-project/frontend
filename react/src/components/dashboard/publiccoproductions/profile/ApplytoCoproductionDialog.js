import React, { useEffect, useState } from 'react';
import { Alert, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from 'react-redux';

const ApplytoCoproductionDialog = ({ open, handleClose }) => {
  const { selectedPubliccoproduction } = useSelector((state) => state.general);
  
  useEffect(() => {
    clearFields();
  }, [open]);

  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [more_info, setMore_info] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations:
    if (!validateForm()) {
      return;
    }

    //Got all admin emails:
    const adminEmails = selectedPubliccoproduction.administrators.map((admin) => admin.email);
   
    // Sens the email with this information
    const infotoSend = {
      name: name,
      email: email,
      phone: phone,
      skills: skills,
      more_info: more_info,
      coproductionId: selectedPubliccoproduction.id,
      coproductionName: selectedPubliccoproduction.name,
      adminEmails: adminEmails,
    };
    alert(JSON.stringify(infotoSend));
    console.log(infotoSend);

    
  };

  // Form cancellation handler
  const handleCancel = (e) => {
    e.preventDefault();

    // Clearing form fields
    clearFields();
    handleClose();
  };

  const clearFields = () => {
    setName('');
    setEmail('');
    setEmailConfirm('');
    setPhone('');
    setSkills('');
    setMore_info('');
  };

  // Email validation function
  const isEmailValid = (email) => {
    // Use a regular expression to check the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation function
  const validateForm = () => {
    let valid = true;

    // Validations:
    if (name === '') {
      setIsError(true);
      setErrorMessage('Name is required');
      valid = false;
    }
    if (email === '') {
      setIsError(true);
      setErrorMessage('Email is required');
      valid = false;
    } else if (!isEmailValid(email)) {
      setIsError(true);
      setErrorMessage('Please enter a valid email address');
      valid = false;
    }
    if (emailConfirm === '') {
      setIsError(true);
      setErrorMessage('Email confirmation is required');
      valid = false;
    } else if (email !== emailConfirm) {
      setIsError(true);
      setErrorMessage('Emails do not match');
      valid = false;
    }

    // Clearing error message and resetting error state
    if (valid) {
      setErrorMessage('');
      setIsError(false);
    }

    return valid;
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Apply to this co-production process</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                onChange={(e) => {
                  setName(e.target.value);
                  validateForm();
                }}
                value={name}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateForm();
                }}
                value={email}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirm Email"
                name="emailConfirm"
                onChange={(e) => {
                  setEmailConfirm(e.target.value);
                  validateForm();
                }}
                value={emailConfirm}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                onChange={(e) => {
                  setPhone(e.target.value);
                  validateForm();
                }}
                value={phone}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Please provide details of your skills and experience"
                name="skills"
                onChange={(e) => {
                  setSkills(e.target.value);
                  validateForm();
                }}
                value={skills}
                variant="outlined"
                multiline
                rows={4}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Please feel free to provide any additional information or ask any further questions"
                name="more_info"
                onChange={(e) => {
                  setMore_info(e.target.value);
                  validateForm();
                }}
                value={more_info}
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
