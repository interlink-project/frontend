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
} from '@material-ui/core';
import BellIcon from '../../icons/Bell';
import ChatAltIcon from '../../icons/ChatAlt';
import CreditCardIcon from '../../icons/CreditCard';
import ShoppingCartIcon from '../../icons/ShoppingCart';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiListItem from "@material-ui/core/ListItem";
import {  useSelector } from 'react-redux';

import { usernotificationsApi } from '__api__';


const now = new Date();

// const usernotifications = [
//   {
//     id: '5e8883f1b51cc1956a5a1ec0',
//     createdAt: subHours(now, 2).getTime(),
//     description: 'Dummy text',
//     title: 'Your order is placed',
//     type: 'order_placed'
//   },
//   {
//     id: '5e8883f7ed1486d665d8be1e',
//     createdAt: subDays(now, 1).getTime(),
//     description: 'You have 32 unread messages',
//     title: 'New message received',
//     type: 'new_message'
//   },
//   {
//     id: '5e8883fca0e8612044248ecf',
//     createdAt: subDays(now, 3).getTime(),
//     description: 'Dummy text',
//     title: 'Your item is shipped',
//     type: 'item_shipped'
//   },
//   {
//     id: '5e88840187f6b09b431bae68',
//     createdAt: subDays(now, 7).getTime(),
//     description: 'You have 32 unread messages',
//     title: 'New message received',
//     type: 'new_message'
//   }
// ];

const iconsMap = {
  item_shipped: ShoppingCartIcon,
  new_message: ChatAltIcon,
  order_placed: CreditCardIcon
};

const UserNotificationsPopover = () => {

  //Obtain the notification data from State Reducer
  const usernotificationsState= useSelector(state => state.general)
  const usernotifications = usernotificationsState.unseenusernotifications



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



  return (
    <>
      <Tooltip title='UserNotifications'>
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
            UserNotifications
          </Typography>
        </Box>
        {usernotifications.length === 0
          ? (
            <Box sx={{ p: 2 }}>
              <Typography
                color='textPrimary'
                variant='subtitle2'
              >
                There are no usernotifications
              </Typography>
            </Box>
          )
          : (
            <>
              <List disablePadding>
                {usernotifications.map((usernotification) => {
                  const Icon = iconsMap['new_message'];

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
                            { includeParametersValues(usernotification.notification.title,usernotification.parameters) }
                           
                          </Link>
                        )}
                        secondary={usernotification.notification.event}
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
