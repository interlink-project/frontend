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
  FormControlLabel,
  FormGroup,
  Checkbox,
  Snackbar,
  Alert,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Chip,
  InputAdornment,
  Divider,
} from "@mui/material";

import { CopyAll, Email } from "@mui/icons-material";

import { LoadingButton } from "@mui/lab";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLanguage, LANGUAGES } from "translations/i18n";
import { recommenderApi, assetsApi } from "__api__";
import { Done, Delete, Close, KeyboardArrowRight } from "@mui/icons-material";
import SelectGovernanceModel from "./SelectGovernanceModel";
import { REACT_APP_COMPLETE_DOMAIN } from "configuration";
import { useDispatch, useSelector } from "react-redux";
import useMounted from "hooks/useMounted";
import UserSearch from "./UserSearch";

export default function AssetsShare({
  open,
  setOpen,
  loading,
  setLoading,
  asset,
}) {
  const { process, isAdministrator, selectedTreeItem } = useSelector(
    (state) => state.process
  );
  const [language, setLanguage] = useState(getLanguage());
  const [assetLink, setAssetLink] = useState("");
  const [subject, setSubject] = useState("");
  const [instructions, setInstructions] = useState("");

  const [openSnakbar, setOpenSnakbar] = React.useState(false);
  const { t } = useTranslation();
  const [listTeams, setListTeams] = useState([]);

  const [checkboxValues, setCheckboxValues] = useState([]);
  const [singleuser, setSingleuser] = useState(null);
  const mounted = useMounted();

  const includedUsers = new Set(
    process.enabled_teams
      .map((team) => team.users.map((user) => user.id))
      .flat()
      .concat(process.administrators_ids)
  );

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      setCheckboxValues([...checkboxValues, value]);
    } else {
      setCheckboxValues(checkboxValues.filter((v) => v !== value));
    }
  };

  useEffect(() => {
    if (process && asset) {
      setAssetLink(
        `${REACT_APP_COMPLETE_DOMAIN}/dashboard/coproductionprocesses/${process.id}/${asset.id}/view`
      );
      setOpenSnakbar(false);
    }
  }, [open]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnakbar(false);
  };

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  const handleClose = () => {
    setSubject("");
    setInstructions("");
    setCheckboxValues([]);
    setOpen(false);
    setLoading(false);
    setSingleuser(null);
  };

  const handleCopyLink = () => {
    //alert("Link Copied"+assetLink);

    copyTextToClipboard(assetLink);
    setOpenSnakbar(true);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleNext = async () => {

    if (singleuser) {
    //Send the email to a single selected user
    
    const dataToSend = {
      asset_id: asset.id,
      link: assetLink,
      asset_name: asset.internalData.name,
      icon: asset.internalData.icon,
      subject: subject,
      instructions: instructions,
      userTo: singleuser.id,
      processId: process.id,
    };
    console.log(dataToSend);

    assetsApi
      .emailAskUserContribution(dataToSend)
      .then((res) => {
        console.log(res);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
    
    
    
    } else {
    //Send an email to a team

    
    const dataToSend = {
      asset_id: asset.id,
      link: assetLink,
      asset_name: asset.internalData.name,
      icon: asset.internalData.icon,
      subject: subject,
      instructions: instructions,
      listTeams: checkboxValues,
      processId: process.id,
    };
    console.log(dataToSend);

    assetsApi
      .emailAskTeamContribution(dataToSend)
      .then((res) => {
        console.log(res);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
    
    
    }


  };

  useEffect(() => {
    const permissions = selectedTreeItem.permissions;
    setListTeams([]);

    let listTeamsTemporal = [];

    for (var i = 0; i < permissions.length; i++) {
      const equipoTemp = permissions[i].team;

      if (listTeamsTemporal.includes(equipoTemp)) {
      } else {
        listTeamsTemporal.push(equipoTemp);
      }
    }

    let listTeamsSet = new Set(listTeamsTemporal);
    setListTeams(Array.from(listTeamsSet));
  }, [asset]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ textAlign: "left", m: 1 }}>
          <Typography color="primary" variant="h5">
            {t("Share or assign options")}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <>
            <Box sx={{ textAlign: "center" }}>
              <label htmlFor="contained-button-file">
                <Input
                  inputProps={{ accept: "image/*" }}
                  id="contained-button-file"
                  type="file"
                  sx={{ display: "none" }}
                  //onChange={handleFileSelected}
                />
              </label>
            </Box>
            <Typography sx={{ mb: 1, fontWeight: "bold" }} variant="body1">
              {"1.- " +
                t(
                  "You may copy the link below and share it with your colleagues"
                ) +
                "."}
            </Typography>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <Input
                id="standard-adornment-password"
                type="text"
                value={assetLink}
                disabled
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleCopyLink}
                      onMouseDown={handleMouseDownPassword}
                    >
                      <CopyAll />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ mb: 1, fontWeight: "bold" }} variant="body1">
              {"2.- " + t("You may send and email") + "."}
            </Typography>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                sx={{ mb: 3 }}
                id="standard-basic"
                label="Subject"
                variant="standard"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <TextField
                id="outlined-multiline-static"
                label="Instructions"
                multiline
                rows={4}
                defaultValue="Default Value"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />

              {checkboxValues.length == 0 ? (
                <>

              {singleuser ? (
                <Typography sx={{ mb: 1,mt:1, fontWeight: "bold" }} variant="body1" >
                  {t("To")+': ' + singleuser.full_name} 
                </Typography>
              ) : (
                <>
                  <Typography
                    sx={{ mt: 1, mb: 1, fontWeight: "bold" }}
                    variant="body1"
                  >
                    {t("2.1 Select a single user") + ":"}
                  </Typography>

                  <UserSearch
                    //error={Boolean(touched.user && errors.user)}
                    alert={false}
                    importCsv={false}
                    include={Array.from(includedUsers)}
                    onClick={(user) => {
                      // setFieldValue("user", user);
                      // setFieldTouched("user");
                      setSingleuser(user);
                    }}
                  />
                </>
              )}
              </>
              ) : (
                <></>
              )}

            {singleuser ? (
                <></>
            ):(
              <>


              <Divider sx={{ my: 2 }} />

              <Typography
                sx={{ mt: 1, mb: 1, fontWeight: "bold" }}
                variant="body1"
              >
                {t("2.2 Select the Teams") + ":"}
              </Typography>

              <FormGroup>
                {listTeams.length === 0 &&
                  t(
                    "No teams assigned to this task. If you want to be able to share this task with your colleagues, please assign a team to it."
                  )}
                {listTeams.length > 0 &&
                  listTeams.map((team) => (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox
                            defaultChecked
                            checked={checkboxValues.includes(team.id)}
                            onChange={handleCheckboxChange}
                            name={team.name}
                            value={team.id}
                          />
                        }
                        label={team.name}
                      />

                      <ul>
                        {team.users.length > 0 &&
                          team.users.map((user) => <li>{user.full_name}</li>)}
                      </ul>
                    </>
                  ))}
              </FormGroup>
              </>
            )}
            </FormControl>
            

            <Snackbar
              open={openSnakbar}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                {t("The link has been copied to the clipboard") + "!"}
              </Alert>
            </Snackbar>
          </>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <LoadingButton
            sx={{ my: 2 }}
            loading={loading}
            size="large"
            onClick={handleNext}
          >
            {t("Send email")}
            <Email sx={{ ml: 2 }} />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
