import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StepLabel from "@mui/material/StepLabel";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import ConstructionIcon from "@mui/icons-material/Construction";
import BuildIcon from "@mui/icons-material/Build";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import WidgetsIcon from "@mui/icons-material/Widgets";
import FlagIcon from "@mui/icons-material/Flag";
import GroupsIcon from "@mui/icons-material/Groups";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
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
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 35,
  height: 35,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    background: "#187595",
  }),
  ...(ownerState.completed && {
    background: "#0f97c7",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <GroupsIcon />,
    2: <DataSaverOffIcon />,
    3: <ConstructionIcon />,
    4: <BuildIcon />,
    5: <MilitaryTechIcon />,
    6: <BusinessCenterIcon />,
    7: <WidgetsIcon />,
    8: <FlagIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

//const steps = [false, false, false, false, false, false, false, false]

export default function CustomizedSteppers(props) {
  const steps = props.completeStates;
  const activeStep = props.selectedStateIndex;
  const onClickEvent= props.onClick;
  const titles=["Organizations","Settings","Type","Schema","Rewards","Permissions","Resources","Finish"]

  const handleStep = (stepFase) => {
    let fase = Number(stepFase["index"]) + 1;
    let nextFaseText = fase.toString();
    nextSect("section_" + nextFaseText);
  };

  function nextSect(nextSectionNum) {
    // const section = document.querySelector("#" + nextSectionNum);
    // section.scrollIntoView({ behavior: "smooth", block: "start" });

    showSection(nextSectionNum);
  };

  function showSection(sectionNum) {
    onClickEvent(sectionNum);
  };


  const [anchorElList, setAnchorElList] = React.useState([null,null,null,null,null,null,null,null])

  const handlePopoverOpen1 = (event,index) => {

    let tempArray=[null,null,null,null,null,null,null,null];
    tempArray[index]=event.currentTarget;
    setAnchorElList(tempArray);
    /* setAnchorElList(existingItems => {

      return [
        ...existingItems.slice(0, index),
        event.currentTarget,
        ...existingItems.slice(index),
      ]
    }) */
 
  }

  const handlePopoverClose1 = (index) => {
    //setAnchorEl(null);

    let tempArray=[null,null,null,null,null,null,null,null];
   
    setAnchorElList(tempArray);

    /* setAnchorElList(existingItems => {
      return [
        ...existingItems.slice(0, index),
        null,
        ...existingItems.slice(index),
      ]
    }) */
   
  }

  const openList = [Boolean(anchorElList[0]),Boolean(anchorElList[1]),Boolean(anchorElList[2]),Boolean(anchorElList[3]),Boolean(anchorElList[4]),Boolean(anchorElList[5]),Boolean(anchorElList[6]),Boolean(anchorElList[7])]

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index ) => (
          <Step completed={label} key={index.toString()}>
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
              key={index}
              onClick={() => handleStep({ index })}
              aria-owns={openList[index] ? "mouse-over-popover_"+index : undefined}
              aria-haspopup="true"
              onMouseEnter={(event) => handlePopoverOpen1(event, index)}
              onMouseLeave={()=> handlePopoverClose1(index)}
            ></StepLabel>

            <Popover
              id={"mouse-over-popover_"+index}
              sx={{
                pointerEvents: "none",
              }}
              open={openList[index]}
              anchorEl={anchorElList[index]}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={()=> handlePopoverClose1(index)}
              disableRestoreFocus
            >
              <Typography sx={{ p: 1 }}>{titles[index]}</Typography>
            </Popover>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
