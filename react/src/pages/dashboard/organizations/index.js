import { Box, Container, Grid, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import useAuth from "hooks/useAuth";
import useMounted from "hooks/useMounted";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizations, getUnseenUserNotifications } from "slices/general";
import { cleanProcess } from "slices/process";
import OrganizationCreate from "components/dashboard/organizations/OrganizationCreate";
import OrganizationProfile from "components/dashboard/organizations/OrganizationProfile";
import OrganizationsList from "components/dashboard/organizations/OrganizationsList";
import TeamProfile from "components/dashboard/organizations/TeamProfile";

const Organizations = () => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = React.useState("");
  const { organizations, loadingOrganizations } = useSelector(
    (state) => state.general
  );
  const [organizationCreatorOpen, setOrganizationCreatorOpen] =
    React.useState(false);
  const [organizationLoading, setOrganizationLoading] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState(null);

  const dispatch = useDispatch();
  const mounted = useMounted();

  const { user, isAuthenticated } = useAuth();

  const getOrganizationsData = React.useCallback(
    async (search) => {
      dispatch(getOrganizations(search));
    },
    [mounted]
  );

  React.useEffect(() => {
    let delayDebounceFn;
    if (mounted.current) {
      delayDebounceFn = setTimeout(
        () => {
          getOrganizationsData(searchValue);
        },
        searchValue ? 800 : 0
      );
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [getOrganizationsData, searchValue]);

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

  React.useEffect(() => {
    let delayDebounceFn;
    if (mounted.current && isAuthenticated) {
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

  const updateOrganizations = (res) => {
    setSearchValue("");
    getOrganizationsData("");
  };

  return (
    <>
      <Helmet>
        <title>{t("organizations-title")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 5,
          px: 1,
        }}
      >
        <OrganizationCreate
          open={organizationCreatorOpen}
          setOpen={setOrganizationCreatorOpen}
          loading={organizationLoading}
          setLoading={setOrganizationLoading}
          onCreate={updateOrganizations}
        />
        <Container maxWidth="lg">
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
                  {t("Organizations")}
                </Typography>
                <Typography color="textPrimary" variant="h5">
                  {t("Organizations and teams present in the platform")}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  {t(
                    "Here you can find the different organizations that are working on the platform"
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <LoadingButton
                  onClick={() => setOrganizationCreatorOpen(true)}
                  disabled={!isAuthenticated}
                  loading={loadingOrganizations}
                  fullWidth
                  variant="contained"
                  sx={{ textAlign: "center", mt: 1, mb: 2 }}
                  startIcon={<Add />}
                  size="small"
                  data-cy="create-new-organization"
                >
                  {t("Create new organization")}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
          {selectedTeam && (
            <TeamProfile
              teamId={selectedTeam.id}
              open={!!selectedTeam}
              setOpen={setSelectedTeam}
              onChanges={updateOrganizations}
              organizations={organizations}
            />
          )}
          <Box sx={{ mt: 4 }}>
            <OrganizationsList
              getCollapseElement={(organization) => (
                <OrganizationProfile
                  organizationId={organization.id}
                  onChanges={updateOrganizations}
                  onTeamClick={setSelectedTeam}
                />
              )}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              organizations={organizations}
              loading={loadingOrganizations}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Organizations;
