// @ts-nocheck
import { Button, Typography, Box, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "@mui/styles";
import { useTranslation } from "react-i18next";

const AuthGuardSkeleton = ({ children, width = "100%", height = "100%" }) => {
  const auth = useAuth();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  if (!auth.isAuthenticated) {
    return (
      <Box
        style={{
          bgcolor: "background.paper",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography
          align="center"
          color="textPrimary"
          variant={mobileDevice ? "h4" : "h2"}
          data-cy="login-required"
        >
          {t("login-required")}
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          sx={{ mt: 0.5 }}
          variant="subtitle2"
          data-cy="login-required-description"
        >
          {t("login-required-description")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <Box
            component="img"
            src={`/static/error/error401_${theme.palette.mode}.svg`}
            sx={{
              height: "auto",
              maxWidth: "100%",
              width: 200,
            }}
            data-cy="error401"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <Button
            color="primary"
            onClick={() => auth.signinRedirect()}
            variant="outlined"
            data-cy="Login"
          >
            {t("Login")}
          </Button>
        </Box>
      </Box>
    );
  }
  return <>{children}</>;
};

AuthGuardSkeleton.propTypes = {
  children: PropTypes.node,
};

export default AuthGuardSkeleton;
