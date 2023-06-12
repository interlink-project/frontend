import { useMatomo } from '@datapunt/matomo-tracker-react';
import {
  Avatar,
  Box, Card, CardHeader, Container, IconButton, Tab, Tabs, useMediaQuery,
  useTheme
} from '@mui/material';
import { red } from '@mui/material/colors';
import { MoreVert } from '@mui/icons-material';
import MainSkeleton from 'components/MainSkeleton';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import OverviewPubliccoproduction from './Tabs/Overview';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import Treeview from './Tabs/Treeview';
import {
  getCoproductionProcessNotifications,
  getSelectedPubliccoproduction,
} from "slices/general";
import { getProcessCatalogue } from "slices/process";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`coproduction-process-tab-${index}`}
      aria-labelledby={`coproduction-process-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const style = {
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
};

const TabsMobile = ({ tabs, tab, publiccoproduction }) => {
  const logoExists = publiccoproduction && publiccoproduction.logotype;
  const navigate = useNavigate();

  return publiccoproduction && (
  <Card sx={{ mb: 1 }}>
    <CardHeader
      avatar={(
        <Avatar
          variant='rounded'
          sx={logoExists ? {} : { bgcolor: red[500] }}
          aria-label='recipe'
          src={logoExists && publiccoproduction.logotype}
        >
          {publiccoproduction && !logoExists && publiccoproduction.name}
          
        </Avatar>
      )}
      action={(
        <IconButton aria-label='settings'>
          <MoreVert />
        </IconButton>
      )}
      title={publiccoproduction && publiccoproduction.name}
      subheader={publiccoproduction && publiccoproduction.name}
    />
    <Tabs
      indicatorColor='secondary'
      onChange={(event, value) => navigate(`/publiccoproductions/${publiccoproduction.id}/${value}`)}
      value={tab}
      aria-label='Coproduction tabs'
      centered
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          disabled={tab.disabled}
        />
      ))}
    </Tabs>
  </Card>
  );
};

const PublicCoproductionProfile = () => {
  const { publiccoproductionId, tab = 'overview' } = useParams();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { trackEvent } = useMatomo();
  
  const { process, hasSchema, loading } = useSelector((state) => state.process);
  const { selectedPubliccoproduction } = useSelector((state) => state.general);


  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    if (selectedPubliccoproduction) {
      if (selectedPubliccoproduction.id != id) {
        dispatch(getSelectedPubliccoproduction(id));
       
      } //else{
    } else {
      dispatch(getSelectedPubliccoproduction(id));
    }

  
  }, []);


  //Every time another publiccoproduction is selected then the data info of the process is loaded
  useEffect(() =>{
    //console.log("La STORY A CAMBIADO:")
    if(selectedPubliccoproduction){
      //console.log(selectedPubliccoproduction.coproductionprocess_cloneforpub_id)
      dispatch(getProcessCatalogue(selectedPubliccoproduction.coproductionprocess_cloneforpub_id))
    }
    
  },[selectedPubliccoproduction])


  const theme = useTheme();
  const showMobileTabs = !useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();

  const _setSelectedTreeItem = (item, callback) => {
    trackEvent({
      category: process.name,
      action: 'tree-item-selected',
      name: item.id
    });
    dispatch(setSelectedTreeItem(item, callback));
  };

  

  const t = useCustomTranslation(selectedPubliccoproduction && selectedPubliccoproduction.language);

  const tabs = [
    { label: t('Overview'), value: 'overview' },
    { label: t('RoadMap'), value: 'roadmap' },
    { label: t('Resources'), value: 'resources' }
  ];

  return (
    <>
      <Helmet>
        <title>{t('dashboard-title')}</title>
        
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        
        <Box sx={{ mt: 3 }}>
          <Container maxWidth='xl'>
            {showMobileTabs && (
            <TabsMobile
              tabs={tabs}
              tab={tab}
              publiccoproduction={selectedPubliccoproduction}
            />
            )}
            { !selectedPubliccoproduction ? <MainSkeleton />
              : (
                <>
                  <TabPanel
                    value={tab}
                    index='overview'
                  >
                    <Card sx={style}>
                        <OverviewPubliccoproduction />
                     
                    </Card>
                  </TabPanel>
                  <TabPanel
                    value={tab}
                    index='resources'
                  >
                    <Card sx={{ ...style, mb: 3 }}>
                      <Treeview setSelectedTreeItem={_setSelectedTreeItem} /> 
                                      
                    </Card>
                  </TabPanel>
                  <TabPanel
                    value={tab}
                    index='roadmap'
                  >
                    <Card sx={{ ...style, mb: 3 }}>
                      {/* <RoadMap setSelectedTreeItem={_setSelectedTreeItem} /> */}
                      RoadMap Space
                    </Card>
                  </TabPanel>
                  <TabPanel
                    value={tab}
                    index='team'
                  >
{/*                     <TeamTab />
 */}              
                  <Card sx={{ ...style, mb: 3 }}>
                  Team Space
                  </Card>
                       
                  </TabPanel>
                  <TabPanel
                    value={tab}
                    index='settings'
                  >
                    <Card sx={{ ...style, mb: 3 }}>
                      Settings Space
                      {/* <SettingsTab /> */}
                    </Card>
                  </TabPanel>
                </>
              )}
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default PublicCoproductionProfile;
