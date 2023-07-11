import { AppBar, Box, Paper, Tab, Tabs, Typography,  Divider,
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
  TableRow, Tabs as MuiTabs
   } from "@mui/material";
import { AccountTree, OpenInNew } from "@mui/icons-material";
import { AssetsTable } from "components/dashboard/assets";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelectedTreeItemById } from "slices/process";
import { getFullAssignmentsbyCoproIdUserId, getInPendingAssignmentsbyCoproIdUserId } from "slices/general";
import { assignmentsApi, coproductionProcessesApi } from "__api__";
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
  Inventory,
  Edit,
} from "@mui/icons-material";


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


  React.useEffect(() => {
    if (mounted) {
      const search = location.search;
      const params = new URLSearchParams(search);
      const selectedTabTemp = params.get('tab');
      if (selectedTabTemp){
        if (selectedTabTemp === "Assignments"){
          setSelectedTab("1");
        }
      } 
      

    }
  
  }, []);

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

  React.useEffect(() => {
    if (mounted) {
      showAssignments();
    }
  }, [mounted]);

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


  const listAssignmentsContainer = assignments.map(
    (assignment) => {
      console.log(assignment);
      
      function approveAssignment() {
        assignmentsApi.setApprovedAssignment({
          assignmentId: assignment.id,
        });
        dispatch(
          getInPendingAssignmentsbyCoproIdUserId({ coproductionprocess_id: process.id })
        );

      }

      return (
        <TableRow>
          <TableCell width="10%" align="center">
            {moment(assignment.created_at).fromNow()}
          </TableCell>
          <TableCell align="left" component="th" scope="row">
            {assignment.title}
          </TableCell>
          <TableCell align="left" component="th" scope="row">
            {assignment.description}
          </TableCell>
          <TableCell align="center">
            {!assignment.state ? (
            <IconButton onClick={() => approveAssignment()}>
              <Archive />
            </IconButton>
            ) : (
            <IconButton >
              <Inventory color='error'/>
            </IconButton>
            )
            }
          </TableCell>
        </TableRow>
      );
    }
  );

  React.useEffect(() => {
    if (mounted) {
      showAssignments();
    }
  }, [mounted]);

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

  const showAssignments= () => {
    dispatch(
      getInPendingAssignmentsbyCoproIdUserId({ coproductionprocess_id: process.id })
    );
    setShowHistory(false);
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
                  <Tab
                    key="2"
                    label={t("Assignments")}
                    value="1"
                  ></Tab>
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
                data-cy={
                  t("Here is the recent assignments you should work on") +
                  "."
                }
              >
                {t("Here is the recent assignments you should work on") +
                  "."}
              </Typography>
            </Grid>

            <Grid item sx={{ textAlign: "right", m: 2 }}>
              {!showHistory ? 
                <Button
                variant="contained"
                color="primary"
                onClick={() => showAssigmentsApproved()}
              >
                {t("Show All Assignments")}
              </Button>
              
              :
              <Button
                variant="contained"
                color="primary"
                onClick={() => showAssignments()}
              >
                {t("Show in progress assignments")}
              </Button>
              }
              
            </Grid>

            <Card sx={{ p: 1 }}>
              <Grid item xs={12} md={9}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width="10%" align="center">
                        {t("Date")}
                      </TableCell>
                      <TableCell width="45%" align="left">
                        {t("Title")}
                      </TableCell>
                      <TableCell width="45%" align="left">
                        {t("Instructions")}
                      </TableCell>
                      
                      
                      <TableCell width="10%" align="center">
                        {t("Approved")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{listAssignmentsContainer}</TableBody>
                </Table>
              </Grid>
            </Card>
          </Grid>
        </>
        )}

</Card>

    

      
    

    </>
  );
}
