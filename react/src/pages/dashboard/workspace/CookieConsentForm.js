import CookieConsentContext from "CookieConsentContext";
import { useContext } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Link
} from "@mui/material";
import React from "react";

const CookieConsentForm = () => {
  const { cookieConsent, setCookieConsent } = useContext(CookieConsentContext);

  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConsentChange = (e) => {
    const { name, checked } = e.target;
    setCookieConsent((prevState) => ({ ...prevState, [name]: checked }));
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"User Agreement and Terms of Service"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <Typography variant="body1" paragraph={true} align="justify" gutterBottom>
          <Typography variant="body1"  paragraph={true} align="justify" gutterBottom>
          Welcome to our Collaborative Platform for Co-producing Public Services!
        </Typography>
        <Typography variant="body2"  paragraph={true} align="justify" gutterBottom>
          By using our platform, you agree to abide by the terms and conditions that govern its use. These terms are designed to ensure the platform remains a safe, respectful, and productive environment for all users. Here’s a brief overview:
        </Typography>
        <Typography variant="body2"  paragraph={true} align="justify" gutterBottom>
        <span style={{ fontWeight: 'bold' }}> 1. Respectful Interaction:</span> We expect all users to interact with others respectfully and professionally.
        </Typography>
        <Typography variant="body2"  paragraph={true} align="justify" gutterBottom>
        <span style={{ fontWeight: 'bold' }}>2. Data Protection:</span> We adhere to strict data protection guidelines to ensure your personal information is safe and secure.
        </Typography>
        <Typography variant="body2"  paragraph={true} align="justify" gutterBottom>
        <span style={{ fontWeight: 'bold' }}>3. Intellectual Property:</span> Users must respect the intellectual property rights of others and of the platform.
        </Typography>
        <Typography variant="body2"  paragraph={true} align="justify" gutterBottom>
        <span style={{ fontWeight: 'bold' }}>4. Responsible Use:</span> Users should utilize the platform responsibly and ethically, adhering to all applicable laws and regulations.
        </Typography>
        <Typography variant="body2">
          For a full and detailed understanding of the terms and conditions that govern the use of this platform, please <Link href="/dashboard/privacy" underline="always">click here</Link>.
        </Typography>
        </Typography>
        
            <div>
              <label>
                <input
                  type="checkbox"
                  name="essential"
                  checked={cookieConsent.essential}
                  onChange={handleConsentChange}
                  disabled
                />
                I declare that I agree with the terms of use of the platform
              </label>
            </div>
           
          </DialogContentText>
        </DialogContent>
        <DialogTitle id="alert-dialog-title">
          {"Cookie Policy Agreement"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This website uses cookies to enhance the user experience. Please
            select the configuration of cookies.
            <div>
              <label>
                <input
                  type="checkbox"
                  name="essential"
                  checked={cookieConsent.essential}
                  onChange={handleConsentChange}
                  disabled
                />
                Essential Cookies
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="matomo"
                  checked={cookieConsent.matomo}
                  onChange={handleConsentChange}
                />
                Matomo Analytics (Tracking user activity to collect statistical data)
              </label>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CookieConsentForm;
