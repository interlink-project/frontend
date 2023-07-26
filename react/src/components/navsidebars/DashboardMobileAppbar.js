import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Badge } from '@mui/material';
import { AccountBox, Folder, Dashboard, Notifications, Help,Ballot,AutoStories } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import useDependantTranslation from "hooks/useDependantTranslation";
import { useNavigate } from "react-router";


const DashboardMobileAppbar = () => {
  const [value, setValue] = useState(0);
  const { t } = useDependantTranslation();
  const navigate = useNavigate();

  
const sections = [{
  title: t('Workspace'),
  path: '/dashboard',
  icon: <Dashboard />
},
{
  title: t('Processes'),
  path: '/dashboard/projects',
  icon: <Ballot />
},
{
  title: t('Catalogue'),
  path: '/dashboard/interlinkers',
  icon: <Folder />,
},
// {
//   title: 'Notifications',
//   path: '/notifications',
//   icon: <Badge
//     color='error'
//     variant='dot'
//   >
//     <Notifications />
//   </Badge>,
// },
{
  title: t('Stories'),
  path: '/stories',
  icon: <AutoStories />,
}
];

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        navigate(sections[newValue].path);
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
