import { useMatomo } from "@datapunt/matomo-tracker-react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router-dom";
import RTL from "./components/RTL";
import SplashScreen from "./components/SplashScreen";
import { PRODUCTION_MODE, REACT_APP_DOMAIN } from "./configuration";
import useAuth from "./hooks/useAuth";
import useScrollReset from "./hooks/useScrollReset";
import useSettings from "./hooks/useSettings";
import routes from "./routes/index";
import "./translations/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getProcess, getTree } from "slices/process";
import getAssets from "./components/dashboard/coproductionprocesses/RightSide";
import { getCoproductionProcesses, getTags } from "slices/general";
import { getOrganizations } from "slices/general";
import { getUnseenUserNotifications } from "slices/general";

export const RemoveTrailingSlash = ({ ...rest }) => {
  const location = useLocation();

  // If the last character of the url is '/'
  if (location.pathname.match("/.*/$")) {
    return (
      <Navigate
        replace
        {...rest}
        to={{
          pathname: location.pathname.replace(/\/+$/, ""),
          search: location.search,
        }}
      />
    );
  }
  return null;
};

const App = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();
  const { process, selectedTreeItem } = useSelector((state) => state.process);
  const [socket, setSocket] = useState(null);
  const [personalSocket, setPersonalSocket] = useState(null);
  const [lastProcessId, setLastProcessId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getUuid = require("uuid-by-string");

  useScrollReset();

  // Create personal websocket to receive updates on dashboard view
  useEffect(() => {
    //The personal websocket will include when is in organizations
    if (
      (location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/organizations") &&
      auth.isAuthenticated &&
      !personalSocket
    ) {
      let socketProtocol = "ws:";
      if (REACT_APP_DOMAIN !== "localhost") {
        socketProtocol = "wss:";
      }

      const new_socket = new WebSocket(
        `${socketProtocol}//${REACT_APP_DOMAIN}/coproduction/api/v1/users/${getUuid(
          auth.user.id
        )}/ws`
      );

      new_socket.onopen = () => {
        console.log("PERSONAL WebSocket Client Connected", new_socket);
      };
      new_socket.onmessage = (message) => {
        console.log("RECEIVING MESSAGE ON PERSONAL SOCKET");
        console.log(message);
        dispatch(getCoproductionProcesses());
        dispatch(getOrganizations(""));
        dispatch(getUnseenUserNotifications({ user_id: auth.user.id }));

        if (window.location.pathname.includes("organizations")) {
          dispatch(getOrganizations(""));
        }
      };
      setPersonalSocket(new_socket);
    }
    if (
      !(
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/organizations"
      ) &&
      personalSocket
    ) {
      console.log("PERSONAL WebSocket Client Closed");
      personalSocket.close();
      setPersonalSocket(null);
    }

    dispatch(getTags());
  }, [location, auth]);

  useEffect(() => {
    const process_changed = !process || process.id !== lastProcessId;
    if (process_changed) {
      if (socket) {
        console.log("WebSocket Client Closed");
        socket.close();
        setSocket(null);
        setLastProcessId(null);
      }

      if (process) {
        console.log(REACT_APP_DOMAIN);

        let socketProtocol = "ws:";
        if (REACT_APP_DOMAIN !== "localhost") {
          socketProtocol = "wss:";
        }

        const new_socket = new WebSocket(
          `${socketProtocol}//${REACT_APP_DOMAIN}/coproduction/api/v1/coproductionprocesses/${process.id}/ws`
        );
        new_socket.onopen = () => {
          console.log("WebSocket Client Connected", new_socket);
        };
        new_socket.onmessage = (message) => {
          console.log(message);
          // dispatch(getProcess(process.id, false, selectedTreeItem.id ))
        };
        setSocket(new_socket);
        setLastProcessId(process.id);
      }
    }
  }, [process]);

  // useEffect(() => {
  //   if (!socket && process) {
  //     console.log(REACT_APP_DOMAIN)

  //     let socketProtocol = 'ws:';
  //     if (REACT_APP_DOMAIN !== 'localhost') {
  //       socketProtocol = 'wss:';
  //     }

  //     const new_socket = new WebSocket(`${socketProtocol}//${REACT_APP_DOMAIN}/coproduction/api/v1/coproductionprocesses/${process.id}/ws`);
  //     new_socket.onopen = () => {
  //       console.log('WebSocket Client Connected', new_socket);
  //     };
  //     new_socket.onmessage = (message) => {
  //       console.log(message)
  //       // dispatch(getProcess(process.id, false, selectedTreeItem.id ))
  //     };
  //     setSocket(new_socket)
  //     setLastProcessId(process.id)
  //   }
  // }, [socket])

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const { event, name, extra } = JSON.parse(message.data);
        console.log(event, extra, name);
        if (event.includes("treeitem")) {
          if (event.includes("removed")) {
            if (selectedTreeItem.name === name) {
              if (selectedTreeItem.prerequisites_ids.length == 0) {
                dispatch(
                  getTree(process.id, selectedTreeItem.prerequisites_ids[0])
                );
              } else {
                dispatch(getTree(process.id));
              }
            } else {
              dispatch(getTree(process.id, selectedTreeItem.id));
            }
          } else {
            dispatch(getTree(process.id, selectedTreeItem.id));
          }
        } else if (
          (event.includes("phase") ||
            event.includes("objective") ||
            event.includes("task")) &&
          selectedTreeItem
        ) {
          if (event.includes("removed")) {
            dispatch(
              getTree(process.id, selectedTreeItem.prerequisites_ids[0])
            );
          } else {
            if (selectedTreeItem) {
              dispatch(getTree(process.id, selectedTreeItem.id));
            } else {
              dispatch(getTree(process.id));
            }
          }
        } else if (event.includes("coproductionprocess_removed")) {
          navigate("/dashboard");
          // show advertence
        } else if (
          event.includes("coproductionprocess") ||
          event.includes("permission")
        ) {
          console.log(process);
          dispatch(getProcess(process.id, false, selectedTreeItem.id? selectedTreeItem.id : null));
        } else if (event.includes("asset")) {
          const datosTemp = JSON.parse(message.data);
          // console.log(datosTemp)
          // console.log("UPDATE ASSETS")

          //Ask if the selected task is the same:
          if (selectedTreeItem.id === datosTemp.extra.task_id) {
            dispatch(getTree(process.id, selectedTreeItem.id));
          } else {
            if (window.location.pathname.includes("overview")) {
              dispatch(getProcess(process.id, false));
            }
          }
        }
      };
    }
  }, [selectedTreeItem]);

  // ANALYTICS
  const { enableLinkTracking, trackPageView } = useMatomo();
  enableLinkTracking();
  useEffect(() => {
    trackPageView();
  }, [window.location.href]);

  return settings.loaded ? (
    <ThemeProvider theme={settings.themeData}>
      <RTL direction={settings.direction}>
        <CssBaseline />
        <Toaster position="top-center" />
        <Helmet>
          {PRODUCTION_MODE && (
            <meta
              httpEquiv="Content-Security-Policy"
              content="upgrade-insecure-requests"
            />
          )}
        </Helmet>
        <RemoveTrailingSlash />
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  ) : (
    <SplashScreen />
  );
};

export default App;
