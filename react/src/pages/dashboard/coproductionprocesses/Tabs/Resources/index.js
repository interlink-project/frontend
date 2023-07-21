import {
  AppBar,
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Divider,
  Alert,
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableRow,
  CardContent,
  Fab,
  Chip,
  Tabs as MuiTabs,
  CardActions,
} from "@mui/material";
import { AccountTree, OpenInNew, ExpandMore } from "@mui/icons-material";
import { AssetsTable } from "components/dashboard/assets";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelectedTreeItemById } from "slices/process";
import {
  getAssignmentbyId,
  getFullAssignmentsbyCoproIdUserId,
  getInPendingAssignmentsbyCoproIdAssigIdUserId,
  getInPendingAssignmentsbyCoproIdUserId,
} from "slices/general";
import { assignmentsApi, claimsApi, coproductionProcessesApi, coproductionprocessnotificationsApi, tasksApi } from "__api__";
import TimeLine from "components/dashboard/coproductionprocesses/TimeLine";
import CoproNotifications from "components/dashboard/coproductionprocesses/CoproNotifications";
import {
  getAssetsList_byCopro,
  getCoproductionProcessNotifications,
} from "slices/general";
import useAuth from "hooks/useAuth";
import { cleanProcess } from "slices/process";
import { defaultReduceAnimations } from "@mui/lab/CalendarPicker/CalendarPicker";
import moment from "moment";
import {
  Add,
  ArrowForward,
  CheckOutlined,
  Close,
  Delete,
  Archive,
  Undo,
  Inventory,
  Edit,
  InsertLink,
  Visibility,
} from "@mui/icons-material";
import { ClaimDialog } from "components/dashboard/coproductionprocesses/ClaimDialog";
import LinkDialog from "./LinkDialog";
import { REACT_APP_COMPLETE_DOMAIN } from "configuration";

