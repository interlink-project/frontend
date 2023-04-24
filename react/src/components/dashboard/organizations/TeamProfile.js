import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Input,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Delete, Edit, Save, Mail } from "@mui/icons-material";
import ConfirmationButton from "components/ConfirmationButton";
import { OrganizationChip } from "components/Icons";
import useDependantTranslation from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import { useEffect, useState } from "react";
import { teamsApi } from "__api__";
import { ExportToCsv } from "export-to-csv";
import UsersList from "./UsersList";
import useAuth from "hooks/useAuth";

const TeamProfile = ({ open, setOpen, teamId, onChanges }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logotype, setLogotype] = useState(null);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState({});
  const { user } = useAuth();

  const mounted = useMounted();
  const { t } = useDependantTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const addUserToTeam = (user) => {
    teamsApi.addUser(teamId, user.sub || user.id).then((res) => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges();
        });
      }
    });
  };

  const removeUserFromTeam = (user) => {
    teamsApi.removeUser(teamId, user.id).then(() => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges();
        });
      }
    });
  };

  const handleAdministratorAdd = (user) => {
    teamsApi.addAdministrator(teamId, user.id).then((res) => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges();
        });
      }
    });
  };
  const handleAdministratorRemove = (user) => {
    teamsApi.removeAdministrator(teamId, user.id).then((res) => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges();
        });
      }
    });
  };

  const downloadMembersMails = (team) => {
    console.log("Downloading mails");
    var mails = [];
    team.users.map((user) =>
      mails.push({
        name: user.full_name,
        mail: user.email,
      })
    );

    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: false,
      filename: team.name + "_Mails",
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(mails);
  };

  const nameAndDescChanged =
    name !== team.name || description !== team.description;
  const somethingChanged = nameAndDescChanged || logotype !== null;

  const handleSave = async () => {
    const calls = [];

    let send = false;
    if (nameAndDescChanged) {
      const data = { name, description };
      calls.push(teamsApi.update(team.id, data));
      send = true;
    }

    // change logotype if specified
    if (logotype) {
      calls.push(teamsApi.setFile(team.id, "logotype", logotype));
      send = true;
    }

    if (send) {
      setLoading(true);
      await Promise.all(calls);
      onChanges && onChanges();
      update(() => {
        setLoading(false);
        setEditMode(false);
      });
    }
  };

  const handleRemove = () => {
    teamsApi.delete(teamId).then(() => {
      onChanges && onChanges();
      setOpen(false);
      window.location.reload(false);
    });
  };

  const update = (callback) => {
    teamsApi.get(teamId).then((res) => {
      if (mounted.current) {
        setTeam(res);
        setName(res.name);
        setDescription(res.description);
        setLoading(false);
        callback && callback(res);
      }
    });
  };

  useEffect(() => {
    if (open) {
      // If dialog open, get team from api
      update();
    } else {
      // if dialog closed, set empty data and loading
      setEditMode(false);
      setTeam({});
      setLoading(true);
    }
  }, [open, editMode]);

  const handleFileSelected = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (file) {
        file.path = URL.createObjectURL(file);
        setLogotype(file);
      }
    }
  };

  const handleApply = () => {
    teamsApi.addAplication(teamId).then((res) => {
      if (mounted.current) {
        console.log(res);
        update();
      }
    });
  };

  const team_trans = t("team");

  const isAdmin = team?.current_user_participation?.includes("administrator");

  const [tabValue, setTabValue] = useState("members");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: "background.default" }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ minHeight: "60vh", backgroundColor: "background.default" }}
      >
        {team && !loading ? (
          <Grid container>
            <Grid item md={4}>
              <Paper sx={{ backgroundColor: "background.paper" }}>
                <Stack
                  direction="column"
                  sx={{ textAlign: "center", justifyContent: "center", p: 2 }}
                  spacing={2}
                >
                  {editMode ? (
                    <label htmlFor="contained-button-file">
                      <Input
                        inputProps={{ accept: "image/*" }}
                        id="contained-button-file"
                        type="file"
                        sx={{ display: "none" }}
                        onChange={handleFileSelected}
                      />
                      <IconButton component="span" color="inherit">
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            position: "relative",
                          }}
                        >
                          <Avatar
                            src={logotype ? logotype.path : team.logotype_link}
                            variant="rounded"
                            style={{
                              width: "100px",
                              height: "100px",
                              position: "absolute",
                            }}
                          />
                          <Edit
                            style={{
                              width: "50%",
                              height: "50%",
                              position: "absolute",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          />
                        </div>
                      </IconButton>
                    </label>
                  ) : (
                    <IconButton component="span" color="inherit" disabled>
                      <Avatar
                        src={logotype ? logotype.path : team.logotype_link}
                        variant="rounded"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                        data-cy="team-avatar"
                      />
                    </IconButton>
                  )}
                  {!editMode ? (
                    <Typography variant="h5" data-cy="team-name">
                      {team.name}
                    </Typography>
                  ) : (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      fullWidth
                      variant="standard"
                      data-cy="edit-team-name"
                    />
                  )}
                  {!editMode ? (
                    <Typography variant="body1" data-cy="team-description">
                      {team.description}
                    </Typography>
                  ) : (
                    <TextField
                      margin="dense"
                      id="description"
                      label="Description"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      variant="standard"
                      data-cy="edit-team-description"
                    />
                  )}
                  <OrganizationChip
                    type={team.type}
                    t={t}
                    dataCy="organizationChip"
                  />
                  {isAdmin && (
                    <>
                      {!editMode ? (
                        <Button
                          disabled={!isAdmin}
                          startIcon={<Edit />}
                          variant="contained"
                          color="primary"
                          onClick={() => setEditMode(true)}
                          data-cy="edit-team"
                        >
                          {t("Edit")}
                        </Button>
                      ) : (
                        <Stack
                          direction="row"
                          justifyContent="center"
                          sx={{ mt: 2 }}
                        >
                          <Button
                            variant="text"
                            color="warning"
                            onClick={() => setEditMode(false)}
                            data-cy="discard-changes"
                          >
                            {t("Discard changes")}
                          </Button>
                          <Button
                            disabled={!somethingChanged}
                            startIcon={<Save />}
                            variant="contained"
                            color="success"
                            onClick={handleSave}
                            data-cy="save-changes-team"
                          >
                            {t("Save")}
                          </Button>
                        </Stack>
                      )}
                      <ConfirmationButton
                        Actionator={({ onClick }) => (
                          <Button
                            startIcon={<Delete />}
                            disabled={!editMode}
                            variant="text"
                            color="error"
                            onClick={onClick}
                            data-cy="remove-team"
                          >
                            {t("Remove {{what}}", { what: team_trans })}
                          </Button>
                        )}
                        ButtonComponent={({ onClick }) => (
                          <Button
                            sx={{ mt: 1 }}
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={onClick}
                            data-cy="confirm-delete-team"
                          >
                            {t("Confirm deletion")}
                          </Button>
                        )}
                        onClick={handleRemove}
                        text={t("Are you sure?")}
                      />
                      {!editMode && (
                        <Button
                          sx={{ mt: 1 }}
                          startIcon={<Mail />}
                          variant="outlined"
                          color="primary"
                          onClick={() => downloadMembersMails(team)}
                          data-cy="download-members-mails"
                        >
                          {t("Download e-mails")}
                        </Button>
                      )}
                    </>
                  )}
                  {team.users.some((u) => u.id === user.id) ? (
                    <></>
                  ) : (
                    <>
                      {team.appliers_ids.some((u) => u === user.id) ? (
                        <Button
                          disabled
                          variant="contained"
                          startIcon={<Mail />}
                          onClick={handleApply}
                        >
                          Already applied
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<Mail />}
                          onClick={handleApply}
                        >
                          Apply to join the team
                        </Button>
                      )}
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>
            <Grid item md={8} sx={{ p: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="organization-right-side-tabs"
                sx={{ mb: 2 }}
                centered
              >
                <Tab
                  value="members"
                  label={`${t("Members")} (${team.users.length})`}
                />
                <Tab
                  value="administrators"
                  label={`${t("Administrators")} (${
                    team.administrators_ids.length
                  })`}
                />
              </Tabs>
              {tabValue === "members" && (
                <UsersList
                  size="small"
                  users={team.users}
                  searchOnOrganization={isAdmin && team.organization_id}
                  disableHeader={false}
                  onSearchResultClick={isAdmin && addUserToTeam}
                  getActions={(user) =>
                    isAdmin && [
                      {
                        id: `${user.id}-remove-action`,
                        onClick: removeUserFromTeam,
                        text: t("Remove member"),
                        sx: { color: "red" },
                        icon: <Delete />,
                      },
                    ]
                  }
                />
              )}

              {tabValue === "administrators" && (
                <>
                  <Alert sx={{ mb: 2 }} severity="info">
                    {t(
                      "Administrators of the team can add/remove users and edit the information of the team"
                    )}
                  </Alert>
                  <UsersList
                    size="small"
                    users={team?.administrators}
                    searchOnOrganization={isAdmin && team?.organization_id}
                    disableHeader={false}
                    onSearchResultClick={isAdmin && handleAdministratorAdd}
                    getActions={(user) => {
                      return (
                        isAdmin && [
                          {
                            id: `${user.id}-remove-admin-action`,
                            onClick: handleAdministratorRemove,
                            text: t("Remove administrator"),
                            icon: <Delete />,
                            sx: { color: "red" },
                            disabled: team?.administrators_ids?.length === 1,
                          },
                        ]
                      );
                    }}
                  />
                </>
              )}
            </Grid>
          </Grid>
        ) : (
          <Box
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box>
              <CircularProgress />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TeamProfile;
