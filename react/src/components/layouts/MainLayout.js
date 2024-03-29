import { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/styles';
import MainNavbar from '../navsidebars/MainNavbar';
import MainSidebar from '../navsidebars/MainSidebar';

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
  paddingTop: 64
}));

const MainLayout = ({ children }) => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  return (
    <MainLayoutRoot>
      <MainNavbar onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)} />
      <MainSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />
      {children || <Outlet />}
      {/*
      <Footer /> */}
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
