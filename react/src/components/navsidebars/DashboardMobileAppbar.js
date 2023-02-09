import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Badge } from '@mui/material';
import { AccountBox, Folder, Dashboard, Notifications } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

const sections = [{
  title: 'Overview',
  path: '/dashboard',
  icon: <Dashboard />
},
{
  title: 'Catalogue',
  path: '/dashboard/catalogue',
  icon: <Folder />,
},
{
  title: 'Notifications',
  path: '/notifications',
  icon: <Badge
    color='error'
    variant='dot'
  >
    <Notifications />
  </Badge>,
},
{
  title: 'Account',
  path: '/myaccount',
  icon: <AccountBox />,
}
];

const DashboardMobileAppbar = () => {
  const [value, setValue] = useState(0);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{
        borderTop: '1px solid #B7DFEE',
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        textAlign: 'center'
      }}
    >
      {sections.map((el) => (
        <BottomNavigationAction
          sx={{ mt: 1 }}
          key={el.path}
          label={el.title}
          icon={el.icon}
        />
      ))}
    </BottomNavigation>
  );
};

export default DashboardMobileAppbar;
