import {
  IconButton,
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
} from "@mui/material";
import CreateSchema from "components/dashboard/SchemaSelector";
import RoadmapCustomized from "components/home/RoadmapCustomized";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import useAuth from "hooks/useAuth";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles"
import StepConnector, {
  stepConnectorClasses
} from "@mui/material/StepConnector"
import { relativeTimeRounding } from "moment";


const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 1
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#187595"
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#0f97c7"
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: "160px",
    width:2,
    position:"relative",
    top:"-350px",
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1
  }
}))


/* function MyStepSection({
  dataFulfilled,
  title,
  subtitle,
  linktoPage,
  picturePath,
  pictureSize,
  sectionName,
  nextSectName,
}) {
  const { process, hasSchema, tree } = useSelector((state) => state.process);
  const t = useCustomTranslation(process.language);
  const navigate = useNavigate();

  function nextSect(nextSectName) {
    const section = document.querySelector("#" + nextSectName);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Step
      completed={!!dataFulfilled}
      sx={{
        "& .MuiStepLabel-iconContainer": {
          alignSelf: "baseline",
        },
        "& .MuiSvgIcon-root": {
          fontSize: "2.5rem",
        },
      }}
      id={sectionName}
    >
      <StepLabel>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ minHeight: "55vh" }}>
            <Stack spacing={1}>
              <Typography variant="h6">{t(title)}</Typography>

              <Typography variant="subtitle1">{t(subtitle)}</Typography>

              <Button
                onClick={() => navigate({ linktoPage })}
                size="small"
                variant="contained"
                sx={{ maxWidth: "200px" }}
              >
                {t("Go to organizations")}
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <img src={picturePath} height={pictureSize} alt="" />
          </Grid>

          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <IconButton
                onClick={() => nextSect(nextSectName)}
                color="primary"
                sx={{ border: "1px" }}
                variant="outlined"
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </StepLabel>
    </Step>
  );
} */

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

  function nextSect(nextSectionNum) {
    const section = document.querySelector("#" + nextSectionNum);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const completeStates = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const selectedStepIndex = 1;

  return (
    <>
      {/* <Box sx={{ justifyContent: "center", position: "sticky" }}>
        <Grid
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
            <RoadmapCustomized
              completeStates={completeStates}
              selectedStateIndex={selectedStepIndex}
            />
          </Grid>
        </Grid>
      </Box> */}
      <Box sx={{ mt: 1, p: 2, justifyContent: "center" }}>
        <Stepper
          nonLinear
          activeStep={0}
          orientation="vertical"
          sx={{ mx: 2, mt: 2 }}
          // connector={<ColorlibConnector />}
        >
          {/* Step 1 */}
          {/* <MyStepSection
            title="Organizations and Teams"
            subtitle="Ok firstly, if you haven't done so before, create your own organization and teams for your project. take into account that if you select your organization as public, it will be visible to all users of the platform. So once you created your organization, you will find inside it a button to create teams."
            dataFulfilled={dataFulfilled}
            linktoPage={`/dashboard/organizations`}
            sectionName="section_1"
            nextSectName="section_2"
            picturePath="/coproduction/static/images/overview_step1.svg"
            pictureSize="450px"
          /> */}

{/*           <Step
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
            id="section_1"
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "55vh" }}>
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
                      onClick={() => navigate(`/dashboard/organizations`)}
                      size="small"
                      variant="contained"
                      sx={{ maxWidth: "200px" }}
                    >
                      {t("Go to organizations")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <img
                    src="/coproduction/static/images/overview_step1.svg"
                    height="400vw"
                  ></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => nextSect("section_2")}
                      color="primary"
                      sx={{ border: "1px" }}
                      variant="outlined"
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          {/* Step 2 */}
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
            id={"section_2"}
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      {t("Set coproduction data and administrator")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t(
                        "The coproduction process data are a set of attributes that serve to define the process to be carried out. At this point you will describe the aim of the project, challenges, which is the organization of the project etc. Than you can also set others administrators for the project [OPTIONAL]. They can update the co-production process information, add permissions to the tree items or add new administrators."
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
                      {t("Go to settings section")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <img
                    src="/coproduction/static/images/overview_step2.svg"
                    height="350vw"
                  ></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => nextSect("section_3")}
                      color="primary"
                      sx={{ border: "1px" }}
                      variant="outlined"
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          {/* Step 3 */}
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
            id={"section_3"}
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      {t("What is your project?")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t(
                        "Every co-production process has particular characteristics and consequently each one has a specific schema to be followed. To help you in the selection of the schema (next step), you can tell us which type of co-production process you are going to do. Click on the button to select some keywords and we will help you to select the right type of coproduction process."
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
                      {t("Decide your type of co-production process")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <img
                    src="/coproduction/static/images/overview_step3.svg"
                    height="400vw"
                  ></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => nextSect("section_4")}
                      color="primary"
                      sx={{ border: "1px" }}
                      variant="outlined"
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          {/* Step 4 */}
         {/*  <Step
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
            id={"section_4"}
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      {t("Select the coproduction schema")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t(
                        "The schemas give to the user some directives on how to proceed in the overall process. Phases, objectives and tasks of the co-production process. Click on the button and search for the optimal coproduction schema for your process. Nevertheless, you can undo this action (clear the coproduction tree) in the settings section."
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
                      {t("Select a Schema")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <img
                    src="/coproduction/static/images/overview_step4.svg"
                    height="330vw"
                  ></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => nextSect("section_5")}
                      color="primary"
                      sx={{ border: "1px" }}
                      variant="outlined"
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          {/* Step 5 */}
         {/*  <Step
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
            id={"section_5"}
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      {t("Give rewards to your collaborators")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t(
                        "If you want to incentivize your collaborators to do their best, try our reward system. If you active this function, you will be able to set the difficulty of each task. At the end of the task you will have to decide the level of contribute of each collaborator that will give him a reward. The reward system needs to be connected with an external portal of vouchers so that the collaborator can take his reward. Click on the button, check how it works and decide if you want to active this function."
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
                      {t("Go tot he reward system tutorial")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <img
                    src="/coproduction/static/images/overview_step5.svg"
                    height="410vw"
                  ></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => nextSect("section_6")}
                      color="primary"
                      sx={{ border: "1px" }}
                      variant="outlined"
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          {/* Step 6 */}
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
            id={"section_6"}
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      {t("Set coproduction data and administrator")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t(
                        "The coproduction process data are a set of attributes that serve to define the process to be carried out. At this point you will describe the aim of the project, challenges,which is the organization of the project etc. Than you can also set others administrators for the project [OPTIONAL]. They can update the co-production process information, add permissions to the tree items or add new administrators."
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
                      {t("Grant permissions to the overall process in the Team section")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <img
                    src="/coproduction/static/images/overview_step6.png"
                    height="410vw"
                  ></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => nextSect("section_7")}
                      color="primary"
                      sx={{ border: "1px" }}
                      variant="outlined"
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          {/* Step 7 */}
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
            id={"section_7"}
          >
            <StepLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">
                      {t("Set coproduction data and administrator")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t(
                        "The coproduction process data are a set of attributes that serve to define the process to be carried out. At this point you will describe the aim of the project, challenges,which is the organization of the project etc. Than you can also set others administrators for the project [OPTIONAL]. They can update the co-production process information, add permissions to the tree items or add new administrators."
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
                      {t("Go to Resources section")}
                    </Button>
                  </Stack>
                </Grid>
                <Grid   item xs={6} >
                  <img
                    src="/coproduction/static/images/overview_step7.svg"
                    height="450vw"
                  ></img>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => nextSect("section_8")}
                      color="primary"
                      sx={{ border: "1px" }}
                      variant="outlined"
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </StepLabel>
          </Step> */}

          {/* Step 8 */}
         {/*  <Step
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
            id={"section_8"}
          >
            <StepLabel>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Typography variant="h3" >
                    {t("Well done! You're ready to start")}
                  </Typography>

                  <Typography variant="subtitle1" >
                    {t(
                      "You completed all the preliminar phases and now you're ready to start your job using the Guide section."
                    )}
                  </Typography>
                  <Typography variant="subtitle1">
                    {t(
                      "Good luck for your process and remember, work inclusive."
                    )}
                  </Typography>

                  
                </Grid>
                <Grid item>
                  <img
                    src="/coproduction/static/images/overview_step8.svg"
                    height="450px"
                  ></img>
                </Grid>

                <IconButton
                  onClick={() => nextSect("section_1")}
                  color="primary"
                  sx={{ border: "1px" }}
                  variant="outlined"
                >
                  <ArrowUpwardIcon />
                </IconButton>
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
                    {t("The coproduction process data has been defined")}
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t("The co-production process data")}
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
                      "The administrators of the coproduction process data has been defined"
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
                    {t("The schema has been selected")}
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
                    {t("At least a permission has been created")}
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t("Now you can allow teams to work on the coproduction")}
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
          <Step active completed={newAssetsFullfilled} id={"last_step"}>
            <StepLabel>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  {t("[OPTIONAL]Add new resources to the coproduction process")}
                </Typography>
                {newAssetsFullfilled ? (
                  <Alert severity="success">
                    {t("At least a resource has been created")}
                  </Alert>
                ) : (
                  <Alert severity="info">
                    {t(
                      "Now you can add resources to the tasks in the coproduction process"
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
