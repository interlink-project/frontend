import { useRef, useState } from 'react';
import { subDays, subHours } from 'date-fns';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import BellIcon from '../../icons/Bell';
import ChatAltIcon from '../../icons/ChatAlt';
import CreditCardIcon from '../../icons/CreditCard';
import ShoppingCartIcon from '../../icons/ShoppingCart';

import GroupsIcon from '@mui/icons-material/Groups';
import AddchartIcon from '@mui/icons-material/Addchart';
import ArticleIcon from '@mui/icons-material/Article';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

import { makeStyles, withStyles } from "@mui/styles";
import MuiListItem from "@mui/material/ListItem";
import {  useDispatch, useSelector } from 'react-redux';

import { usernotificationsApi } from '__api__';
import { formatDistanceToNowStrict } from 'date-fns';
import { useCustomTranslation } from 'hooks/useDependantTranslation';


import { getUnseenUserNotifications } from 'slices/general';
import useAuth from 'hooks/useAuth';


const now = new Date();

const iconsMap = {
  group: GroupsIcon,
  addresource: AddchartIcon,
  changeresource: ArticleIcon,
  
  defaulticon: ChatAltIcon
};

const UserNotificationsPopover = () => {

  //Obtain the notification data from State Reducer
  const usernotificationsState= useSelector(state => state.general)
  const usernotifications = usernotificationsState.unseenusernotifications
  const { user } = useAuth();
  const dispatch = useDispatch();

  function htmlDecode(str) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }


  const includeParametersValues = (text, parameters) => {
    
    if(parameters){
      //Obtain all parameters of the text
      const paramsPattern = /[^{}]+(?=})/g;
      let extractParams = text.match(paramsPattern);
      //Loop over each parameter value and replace in the text
      if(extractParams){
        for (let i = 0; i < extractParams.length; i++) {
          //console.log(extractParams[i]);
          text=text.replace('{'+extractParams[i]+'}', JSON.parse(parameters.replace(/'/g, '"'))[extractParams[i]]);  
        }
      }
      
    }
    text=htmlDecode(text)
    return text;
  }

  
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    }
  }));

  const ListItem = withStyles({
    root: {
      "&$selected": {
        backgroundColor: "red",
        color: "white",
        "& .MuiListItemIcon-root": {
          color: "white"
        }
      },
      "&$selected:hover": {
        backgroundColor: "purple",
        color: "white",
        "& .MuiListItemIcon-root": {
          color: "white"
        }
      },
      "&:hover": {
        background: '#a4cbd8',
        color:'black',
        "& .MuiListItemIcon-root": {
          color: "white"
        }
      }
    },
    selected: {}
  })(MuiListItem);

  const onLinkClick = (usernotificationId) => {
    //Save the state to seen of the notification.
    usernotificationsApi.setSeenUserNotification({'usernotificationId':usernotificationId});
  
  };

  
  
  const onClickMarkAll = () => {

    //Recorro todas las notificaciones y les pongo como vistas

    for (let i=0 ; i < usernotifications.length; i++) {
      usernotificationsApi.setSeenUserNotification({'usernotificationId':usernotifications[i].id});
    }

    dispatch(getUnseenUserNotifications({'user_id':user.id}));
  
  };

  return (
    <>
      <Tooltip title='Notifications'>
        <IconButton
          color='inherit'
          ref={anchorRef}
          onClick={handleOpen}
        >
          <Badge
            color='error'
            badgeContent={usernotifications.length}
          >
            <BellIcon fontSize='small' />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 320 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            color='textPrimary'
            variant='h6'
          >
            Notifications
          </Typography>
        </Box>
        {usernotifications.length === 0
          ? (
            <Box sx={{ p: 2 }}>
              <Typography
                color='textPrimary'
                variant='subtitle2'
              >
                There are no notifications
              </Typography>
            </Box>
          )
          : (
            <>
              <List disablePadding>
                {usernotifications.map((usernotification) => {
                  //Verify if the icon is defined:
                  const Icon = usernotification.notification.icon ? iconsMap[usernotification.notification.icon] : iconsMap['defaulticon'];
      

                  return (
                    <ListItem
                      divider
                      key={usernotification.id}                
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText'
                          }}
                        >
                          <Icon fontSize='small' />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={(
                          <Link
                            href={includeParametersValues(usernotification.notification.url_link,usernotification.parameters)}
                            onClick={() =>  onLinkClick(usernotification.id)}
                            color='textPrimary'
                            sx={{ cursor: 'pointer' }}
                            underline='none'
                            variant='subtitle2'
                
                          >
                            { includeParametersValues(usernotification.notification.subtitle,usernotification.parameters) }
                           
                          </Link>
                        )}
                        secondary={formatDistanceToNowStrict(new Date(usernotification.updated_at || usernotification.created_at))}
                      />
                    </ListItem>
                  );
                })}
              </List>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 1
                }}
              >
                <Button
                  color='primary'
                  size='small'
                  variant='text'
                  onClick={() =>  onClickMarkAll()}
                >
                  Mark all as read
                </Button>
              </Box>
            </>
          )}
      </Popover>
    </>
  );
};

export default UserNotificationsPopover;
