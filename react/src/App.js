import { useMatomo } from '@datapunt/matomo-tracker-react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { PRODUCTION_MODE, REACT_APP_DOMAIN } from './configuration';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import routes from './routes/index';
import './translations/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { getProcess, getTree } from 'slices/process';
import getAssets  from './components/dashboard/coproductionprocesses/RightSide'

export const RemoveTrailingSlash = ({ ...rest }) => {
  const location = useLocation();

  // If the last character of the url is '/'
  if (location.pathname.match('/.*/$')) {
    return (
      <Navigate
        replace
        {...rest}
        to={{
          pathname: location.pathname.replace(/\/+$/, ''),
          search: location.search
        }}
      />
    );
  } return null;
};



const App = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();
  const { process, selectedTreeItem } = useSelector((state) => state.process);
  const [socket, setSocket] = useState(null)
  const [lastProcessId, setLastProcessId] = useState(null)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useScrollReset();

  useEffect(() => {
    const process_changed = !process || process.id !== lastProcessId
    if (process_changed) {
      if (socket) {
        console.log('WebSocket Client Closed');
        socket.close();
      }
      
      if(process){
        console.log(REACT_APP_DOMAIN)
        
        let socketProtocol='ws:';
        if(REACT_APP_DOMAIN !== 'localhost'){
          socketProtocol='wss:';
        }

        const new_socket = new WebSocket(`${socketProtocol}//${REACT_APP_DOMAIN}/coproduction/api/v1/coproductionprocesses/${process.id}/ws`);
        new_socket.onopen = () => {
          console.log('WebSocket Client Connected',new_socket);
        };
        new_socket.onmessage = (message) => {
          console.log(message)
          // dispatch(getProcess(process.id, false, selectedTreeItem.id ))
        };
        setSocket(new_socket)
        setLastProcessId(process.id)
      }
      
    }
  }, [process])


   useEffect(() => {
    if(socket){
      socket.onmessage = (message) => {
        const {event, name, extra} = JSON.parse(message.data)
        console.log(event, extra, name)
        if(event.includes("treeitem")){
          if(event.includes("removed")){
            if(selectedTreeItem.name === name){
              dispatch(getTree(process.id, selectedTreeItem.prerequisites_ids[0] ))
            }else{
              dispatch(getTree(process.id, selectedTreeItem.id ))  
            }
          }else{
            dispatch(getTree(process.id, selectedTreeItem.id ))
          }
          
        }else
        if(event.includes("phase") || event.includes("objective") || event.includes("task")){
          if(event.includes("removed")){
            dispatch(getTree(process.id, selectedTreeItem.prerequisites_ids[0] ))
          }else{
            dispatch(getTree(process.id, selectedTreeItem.id ))
          }
          
        }else if(event.includes("coproductionprocess_removed")){
          navigate('/dashboard')
          // show advertence
        }else if(event.includes("coproductionprocess") || event.includes("permission")){
          dispatch(getProcess(process.id, false, selectedTreeItem.id ))
        }
        else if(event.includes("asset") && extra.task_id === selectedTreeItem.id){
          console.log("UPDATE ASSETS")
          //dispatch(getAssets())
          getAssets();
        }
      };
    }
  }, [selectedTreeItem]) 

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
        <Toaster position='top-center' />
        <Helmet>
          {PRODUCTION_MODE && (
            <meta
              httpEquiv='Content-Security-Policy'
              content='upgrade-insecure-requests'
            />
          )}
        </Helmet>
        <RemoveTrailingSlash />
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  ) : <SplashScreen />;
};

export default App;
