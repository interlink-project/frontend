import {
  Box,
  Container,
  Typography,
  Divider,
  Card,
  CardActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import useAuth from "hooks/useAuth";
import useMounted from "hooks/useMounted";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAssignment, getContributions } from "slices/general";
import { useParams } from "react-router";
import {
  claimsApi,
  coproductionprocessnotificationsApi,
  teamsApi,
} from "__api__";
import {
  getProcess,
  setSelectedTreeItem,
  setSelectedTreeItemById,
} from "slices/process";
import { useNavigate } from "react-router";

const NewAssignationClaim = ({ assignmentId = null }) => {
  const { process, selectedTreeItem } = useSelector((state) => state.process);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();

  const [userRoles, setUserRoles] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const navigate = useNavigate();

  const { assignment } = useSelector((state) => state.general);

  if (assignmentId == null) {
    const { assignmentIdPage } = useParams();
    assignmentId = assignmentIdPage;
  }

  useEffect(() => {
    if (assignmentId) {
      dispatch(getAssignment(assignmentId));
    }
    
  }, []);
  useEffect(() => {
    if(assignment){
      setSelectedAsset(assignment.asset);

      dispatch(setSelectedTreeItemById(assignment.task_id));
      dispatch(
        getProcess(assignment.coproductionprocess_id, false, assignment.task_id)
      );
    }

  }, [assignment]);

  // useEffect(() => {
  //   let listofRoles = [];
  //   setUserRoles([]);
  //   async function getRoles() {
  //     for (let i = 0; i < user.teams_ids.length; i++) {
  //       const listAllowedTeams=selectedTreeItem.teams;
  //       for (let j = 0; j < listAllowedTeams.length; j++) {
  //         if (user.teams_ids[i] === listAllowedTeams[j].id) {
  //           const user_team = await teamsApi.get(user.teams_ids[i]);

  //           if (!listofRoles.includes(user_team.type)){
  //           listofRoles.push(user_team.type);
  //           }
  //         }
  //       }
  //     }
  //     setUserRoles(listofRoles);
  //   }
  //   getRoles();

  // }, [selectedTreeItem]);

  function escape(htmlStr) {
    return htmlStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  return (
    <Card variant="outlined">
      {assignment && (
        <>
          <Helmet>
            <title>{t("User Assignation Action")}</title>
          </Helmet>

          <Box>
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
                <Typography color="primary" variant="h5">
                  {t("Assignment").toUpperCase()}
                </Typography>
              </Box>

              <Typography color="textSecondary" variant="h6" sx={{ m: 1 }}>
                {t(
                  "This are some details about the assignment that you are going to claim."
                )}
              </Typography>

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
              {selectedTreeItem && (
                <>
                  <Typography color="textSecondary" variant="h6" sx={{ m: 1, fontWeight: "bold" }}>
                    {process.name}
               
                  </Typography>
                  <Typography color="textSecondary" variant="h6" sx={{ m: 1, fontWeight: "bold" }}>
               
                    {selectedTreeItem.name}
               
                  </Typography>
                  
                </>
              )}
              </Box>
              <Divider sx={{ mt: 2 }} />

              <Typography
                sx={{ mt: 1, mb: 1, fontWeight: "bold" }}
                variant="body1"
              >
                {"* " + t("Subject") + ":"}
              </Typography>

              <Typography sx={{ mt: 1, mb: 1 }} variant="body1">
                {t(assignment.title)}
              </Typography>
              <Typography
                sx={{ mt: 1, mb: 1, fontWeight: "bold" }}
                variant="body1"
              >
                {"* " + t("Instructions") + ":"}
              </Typography>

              <Typography sx={{ mt: 1, mb: 1 }} variant="body1">
                {t(assignment.description)}
              </Typography>

              <Divider sx={{ mt: 4 }} />

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

                    return alert(
                      t(
                        "The task is closed you can't make a claim. Please contact to the administrator to reopen this task."
                      )
                    );
                  }

                  //Creo el claim:
                  let dataToSendClaim = {};
                  if (assignment == null) {
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
                  } else {
                    dataToSendClaim = {
                      user_id: user.id,
                      asset_id: selectedAsset.id,
                      task_id: selectedTreeItem.id,
                      coproductionprocess_id: process.id,
                      title: escape(values.title),
                      description: escape(values.description),
                      state: false,
                      claim_type: "Development",
                      assignment_id: assignment.id,
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
                          selectedAssetIcon =
                            "/static/graphics/external_link.svg";
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
                          selectedAssetIcon =
                            selectedAsset["internalData"]["icon"];
                        }
                        selectedShowIcon = "";
                        selectedShowLink = "hidden";
                      }

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
                          //getContributions();

                          //Refresh Contribution data
                          //getContributionsData(selectedTreeItem.id);

                          //Register an event in matomo
                          // trackEvent({
                          //   category: process.name,
                          //   action: "claim-contribution",
                          //   name: res.id,
                          //   customDimensions: [
                          //     {
                          //       id: 1,
                          //       value: action_role_value,
                          //     },
                          //   ],
                          // });
                          //Everything when sucessfull:
                          navigate(`/dashboard/assignments/success`);
                          
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
                        Introduce the details of your contribution:
                      </Typography>
                      <TextField
                        required
                        error={Boolean(touched.title && errors.title)}
                        fullWidth
                        helperText={touched.title && errors.title}
                        label="Title"
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
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        fullWidth
                        helperText={touched.description && errors.description}
                        label="Description"
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
                          error={Boolean(
                            touched.action_role && errors.action_role
                          )}
                          helperText={touched.action_role && errors.action_role}
                          variant="outlined"
                        >
                          {userRoles.map((option) => {
                            const optionLabel = option
                              .replace(/_/g, " ")
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
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

                      <CardActions sx={{ justifyContent: "center" }}>
                        <LoadingButton
                          sx={{ mt: 2 }}
                          variant="contained"
                          fullWidth
                          loading={isSubmitting}
                          onClick={handleSubmit}
                        >
                          {t("Claim")}
                        </LoadingButton>
                      </CardActions>
                    </Box>
                  </form>
                )}
              </Formik>
            </Container>
          </Box>
        </>
      )}
    </Card>
  );
};

export default NewAssignationClaim;
