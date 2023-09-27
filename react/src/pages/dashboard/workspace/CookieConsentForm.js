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
  Link,
} from "@mui/material";
import React from "react";
import useAuth from "hooks/useAuth";
import toast from "react-hot-toast";
import { usersApi } from "__api__";

import useMounted from "hooks/useMounted";

const CookieConsentForm = () => {
  const mounted = useMounted();

  const auth = useAuth();
  const { cookieConsent, setCookieConsent } = useContext(CookieConsentContext);

  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDisagree = async () => {

    try {
      await usersApi.refuseTerms();
    } catch (error) {
      console.error(
        "Error agreeing to terms:",
        error.response ? error.response.data : error.message
      );
      alert("There is a mistake submitting the refuse agreement");
    }


    handleLogout();
  };

  const handleAgree = async () => {
    setLoading(true); // Set loading state to true when the function starts
    try {
      await usersApi.agreeTerms();
      handleClose();
    } catch (error) {
      console.error(
        "Error agreeing to terms:",
        error.response ? error.response.data : error.message
      );
      alert("There is a mistake submitting the agreement");
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };
  const handleLogout = async () => {
    
    try {
      handleClose();
      auth.logout();
    } catch (err) {
      console.error(err);
      toast.error("Unable to logout.");
    }
  };

  const handleConsentChange = (e) => {
    const { name, checked } = e.target;
    setCookieConsent((prevState) => ({ ...prevState, [name]: checked }));
  };

  return (
    <div>
      <Dialog
        open={open && user && !user.agreeTermsOfUse}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"User Agreement and Terms of Service"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="body1"
              paragraph={true}
              align="justify"
              gutterBottom
            >
              <Typography
                variant="body1"
                paragraph={true}
                align="justify"
                gutterBottom
              >
                Welcome to our Collaborative Platform for Co-producing Public
                Services! {user.agreeTermsOfUse}
              </Typography>
              <Typography
                variant="body2"
                paragraph={true}
                align="justify"
                gutterBottom
              >
                By using our platform, you agree to abide by the terms and
                conditions that govern its use. These terms are designed to
                ensure the platform remains a safe, respectful, and productive
                environment for all users. Here’s a brief overview:
              </Typography>
              <Typography
                variant="body2"
                paragraph={true}
                align="justify"
                gutterBottom
              >
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  1. Respectful Interaction:
                </span>{" "}
                We expect all users to interact with others respectfully and
                professionally.
              </Typography>
              <Typography
                variant="body2"
                paragraph={true}
                align="justify"
                gutterBottom
              >
                <span style={{ fontWeight: "bold" }}>2. Data Protection:</span>{" "}
                We adhere to strict data protection guidelines to ensure your
                personal information is safe and secure.
              </Typography>
              <Typography
                variant="body2"
                paragraph={true}
                align="justify"
                gutterBottom
              >
                <span style={{ fontWeight: "bold" }}>
                  3. Intellectual Property:
                </span>{" "}
                Users must respect the intellectual property rights of others
                and of the platform.
              </Typography>
              <Typography
                variant="body2"
                paragraph={true}
                align="justify"
                gutterBottom
              >
                <span style={{ fontWeight: "bold" }}>4. Responsible Use:</span>{" "}
                Users should utilize the platform responsibly and ethically,
                adhering to all applicable laws and regulations.
              </Typography>
              <Typography variant="body2">
                For a full and detailed understanding of the terms and
                conditions that govern the use of this platform, please{" "}
                <Link href="/dashboard/privacy" underline="always">
                  click here
                </Link>
                .
              </Typography>
            </Typography>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDisagree}>Disagree</Button>
          <Button onClick={handleAgree} disabled={loading} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CookieConsentForm;
