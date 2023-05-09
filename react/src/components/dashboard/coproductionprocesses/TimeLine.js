import {
  IconButton,
  Grid,
  Alert,
  Box,
  Button,
  Dialog,
  Link,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CreateSchema from "components/dashboard/SchemaSelector";
import RoadmapCustomized from "components/home/RoadmapCustomized";
import Lightbox from "../../../components/Lightbox";
import RewardSettings from "../../../pages/dashboard/coproductionprocesses/Tabs/Settings/RewardSettings";

import useAuth from "hooks/useAuth";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import * as React from "react";

import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import SelectTypeCoproProcess from "./SelectTypeCoproProcess";
import { updateProcess } from "slices/process";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowForward,
  Groups,
  Construction,
  Build,
  MilitaryTech,
  BusinessCenter,
  Widgets,
  DataSaverOff,
  Flag,
  ArrowBack,
} from "@mui/icons-material";
import Organizations from "pages/dashboard/organizations";
import OrganizationsDialog, {OganizationsDialog} from "pages/dashboard/organizations/indexDialog"
import { LoadingButton } from "@mui/lab";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 1,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#187595",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#0f97c7",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: "160px",
    width: 2,
    position: "relative",
    top: "-350px",
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

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
    <React.Fragment>
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
    </React.Fragment>
  );
} */

