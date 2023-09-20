import { useState, useEffect } from "react";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import ContributionsTable from "components/dashboard/tree/ContributionsTable";
import {
  gamesApi,
  usersApi,
  coproductionprocessnotificationsApi,
  tasksApi,
  teamsApi,
} from "__api__";
import {
  Alert,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Snackbar,
  Grid,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import ConfirmationButton from "components/ConfirmationButton";
import { LoadingButton } from "@mui/lab";
import UserSearch from "../coproductionprocesses/UserSearch";
import {
  Save,
  Close,
  ViewList,
  Download,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import ContributionCard from "./ContributionCard";
import Papa from "papaparse";
import { ExportToCsv } from "export-to-csv";
import { getContributions, setContributionsListLevels } from "slices/general";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { is } from "date-fns/locale";
import { claimsApi } from "__api__/coproduction/claimsApi";

const ContributionsTabs = () => {

  const { trackEvent } = useMatomo();
  const { contributions, contributionslistlevels } = useSelector(
    (state) => state.general
  );
  const dispatch = useDispatch();

  // Data for new contributions
  const [rows, setRows] = useState([]);
  const [contributor, setContributor] = useState(null);
  const [closedTask, setClosedTask] = useState(false);
  const [listTeams, setListTeams] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [alertNoComplexity, setAlertNoComplexity] = useState(false);

  const [claimDialogOpen, setClaimDialogOpen] = useState(false);

  const { assetsList } = useSelector((state) => state.general);
  const { process, selectedTreeItem } = useSelector((state) => state.process);
  const t = useCustomTranslation(process.language);
  const includedUsers = new Set(
    process.enabled_teams
      .map((team) => team.users.map((user) => user.id))
      .flat()
      .concat(process.administrators_ids)
  );

  const [checkboxValues, setCheckboxValues] = useState([]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      setCheckboxValues([...checkboxValues, value]);
    } else {
      setCheckboxValues(checkboxValues.filter((v) => v !== value));
    }
  };

  function escape(htmlStr) {
    return htmlStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  //Function to create a claim from a list
  const createClaims_by_users =(
    values,
    user_ids
    )=>{

    const claimData = {
      users_id: user_ids,
      asset_id: values.asset.id,
      task_id: selectedTreeItem.id,
      coproductionprocess_id: process.id,
      title: values.title,
      description: values.description,
      state: false,
      claim_type: "Development",
    };

      claimsApi
      .createClaimsForUsers(claimData)
      .then((res) => {
        const responseData = JSON.parse(res.data);
        console.log(responseData);

        if (responseData["excluded"].length > 0) {
          alert(
            t("We couldn't include") +
              ": [" +
              responseData["excluded"] +
              "] " +
              t(
                "users because are not part of a team with permissions over this task. Please check the list of users and try again"
              )
          );
        }

      })
  }

  //Function to create a claims from a team
  const createClaims_by_teams =(
    values,
    team_ids
    )=>{

      const claimData = {
        teams_id: team_ids,
        asset_id: values.asset.id,
        task_id: selectedTreeItem.id,
        coproductionprocess_id: process.id,
        title: values.title,
        description: values.description,
        state: false,
        claim_type: "Development",
      };
  
        claimsApi
        .createClaimsForTeams(claimData)
        .then((res) => {
          const responseData = JSON.parse(res.data);
          console.log(responseData);
  
          if (responseData["excluded"].length > 0) {
            alert(
              t("We couldn't include") +
                ": [" +
                responseData["excluded"] +
                "] " +
                t(
                  "users because are not part of a team with permissions over this task. Please check the list of users and try again"
                )
            );
          }
  
        })
  
  }



  const createNotificationsProcess = (
    values,
    user,
    isListUsers = false,
    isTeams = false,
    setErrors,
    setStatus,
    setSubmitting
  ) => {


    const selectedAsset = values.asset;
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
        selectedShowIcon = "";
        selectedShowLink = "hidden";
      } else {
        const backend = selectedAsset["software_response"]["backend"];
        const linkAsset =
          backend + "/" + selectedAsset["external_asset_id"] + "/view";
        selectedAssetLink = linkAsset;
      }
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

    let dataToSend = {};
    let listUsuarios=[];
    if (!isListUsers) {
      //Solamente guardo info de 1 usuario
      listUsuarios=[user.id];
      dataToSend = {
        coproductionprocess_id: process.id,
        notification_event: "add_contribution_asset",
        asset_id: selectedAsset.id,
        parameters: paramListJson,
        claim_type: "Development",
        user_id: user.id,
        isTeam: isTeams,
      };
    } else {
      //En el caso que sea una lista de usuarios:
      listUsuarios = user.join(",");
      
      dataToSend = {
        coproductionprocess_id: process.id,
        notification_event: "add_contribution_asset",
        asset_id: selectedAsset.id,
        parameters: paramListJson,
        claim_type: "Development",
        user_id: listUsuarios,
        isTeam: isTeams,
      };
    }

    coproductionprocessnotificationsApi
      .createbyEvent(dataToSend)
      .then((res) => {
        const responseData = JSON.parse(res.data);
        console.log(responseData);

        if (responseData["excluded"].length > 0) {
          alert(
            t("We couldn't include") +
              ": [" +
              responseData["excluded"] +
              "] " +
              t(
                "users because are not part of a team with permissions over this task. Please check the list of users and try again"
              )
          );
        }

        setStatus({ success: true });
        setSubmitting(false);
        // getAssets();
        handleCloseDialog();

        //Register an event in matomo
        async function getRoles(user_id, isTeamsSelected = false) {
          if (isTeamsSelected) {
           
            const team_temp = await teamsApi.get(user_id);
            const listOfUsers = team_temp.user_ids;
            for (user of listOfUsers) {
              getRoles(user_id,false);
            }
          } else {

            const user_temp = await usersApi.get(user_id);
            let listofRoles = [];
    
            for (let i = 0; i < user_temp.teams_ids.length; i++) {
              const listAllowedTeams=selectedTreeItem.teams;
              for (let j = 0; j < listAllowedTeams.length; j++) {
                if (user_temp.teams_ids[i] === listAllowedTeams[j].id) {
                  const user_team = await teamsApi.get(user_temp.teams_ids[i]);
                  if (!listofRoles.includes(user_team.type)){
                    listofRoles.push(user_team.type);
                  }
                }
              }
            }

            let action_role_value = "";
            if (listofRoles.length > 0) {
              action_role_value = listofRoles[0].type;

              //Register an event in matomo
              trackEvent({
                category: process.name,
                action: "claim-contribution",
                name: selectedAsset.id,
                customDimensions: [
                  {
                    id: 1,
                    value: action_role_value,
                  },
                ],
              });
            }

           
          }
        }

        for (const user_id of listUsuarios) {
          getRoles(user_id,isTeams);
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus({ success: false });
        setErrors({ submit: err });
        setSubmitting(false);
      });
  };

  //Obtain the contributions data
  // TODO: use this method as the default one to get the contributions
  const getContributionsData = () => {
    dispatch(getContributions(selectedTreeItem.id));
  };

  const parseFile = (evt) => {
    let exclude = [];
    if (!(evt.target && evt.target.files && evt.target.files[0])) {
      return;
    }
    let options = {
      fieldSeparator: ",",
      decimalSeparator: ".",
      showLabels: false,
      filename: "Rejected mails",
      useTextFile: false,
      useBom: true,
      headers: ["mails"],
    };

    let csvExporter = new ExportToCsv(options);
    let rejected_users = [];
    Papa.parse(evt.target.files[0], {
      header: false,
      skipEmptyLines: true,
      complete: function (results) {
        let new_users = [];
        for (let u of results.data) {
          const email = u.toString().replace(",", "");
          //alert(email);
          new_users.push(email);
        }
        setListUsers(new_users);
        //alert(new_users.length + " users added");

        if (rejected_users.length > 0) {
          setMailErrors(true);
          console.log(rejected_users);
          csvExporter.generateCsv(rejected_users);
        }
      },
    });
  };

  useEffect(() => {
    if (claimDialogOpen) {
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
    }
  }, [claimDialogOpen]);

  const CONTRIBUTION_LEVELS = {
    Low: 1,
    Average: 2,
    High: 3,
  };

  // Map contributions to a value. TODO: make this configurable
  const mapContributions = (total_contribs, user_contribs) => {
    const percentage = user_contribs / total_contribs;
    if (percentage < 0.15) {
      return "Low";
    }
    if (percentage < 0.6) {
      return "Average";
    }
    return "High";
  };

  const handleCloseDialog = () => {
    setClaimDialogOpen(false);
    setContributor("");
  };

  const handleAddRow = () => {
    setClaimDialogOpen(true);
    setCheckboxValues([]);
    setListUsers([]);
  };

  const handleCloseTask = async () => {
    console.log("Closing task", rows);
    for (let row of rows) {
      await gamesApi.addClaim(
        process.id,
        selectedTreeItem.id,
        row.id,
        row.name,
        CONTRIBUTION_LEVELS[row.contribution]
      );
    }
    console.log("Claims done")

    //Save user data and contribution in data object
    const data = {};
    for (let row of rows) {
      const user = await usersApi.get(row.id);
      data[row.id] = {
        name: user.full_name,
        email: user.email
      };
    }
    console.log("Data", data);
    
    gamesApi.completeTask(process.id, selectedTreeItem.id, data).then((res) => {
      console.log(res);
      setClosedTask(true);
    });

    tasksApi.update(selectedTreeItem.id, { status: "finished" }).then((res) => {
      console.log(res);
    });

    //Remove temporal list of contributions levels
    dispatch(setContributionsListLevels([]));
  };

  useEffect(() => {
    let isSubscribed = true;
    //console.log("contributions", contributions);
    //alert("Recarga el listado de contribuciones");
    if (isSubscribed) {
    setRows([]);
    }

    // declare the data fetching function
    const fetchData = async () => {
      let task = await gamesApi.getTask(process.id, selectedTreeItem.id);
      
      if (typeof task !== "undefined" && task.completed) {
   
        setClosedTask(task.completed);
        console.log("tasks dentro de closed task", task);
        let r = [];
        for (let player of task.players) {
          r.push({
            id: player.id,
            name: player.name,
            contribution: Object.keys(CONTRIBUTION_LEVELS).find(
              (key) => CONTRIBUTION_LEVELS[key] === player.development
            ),
            contrib_value: player.development,
          });
        }
        if (isSubscribed) {
        setRows(r);
        }
      } else {
        if (contributions.length === 0) {
          console.log("NO CONTRIBUTIONS");
          setClosedTask(task.completed);
          return;
        }
        let total_contribs = 0;
        let contribs = {};
        for (let i = 0; i < contributions.length; i++) {
          for (let j = 0; j < contributions[i].contributors.length; j++) {
            if (!contribs[contributions[i].contributors[j].user_id]) {
              contribs[contributions[i].contributors[j].user_id] = 1;
            } else {
              contribs[contributions[i].contributors[j].user_id] += 1;
            }
            total_contribs += 1;
          }
        }
  
       
        let tempListRows=[];
        for (let id in contribs) {

          const userTemp=await usersApi.get(id);

          tempListRows.push({
            id: id,
              name: userTemp.full_name+' ('+contribs[id]+')',
              contribution: mapContributions(total_contribs, contribs[id]),
              contrib_value: contribs[id],});

        }

        if (isSubscribed) {
        setRows(tempListRows);
        }
        setClosedTask(task.completed);
      }
    }

    // call the function
    fetchData()
    // make sure to catch any error
    .catch(console.error);

    // cancel any future `setData`
    return () => isSubscribed = false;

  }, [contributions]);

  useEffect(() => {
    console.log("selectedTreeItem", selectedTreeItem)
    if (selectedTreeItem.development === 0) {
      setAlertNoComplexity(true);
    } else {
      setAlertNoComplexity(false);
    }
  }, [selectedTreeItem]);

  return (
    <>
      {!closedTask ? (
        <>
          {/* Header */}
          <Grid container sx={{ p: 2 }}>
            <Grid item xs={6}>
              <Typography variant="h3" sx={{}}>
                {t("Contributions")}
              </Typography>
            </Grid>

            {process.game_id ? (
              <Grid item xs={6} sx={{ position: "relative" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddRow}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                  }}
                >
                  {t("Add contributor")}
                </Button>
              </Grid>
            ) : null}
          </Grid>
          {/* Table */}
          <ContributionsTable rows={rows} closedTask={closedTask} />
          {/* Button for closing the task and giving the points */}
          {process.game_id ? (
            <Box sx={{ p: 2, float: "right" }}>
              <ConfirmationButton
                Actionator={({ onClick }) => (
                  <Button
                    variant="contained"
                    // disabled={!isAdministrator}
                    color="warning"
                    onClick={onClick}
                    startIcon={<Save />}
                  >
                    {t("Award points")}
                  </Button>
                )}
                ButtonComponent={({ onClick }) => (
                  <Button
                    sx={{ mt: 1 }}
                    fullWidth
                    variant="contained"
                    color="warning"
                    onClick={onClick}
                  >
                    {t("Confirm closing the task")}
                  </Button>
                )}
                onClick={handleCloseTask}
                text={t("Check the complexity of the task before closing it.")}
              />
            </Box>
          ) : null}

          <Dialog open={claimDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle sx={{ textAlign: "left", m: 1 }}>
              <Typography variant="h5" component="h4">
                {t("Create Contributions for Users")}
              </Typography>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => handleCloseDialog()}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>

            <DialogContent sx={{ p: 2 }} dividers>
              <Formik
                initialValues={{
                  user: "",
                  teams: "",
                  file: "",
                  asset: "",
                  title: "",
                  description: "",
                }}
                validationSchema={Yup.object().shape({
                  title: Yup.string()
                    .min(3, t("Must be at least 3 characters"))
                    .max(255)
                    .required(t("Required")),
                  description: Yup.string()
                    .min(3, t("Must be at least 3 characters"))
                    .required(t("Required")),

                  asset: Yup.object().required("Required"),
                })}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  //alert("Lets send the contribution to the server!!");

                  const userSelected = values.user != "";
                  const fileSelected = listUsers.length > 0;
                  const teamsSelected = checkboxValues.length > 0;

                  setSubmitting(true);

                  if (userSelected || fileSelected || teamsSelected) {
                    if (userSelected) {
                      //alert("You have selected a user:" + values.user.id);

                      // Create a Claim for the user:
                      createClaims_by_users(values, [values.user.id]);

                      // Create a Notification per user:
                      createNotificationsProcess(
                        values,
                        values.user,
                        false,
                        false,
                        setErrors,
                        setStatus,
                        setSubmitting
                      );
                    }
                    if (fileSelected) {
                      //("You have selected a file:" + listUsers.length);
                      let listUsersIds = [];
                      for (let i = 0; i < listUsers.length; i++) {
                        //Obtain a user from its email:
                        const usuario = await usersApi.search(listUsers[i]);
                        if (usuario[0] === undefined) {
                          alert(
                            t("The user") +
                            " " +
                            listUsers[i] +
                            " " +
                            t(
                              "haven't registered yet in the platform. Please, ask him to register and try again"
                            ) +
                            "."
                          );
                          return false;
                        } else {
                          listUsersIds = [...listUsersIds, usuario[0].id];
                        }
                      }
                      //alert("You have selected a file:" + listUsersIds)

                      // Create a claims for the users:
                      createClaims_by_users(values, listUsersIds);
                      
                      // Create a Notification per user:
                      createNotificationsProcess(
                        values,
                        listUsersIds,
                        true,
                        false,
                        setErrors,
                        setStatus,
                        setSubmitting
                      );
                      //Refresh the list of contributions
                      getContributionsData();
                    }
                    if (teamsSelected) {

                      // Create a claims for a list of teams:
                      createClaims_by_teams(values, checkboxValues);

                      //alert("You have selected a team:" + checkboxValues);
                      createNotificationsProcess(
                        values,
                        checkboxValues,
                        true,
                        true,
                        setErrors,
                        setStatus,
                        setSubmitting
                      );
                      //Refresh the list of contributions
                    }
                    getContributionsData();
                  } else {
                    setStatus({ success: false });
                    setErrors({ submit: err });
                    setSubmitting(false);
                    alert(t("You must select one of the contribution option."));
                  }
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
                    <Box sx={{ mt: 0 }}>
                      {!contributor &&
                        listUsers.length == 0 &&
                        checkboxValues.length == 0 ? (
                        //Show all Options
                        <Box sx={{ mt: 0 }}>
                          <Typography
                            variant="h6"
                            component="h5"
                            sx={{ mt: 2 }}
                          >
                            {t("Select one of the following options") + ":"}
                          </Typography>
                          <Box sx={{ ml: 1 }}>
                            <InputLabel
                              id="resource-select-label"
                              sx={{ mt: 2, mb: -1, fontWeight: "bold" }}
                            >
                              {"1.- " +
                                t("Add contribution of a single user" + ".")}
                            </InputLabel>
                            <UserSearch
                              error={Boolean(touched.user && errors.user)}
                              alert={false}
                              importCsv={false}
                              include={Array.from(includedUsers)}
                              onClick={(user) => {
                                setFieldValue("user", user);
                                setFieldTouched("user");
                                setContributor(user);
                              }}
                            />

                            <InputLabel
                              id="resource-select-label"
                              sx={{ mt: 2, mb: -1, fontWeight: "bold" }}
                            >
                              {"2.- " +
                                t("Add contribution of one or multiple teams") +
                                "."}
                            </InputLabel>
                            <FormGroup sx={{ mt: 1 }}>
                              {listTeams.length == 0 && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {t("There are no teams assigned to this task")}
                                </Typography>
                              )}

                              {listTeams.length > 0 &&
                                listTeams.map((team) => (
                                  <>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          defaultChecked
                                          checked={checkboxValues.includes(
                                            team.id
                                          )}
                                          onChange={handleCheckboxChange}
                                          name={team.name}
                                          value={team.id}
                                        />
                                      }
                                      label={team.name}
                                    />

                                    <ul>
                                      {team.users.length > 0 &&
                                        team.users.map((user) => (
                                          <li>{user.full_name}</li>
                                        ))}
                                    </ul>
                                  </>
                                ))}
                            </FormGroup>
                            <InputLabel
                              id="resource-select-label"
                              sx={{ mt: 2, mb: -1, fontWeight: "bold" }}
                            >
                              {"3.- " +
                                t(
                                  "Add contribution from multiple users included in a file" +
                                  "."
                                )}
                            </InputLabel>
                            <Stack direction="row" sx={{ mt: 2 }} spacing={0}>
                              <LoadingButton
                                variant="contained"
                                //   disabled={!isAdministrator}
                                loading={false}
                                //color="warning"
                                component="label"
                                startIcon={<ViewList />}
                                sx={{
                                  mb: 3,
                                  justifyContent: "right",
                                  textAlign: "center",
                                }}
                              >
                                {t("Load users from csv file")}
                                <input
                                  type="file"
                                  accept=".csv"
                                  hidden
                                  onChange={parseFile}
                                />
                              </LoadingButton>
                              <Grid container spacing={3}>
                                <Typography variant="p" sx={{ mt: 3, ml: 4 }}>
                                  {t("An example of this file") + ":"}
                                  <Link
                                    to="/static/story/ExampleFileCSV.csv"
                                    target="_blank"
                                    download
                                  >
                                    <Download sx={{ ml: 1 }} />{" "}
                                  </Link>
                                </Typography>
                              </Grid>
                            </Stack>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                        </Box>
                      ) : (
                        <>
                          {contributor ? (
                            //Muestro Opciones de unico contribuidor
                            <>
                              <Typography
                                variant="h6"
                                component="h5"
                                sx={{ mt: 2 }}
                              >
                                {t("Single user selected")}
                              </Typography>
                              <Grid container>
                                <Grid item xs={10}>
                                  <TextField
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    id="outlined-disabled"
                                    label="User"
                                    value={values.user.full_name}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <IconButton
                                    aria-label="close"
                                    sx={{
                                      verticalAlign: "center",
                                    }}
                                    onClick={() => {
                                      setContributor(null);
                                      setFieldValue("user", "");
                                    }}
                                  >
                                    <Close />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </>
                          ) : (
                            <>
                              {listUsers.length > 0 ? (
                                //Muestro Opciones de Archivo CSV
                                <>
                                  <Typography
                                    variant="h6"
                                    component="h5"
                                    sx={{ mt: 2 }}
                                  >
                                    {t("CSV option selected")}
                                  </Typography>
                                  <Grid container>
                                    <Grid item xs={10}>
                                      <TextField
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        id="outlined-disabled"
                                        label="Archivo CSV"
                                        value={listUsers.length + " users"}
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={2}>
                                      <IconButton
                                        aria-label="close"
                                        sx={{
                                          verticalAlign: "center",
                                        }}
                                        onClick={() => {
                                          setContributor(null);
                                          setCheckboxValues([]);
                                          setListUsers([]);
                                          setFieldValue("user", "");
                                        }}
                                      >
                                        <Close />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </>
                              ) : (
                                <>
                                  {listTeams.length > 0 && (
                                    //Muestro Opciones de Teams
                                    <>
                                      <Typography
                                        variant="h6"
                                        component="h5"
                                        sx={{ mt: 2 }}
                                      >
                                        {t("Team option selected")}
                                      </Typography>
                                      <Grid container>
                                        <Grid item xs={10}>
                                          <TextField
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            id="outlined-disabled"
                                            label="Teams"
                                            value={
                                              checkboxValues.length + " teams"
                                            }
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                        </Grid>
                                        <Grid item xs={2}>
                                          <IconButton
                                            aria-label="close"
                                            sx={{
                                              verticalAlign: "center",
                                            }}
                                            onClick={() => {
                                              setContributor(null);
                                              setCheckboxValues([]);
                                              setListUsers([]);
                                              setFieldValue("user", "");
                                            }}
                                          >
                                            <Close />
                                          </IconButton>
                                        </Grid>
                                        <FormGroup>
                                          {listTeams.length > 0 &&
                                            listTeams.map((team) => (
                                              <>
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      defaultChecked
                                                      checked={checkboxValues.includes(
                                                        team.id
                                                      )}
                                                      onChange={
                                                        handleCheckboxChange
                                                      }
                                                      name={team.name}
                                                      value={team.id}
                                                    />
                                                  }
                                                  label={team.name}
                                                />

                                                <ul>
                                                  {team.users.length > 0 &&
                                                    team.users.map((user) => (
                                                      <li>{user.full_name}</li>
                                                    ))}
                                                </ul>
                                              </>
                                            ))}
                                        </FormGroup>
                                      </Grid>
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}

                      <Typography variant="h6" component="h5" sx={{ mt: 2 }}>
                        {t("Select the Resource")}
                      </Typography>

                      <Select
                        required
                        error={Boolean(touched.asset && errors.asset)}
                        helperText={touched.asset && errors.asset}
                        onBlur={handleBlur}
                        labelId="resource-select-label"
                        id="resource-select"
                        value={values.asset}
                        name="asset"
                        onChange={handleChange}
                        onClick={() => setFieldTouched("asset")}
                        // onChange={(event) => {
                        //     setAsset(event.target.value);
                        // }}
                        sx={{ width: "100%", mt: 1 }}
                      >
                        {assetsList.map((el) => (
                          <MenuItem key={el.id} value={el}>
                            {el.internalData.name}
                          </MenuItem>
                        ))}
                      </Select>

                      <Typography variant="h6" component="h5" sx={{ mt: 2 }}>
                        {t("Fill in contribution information")}
                      </Typography>
                      <TextField
                        required
                        error={Boolean(touched.title && errors.title)}
                        fullWidth
                        helperText={touched.title && errors.title}
                        label={t("title")}
                        name="title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onClick={() => setFieldTouched("title")}
                        value={values.title}
                        variant="outlined"
                        sx={{ mt: 1 }}
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
                        label={t("Description")}
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onClick={() => setFieldTouched("description")}
                        value={values.description}
                        variant="outlined"
                      />

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
          {alertNoComplexity && <Alert

            severity="warning"
            sx={{ m: 1.35, float: "right", alignItems: "center" }}
          >{t("This task does not have a complexity defined" + ".")}
          </Alert>
          }
        </>
      ) : (
        <>
          <Typography variant="h3" component="h2">
            {t("List of contributors")}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {rows.map((row) => (
                <Grid item xs={12} md={6} lg={4} key={row.id}>
                  <ContributionCard
                    user_id={row.id}
                    name={row.name}
                    contribution_level={row.contribution}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default ContributionsTabs;
