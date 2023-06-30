import {
  Divider,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
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
import { OrganizationChip, TreeItemTypeChip } from "components/Icons";
import TeamAvatar from "components/TeamAvatar";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import TeamProfile from "components/dashboard/organizations/TeamProfile";
import UsersList from "components/dashboard/organizations/UsersList";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getProcess, setSelectedTreeItem } from "slices/process";
import PermissionCreate from "components/dashboard/coproductionprocesses/PermissionCreate";
import ConfirmationButton from "components/ConfirmationButton";
import { LoadingButton } from "@mui/lab";
import { permissionsApi, usernotificationsApi } from "__api__";
import { getUserAplicationsHistorybyCoproId, getUserAplicationsbyCoproId } from "slices/general";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useLocation } from "react-router-dom";

import { AppBar, LinearProgress, Tab, Tabs as MuiTabs } from "@mui/material";

function TeamRow({
  t,
  team,
  process,
  treeitems,
  setSelectedTeam,
  setSelectedTreeItem,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [teamItems, setTeamItems] = React.useState([]);

  const handleDelete = (id) => {
    permissionsApi.delete(id).then(() => {
      dispatch(getProcess(process.id));
    });
  };

  React.useEffect(() => {
    const li = process.enabled_permissions.map((el) => undefined);
    process.enabled_permissions
      .filter((el) => el.team_id === team.id)
      .forEach((permission) => {
        const index = treeitems.findIndex(
          (el) => el.id === permission.treeitem_id
        );
        if (index >= 0) {
          li.splice(index + 1, 0, {
            permission: permission,
            treeitem: treeitems[index],
          });
        } else {
          // insert at position 0
          li.splice(0, 0, { permission: permission, treeitem: null });
        }
      });
    const without_undefined = li.filter(function (element) {
      return element !== undefined;
    });
    setTeamItems(without_undefined);
  }, [process]);

  return (
    <Grid item key={team.id} xs={12} sx={{ textAlign: "center" }}>
      <Card sx={{ p: 1 }} key={team.id}>
        <Grid container>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                sx={{ p: 1, height: "100%" }}
                onClick={() => setSelectedTeam(team.id)}
              >
                <CardHeader
                  avatar={<TeamAvatar team={team} />}
                  title={team.name}
                  subheader={<OrganizationChip t={t} type={team.type} />}
                />
              </CardActionArea>
            </Card>
            {false && <UsersList users={team.users} size="small" />}
          </Grid>
          <Grid item xs={12} md={9}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="45%" align="right">
                    {t("For")}
                  </TableCell>
                  <TableCell width="15%" align="center">
                    {t("access_assets_permission")}
                  </TableCell>
                  <TableCell width="15%" align="center">
                    {t("create_assets_permission")}
                  </TableCell>
                  <TableCell width="15%" align="center">
                    {t("delete_assets_permission")}
                  </TableCell>
                  <TableCell width="10%" align="center">
                    {t("Actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamItems.map((el) => {
                  const { permission, treeitem } = el;
                  return (
                    permission && (
                      <TableRow
                        key={permission.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="right" component="th" scope="row">
                          {treeitem ? (
                            <Button
                              fullWidth
                              color="inherit"
                              variant="text"
                              onClick={() => {
                                dispatch(
                                  setSelectedTreeItem(treeitem, () =>
                                    navigate(
                                      `/dashboard/coproductionprocesses/${process.id}/guide`
                                    )
                                  )
                                );
                              }}
                              endIcon={<ArrowForward />}
                            >
                              <Box sx={{ m: 1 }}>
                                <TreeItemTypeChip treeitem={treeitem} t={t} />
                              </Box>
                              {treeitem.name}
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() => {
                                dispatch(
                                  setSelectedTreeItem(treeitems[0], () =>
                                    navigate(
                                      `/dashboard/coproductionprocesses/${process.id}/guide`
                                    )
                                  )
                                );
                              }}
                              color={"inherit"}
                            >
                              {t("Overall process")}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {permission.access_assets_permission ? (
                            <CheckOutlined style={{ color: green[500] }} />
                          ) : (
                            <Close style={{ color: red[500] }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {permission.create_assets_permission ? (
                            <CheckOutlined style={{ color: green[500] }} />
                          ) : (
                            <Close style={{ color: red[500] }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {permission.delete_assets_permission ? (
                            <CheckOutlined style={{ color: green[500] }} />
                          ) : (
                            <Close style={{ color: red[500] }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row">
                            {false && (
                              <IconButton>
                                <Edit />
                              </IconButton>
                            )}
                            <ConfirmationButton
                              key={`${permission.id}-delete-action`}
                              Actionator={({ onClick }) => (
                                <IconButton onClick={onClick}>
                                  <Delete />
                                </IconButton>
                              )}
                              ButtonComponent={({ onClick }) => (
                                <LoadingButton
                                  sx={{ mt: 1 }}
                                  fullWidth
                                  variant="contained"
                                  color="error"
                                  onClick={onClick}
                                >
                                  {t("Confirm deletion")}
                                </LoadingButton>
                              )}
                              onClick={() => handleDelete(permission.id)}
                              text={t(
                                "Are you sure you want to remove this permission?"
                              )}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
export default function TeamsTab() {
  const { process, hasSchema, isAdministrator, treeitems } = useSelector(
    (state) => state.process
  );

  const { usernotifications } = useSelector((state) => state.general);

  const dispatch = useDispatch();
  const mounted = useMounted();
  const t = useCustomTranslation(process.language);
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [permissionCreatorOpen, setOpenPermissionCreator] =
    React.useState(false);
  const [creatingPermission, setCreatingPermission] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState("0");
  const [showHistory, setShowHistory] = React.useState(false);

  const location = useLocation();

  React.useEffect(() => {
    if (mounted) {
      const search = location.search;
      const params = new URLSearchParams(search);
      const selectedTabTemp = params.get('tab');
      if (selectedTabTemp){
        if (selectedTabTemp === "Requests"){
          setSelectedTab("1");
        }
      } 

    }
  
  }, []);

  const style = {
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  };

  React.useEffect(() => {
    if (mounted) {
      dispatch(
        getUserAplicationsbyCoproId({ coproductionprocess_id: process.id })
      );
    }
  }, [mounted]);

  if (!hasSchema) {
    navigate(`/dashboard/coproductionprocesses/${process.id}`);
    return null;
  }

  const update = () => {
    dispatch(getProcess(process.id, false));
  };

  const listUserNotificationsContainer = usernotifications.map(
    (notification) => {
      console.log(notification);
      const replacedString = notification.parameters.replace(/'/g, '"');
      const parameters = JSON.parse(replacedString);
      
      function archiveRequest() {
        usernotificationsApi.setArchiveUserNotification({
          usernotificationId: notification.id,
        });
        dispatch(
          getUserAplicationsbyCoproId({ coproductionprocess_id: process.id })
        );

      }

      return (
        <TableRow>
          <TableCell width="10%" align="center">
            {moment(notification.created_at).fromNow()}
          </TableCell>
          <TableCell align="left" component="th" scope="row">
            {parameters.razon}
          </TableCell>
          <TableCell align="center">{parameters.userName}</TableCell>
          <TableCell align="center">{parameters.userEmail}</TableCell>
          <TableCell align="center">
            {!notification.is_archived ? (
            <IconButton onClick={() => archiveRequest()}>
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

  const onSelect = (value) => {
    if (mounted.current) {
      setSelectedTab(value);
    }
  };

  const showArchivedRequests = () => {
    dispatch(
      getUserAplicationsHistorybyCoproId({ coproductionprocess_id: process.id })
    );
    setShowHistory(true);

  };

  const showRequests= () => {
    dispatch(
      getUserAplicationsbyCoproId({ coproductionprocess_id: process.id })
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
                <Tab key="1" label={t("Teams")} value="0"></Tab>
                {isAdministrator && (
                  <Tab
                    key="2"
                    label={t("Collaboration Requests")}
                    value="1"
                  ></Tab>
                )}
              </MuiTabs>
              {/* {loading && <LinearProgress />} */}
            </AppBar>
          </Grid>
        </Box>

        {/* Show the Teams Tab */}
        {selectedTab === "0" && (
          <>
          <Grid item sx={{ textAlign: "left", m: 2 }}>
                <Typography
                  color="textPrimary"
                  variant="h5"
                  data-cy="welcome-to-user"
                >
                  {t("Teams Permissions")}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  
                >
                  {t("Here are listed the teams that have participation and permissions on the process") +
                    "."}
                </Typography>
              </Grid>


            {isAdministrator && (
              <Grid
                alignItems="center"
                container
                justifyContent="space-between"
                spacing={3}
                item
                xs={12}
                sx={{ my: 2 }}
              >
                <Grid item></Grid>
                <Grid item>
                  <Button
                    onClick={() => setOpenPermissionCreator(true)}
                    fullWidth
                    startIcon={<Add />}
                    variant="contained"
                  >
                    {`${t("Add new permission to the overall process")}`}
                  </Button>
                </Grid>
              </Grid>
            )}
            {selectedTeam && (
              <TeamProfile
                teamId={selectedTeam}
                open={!!selectedTeam}
                setOpen={setSelectedTeam}
                onChanges={() => console.log("refresh")}
              />
            )}
            {process.enabled_teams.length > 0 ? (
              <>
                <Grid container spacing={3} sx={{ mb: 1 }}>
                  {process.enabled_teams.map((team) => (
                    <TeamRow
                      key={team.id}
                      t={t}
                      team={team}
                      process={process}
                      treeitems={treeitems}
                      setSelectedTeam={setSelectedTeam}
                      setSelectedTreeItem={setSelectedTreeItem}
                    />
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Alert severity="warning">
                  {t(
                    "There are no teams working on the coproduction process yet"
                  )}
                </Alert>
              </>
            )}
            <PermissionCreate
              open={permissionCreatorOpen}
              setOpen={setOpenPermissionCreator}
              onCreate={update}
              loading={creatingPermission}
              setLoading={setCreatingPermission}
              coproductionprocess={process}
            />
          </>
        )}

        {/* //Show the Requests Tab */}
        {selectedTab === "1" && (
          <>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Grid item sx={{ textAlign: "left", m: 2 }}>
                <Typography
                  color="textPrimary"
                  variant="h5"
                  data-cy="welcome-to-user"
                >
                  {t("Process Collaboration Requests")}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  data-cy={
                    t("Here is the recent requests applied to the process") +
                    "."
                  }
                >
                  {t("Here is the recent requests applied to the process") +
                    "."}
                </Typography>
              </Grid>

              <Grid item sx={{ textAlign: "right", m: 2 }}>
                {!showHistory ? 
                  <Button
                  variant="contained"
                  color="primary"
                  onClick={() => showArchivedRequests()}
                >
                  {t("Show All Requests")}
                </Button>
                
                :
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => showRequests()}
                >
                  {t("Hide archived requests")}
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
                          {t("Comment")}
                        </TableCell>
                        <TableCell width="15%" align="center">
                          {t("Name")}
                        </TableCell>
                        <TableCell width="15%" align="center">
                          {t("Email")}
                        </TableCell>

                        <TableCell width="10%" align="center">
                          {t("Archive")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{listUserNotificationsContainer}</TableBody>
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
