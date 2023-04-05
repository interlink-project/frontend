import useSettings from "hooks/useSettings";
import { THEMES } from "../constants";

const Logo = ({ src, style = { height: "40px" }, datacy = null }) => (
  <img src={src} style={style} data-cy={datacy} />
);

export default Logo;

export function DashboardNavbarLogo({ style = { height: "40px" } }) {
  const { settings } = useSettings();
  return (
    <Logo
      style={style}
      src={`/static/customization/${
        settings.theme === THEMES.LIGHT.key
          ? settings.logos.dashboard_navbar_light
          : settings.logos.dashboard_navbar_dark
      }`}
      datacy="dashboard-navbar-logo"
    />
  );
}

export function HomeLogo({ style = { height: "40px" } }) {
  const { settings } = useSettings();
  return (
    <Logo
      style={style}
      src={`/static/customization/${
        settings.theme === THEMES.LIGHT.key
          ? settings.logos.home_light
          : settings.logos.home_dark
      }`}
      datacy="home-logo"
    />
  );
}

export function LandingNavbarLogo({ style = { height: "40px" } }) {
  const { settings } = useSettings();
  return (
    <Logo
      style={style}
      src={`/static/customization/${
        settings.theme === THEMES.LIGHT.key
          ? settings.logos.landing_light
          : settings.logos.landing_dark
      }`}
      datacy="landing-navbar-logo"
    />
  );
}
