import { Box, Button, Container, Grid, Typography } from "@mui/material";
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

const MyWorkspace = () => {
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
          getUnseenUserNotificationsData({ user_id: user?.id });
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
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                <Grid item xs={6}>
                  <Typography
                    color="textPrimary"
                    variant="h3"
                    data-cy="Welcome"
                  >
                    {t("Welcome", {
                      name: user ? user.given_name : "",
                    })}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    sx={{ mt: 2 }}
                    align="justify"
                    data-cy="Welcome-description"
                  >
                    {t(
                      "Welcome to the INTERLINK platform, a collaborative enviroment where PAs, citizens, and other actors can collaborate to develop their projects, which we will call co-production processes."
                    )}
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ mt: 3 }}
                    data-cy="first-question-title"
                  >
                    {t(
                      "1. Have you been invited to a process that hasn’t started yet?"
                    )}
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="body1"
                    sx={{ mt: 2, mb: 2 }}
                    align="justify"
                    data-cy="first-question-description"
                  >
                    {t(
                      "During the waiting, Check our video tutorial to discover the platform functionalities."
                    )}
                  </Typography>

                  <Button
                    sx={{ minWidth: "200px" }}
                    href="docs/en/"
                    variant="contained"
                    data-cy="check-tutorials"
                  >
                    Check tutorials
                  </Button>

                  <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ mt: 3 }}
                    data-cy="second-question-title"
                  >
                    {t("2. Do you want to see your projects ?")}
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="body1"
                    sx={{ mt: 2, mb: 2 }}
                    align="justify"
                    data-cy="second-question-description"
                  >
                    {t(
                      "If you just created your project or you have been invited to a project, check to your co-production processes list."
                    )}
                  </Typography>

                  <Button
                    sx={{ minWidth: "200px" }}
                    variant="contained"
                    href="dashboard/projects"
                    data-cy="go-to-processes-list"
                  >
                    Go to processes list
                  </Button>

                  <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ mt: 3 }}
                    data-cy="third-question-title"
                  >
                    {t("3. Do you want to create your own process?")}
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="body1"
                    sx={{ mt: 2, mb: 2 }}
                    data-cy="third-question-description"
                  >
                    {t(
                      "We will guide you helping to manage your group. You will find an archive dedicated to shared resources, a structured schema for the process, etc."
                    )}
                  </Typography>

                  <Button
                    sx={{ minWidth: "200px" }}
                    onClick={() => setCoproductionProcessCreatorOpen(true)}
                    variant="contained"
                    data-cy="start-here-your-guide"
                  >
                    Start here your guide
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    component="img"
                    sx={{
                      //height: 233,
                      //width: 350,
                      //maxHeight: { xs: 233, md: 167 },
                      //maxWidth: 100%,
                      minWidth: "500",
                      width: "100vh",
                    }}
                    alt="welcome graph."
                    data-cy="welcome-dashboard-illustration"
                    src="/coproduction/static/coproductionprocesses/Illustration.png"
                  />
                </Grid>
              </Grid>
            </Grid>
          </AuthGuardSkeleton>
        </Container>
        <CoproductionprocessCreate
          open={coproductionProcessCreatorOpen}
          setOpen={setCoproductionProcessCreatorOpen}
          loading={coproductionProcessLoading}
          setLoading={setCoproductionProcessLoading}
          onCreate={onProcessCreate}
        />
      </Box>
    </>
  );
};

export default MyWorkspace;
