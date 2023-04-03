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
      title: "Citizen Sourcing (C2G)",
      description: `Occurs when government design and delivers a service, but asks
     citizens for the voluntary commitment of resources to improve the
     service itself, such as their personal data.`,
      example: `The city of Boston provides a Citizen Connect iPhone App
     that allows constituents to report various services
     requests, including for removing greffiti, filling
     potholes, adn fixing traffic lights.`,
    },
    {
      recomended: false,
      title: "Public Civil Partnership (G+G)",
      description: `Occurs when government design and delivers a service, but asks
       citizens for the voluntary commitment of resources to improve the
       service itself, such as their personal data.`,
      example: `The city of Boston provides a Citizen Connect iPhone App
       that allows constituents to report various services
       requests, including for removing greffiti, filling
       potholes, adn fixing traffic lights.`,
    },
    {
      recomended: false,
      title: "Government as a Platform (G2C)",
      description: `Occurs when government design and delivers a service, but asks
       citizens for the voluntary commitment of resources to improve the
       service itself, such as their personal data.`,
      example: `The city of Boston provides a Citizen Connect iPhone App
       that allows constituents to report various services
       requests, including for removing greffiti, filling
       potholes, adn fixing traffic lights.`,
    },
    {
      recomended: false,
      title: "Citizen-to-Citizen (C2C)",
      description: `Occurs when government design and delivers a service, but asks
       citizens for the voluntary commitment of resources to improve the
       service itself, such as their personal data.`,
      example: `The city of Boston provides a Citizen Connect iPhone App
       that allows constituents to report various services
       requests, including for removing greffiti, filling
       potholes, adn fixing traffic lights.`,
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
            <Typography variant="h6" color="primary">{bull}Recomended</Typography>
          </Grid>
          </>
        ):(
            <Grid xs={12}>
            <Typography variant="h6">{governanceModel.title}</Typography>
          </Grid>
        )}
          
        </Grid>

        <Typography variant="body2">{governanceModel.description}</Typography>
        <Typography variant="subtitle2">Example</Typography>
        <Typography variant="body2">{governanceModel.example}</Typography>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end">
          <Button onClick={handleClick} variant="contained" size="small">
            Select
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
