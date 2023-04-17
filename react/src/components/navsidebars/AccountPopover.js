import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  Popover,
  Typography,
} from "@mui/material";
import { Login } from "@mui/icons-material";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

const AccountPopover = () => {
  const anchorRef = useRef(null);
  const auth = useAuth();
  const { user, isAuthenticated } = auth;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  return isAuthenticated ? (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: "center",
          display: "flex",
        }}
        data-cy="account-button"
      >
        <Avatar
          src={user.picture}
          sx={{
            height: 32,
            width: 32,
          }}
          data-cy="account-avatar"
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 },
        }}
        data-cy="account-popover"
      >
        <Box sx={{ p: 2 }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
            data-cy="account-popover-name"
          >
            {user.full_name}
          </Typography>
        </Box>
        <Divider />
        {/* <Box sx={{ mt: 2 }}>
          <MenuItem
            // component={RouterLink}
            // to='/dashboard/social/profile'
          >
            <ListItemIcon>
              <UserIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography
                  color='textPrimary'
                  variant='subtitle2'
                >
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
          <MenuItem
            // component={RouterLink}
            // to='/dashboard/account'
          >
            <ListItemIcon>
              <CogIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography
                  color='textPrimary'
                  variant='subtitle2'
                >
                  Settings
                </Typography>
              )}
            />
          </MenuItem>
              </Box> */}
        <Box sx={{ p: 2 }}>
          <Button
            color="primary"
            fullWidth
            onClick={handleLogout}
            variant="outlined"
            data-cy="logout-button"
          >
            {t("Logout")}
          </Button>
        </Box>
      </Popover>
    </>
  ) : (
    <Box
      component={ButtonBase}
      sx={{
        alignItems: "center",
        display: "flex",
      }}
      onClick={() => auth.signinRedirect()}
      data-cy="login-button"
    >
      <Typography sx={{ mr: 1 }} variant="overline">
        {t("Login")}
      </Typography>
      <Login />
    </Box>
  );
};

export default AccountPopover;
