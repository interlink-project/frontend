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
import OverviewStory from './Tabs/Overview';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import Treeview from './Tabs/Treeview';
import {
  getCoproductionProcessNotifications,
  getSelectedStory,
} from "slices/general";
import { getProcessCatalogue } from "slices/process";
//import { getStory } from 'slices/process';

// import RoadMap from './Tabs/RoadMap';
// import Overview from './Tabs/Overview';
// import SettingsTab from './Tabs/Settings';
// import TeamTab from './Tabs/Team';
// import Resources from './Tabs/Resources';

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

const TabsMobile = ({ tabs, tab, story }) => {
  const logoExists = story && story.data_story.logo;
  const navigate = useNavigate();

  return story && (
  <Card sx={{ mb: 1 }}>
    <CardHeader
      avatar={(
        <Avatar
          variant='rounded'
          sx={logoExists ? {} : { bgcolor: red[500] }}
          aria-label='recipe'
          src={logoExists && story.data_story.logo}
        >
          {story && !logoExists && story.data_story.name}
        </Avatar>
      )}
      action={(
        <IconButton aria-label='settings'>
          <MoreVert />
        </IconButton>
      )}
      title={story && story.data_story.name}
      subheader={story && story.data_story.name}
    />
    <Tabs
      indicatorColor='secondary'
      onChange={(event, value) => navigate(`/stories/${story.id}/${value}`)}
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

const StoryProfile = () => {
  const { storyId, tab = 'overview' } = useParams();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { trackEvent } = useMatomo();
  
  const { process, hasSchema, loading } = useSelector((state) => state.process);
  const { selectedStory } = useSelector((state) => state.general);


  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    if (selectedStory) {
      if (selectedStory.id != id) {
        dispatch(getSelectedStory(id));
       
      } //else{
    } else {
      dispatch(getSelectedStory(id));
    }

    // storiesApi.getStoriesbyId(id).then((res) => {
    //   res.data=JSON.parse(res.data_story)
    //   selectedStory=res

    // });
    //}
  }, []);


  //Every time another story is selected then the data info of the process is loaded
  useEffect(() =>{
    //console.log("La STORY A CAMBIADO:")
    if(selectedStory){
      //console.log(selectedStory.coproductionprocess_cloneforpub_id)
      dispatch(getProcessCatalogue(selectedStory.coproductionprocess_cloneforpub_id))
    }
    
  },[selectedStory])


  /* const story={
    id:'1',
    title:'Families Share @ Work',
    name:'Families Share @ Work',
    description:'Story description is that it has a more-or-less normal distribution of letters, as opposed to using  making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    isLiked:false,
    likes:0,
    logotype_link:'/static/coproductionprocesses/f8c68b18-a8ce-4101-9067-40474c90c4ff.png',
    updated_at:'2021-08-23',
    created_at:'2021-08-23',
    rating:10,
    tags:['salud','dinero','amor']

}; */

  const theme = useTheme();
  const showMobileTabs = !useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();

  const _setSelectedTreeItem = (item, callback) => {
    trackEvent({
      category: process.id,
      action: 'tree-item-selected',
      name: item.id
    });
    dispatch(setSelectedTreeItem(item, callback));
  };

  // const getStory = useCallback(async () => {
  //   try {
  //     if (mounted.current) {
  //       dispatch(getStory(storyId));
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [mounted]);

  // useEffect(() => {
  //   getStory();
  // }, [getStory]);

 


  const t = useCustomTranslation(selectedStory && selectedStory.language);

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
              story={selectedStory}
            />
            )}
            { !selectedStory ? <MainSkeleton />
              : (
                <>
                  <TabPanel
                    value={tab}
                    index='overview'
                  >
                    <Card sx={style}>
                        <OverviewStory /> 
                     
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

export default StoryProfile;
