import * as React from "react"
import { styled } from "@mui/material/styles"
import Stack from "@mui/material/Stack"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff"
import ConstructionIcon from "@mui/icons-material/Construction"
import BuildIcon from "@mui/icons-material/Build"
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech"
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"
import WidgetsIcon from "@mui/icons-material/Widgets"
import FlagIcon from "@mui/icons-material/Flag"
import GroupsIcon from "@mui/icons-material/Groups"
import StepConnector, {
  stepConnectorClasses
} from "@mui/material/StepConnector"

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16
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
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1
  }
}))

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
    background: "#187595"
  }),
  ...(ownerState.completed && {
    background: "#0f97c7"
  })
}))

function ColorlibStepIcon(props) {
  const { active, completed, className } = props

  const icons = {
    1: <GroupsIcon />,
    2: <DataSaverOffIcon />,
    3: <ConstructionIcon />,
    4: <BuildIcon />,
    5: <MilitaryTechIcon />,
    6: <BusinessCenterIcon />,
    7: <WidgetsIcon />,
    8: <FlagIcon />
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

//const steps = [false, false, false, false, false, false, false, false]

export default function CustomizedSteppers(props) {
  
  const steps=props.completeStates
  const activeStep=props.selectedStateIndex
  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >


        {steps.map((label,index) => (
          <Step completed={label} key={index.toString()} >
            <StepLabel StepIconComponent={ColorlibStepIcon}   ></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  )
}
