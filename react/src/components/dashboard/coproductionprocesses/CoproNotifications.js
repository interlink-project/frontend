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

  

  const coproductionprocessnotificationsState= useSelector(state => state.general);
  const copronotifications = coproductionprocessnotificationsState.coproductionprocessnotifications;
  console.log('Carga las notifications');
  console.log(copronotifications);

  const includeParametersValues = (text, parameters) => {
    if(parameters){
      //Obtain all parameters of the text
      const paramsPattern = /[^{}]+(?=})/g;
      let extractParams = text.match(paramsPattern);
      //Loop over each parameter value and replace in the text
      for (let i = 0; i < extractParams.length; i++) {
        //console.log(extractParams[i]);
        text=text.replace('{'+extractParams[i]+'}', JSON.parse(parameters.replace(/'/g, '"'))[extractParams[i]]);  
      }
    }
    return text;
  }

  return (
<Timeline position="alternate">
    <>
    { copronotifications.map((copronotification) => {
      return(
      <TimelineItem>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            
            {t('time-ago', {
              when: formatDistanceToNowStrict(new Date(copronotification.updated_at || copronotification.created_at))
            })}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot>
            <GroupsIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
       
            <Typography variant="h6" component="h1">
              { includeParametersValues(copronotification.notification.title,copronotification.parameters) }
            </Typography>
            <Typography>{copronotification.notification.event}</Typography>
            <Typography>
              <td dangerouslySetInnerHTML={{__html: includeParametersValues(copronotification.notification.text,copronotification.parameters)}} />

            </Typography>
         
        </TimelineContent>
      </TimelineItem>
      );
      })}
      </>
      <TimelineItem>
        <TimelineOppositeContent>
          <Typography variant="body2" color="textSecondary">
            10:00 am
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="primary">
            <AddchartIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
         
            <Typography variant="h6" component="h1">
            Daniel Silva performs a creation over resource 'My survey' of of the task 1.1
            </Typography>
            <Typography>Comment: I just created a demographic survey.</Typography>
         
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" variant="outlined">
            <ArticleIcon />
          </TimelineDot>
          <TimelineConnector className={classes.secondaryTail} />
        </TimelineSeparator>
        <TimelineContent>
         
            <Typography variant="h6" component="h1">
              Sleep
            </Typography>
            <Typography>Because you need rest</Typography>
        
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary">
            <RepeatIcon />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          
            <Typography variant="h6" component="h1">
              Repeat
            </Typography>
            <Typography>Because this is the life you love!</Typography>
          
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
          <TimelineDot color="secondary">
            <RepeatIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography variant="h6" component="span">
            Repeat
          </Typography>
          <Typography>Because this is the life you love!</Typography>
        </TimelineContent>
      </TimelineItem>

    </Timeline>
  );
}
