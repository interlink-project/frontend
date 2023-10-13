import React, { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    Snackbar
  } from "@mui/material";
  import {
    Close,
    CopyAll,
    Delete,
    RecordVoiceOver,
    Download,
    Edit,
    KeyboardArrowDown,
    OpenInNew,
    Share,
    CoPresent,
  } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import useDependantTranslation from "hooks/useDependantTranslation";
import useAuth from "hooks/useAuth";
import { claimsApi, coproductionprocessnotificationsApi, teamsApi } from "__api__";
import { useDispatch } from "react-redux";

import { getAssetsList_byTask, getInPendingAssignmentsbyCoproIdUserId, setContributionsListLevels } from "slices/general";
import { getContributions } from "slices/general";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { LoadingButton } from "@mui/lab";


export const ClaimDialog = ({
    
  claimDialogOpen,
  setClaimDialogOpen,
  selectedAsset,
  selectedAssignment = null,
  afterRefreshEvent=null

}) => {
    //console.log("selectedAssignment",selectedAssignment);
    const { process, isAdministrator, selectedTreeItem } = useSelector(
        (state) => state.process
    );
    const isTask = selectedTreeItem && selectedTreeItem.type === "task";
    const { t } = useDependantTranslation();
    const { user } = useAuth();
    const [userRoles, setUserRoles] = useState([]);
    const dispatch = useDispatch();
    const { trackEvent } = useMatomo();

    function escape(htmlStr) {
        return htmlStr
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }

      function getContributionsData(selectTreeItemId) {
        
        dispatch(afterRefreshEvent);
        //console.log("contributions", contributions);
      }
    
      function obtenerNroContributions(contributions) {
        let nroContribution = 0;
        if (contributions && contributions) {
          if (contributions.length !== 0) {
            for (var j = 0; j < contributions.length; j++) {
              let asset = contributions[j];
              nroContribution = nroContribution + asset["contributors"].length;
            }
          }
        }
    
        return nroContribution;
      }


      useEffect(() => {
        let listofRoles = [];
        setUserRoles([]);
        async function getRoles() {
          for (let i = 0; i < user.teams_ids.length; i++) {
            const listAllowedTeams=selectedTreeItem.teams;
            for (let j = 0; j < listAllowedTeams.length; j++) {
              if (user.teams_ids[i] === listAllowedTeams[j].id) {
                const user_team = await teamsApi.get(user.teams_ids[i]);
            
                if (!listofRoles.includes(user_team.type)){
                listofRoles.push(user_team.type);
                }
              }
            }
          }
          setUserRoles(listofRoles);
        }
        getRoles();
    
       
      }, [selectedTreeItem]);
    
      
  return (
    <Dialog open={claimDialogOpen} onClose={() => setClaimDialogOpen(false)}>
      <IconButton
        aria-label="close"
        onClick={() => setClaimDialogOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>

      <DialogContent sx={{ p: 2 }}>
        <Formik
          initialValues={{
            title: "",
            description: "",
            action_role: "",
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(3, "Must be at least 3 characters")
              .max(255)
              .required("Required"),
            description: Yup.string()
              .min(3, "Must be at least 3 characters")
              .required("Required"),
          })}
          onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
            //Verify that the task is not closed
            if (selectedTreeItem.status == "finished") {
              setSubmitting(false);
              setClaimDialogOpen(false);
              return alert(
                t(
                  "The task is closed you can't make a claim. Please contact to the administrator to reopen this task."
                )
              );
            }

            //Creo el claim:
            let dataToSendClaim={};
            if(selectedAssignment==null){
              dataToSendClaim = {
                user_id: user.id,
                asset_id: selectedAsset.id,
                task_id: selectedTreeItem.id,
                coproductionprocess_id: process.id,
                title: escape(values.title),
                description: escape(values.description),
                state: false,
                claim_type: "Development",
              };
            }else{
              dataToSendClaim = {
                user_id: user.id,
                asset_id: selectedAsset.id,
                task_id: selectedTreeItem.id,
                coproductionprocess_id: process.id,
                title: escape(values.title),
                description: escape(values.description),
                state: false,
                claim_type: "Development",
                assignment_id: selectedAssignment.id,
              };
            }


            claimsApi
              .create(dataToSendClaim)
              .then((res) => {
                //Create the process notifications:

                setSubmitting(true);

                //Defino el link del asset
                let selectedAssetLink = "";
                let selectedAssetIcon = "";
                let selectedShowIcon = "";
                let selectedShowLink = "";

                if (selectedAsset.type == "externalasset") {
                  //Is external
                  selectedAssetLink = selectedAsset.uri;

                  if (selectedAsset.icon_path) {
                    selectedAssetIcon = selectedAsset.icon_path;
                  } else {
                    selectedAssetIcon = "/static/graphics/external_link.svg";
                  }

                  selectedShowIcon = "";
                  selectedShowLink = "hidden";
                } else {
                  if (selectedAsset.link) {
                    //Is internal
                    selectedAssetLink = selectedAsset.link + "/view";
                  } else {
                    const backend =
                      selectedAsset["software_response"]["backend"];
                    const linkAsset =
                      backend +
                      "/" +
                      selectedAsset["external_asset_id"] +
                      "/view";
                    selectedAssetLink = linkAsset;
                    selectedAssetIcon = selectedAsset["internalData"]["icon"];
                  }
                  selectedShowIcon = "";
                  selectedShowLink = "hidden";
                }

                function escape(htmlStr) {
                  return htmlStr
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
                }
                //console.log(res.data);
                //alert("Claim created successfully"+res.data.id);
                const parametersList = {
                  assetId: selectedAsset.id,
                  assetName: "{assetid:" + selectedAsset.id + "}",
                  assetLink: selectedAssetLink,
                  assetIcon: selectedAssetIcon,
                  commentTitle: escape(values.title),
                  commentDescription: escape(values.description),
                  treeitem_id: selectedTreeItem.id,
                  treeItemName: escape(selectedTreeItem.name),
                  copro_id: process.id,
                  showIcon: selectedShowIcon,
                  showLink: selectedShowLink,
                  claim_id: res.data.id,
                };

                const paramListJson = JSON.stringify(parametersList);
                // console.log(parametersList)
                const dataToSend = {
                  coproductionprocess_id: process.id,
                  notification_event: "add_contribution_asset",
                  asset_id: selectedAsset.id,
                  parameters: paramListJson,
                  claim_type: "Development",
                };

                let action_role_value = "";
                if (userRoles.length == 1) {
                  action_role_value = userRoles[0].type;
                } else if (userRoles.length > 1) {
                  action_role_value = values.action_role;
                }

                //alert(action_role_value)

                coproductionprocessnotificationsApi
                  .createbyEvent(dataToSend)
                  .then((res) => {
                    setStatus({ success: true });
                    setSubmitting(false);
                    // getAssets();
                    getContributions();
                    setClaimDialogOpen(false);
                    //Refresh Contribution data
                    getContributionsData(selectedTreeItem.id);

                    //Register an event in matomo
                    trackEvent({
                      category: process.name,
                      action: "claim-contribution",
                      name: res.id,
                      customDimensions: [
                        {
                          id: 1,
                          value: action_role_value,
                        },
                      ],
                    });
                  })
                  .catch((err) => {
                    setStatus({ success: false });
                    setErrors({ submit: err });
                    console.log(err);
                    setSubmitting(false);
                  });
              })
              .catch((err) => {
                setStatus({ success: false });
                setErrors({ submit: err });
                console.log(err);
                setSubmitting(false);
              });
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            touched,
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" component="h2">
                {t("Introduce the details of your contribution")+":"}
                </Typography>
                <TextField
                  required
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label={t("Title")}
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onClick={() => setFieldTouched("title")}
                  value={values.title}
                  variant="outlined"
                  sx={{ mt: 3 }}
                />
                <TextField
                  required
                  sx={{ mt: 2 }}
                  rows={4}
                  multiline
                  error={Boolean(touched.description && errors.description)}
                  fullWidth
                  helperText={touched.description && errors.description}
                  label={t("Description")}
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onClick={() => setFieldTouched("description")}
                  value={values.description}
                  variant="outlined"
                />

                {userRoles.length > 1 && (
                  <TextField
                    required
                    sx={{ mt: 2 }}
                    select
                    fullWidth
                    label="Action Role"
                    name="action_role"
                    value={values.action_role}
                    onChange={handleChange}
                    error={Boolean(touched.action_role && errors.action_role)}
                    helperText={touched.action_role && errors.action_role}
                    variant="outlined"
                  >
                    {userRoles.map((option) => {
                      const optionLabel = option
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                      return (
                        <MenuItem key={"mi-" + option} value={option}>
                          {t(optionLabel)}
                        </MenuItem>
                      );
                    })}
                    {/* <MenuItem value="Management">{t('Management')}</MenuItem>
                              <MenuItem value="Development">{t('Development')}</MenuItem>
                              <MenuItem value="Exploitation">{t('Exploitation')}</MenuItem> */}
                  </TextField>
                )}
                <LoadingButton
                  sx={{ mt: 2 }}
                  variant="contained"
                  fullWidth
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  {t("Claim")}
                </LoadingButton>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
