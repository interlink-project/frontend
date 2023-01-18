import { Alert, Box, Button, Dialog, Stack, Step, StepLabel, Stepper, Typography } from '@material-ui/core';

import CreateSchema from 'components/dashboard/SchemaSelector';
import useAuth from 'hooks/useAuth';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';

import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@material-ui/lab';

import FastfoodIcon from '@material-ui/icons/Fastfood';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import HotelIcon from '@material-ui/icons/Hotel';
import RepeatIcon from '@material-ui/icons/Repeat';
import { formatDistanceToNowStrict } from 'date-fns';
import GroupsIcon from '@material-ui/icons/Groups';
import AddchartIcon from '@material-ui/icons/Addchart';
import ArticleIcon from '@material-ui/icons/Article';

import { assetsApi } from '__api__';
import { useEffect } from 'react';
import useMounted from 'hooks/useMounted';


const iconsMap = {
  group: GroupsIcon,
  addresource: AddchartIcon,
  changeresource: ArticleIcon,
  defaulticon: LaptopMacIcon
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));





export default function CoproNotifications({ assets }) {
  const classes = useStyles();
  const { process, hasSchema, tree } = useSelector((state) => state.process);
  const { user } = useAuth()
  const t = useCustomTranslation(process.language);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [ notificationsList,setNotificationsList]= React.useState([]);
  let copronotifications = [];
  const mounted = useMounted();

  const coproductionprocessnotificationsState= useSelector(state => state.general);
  
  useEffect(() => {
    copronotifications = coproductionprocessnotificationsState.coproductionprocessnotifications;
    setNotificationsList(copronotifications)
    console.log('Carga las notifications');
    console.log(copronotifications);
  
  }, [mounted]);


  


  const includeParametersValues = (text, parameters) => {
    if(parameters){
      //Obtain all parameters of the text
      const paramsPattern = /[^{}]+(?=})/g;
      let extractParams = text.match(paramsPattern);
      //Loop over each parameter value and replace in the text
      for (let i = 0; i < extractParams.length; i++) {
        //console.log(extractParams[i]);
        if(JSON.parse(parameters.replace(/'/g, '"'))[extractParams[i]]){
          text=text.replace('{'+extractParams[i]+'}', JSON.parse(parameters.replace(/'/g, '"'))[extractParams[i]]);
        }
          
      }
    }

    //Reemplazo con el valor del asset
    const paramsPattern = /[^{}]+(?=})/g;
    let extractParams = text.match(paramsPattern);
    //Loop over each parameter value and replace in the text
    if(extractParams){
      for (let i = 0; i < extractParams.length; i++) {
        if(extractParams[i].includes(':')){

          // console.log('----->'+extractParams[i]);
          const entidadName=extractParams[i].split(":")[0];
          const entidadId=extractParams[i].split(":")[1];

          if(entidadName=='assetid'){
            //Obtain the asset name:

            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/coproduction/api/v1/assets/internal/${entidadId}`, true);  // `false` makes the request synchronous
            
            xhr.onload = (e) => {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  //console.log(xhr.responseText);
                  const assetdata = JSON.parse(xhr.responseText);
                  if(document.getElementById("lk_"+entidadId+"")){
                  const assetName=assetdata.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                  document.getElementById("lk_"+entidadId+"").innerHTML=assetName;

           

                  document.getElementById("im_"+entidadId+"").src=assetdata.icon;

                  const collection = document.getElementsByTagName("h1");
                  for (let i = 0; i < collection.length; i++) {
                    const textotoReemp=collection[i].innerText;
                    const textonuevo=textotoReemp.replace('{assetid:'+entidadId+'}', assetName);
                    collection[i].innerText=textonuevo;
                  }


                  }

                } else {
                  console.error(xhr.statusText);
                }
              }
            };
            xhr.onerror = (e) => {
              console.error(xhr.statusText);
            };
            xhr.send(null);


            
            // const request = new XMLHttpRequest();
            // request.open('GET', `/coproduction/api/v1/assets/internal/${entidadId}`, false);  // `false` makes the request synchronous
            // request.send(null);

            // if (request.status === 200) {
            //   //console.log(request.responseText);
            //   const assetdata = JSON.parse(request.responseText);
            //   const assetIcon=assetdata.icon
            //   //console.log(assetdata.name)
            //   text=text.replace('{'+extractParams[i]+'}', '\''+ assetdata.name+'\'');
            //   text=text.replace('{assetIcon}', assetIcon);
              
                
            // }
          }

        }
        
      }
    }


    return text;
  }

  return (
<Timeline position="alternate">
    <>
    { notificationsList.map((copronotification) => {
      
      //Verify if the icon is defined:
      const Icon = copronotification.notification.icon ? iconsMap[copronotification.notification.icon] : iconsMap['defaulticon'];
      
      return(
      <TimelineItem key={'tln_'+copronotification.id} id={'tln_'+copronotification.id}>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            
            {t('time-ago', {
              when: formatDistanceToNowStrict(new Date(copronotification.updated_at || copronotification.created_at))
            })}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="primary" variant="outlined">
            <Icon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
       
            <Typography variant="h6" component="h1">
              { includeParametersValues(copronotification.notification.title,copronotification.parameters) }
            </Typography>
            <Typography>{copronotification.notification.event}</Typography>
            <Typography>
              <span dangerouslySetInnerHTML={{__html: includeParametersValues(copronotification.notification.text,copronotification.parameters)}} />

            </Typography>
         
        </TimelineContent>
      </TimelineItem>
      );
      })}
      </>

    </Timeline>
  );
}
