import {
  Box,
  Container,
  Typography,
  Card,
  CardActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const SucessfullClaimRegistration = () => {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate("/dashboard");
  };

  return (
    <Card variant="outlined">
      <Container>
        <Box
          sx={{
            justifyContent: "center",
            display: "flex",
            mb: 2,
            mt: 2,
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography color="textSecondary" variant="h6" sx={{ m: 1 }}>
            Your claim has been registered successfully. You will be notified
            when the claim is accepted or rejected.
          </Typography>
          
        </Box>
      </Container>

      <CardActions sx={{ justifyContent: "center" }}>
        <LoadingButton
          sx={{ mt: 2 }}
          variant="contained"
          fullWidth
          onClick={handleSubmit}
        >
          {t("Go to Dashboard")}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default SucessfullClaimRegistration;
