import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Fade,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import CreateSchema from "components/dashboard/SchemaSelector";
import useAuth from "hooks/useAuth";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { makeStyles } from "@mui/styles";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import { formatDistanceToNowStrict } from "date-fns";
import GroupsIcon from "@mui/icons-material/Groups";
import AddchartIcon from "@mui/icons-material/Addchart";
import ArticleIcon from "@mui/icons-material/Article";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import { assetsApi } from "__api__";
import { useEffect } from "react";
import useMounted from "hooks/useMounted";
import { useDispatch } from "react-redux";
//import {  getCoproductionProcessNotifications } from "slices/general";

const iconsMap = {
  group: GroupsIcon,
  addresource: AddchartIcon,
  changeresource: ArticleIcon,
  defaulticon: LaptopMacIcon,
  tree: AccountTreeIcon,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    margin: theme.spacing(2),
  },
  placeholder: {
    height: 40,
  },
}));

export default function CoproNotifications({ mode = "notification" }) {
  const classes = useStyles();
  const { process, hasSchema, tree } = useSelector((state) => state.process);
  const { user } = useAuth();
  const t = useCustomTranslation(process.language);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const mounted = useMounted();

 
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "/coproduction/static/assets/showDialogScript.js";
    script.async = true;
    document.body.appendChild(script);
  return () => {
      document.body.removeChild(script);
    }
  }, []);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const notificationsList = useSelector((state) => {
    if (mode === "notification") {
      return state.general.coproductionprocessnotifications;
    } else if (mode === "activity") {
      return state.general.userActivities;
    }
  });

  const { assetsList } = useSelector((state) => state.general);


  //This function will obtain and reeplace all paremeters
  // and replace in the text.
  const includeParametersValues = (text, parameters, notification_id) => {
    if (parameters) {
      //Obtain all parameters of the text
      const paramsPattern = /[^{}]+(?=})/g;
      let extractParams = text.match(paramsPattern);
      //Loop over each parameter value and replace in the text
      if (extractParams) {
        for (let i = 0; i < extractParams.length; i++) {
          //console.log(extractParams[i]);
          const listParameters=JSON.parse(parameters.replace(/'/g, '"'));
          if (listParameters[extractParams[i]]!=null) {
            text = text.replace(
              "{" + extractParams[i] + "}",
              listParameters[extractParams[i]]
            );
          }
        }
        // Add notification Id
        text=text.replaceAll("{notificationId}",notification_id);
      }


    }

    return text;
  };

  const includeObjectNames = (text,subtitle) => {

    //Search and reemplace que assetName and icon
    const paramsPattern = /[^{}]+(?=})/g;
    let extractParams = text.match(paramsPattern);
    //Loop over each parameter value and replace in the text
    
    if (extractParams) {
      extractParams = [...new Set(extractParams)];
      for (let i = 0; i < extractParams.length; i++) {
        if (extractParams[i].includes(":")) {
          // console.log('----->'+extractParams[i]);
          const entidadName = extractParams[i].split(":")[0];
          const entidadId = extractParams[i].split(":")[1];

          if (entidadName == "assetid") {
            //Obtain the asset name:
            let hasAssetRights=false;
            //Busco si existe el asset en el listado temporal:
            for (let i = 0; i < assetsList.length; i++) {
              if(assetsList[i].id==entidadId){
                hasAssetRights=true;

                const assetName=assetsList[i]['internalData']['name'];
                const assetIcon=assetsList[i]['internalData']['icon'];

                const nodes = document.getElementsByClassName(
                  "lk_" + entidadId
                );

                for (let i = 0; i < nodes.length; i++) {
                  nodes[i].innerHTML = assetName;
                }

                const nodes2 = document.getElementsByClassName(
                  "im_" + entidadId
                );
                if(assetIcon!=''){
                  for (let i = 0; i < nodes.length; i++) {
                      nodes2[i].src = assetIcon;
                  }
              }
                break;
              }
            }

            if (!hasAssetRights){
              text= includeObjectNames(subtitle,'')
              return text;
            }

          }
        }
      }
    }

    return text;
  };

  const compareDates = (d1, d2) => {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    if (date1 < date2) {
      return false;
    } else if (date1 > date2) {
      return true;
    } else {
      return true;
    }
  };

  return (
    <Timeline position="alternate">
      <>
        {notificationsList.map((copronotification) => {
          //Verify if the icon is defined:
          const Icon = copronotification.notification.icon
            ? iconsMap[copronotification.notification.icon]
            : iconsMap["defaulticon"];

          return (
            <TimelineItem
              key={"tln_" + copronotification.id}
              id={"tln_" + copronotification.id}
            >
              <TimelineOppositeContent key={"tlo_" + copronotification.id}>
                <Typography variant="body2" color="textSecondary">
                  {t("time-ago", {
                    when: formatDistanceToNowStrict(
                      new Date(
                        copronotification.updated_at ||
                          copronotification.created_at
                      )
                    ),
                  })}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator key={"tls_" + copronotification.id}>
                <TimelineDot
                  color={
                    compareDates(copronotification.created_at, user.last_login)
                      ? "secondary"
                      : "primary"
                  }
                  variant={
                    compareDates(copronotification.created_at, user.last_login)
                      ? "filled"
                      : "outlined"
                  }
                >
                  <Icon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent key={"tlc_" + copronotification.id}>
                <Typography variant="h6" component="h1">
                  {includeParametersValues(
                    copronotification.notification.title,
                    copronotification.parameters,
                    copronotification.id,
                  )}
                </Typography>

                <Typography>
                  <span
                    key={"cont_" + copronotification.id}
                    id={"text_" + copronotification.id}
                    class="textNotification"
                    dangerouslySetInnerHTML={{
                      __html: includeObjectNames(
                        includeParametersValues(
                          copronotification.notification.text,
                          copronotification.parameters,
                          copronotification.id
                        ),
                        includeParametersValues(
                          copronotification.notification.subtitle,
                          copronotification.parameters,
                          copronotification.id
                        ),
                      ),
                    }}
                  />
                </Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </>
    </Timeline>
  );
}