export default function Resources({}) {
  const { process, isAdministrator, tree } = useSelector(
    (state) => state.process
  );
  const t = useCustomTranslation(process.language);
  const [tab, setTab] = useState(
    isAdministrator & !process.is_part_of_publication ? "progress" : "assets"
  );
  const [loading, setLoading] = React.useState(true);
  //const [assets, setAssets] = React.useState([]);
  const { assetsList, assignments } = useSelector((state) => state.general);
  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");

  const { user, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState("0");
  const [showHistory, setShowHistory] = React.useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [link_assignment, setLink_assignment] = useState(null);

  React.useEffect(() => {
    if (mounted) {
      const search = location.search;
      const params = new URLSearchParams(search);
      const selectedTabTemp = params.get("tab");
      if (selectedTabTemp) {
        if (selectedTabTemp === "Assignments") {
          setSelectedTab("1");
        }
      }

      const selectedTabAssignment_id = params.get("assignment");
      if (selectedTabAssignment_id) {
        setSelectedTab("1");
        showAssignments(selectedTabAssignment_id);
      } else {
        showAssignments();
      }
    }
  }, [mounted]);

  React.useEffect(() => {
    setLoading(true);

    // coproductionProcessesApi.getAssets(process.id).then((res) => {
    //   if (mounted.current) {
    //     setAssets(res);
    //     setLoading(false);
    //   }
    // });
    dispatch(getAssetsList_byCopro(process.id));
    setLoading(false);
  }, [process]);

  const style = {
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  };

  const getAssetsActions = (asset) => {
    const actions = [];
    actions.push({
      id: `${asset.id}-open-action`,
      onClick: (closeMenuItem) => {
        window.open(`${asset.id}/view`, "_blank");
        closeMenuItem();
      },
      text: t("Open"),
      icon: <OpenInNew fontSize="small" />,
    });
    actions.push({
      id: `${asset.id}-open-task-action`,
      onClick: (closeMenuItem) => {
        dispatch(
          setSelectedTreeItemById(asset.task_id, () => {
            navigate(`/dashboard/coproductionprocesses/${process.id}/guide`);
          })
        );
      },
      text: t("Go to the task"),
      icon: <AccountTree fontSize="small" />,
    });
    return actions;
  };

  if (!process || !tree) {
    return;
  }

  const listAssignmentsContainer2 = assignments.map((assignment) => {
    function approveAssignment() {
      assignmentsApi.setApprovedAssignment({
        assignmentId: assignment.id,
      });
      setShowHistory(false);

      
      dispatch(
        getInPendingAssignmentsbyCoproIdUserId({
          coproductionprocess_id: process.id,
        })
      );
    }

    function inprogressAssignment() {
      assignmentsApi.setInProgressAssignment({
        assignmentId: assignment.id,
      });
      setShowHistory(false);

      dispatch(
        getInPendingAssignmentsbyCoproIdUserId({
          coproductionprocess_id: process.id,
        })
      );
    }

    function showLink() {
      //Create the link to the claim dialog:
      setSelectedAssignment(assignment);
      setLink_assignment(
        `${REACT_APP_COMPLETE_DOMAIN}/dashboard/coproductionprocesses/${process.id}/resources?tab=Assignments&assignment=${assignment.id}`
      );
      //console.log(link_assignment);
      setOpenLinkDialog(true);
    }

    function goTask(selectedTaskId){
      dispatch(
        setSelectedTreeItemById(selectedTaskId, () => {
          navigate(`/dashboard/coproductionprocesses/${process.id}/guide`);
        })
      );
    }

    function showResource() {
      const linkToAsset = `${REACT_APP_COMPLETE_DOMAIN}/dashboard/coproductionprocesses/${process.id}/${assignment.asset.id}/view`;
      window.open(linkToAsset, "_blank");
    }

    return (
      <>
        <TableRow>
          <TableCell width="10%" align="center">
            {moment(assignment.created_at).fromNow()}
          </TableCell>

          <TableCell align="center" width="10%">
            {!assignment.state ? (
              <Chip label="In Progress" />
            ) : (
              <Chip label="Archived" variant="outlined" color="warning" />
            )}
          </TableCell>

          <TableCell align="left" component="th" scope="row">
            {assignment.title}
          </TableCell>
          <TableCell align="left" component="th" scope="row">
            {assignment.description}
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => goTask(assignment.task_id)}>
              <AccountTree />
            </IconButton>
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => showResource()}>
              <Visibility />
            </IconButton>
          </TableCell>
          <TableCell align="center">
            {!assignment.state ? (
              <IconButton onClick={() => approveAssignment()}>
                <Archive />
              </IconButton>
            ) : (
              <IconButton onClick={() => inprogressAssignment()}>
                <Undo color="success" />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center"  sx={{verticalAlign: "top", paddingTop: "16px"}} >
          { !assignment.state && 
                  <Fab
                    color="primary"
                    aria-label="add"
                    size="small"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      //console.log(assignment);
                      handleClaim(assignment.asset);
                    }} // <-- add your click event here
                  >
                    <Add />
                  </Fab>
                  }

          </TableCell>
          <TableCell colSpan={6}>
            <Accordion
              style={{ width: "100%" }}
              sx={{
                mb: 1,
                mt: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 3,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={2}
                >

                
                  <Divider orientation="vertical" flexItem />
                  <Typography color="text.secondary">
                    Claims ({assignment.claims.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {assignment.claims.map((claim) => {

                  const handleDeleteClaim = async (claim) => {
                    //window.open(`${asset.link}/download`, '_blank');
                    const selectedTask = await tasksApi.get(claim.task_id);
                    // console.log("task:")
                    // console.log(selectedTask)
                    if (selectedTask.status === "finished") {
                      alert(
                        t("This task is already close! You can not delete this claim")+"."
                      );
                    } else {
                      await coproductionprocessnotificationsApi.delete(
                        claim.id
                      );
                      await claimsApi.delete(claim.id);
                      dispatch(
                        getInPendingAssignmentsbyCoproIdUserId({
                          coproductionprocess_id: process.id,
                        })
                      );
                    }
                  };

                  return (
                    <Card sx={{ minWidth: 275 }} key={"card_" + claim.id}>
                      <CardContent>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {moment(claim.created_at).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </Typography>
                        <Typography variant="h5" component="div">
                          {claim.title}
                        </Typography>

                        <Typography>{claim.description}</Typography>
                      </CardContent>
                      <CardActions
                        align="right"
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <Button
                         key={"button_" + claim.id}
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteClaim(claim)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </TableCell>
        </TableRow>
      </>
    );
  });

  const onSelect = (value) => {
    if (mounted.current) {
      setSelectedTab(value);
    }
  };

  const showAssigmentsApproved = () => {
    dispatch(
      getFullAssignmentsbyCoproIdUserId({ coproductionprocess_id: process.id })
    );
    setShowHistory(true);
  };

  const showAssignments = (selectedAssignment) => {
    if (selectedAssignment != null) {

      dispatch(
        getAssignmentbyId({
          assignment_id: selectedAssignment,
        })
      );
    } else {
      dispatch(
        getInPendingAssignmentsbyCoproIdUserId({
          coproductionprocess_id: process.id,
        })
      );
    }
    setShowHistory(false);
  };

  const handleClaim = (asset) => {
    //window.open(`${asset.link}/download`, '_blank');
    setSelectedAsset(asset);
    setClaimDialogOpen(true);
  };

  return (
    <>
      <Card sx={{ ...style, mb: 3 }}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Grid container>
            <Grid item xl={12} lg={12} md={12} xs={12}></Grid>

            <AppBar
              position="static"
              sx={{
                color: "white",
              }}
            >
              <MuiTabs
                indicatorColor="secondary"
                onChange={(event, value) => onSelect(value)}
                value={selectedTab}
                // centered
                variant="scrollable"
                textColor="inherit"
                aria-label="Coproduction phases tabs"
                sx={{
                  "& .Mui-selected": {
                    background: "#a4cbd8",
                    color: "black",
                  },
                  "& .MuiTabs-flexContainer": {
                    "justify-content": "center",
                  },
                }}
              >
                <Tab key="1" label={t("Resources")} value="0"></Tab>
                {isAdministrator && (
                  <Tab key="2" label={t("Assignments")} value="1"></Tab>
                )}
              </MuiTabs>
              {/* {loading && <LinearProgress />} */}
            </AppBar>
          </Grid>
        </Box>

        {/* Show the Resources Tab */}
        {selectedTab === "0" && (
          <Box sx={{ p: 3, justifyContent: "center" }}>
            <AssetsTable
              language={process.language}
              loading={loading}
              getActions={getAssetsActions}
            />
          </Box>
        )}

        {/* //Show the Assignments Tab */}
        {selectedTab === "1" && (
          <>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Grid container justifyContent="space-between">
                <Grid item sx={{ textAlign: "left", m: 2 }}>
                  <Typography
                    color="textPrimary"
                    variant="h5"
                    data-cy="welcome-to-user"
                  >
                    {t("User Assignments")}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    
                  >
                    {t("Here are the recent assignments where you may work") +
                      "."}
                  </Typography>
                </Grid>

                <Grid item sx={{ textAlign: "right", m: 2 }}>
                  {!showHistory ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => showAssigmentsApproved()}
                    >
                      {t("Show All Assignments")}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => showAssignments()}
                    >
                      {t("Show in progress assignments")}
                    </Button>
                  )}
                </Grid>
              </Grid>

              <Card sx={{ p: 1 }}>
                <Grid item xs={12} md={9}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width="5%" align="center">
                          <Typography variant="subtitle2" color="secundary">
                            {t("Date")}
                          </Typography>
                        </TableCell>
                        <TableCell width="5%" align="center">
                          <Typography variant="subtitle2" color="secundary">
                            {t("State")}
                          </Typography>
                        </TableCell>
                        <TableCell width="20%" align="left">
                          <Typography variant="subtitle2" color="secundary">
                            {t("Title")}
                          </Typography>
                        </TableCell>
                        <TableCell width="50%" align="left">
                          <Typography variant="subtitle2" color="secundary">
                            {t("Instructions")}
                          </Typography>
                        </TableCell>

                        <TableCell width="5%" align="center">
                          <Typography variant="subtitle2" color="secundary">
                            {t("Task")}
                          </Typography>
                        </TableCell>

                        <TableCell width="5%" align="center">
                          <Typography variant="subtitle2" color="secundary">
                            {t("Resource")}
                          </Typography>
                        </TableCell>

                        <TableCell width="5%" align="center">
                          <Typography variant="subtitle2" color="secundary">
                            {t("Archive")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{listAssignmentsContainer2}</TableBody>
                  </Table>
                </Grid>
              </Card>
            </Grid>
          </>
        )}
      </Card>

      <ClaimDialog
        claimDialogOpen={claimDialogOpen}
        setClaimDialogOpen={setClaimDialogOpen}
        selectedAsset={selectedAsset}
        selectedAssignment={selectedAssignment}
        afterRefreshEvent={getInPendingAssignmentsbyCoproIdUserId({
          coproductionprocess_id: process.id,
        })}
      />

      <LinkDialog
        open={openLinkDialog}
        handleClose={() => setOpenLinkDialog(false)}
        title={t("Link to the asset")}
        sub_text={t(
          "This direct access link will take you to this specific assignment page"
        )}
        imp_text={link_assignment}
        submitText="Copy Link"
      />
    </>
  );
}
