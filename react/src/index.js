import { createInstance, MatomoProvider } from "@datapunt/matomo-tracker-react";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { REACT_APP_COMPLETE_DOMAIN, REACT_APP_MATOMO_ID } from "configuration";
import "nprogress/nprogress.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/CookieContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import store from "./store";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
// import secrets from ".secrets.json"
import secrets from "./.secrets.json";

let environment = undefined;
if (REACT_APP_COMPLETE_DOMAIN.includes("localhost")) {
  environment = "local";
}
if (REACT_APP_COMPLETE_DOMAIN.includes("dev")) {
  environment = "dev";
}
if (REACT_APP_COMPLETE_DOMAIN.includes("demo")) {
  environment = "demo";
}

if (environment) {
  Sentry.init({
    dsn: secrets?.sentry_dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment,
    ignoreErrors: ["ResizeObserver loop limit exceeded"],
  });
}

const instance = createInstance({
  urlBase: `${REACT_APP_COMPLETE_DOMAIN}/matomo/`,
  siteId: REACT_APP_MATOMO_ID,
  linkTracking: false,
});

ReactDOM.render(
  <StrictMode>
    <MatomoProvider value={instance}>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <BrowserRouter>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                </BrowserRouter>
              </SettingsProvider>
            </LocalizationProvider>
          </StyledEngineProvider>
        </ReduxProvider>
      </HelmetProvider>
    </MatomoProvider>
  </StrictMode>,
  document.getElementById("root")
);
