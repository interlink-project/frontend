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
import {
  Done,
  Delete,
  Close,
  KeyboardArrowRight,
  ArrowBack,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import { updateProcess } from "slices/process";
import useMounted from "hooks/useMounted";

export default function SelectGovernanceModel({
  open,
  setOpen,
  loading,
  setLoading,
  categories,
  setOpenPreviousDialog,
}) {
  const [language, setLanguage] = useState(getLanguage());

  const { t } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };
  const dispatch = useDispatch();

  const { process } = useSelector(
    (state) => state.process
  );

  const mounted = useMounted();

  const [logotype] = useState(null);

 
  function handleClick(name) {
    alert(`You have selected the governance model, ${name}`);


    //Save Inter-governmental model
    const values = { intergovernmental_model: name };

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



    handleClose();
  }

  const handlePrevious = async () => {
    setOpen(false);
    setLoading(false);
    setOpenPreviousDialog(true);
  };

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const [listGovernanceModels, setListGovernanceModels] = useState([
    {
      recomended: true,
      code: "C2G",
      title: t("Citizen Sourcing"),
      description: t("Occurs when government design"),
      example: t("The city of Boston provides a Citizen"),
    },
    {
      recomended: true,
      code: "G+G",
      title: t("Public Civil Partnership"),
      description: t("Occurs when government, citizen"),
      example: t("In December 2016 the city of Ghent"),
    },
    {
      recomended: false,
      code: "G2C",
      title: t("Government as a Platform"),
      description: t("Is a specific type of co-delivery"),
      example: t("The UK Government Digital Service adopted"),
    },
    {
      recomended: false,
      code: "C2C",
      title: t("Citizen-to-Citizen"),
      description: t("Is a situation in which citizens self-organize services"),
      example: t("Etsy alloys company owners to create their"),
    },
  ]);

  useEffect(() => {
    let newStateGovernanceModels = [];
    for (let i = 0; i < listGovernanceModels.length; i++) {
      let newModel = listGovernanceModels[i];

      if (categories.includes(listGovernanceModels[i].code)) {
        newModel.recomended = true;
      } else {
        newModel.recomended = false;
      }
      newStateGovernanceModels.push(newModel);
    }
    setListGovernanceModels(newStateGovernanceModels);
  });

  const listGovernanceCards = listGovernanceModels.map((governanceModel) => (
    <Card className="h-50 d-flex flex-column" variant="outlined">
      <CardContent>
        <Grid container spacing={2} xs={12} sx={{ ml: 0 }}>
          {governanceModel.recomended ? (
            <>
              <Grid xs={9}>
                <Typography variant="h6">{governanceModel.title}</Typography>
              </Grid>

              <Grid xs={3}>
                <Typography variant="subtitle2" color="primary">
                  {bull}
                  {t("Recomended")}
                </Typography>
              </Grid>
            </>
          ) : (
            <Grid xs={12}>
              <Typography variant="h6">{governanceModel.title}</Typography>
            </Grid>
          )}
        </Grid>

        <Typography variant="body2">{governanceModel.description}</Typography>
        <Typography variant="subtitle2">{t("For example") + ":"}</Typography>
        <Typography variant="body2">{governanceModel.example}</Typography>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end">
          <Button onClick={() => handleClick(governanceModel.code)} variant="contained" size="small">
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
        <DialogContent dividers>
          <>
            <Box sx={{ minWidth: 275, flexGrow: 1, p: 2 }}>
              <Stack spacing={2}>{listGovernanceCards}</Stack>
            </Box>
          </>
        </DialogContent>

        <DialogActions>
          <IconButton
            onClick={handlePrevious}
            color="primary"
            sx={{ border: "1px", mt: 2 }}
            variant="outlined"
          >
            <ArrowBack />
          </IconButton>
        </DialogActions>
       
      </Dialog>
    </>
  );
}
