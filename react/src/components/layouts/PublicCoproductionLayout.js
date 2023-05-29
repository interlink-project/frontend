import { useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/styles';
//import ProcessSidebar from 'components/navsidebars/ProcessSidebar';
import PublicCoproductionSidebar from 'components/navsidebars/PublicCoproductionSidebar';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardMobileAppbar from '../navsidebars/DashboardMobileAppbar';
import DashboardNavbar from '../navsidebars/DashboardNavbar';

const PublicCoproductionLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const PublicCoproductionLayoutWrapperWithNavbar = styled('div')(({ theme }) => ({
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

const PublicCoproductionLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
}));

const PublicCoproductionLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const PublicCoproductionLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch'
});

const PublicCoproductionLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const publiccoproductionLocation = location.pathname.indexOf('/stories/') > -1;

  const content = (
    <PublicCoproductionLayoutContainer>
      <PublicCoproductionLayoutContent>
        <Outlet />
      </PublicCoproductionLayoutContent>
    </PublicCoproductionLayoutContainer>
  );

  return (
    <PublicCoproductionLayoutRoot>
      
      
      {publiccoproductionLocation && (
      
      <PublicCoproductionSidebar
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
              showOpenMenuButton={publiccoproductionLocation}
              onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)}
            />
            
             
            {publiccoproductionLocation ? <PublicCoproductionLayoutWrapperWithNavbar>{content}</PublicCoproductionLayoutWrapperWithNavbar> : <PublicCoproductionLayoutWrapper>{content}</PublicCoproductionLayoutWrapper>}
             </>
        )}

    </PublicCoproductionLayoutRoot>
  );
};

export default PublicCoproductionLayout;