export default function TimeLine({ assets }) {
  const { process, hasSchema, tree } = useSelector((state) => state.process);
  const { user } = useAuth();
  const t = useCustomTranslation(process.language);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [openOrganizations,setOpenOrganizations] = React.useState(false);
  const [roadItemIndex, setRoadItemIndex] = React.useState("section_1");
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isRewardingAtivated, setIsRewardingAtivated] = React.useState(false);

  const [selectorTypeOpen, setSelectorTypeOpen] = React.useState(false);
  const [selectorTypeLoading, setSelectorTypeLoading] = React.useState(false);

  const handleOpenLightbox = () => {
    if (!isRewardingAtivated) {
      setIsLightboxOpen(true);
    }
    if (isRewardingAtivated) {
      setIsRewardingAtivated(!isRewardingAtivated);
    }
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
    //alert("Open Schema Selector");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseOrganizations = () => {
    setOpenOrganizations(false);
  };

  const openGSelector = () => {
    setOpenGovernanceSelector(true);
  };

  const dataFulfilled = process.aim || process.idea || process.challenges;
  const administratorsFulfilled = process.administrators_ids.length > 1;
  const permissionsFullfilled = process.enabled_permissions.length >= 1;
  const newAssetsFullfilled = assets.length >= 1;

  function nextSect(nextSectionNum) {
    // const section = document.querySelector("#" + nextSectionNum);
    // section.scrollIntoView({ behavior: "smooth", block: "start" });
    showSection(nextSectionNum);
  }

  function showSection(sectionNum) {
    setRoadItemIndex(sectionNum);
    //alert("Muestra el index: " + sectionNum);
  }

  const setHideguidechecklist = async () => {
    const values = { hideguidechecklist: true };
    if (hasSchema) {
      try {
        dispatch(
          updateProcess({
            id: process.id,
            data: values,
            logotype: false,
            onSuccess: false,
          })
        );
      } catch (err) {
        console.error(err);
      }
      navigate("/dashboard/coproductionprocesses/" + process.id + "/profile");
    } else {
      alert(
        "It is not possible to hide the guide before selecting the scheme."
      );
    }
  };

  const setHasAddAnOrganization = async () => {
    const values = { hasAddAnOrganization: true };
    try {
      dispatch(
        updateProcess({
          id: process.id,
          data: values,
          logotype: false,
          onSuccess: false,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const setSkipResourcesStep = async () => {
    const values = { skipResourcesStep: true };
    try {
      dispatch(
        updateProcess({
          id: process.id,
          data: values,
          logotype: false,
          onSuccess: false,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const temp_completeStates = [
    process.hasAddAnOrganization, //Has Organizations? He decide!.
    !!dataFulfilled || administratorsFulfilled,
    process.intergovernmental_model!=null, //Did you decide the type (If has a schema it means it has a type)
    hasSchema,
    process.incentive_and_rewards_state, //Have you active the rewards?
    permissionsFullfilled, //Have you grant permissions to a team in all process?
    process.skipResourcesStep || newAssetsFullfilled,
  ];

  let checker = (arr) => arr.every((v) => v === true);
  const hasCompletedAll = checker(temp_completeStates);

  const completeStates = [
    process.hasAddAnOrganization, //Has Organizations? He decide!.
    !!dataFulfilled || administratorsFulfilled,
    process.intergovernmental_model!=null, //Did you decide the type (If has a schema it means it has a type)
    hasSchema,
    process.incentive_and_rewards_state, //Have you active the rewards?
    permissionsFullfilled, //Have you grant permissions to a team in all process?
    process.skipResourcesStep || newAssetsFullfilled,
    hasCompletedAll, //Has Finish
  ];

  const selectedStepIndex = null;

  return (
    <>
      <Box id="section_0" sx={{ justifyContent: "center", position: "sticky" }}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ m: 2 }}>
              {t("Roadmap")}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <RoadmapCustomized
              completeStates={completeStates}
              selectedStateIndex={selectedStepIndex}
              onClick={showSection}
            />
          </Grid>
        </Grid>
      </Box>
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
            picturePath="/coproduction/static/guide/overview_step1.svg"
            pictureSize="450px"
          /> */}

          {roadItemIndex == "section_1" && (
            <Step
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
              <StepLabel StepIconComponent={Groups}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        {t("Organizations and Teams")}
                      </Typography>

                      <Typography variant="subtitle1">
                        {t("Ok firstly- if you")}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={2}
                      >
                        <Button
                          onClick={() => setOpenOrganizations(true)}
                          size="small"
                          variant="contained"
                          sx={{ maxWidth: "200px" }}
                        >
                          {t("Go to organizations")}
                        </Button>
                        <Link href="#" onClick={setHasAddAnOrganization}>
                          {t("already done")}
                        </Link>
                      </Stack>
                    </Stack>

                    <IconButton
                      onClick={() => nextSect("section_2")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="/static/guide/overview_step1.svg"
                      height="400vw"
                    ></img>
                  </Grid>

                  {/*                   <Grid
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
                  </Grid> */}
                </Grid>
              </StepLabel>
            </Step>
          )}

          {/* Step 2 */}
          {roadItemIndex == "section_2" && (
            <Step
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
              <StepLabel StepIconComponent={DataSaverOff}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        {t("Set coproduction data and administrator")}
                      </Typography>

                      <Typography variant="subtitle1">
                        {t(
                          "The coproduction process data are a set of attributes that serve to define the process to be carried out"
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
                    <IconButton
                      onClick={() => nextSect("section_1")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={() => nextSect("section_3")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="/static/guide/overview_step2.svg"
                      height="350vw"
                    ></img>
                  </Grid>

                  {/*  <Grid
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
                  </Grid> */}
                </Grid>
              </StepLabel>
            </Step>
          )}

          {/* Step 3 */}
          {roadItemIndex == "section_3" && (
            <Step
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
              <StepLabel StepIconComponent={Construction}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        {t("What is your project") + "?"}
                      </Typography>

                      <Typography variant="subtitle1">
                        {t("Every co-production process has particular") + "."}
                      </Typography>

                      {process.intergovernmental_model!=null ? (
                        <Alert severity="success">
                          {t(
                            "You have already defined the type of co-production process"
                          )+': '+process.intergovernmental_model}
                        </Alert>
                      ) : (
                        <Button
                         onClick={() => {
                           setSelectorTypeOpen(true);
                         }}
                         size="small"
                         variant="contained"
                         sx={{ maxWidth: "200px" }}
                       >
                         {t("Decide your type of co-production process")}
                       </Button>
                      )}
                      

                     
                    </Stack>
                    <IconButton
                      onClick={() => nextSect("section_2")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={() => nextSect("section_4")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="/static/guide/overview_step3.svg"
                      height="400vw"
                    ></img>
                  </Grid>

                  {/* <Grid
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
                  </Grid> */}
                </Grid>
              </StepLabel>
            </Step>
          )}

          {/* Step 4 */}

          {roadItemIndex == "section_4" && (
            <Step
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
              <StepLabel StepIconComponent={Build}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        {t("Select the coproduction schema")}
                      </Typography>

                      <Typography variant="subtitle1">
                        {t("The schemas give to the user some directives")}
                      </Typography>

                      {hasSchema ? (
                        <Alert severity="success">
                          {t(
                            "The schema has already been selected for this process"
                          )}
                        </Alert>
                      ) : (
                        <></>
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
                    <IconButton
                      onClick={() => nextSect("section_3")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={() => nextSect("section_5")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="/static/guide/overview_step4.svg"
                      height="330vw"
                    ></img>
                  </Grid>

                  {/*  <Grid
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
                  </Grid> */}
                </Grid>
              </StepLabel>
            </Step>
          )}

          {/* Step 5 */}
          {roadItemIndex == "section_5" && (
            <Step
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
              <StepLabel StepIconComponent={MilitaryTech}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        {t("Give rewards to your collaborators")}
                      </Typography>

                      <Typography variant="subtitle1">
                        {t(
                          "If you want to incentivize your collaborators to do their best"
                        )}
                      </Typography>

                      <Button
                        onClick={() => handleOpenLightbox()}
                        size="small"
                        variant="contained"
                        sx={{ maxWidth: "200px" }}
                      >
                        {t("Go to the reward system tutorial")}
                      </Button>
                    </Stack>
                    <IconButton
                      onClick={() => nextSect("section_4")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={() => nextSect("section_6")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="/static/guide/overview_step5.svg"
                      height="410vw"
                    ></img>
                  </Grid>

                  {/* <Grid
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
                  </Grid> */}
                </Grid>
              </StepLabel>
            </Step>
          )}

          {/* Step 6 */}

          {roadItemIndex == "section_6" && (
            <Step
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
              <StepLabel StepIconComponent={BusinessCenter}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        {t("Grant permissions to Teams over the process")}
                      </Typography>

                      <Typography variant="subtitle1">
                        {t(
                          "Now you can allow teams to work on the coproduction process"
                        )}
                      </Typography>

                      <Button
                        onClick={() =>
                          navigate(
                            `/dashboard/coproductionprocesses/${process.id}/team`
                          )
                        }
                        size="small"
                        variant="contained"
                        sx={{ maxWidth: "200px" }}
                      >
                        {t(
                          "Grant permissions to the overall process in the Team section"
                        )}
                      </Button>
                    </Stack>
                    <IconButton
                      onClick={() => nextSect("section_5")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={() => nextSect("section_7")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="/static/guide/overview_step6.png"
                      height="410vw"
                    ></img>
                  </Grid>

                  {/* <Grid
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
                  </Grid> */}
                </Grid>
              </StepLabel>
            </Step>
          )}

          {/* Step 7 */}

          {roadItemIndex == "section_7" && (
            <Step
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
              <StepLabel StepIconComponent={Widgets}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ minHeight: "55vh" }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        {t("Your Interlinkers-Resources")}
                      </Typography>

                      <Typography variant="subtitle1">
                        {t("Once you add a resource to a tree element")}
                      </Typography>

                      {dataFulfilled ? (
                        <Alert severity="success">
                          {t("The coproduction process data has been defined")}
                        </Alert>
                      ) : (
                        <></>
                      )}

                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={2}
                      >
                        <Button
                          onClick={() =>
                            navigate(
                              `/dashboard/coproductionprocesses/${process.id}/resources`
                            )
                          }
                          size="small"
                          variant="contained"
                          sx={{ maxWidth: "200px" }}
                        >
                          {t("Go to Resources section")}
                        </Button>
                        <Link href="#" onClick={setSkipResourcesStep}>
                          {t("or just skip")}
                        </Link>
                      </Stack>
                    </Stack>
                    <IconButton
                      onClick={() => nextSect("section_6")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={() => nextSect("section_8")}
                      color="primary"
                      sx={{ border: "1px", mt: 2 }}
                      variant="outlined"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="/static/guide/overview_step7.svg"
                      height="450vw"
                    ></img>
                  </Grid>

                  {/*  <Grid
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
                  </Grid> */}
                </Grid>
              </StepLabel>
            </Step>
          )}

          {/* Step 8 */}
          {roadItemIndex == "section_8" && (
            <Step
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
              <StepLabel StepIconComponent={Flag}>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Typography variant="h3">
                      {t("Well done-Youre ready to start")}
                    </Typography>

                    <Typography variant="subtitle1">
                      {t("You completed all the preliminar phases")}
                    </Typography>
                    <Typography variant="subtitle1">
                      {t(
                        "Good luck for your process and remember, work inclusive"
                      )}
                    </Typography>
                  </Grid>

                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                  >
                    <Button
                      onClick={() =>
                        navigate(
                          `/dashboard/coproductionprocesses/${process.id}/guide`
                        )
                      }
                      variant="contained"
                      sx={{ maxWidth: "500px", mt: 2 }}
                    >
                      {t("Go to guide section and start your job")}
                    </Button>
                    <Link href="#" onClick={setHideguidechecklist}>
                      {t("Hide this guide")}
                    </Link>
                  </Stack>

                  <Grid item>
                    <img
                      src="/static/guide/overview_step8.svg"
                      height="450px"
                    ></img>
                  </Grid>
                </Grid>
              </StepLabel>
            </Step>
          )}
          {isLightboxOpen && (
            <Lightbox onClose={handleCloseLightbox}>
              <RewardSettings
                onClose={handleCloseLightbox}
                activateReward={() => {
                  setIsRewardingAtivated(true);
                }}
              />
            </Lightbox>
          )}

          {/* <Step active completed={!!dataFulfilled}>
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
          </Step> */}
        </Stepper>

        {!hasSchema && process.creator_id === user.id && (
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
            <Box sx={{ minHeight: "93vh" }}>
              <CreateSchema />
            </Box>
          </Dialog>
        )}
      </Box>

      <SelectTypeCoproProcess
        open={selectorTypeOpen}
        setOpen={setSelectorTypeOpen}
        loading={selectorTypeLoading}
        setLoading={setSelectorTypeLoading}
      />

        <Dialog key='dialogOrg' open={openOrganizations} onClose={handleCloseOrganizations} fullWidth maxWidth="xl">
            
        <DialogTitle sx={{ textAlign: "center", m: 2 }}>
          {t("Organizations")}
        </DialogTitle>
        <DialogContent dividers>
            <Box sx={{ minHeight: "93vh" }}>
         
              <OrganizationsDialog />
            </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
          <Button
         
            onClick={handleCloseOrganizations}
          >
            {t("Close")}
            
          </Button>
        </DialogActions>
          </Dialog> 
    </>
  );
}
