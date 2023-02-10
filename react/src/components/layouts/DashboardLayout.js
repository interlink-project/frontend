import { useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/styles';
import ProcessSidebar from 'components/navsidebars/ProcessSidebar';
import StorySidebar from 'components/navsidebars/StorySidebar';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardMobileAppbar from '../navsidebars/DashboardMobileAppbar';
import DashboardNavbar from '../navsidebars/DashboardNavbar';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const DashboardLayoutWrapperWithNavbar = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '260px'
  }
}));

const MobileLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingBottom: '70px',

}));

const DashboardLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
}));

const DashboardLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch'
});

const DashboardLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const coproductionProcessLocation = location.pathname.indexOf('/dashboard/coproductionprocesses/') > -1;
  const storyLocation = location.pathname.indexOf('/dashboard/stories/') > -1;

  const content = (
    <DashboardLayoutContainer>
      <DashboardLayoutContent>
        <Outlet />
      </DashboardLayoutContent>
    </DashboardLayoutContainer>
  );

  return (
    <DashboardLayoutRoot>
    {/*   {coproductionProcessLocation && (
      
      <ProcessSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={!onMobile && isSidebarMobileOpen}
      />
      )} */}
      
      {storyLocation && (
      
      <StorySidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={!onMobile && isSidebarMobileOpen}
      />
      )}


      {onMobile
        ? (
          <>
            <MobileLayoutWrapper>{content}</MobileLayoutWrapper>
            <DashboardMobileAppbar />
          </>
        )
        : (
          <>
           
            <DashboardNavbar
              showOpenMenuButton={coproductionProcessLocation}
              onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)}
            />
            
            
             
            {coproductionProcessLocation ? <DashboardLayoutWrapperWithNavbar>{content}</DashboardLayoutWrapperWithNavbar> : <DashboardLayoutWrapper>{content}</DashboardLayoutWrapper>}
             </>
        )}

    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
