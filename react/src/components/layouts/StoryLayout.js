import { useMediaQuery, useTheme } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
//import ProcessSidebar from 'components/navsidebars/ProcessSidebar';
import StorySidebar from 'components/navsidebars/StorySidebar';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardMobileAppbar from '../navsidebars/DashboardMobileAppbar';
import DashboardNavbar from '../navsidebars/DashboardNavbar';

const StoryLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const StoryLayoutWrapperWithNavbar = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '260px'
  }
}));

const MobileLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingBottom: '70px',

}));

const StoryLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
}));

const StoryLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const StoryLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch'
});

const StoryLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const storyLocation = location.pathname.indexOf('/stories/') > -1;

  const content = (
    <StoryLayoutContainer>
      <StoryLayoutContent>
        <Outlet />
      </StoryLayoutContent>
    </StoryLayoutContainer>
  );

  return (
    <StoryLayoutRoot>
      
      
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
              showOpenMenuButton={storyLocation}
              onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)}
            />
            
             
            {storyLocation ? <StoryLayoutWrapperWithNavbar>{content}</StoryLayoutWrapperWithNavbar> : <StoryLayoutWrapper>{content}</StoryLayoutWrapper>}
             </>
        )}

    </StoryLayoutRoot>
  );
};

export default StoryLayout;
