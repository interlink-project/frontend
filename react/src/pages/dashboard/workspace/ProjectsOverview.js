import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Folder, MenuBook } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import AuthGuardSkeleton from "components/guards/AuthGuardSkeleton";
import useMounted from "hooks/useMounted";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  getCoproductionProcesses,
  getUnseenUserNotifications,
} from "slices/general";
import { cleanProcess } from "slices/process";
import useAuth from "../../../hooks/useAuth";
import CoproductionprocessCreate from "./CoproductionProcessCreate";
import CentricCircularProgress from "components/CentricCircularProgress";
import { StatusChip, WarningIcon } from "components/Icons";
import HelpAlert from "components/HelpAlert";
import SearchBox from "components/SearchBox";
import moment from "moment";
import TeamAvatar from "components/TeamAvatar";

function ProcessRow({ process, t }) {
  const navigate = useNavigate();
  return (
    <TableRow
      key={process.id}
      hover
      sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
      onClick={() =>
        navigate(`/dashboard/coproductionprocesses/${process.id}/overview`)
      }
    >
      <TableCell align="center">
        <Box style={{ justifyContent: "center", display: "flex" }}>
          {process.is_part_of_publication && <MenuBook sx={{ mr: 1 }} />}

          {process.logotype_link ? (
            <Avatar
              sx={{ height: "25px", width: "25px" }}
              variant="rounded"
              src={process.logotype_link}
            />
          ) : (
            <Folder />
          )}
        </Box>
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        <b>{process.name}</b>
      </TableCell>
      <TableCell align="center">
        {moment(process.created_at).fromNow()}
      </TableCell>
      <TableCell align="center">
        <StatusChip t={t} status={process.status} />
      </TableCell>
      <TableCell align="center">
        <AvatarGroup max={5} variant="rounded">
          {process.enabled_teams.length > 0 ? (
            process.enabled_teams.map((team) => (
              <TeamAvatar
                sx={{ height: 25, width: 25 }}
                key={team.id}
                team={team}
              />
            ))
          ) : (
            <Stack direction="row" alignItems="center">
              <WarningIcon />
              <Typography sx={{ ml: 2 }}>{t("No teams")}</Typography>
            </Stack>
          )}
        </AvatarGroup>
      </TableCell>
      <TableCell align="center">
        {process.current_user_participation.map((p) => (
          <Chip key={p} label={p} />
        ))}
      </TableCell>
    </TableRow>
  );
}
const ProjectsOverview = () => {
  const { processes, loadingProcesses } = useSelector((state) => state.general);
  const [coproductionProcessCreatorOpen, setCoproductionProcessCreatorOpen] =
    React.useState(false);
  const [coproductionProcessLoading, setCoproductionProcessLoading] =
    React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const navigate = useNavigate();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();

  const getCoproductionProcessesData = React.useCallback(
    async (search) => {
      if (isAuthenticated) {
        dispatch(cleanProcess());
        dispatch(getCoproductionProcesses(search));
      }
    },
    [isAuthenticated, mounted]
  );

  const getUnseenUserNotificationsData = React.useCallback(
    async (search) => {
      if (isAuthenticated) {
        dispatch(cleanProcess());
        dispatch(getUnseenUserNotifications(search));
        //dispatch(getUnseenUserNotifications({'user_id':user.id}));
      }
    },
    [isAuthenticated, mounted]
  );

  // if (mounted.current) {
  //   dispatch(cleanProcess());
  //   dispatch(getUnseenUserNotifications(search));
  // }

  React.useEffect(() => {
    let delayDebounceFn;
    if (mounted.current) {
      delayDebounceFn = setTimeout(
        () => {
          getCoproductionProcessesData(searchValue);
        },
        searchValue ? 800 : 0
      );
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [getCoproductionProcessesData, searchValue]);

  React.useEffect(() => {
    let delayDebounceFn;
    if (mounted.current) {
      delayDebounceFn = setTimeout(
        () => {
<<<<<<< HEAD
          getUnseenUserNotificationsData({ user_id: user?.id });
=======
          getUnseenUserNotificationsData({ user_id: user.id });
>>>>>>> 7978d980d3d6e6cddb35995edd7c867e573ca17a
        },
        searchValue ? 800 : 0
      );
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [getUnseenUserNotificationsData]);

  const onProcessCreate = (res) => {
    navigate(`/dashboard/coproductionprocesses/${res.id}/overview`);
  };
  return (
    <>
      <Helmet>
        <title>{t("workspace-title")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 5,
          px: 1,
        }}
      >
        <Container maxWidth="lg">
          <AuthGuardSkeleton height="60vh" width="100%">
            <Grid container spacing={3}>
              <Grid
                alignItems="center"
                container
                justifyContent="space-between"
                spacing={3}
                item
                xs={12}
              >
                <Grid item>
                  <Typography color="textSecondary" variant="overline">
                    {t("Workspace")}
                  </Typography>
                  <Typography color="textPrimary" variant="h5">
                    {t("Welcome", {
                      name: user ? user.given_name : "",
                    })}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    {t("workspace-subtitle")}
                  </Typography>
                </Grid>
                <Grid item>
                  <LoadingButton
                    onClick={() => setCoproductionProcessCreatorOpen(true)}
                    loading={loadingProcesses}
                    fullWidth
                    variant="contained"
                    sx={{ textAlign: "center", mt: 1, mb: 2 }}
                    startIcon={<Add />}
                    size="small"
                    data-cy="add-process"
                  >
                    {t("add-process")}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Box sx={{ mb: 2 }}>
                <SearchBox
                  loading={loadingProcesses}
                  inputValue={searchValue}
                  setInputValue={setSearchValue}
                />
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" />
                      <TableCell align="center">{t("Name")}</TableCell>
                      <TableCell align="center">{t("Created")}</TableCell>
                      <TableCell align="center">{t("Status")}</TableCell>
                      <TableCell align="center">{t("Teams")}</TableCell>
                      <TableCell align="center">
                        {t("Your participation in the process")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processes.length > 0 &&
                      processes.map((process) => (
                        <React.Fragment key={process.id}>
                          <ProcessRow process={process} t={t} />
                        </React.Fragment>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {processes.length === 0 && (
                <>
                  {loadingProcesses ? (
                    <CentricCircularProgress />
                  ) : (
                    <Paper
                      sx={{ p: 2, textAlign: "center", minHeight: "50vh" }}
                    >
                      <Box
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Typography sx={{ my: 2 }} variant="h5">
                          {t("Empty")}
                        </Typography>
                        <Button
                          onClick={() =>
                            setCoproductionProcessCreatorOpen(true)
                          }
                          sx={{ my: 3, width: 400 }}
                          variant="contained"
                          size="small"
                        >
                          {t("Create a new co-production process")}
                        </Button>
                      </Box>
                    </Paper>
                  )}
                </>
              )}
              <CoproductionprocessCreate
                open={coproductionProcessCreatorOpen}
                setOpen={setCoproductionProcessCreatorOpen}
                loading={coproductionProcessLoading}
                setLoading={setCoproductionProcessLoading}
                onCreate={onProcessCreate}
              />
            </Box>
          </AuthGuardSkeleton>
        </Container>
      </Box>
    </>
  );
};

export default ProjectsOverview;
