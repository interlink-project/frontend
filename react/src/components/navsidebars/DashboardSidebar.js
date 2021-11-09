import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Box, Divider, Drawer, Link, Typography } from '@material-ui/core';
import {Dashboard as DashboardIcon, FolderOpen as FolderOpenIcon, HomeRepairService as HomeRepairServiceIcon, Link as LinkIcon, Group as GroupIcon} from '@material-ui/icons';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logo from '../Logo';
import NavSection from '../../components/NavSection';
import Scrollbar from '../../components/Scrollbar';import useAuth from '../../hooks/useAuth';

// /dashboard/account

const sections = [

  {
    title: 'Platforms',
    items: [
      {
        title: 'Overview',
        path: '/dashboard',
        icon: <DashboardIcon fontSize='small' />
      },
      {
        title: 'Catalogue',
        path: '/',
        icon: <FolderOpenIcon fontSize='small' />,
        children: [
          {
            title: 'Public services',
            path: '/dashboard/interlinkers/browse',
            icon: <HomeRepairServiceIcon fontSize='small' />
          },
          {
            title: 'Interlinkers',
            path: '/dashboard/interlinkers/browse',
            icon: <LinkIcon fontSize='small' />
          },
          {
            title: 'Teams',
            path: '/dashboard/teams/browse',
            icon: <GroupIcon fontSize='small' />
          }
        ]
      },
    ]
  },
];

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;

  const auth = useAuth();
  const { user } = auth;
  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex'
            },
            justifyContent: 'center',
            p: 2
          }}
        >
          <RouterLink to='/'>
            <Logo
              sx={{
                height: 40,
                width: 40
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2
            }}
          >
            <RouterLink to='/dashboard/account'>
              <Avatar
                src={user.picture}
                sx={{
                  cursor: 'pointer',
                  height: 48,
                  width: 48
                }}
              />
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography
                color='textPrimary'
                variant='subtitle2'
              >
                {`${user.given_name} ${user.family_name}`}
              </Typography>
              
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                }
              }}
              {...section}
            />
          ))}
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor='left'
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 280
          }
        }}
        variant='permanent'
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor='left'
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 280
        }
      }}
      variant='temporary'
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default DashboardSidebar;
