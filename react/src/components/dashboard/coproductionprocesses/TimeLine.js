import {
  Grid,
  Alert,
  Box,
  Button,
  Dialog,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Fab,
} from "@mui/material";
import CreateSchema from "components/dashboard/SchemaSelector";
import RoadmapCustomized from "components/home/RoadmapCustomized";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import useAuth from "hooks/useAuth";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function TimeLine({ assets }) {
  const { process, hasSchema, tree } = useSelector((state) => state.process);
  const { user } = useAuth();
  const t = useCustomTranslation(process.language);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dataFulfilled = process.aim || process.idea || process.challenges;
  const administratorsFulfilled = process.administrators_ids.length > 1;
  const permissionsFullfilled = process.enabled_permissions.length >= 1;
  const newAssetsFullfilled = assets.length >= 1;

  function nextSect(e) {
    e.preventDefault();
    alert("you click next section.");
  }

  return (
    <>
      <Box sx={{  justifyContent: "center"/* ml: "30em", , position: "fixed" */ }}>
        {/* <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ m: 2 }}>
              Roadmap
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <RoadmapCustomized />
          </Grid>
        </Grid> */}
      </Box>
      <Box sx={{ mt: 10, p: 2, justifyContent: "center" }}>
        <Stepper
          nonLinear
          activeStep={0}
          orientation="vertical"
          sx={{ mx: 2, mt: 2 }}
        >
          {/* <Step
            active
            completed={!!dataFulfilled}
            sx={{
              "& .MuiStepLabel-iconContainer": {
                alignSelf: "baseline",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "2.5rem",
              },
            }}
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "65vh" }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      {t("Organizations and Teams")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t(
                        "Ok firstly, if you haven't done so before, create your own organization and teams for your project. take into account that if you select your organization as public, it will be visible to all users of the platform. So once you created your organization, you will find inside it a button to create teams."
                      )}
                    </Typography>

                    <Button
                      onClick={() =>
                        navigate(
                          `/dashboard/coproductionprocesses/${process.id}/settings`
                        )
                      }
                      size="small"
                      variant="contained"
                      sx={{ maxWidth: "200px" }}
                    >
                      {t("Go to organizations")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <img src="/coproduction/static/images/overview_step1.svg"></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <Fab
                      size="medium"
                      color="primary"
                      aria-label="next"
                      onClick={nextSect}
                    >
                      <ArrowDownwardIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          <Step active completed={!!dataFulfilled}>
            <StepLabel>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  {t("Set coproduction process data")}
                </Typography>
                {dataFulfilled ? (
                  <Alert severity="success">
                    {t("The coproduction process data has been defined.")}
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t(
                      "The co-production process data are a set of attributes that serve to define the process to be carried out."
                    )}
                  </Alert>
                )}
                <Button
                  onClick={() =>
                    navigate(
                      `/dashboard/coproductionprocesses/${process.id}/settings`
                    )
                  }
                  size="small"
                  variant="contained"
                  sx={{ maxWidth: "200px" }}
                >
                  {t("Go to settings section")}
                </Button>
              </Stack>
            </StepLabel>
          </Step>

          <Step active completed={administratorsFulfilled}>
            <StepLabel>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  [{t("OPTIONAL")}]
                  {t("Set coproduction process administrators")}
                </Typography>
                {administratorsFulfilled ? (
                  <Alert severity="success">
                    {t(
                      "The administrators of the coproduction process data has been defined."
                    )}{" "}
                    ({process.administrators_ids.length} {t("administrators")})
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t(
                      "Administrators can update the coproduction proccess information, add permissions to the tree items or add new administrators"
                    )}
                  </Alert>
                )}
                <Button
                  onClick={() =>
                    navigate(
                      `/dashboard/coproductionprocesses/${process.id}/settings`
                    )
                  }
                  size="small"
                  variant="contained"
                  sx={{ maxWidth: "200px" }}
                >
                  {t("Go to settings section")}
                </Button>
              </Stack>
            </StepLabel>
          </Step>

          <Step active completed={hasSchema}>
            <StepLabel>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  {t("Select the coproduction schema")}
                </Typography>
                {hasSchema ? (
                  <Alert severity="success">
                    {t(
                      "The schema has been selected. Now you can access the Guide and the Workplan sections. Nevertheless, you can undo this action (clear the coproduction tree) in the settings section."
                    )}
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t(
                      "The schemas are used to create the initial phases, tasks and objectives of the co-production process. From there, the resulting co-production tree can be freely modified. Click on the button and search for the optimal coproduction schema for your process."
                    )}
                  </Alert>
                )}
                {!hasSchema && (
                  <Button
                    disabled={process.creator_id !== user.id}
                    onClick={handleClickOpen}
                    size="small"
                    variant="contained"
                    sx={{ maxWidth: "200px" }}
                  >
                    {t("Select an schema")}
                  </Button>
                )}
              </Stack>
            </StepLabel>
          </Step>
          <Step active completed={permissionsFullfilled}>
            <StepLabel>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  {t(
                    "Grant permissions over process to co-producer teams and start co-producing through Guide view"
                  )}
                </Typography>
                {permissionsFullfilled ? (
                  <Alert severity="success">
                    {t("At least a permission has been created.")}
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t(
                      "Now you can allow teams to work on the coproduction process. For that, associate permissions to teams by navigating to the Team view and adding permission for the whole coproduction process or go to Guide view and add new permissions for distinct tree items and teams."
                    )}
                  </Alert>
                )}
                {!permissionsFullfilled && (
                  <Button
                    disabled={!hasSchema}
                    onClick={() =>
                      navigate(
                        `/dashboard/coproductionprocesses/${process.id}/guide`
                      )
                    }
                    size="small"
                    variant="contained"
                    sx={{ maxWidth: "400px" }}
                  >
                    {t("Grant permissions to teams in the guide section")}
                  </Button>
                )}
              </Stack>
            </StepLabel>
          </Step>
          <Step active completed={newAssetsFullfilled}>
            <StepLabel>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  {t("[OPTIONAL]Add new resources to the coproduction process")}
                </Typography>
                {newAssetsFullfilled ? (
                  <Alert severity="success">
                    {t("At least a resource has been created.")}
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t(
                      "Now you can add resources to the tasks in the coproduction process. For that, navigate to the Guide section and add new resources in the Resources tab available in each task"
                    )}
                  </Alert>
                )}
                {!newAssetsFullfilled && (
                  <Button
                    disabled={!hasSchema}
                    onClick={() =>
                      navigate(
                        `/dashboard/coproductionprocesses/${process.id}/guide`
                      )
                    }
                    size="small"
                    variant="contained"
                    sx={{ maxWidth: "400px" }}
                  >
                    {t("Add an resource in the guide section")}
                  </Button>
                )}
              </Stack>
            </StepLabel>
          </Step>
        </Stepper>

        {!hasSchema && process.creator_id === user.id && (
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
            <Box sx={{ minHeight: "93vh" }}>
              <CreateSchema />
            </Box>
          </Dialog>
        )}
      </Box>
    </>
  );
}
