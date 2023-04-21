import React from "react";
import {
  Avatar,
  Box,
  Grid,
  Item,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardContent,
  Button,
  CardActions,
  Card,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLanguage, LANGUAGES } from "translations/i18n";
import { Done, Delete, Close, KeyboardArrowRight } from "@mui/icons-material";

export default function SelectGovernanceModel({
  open,
  setOpen,
  loading,
  setLoading,
}) {
  const [language, setLanguage] = useState(getLanguage());

  const { t } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleClick = (keyword) => {
    alert("You have selected the governance model!!");
  };

  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

  const [listGovernanceModels, setListGovernanceModels] = useState([
    {
      recomended: true,
      title: t("Citizen Sourcing"),
      description: t("Occurs when government design"),
      example: t("The city of Boston provides a Citizen"),
    },
    {
      recomended: true,
      title: t("Public Civil Partnership"),
      description: t("Occurs when government, citizen"),
      example: t("In December 2016 the city of Ghent"),
    },
    {
      recomended: false,
      title: t("Government as a Platform"),
      description: t("Is a specific type of co-delivery"),
      example: t("The UK Government Digital Service adopted"),
    },
    {
      recomended: false,
      title: t("Citizen-to-Citizen"),
      description: t("Is a situation in which citizens self-organize services"),
      example: t("Etsy alloys company owners to create their"),
    },
  ]);

  const listGovernanceCards = listGovernanceModels.map((governanceModel) => (
    <Card className="h-50 d-flex flex-column" variant="outlined">
      <CardContent>
        <Grid container spacing={2} xs={12} sx={{ml:0}}>
        {governanceModel.recomended?(
            <>
            <Grid xs={9}>
            <Typography variant="h6">{governanceModel.title}</Typography>
          </Grid>
          
          <Grid xs={3}>
          <Typography variant="subtitle2" color="primary">{bull}{t("Recomended")}</Typography>
          </Grid>  
          
          </>
        ):(
            <Grid xs={12}>
            <Typography variant="h6">{governanceModel.title}</Typography>
          </Grid>
        )}
          
        </Grid>

        <Typography variant="body2">{governanceModel.description}</Typography>
        <Typography variant="subtitle2">{t("For example")+':'}</Typography>
        <Typography variant="body2">{governanceModel.example}</Typography>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end">
          <Button onClick={handleClick} variant="contained" size="small">
          {t("Select")}
          </Button>
        </Grid>
      </CardActions>
    </Card>
  ));

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ textAlign: "center", m: 2 }}>
          {t("Select your type of co-production process")}
        </DialogTitle>
        <DialogContent>
          <>
            <Box sx={{ minWidth: 275, flexGrow: 1, p: 2 }}>
              <Stack spacing={2}>{listGovernanceCards}</Stack>
            </Box>
          </>
        </DialogContent>
        {/* <DialogActions sx={{ justifyContent: "center" }}>
          <LoadingButton
            sx={{ my: 2 }}
            loading={loading}
            size="small"
            onClick={handleNext}
          >
            {t("Next")}
            <KeyboardArrowRight />
          </LoadingButton>
        </DialogActions>*/}
      </Dialog>
    </>
  );
}
