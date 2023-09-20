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
import CookieConsentForm from "./CookieConsentForm";

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
                      "Welcome to the INTERLINK platform"
                    )+'.'}
                  </Typography>

                  <Typography
                    color="textPrimary"
                    variant="h6"
                    sx={{ mt: 3 }}
                    data-cy="first-question-title"
                  >
                    {'1. '+t(
                      "Have you been invited"
                    )+"?"}
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="body1"
                    sx={{ mt: 2, mb: 2 }}
                    align="justify"
                    data-cy="first-question-description"
                  >
                    {t(
                      "During the waiting"
                    )+'.'}
                  </Typography>

                  <Button
                    sx={{ minWidth: "200px" }}
                    href="docs/en/"
                    variant="contained"
                    data-cy="check-tutorials"
                  >
                    {t(
                      "Check tutorials"
                    )}
                    
                  </Button>

                  <Typography
                    color="textPrimary"
                    variant="h6"
                    sx={{ mt: 3 }}
                    data-cy="second-question-title"
                  >
                    {'2. '+
                    t("Do you want to see your co")
                    +' ?'}
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="body1"
                    sx={{ mt: 2, mb: 2 }}
                    align="justify"
                    data-cy="second-question-description"
                  >
                    {t(
                      "If you have just created a process or have been invited to participate"
                    )}
                  </Typography>

                  <Button
                    sx={{ minWidth: "200px" }}
                    variant="contained"
                    href="dashboard/projects"
                    data-cy="go-to-processes-list"
                  >
                    {t(
                    "Go to processes list"
                    )}
                  </Button>

                  <Typography
                    color="textPrimary"
                    variant="h6"
                    sx={{ mt: 3 }}
                    data-cy="third-question-title"
                  >
                    {'3. '+
                    t("Do you want to create your own process")
                    +' ?'}
                  
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="body1"
                    sx={{ mt: 2, mb: 2 }}
                    data-cy="third-question-description"
                  >
                    {t(
                      "We will guide you helping to manage your group"
                    )+'.'}
                  </Typography>

                  <Button
                    sx={{ minWidth: "200px" }}
                    onClick={() => setCoproductionProcessCreatorOpen(true)}
                    variant="contained"
                    data-cy="start-here-your-guide"
                  >
                    {t(
                    "Start here your guide"
                    )}
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
                    src="/static/guide/Illustration.png"
                  />
                </Grid>
              </Grid>
            </Grid>
            <CookieConsentForm/>
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
