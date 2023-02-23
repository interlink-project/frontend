import { Grid, Avatar, Box, Button, Chip, Divider, Drawer, Skeleton, Stack, Typography, useMediaQuery, Rating } from '@mui/material';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AccountTree, ArrowBack,AssistantDirection, PermMedia, Dashboard, Balcony, Folder, Group as GroupIcon, Settings, Timeline } from '@mui/icons-material';
import { StatusChip } from 'components/Icons';
import useDependantTranslation from 'hooks/useDependantTranslation';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { LANGUAGES } from 'translations/i18n';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';


const StorySidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  //const { process, hasSchema, loading, updating } = useSelector((state) => state.process);
  const navigate = useNavigate();
  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  //const processId = process && process.id;

  const { selectedStory } = useSelector((state) => state.general);
  let storyId=1;
  if(selectedStory){
    storyId=selectedStory.id;
  }
  const { t } = useDependantTranslation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const sections = [

    {
      title: '',
      items: [
        {
          title: t('Project Overview'),
          path: `/stories/${storyId}/overview`,
          icon: <Balcony />,
          disabled: false
        },
        
        {
          title: t('Resources'),
          path: `/stories/${storyId}/resources`,
          icon: <PermMedia />,
         // disabled: !hasSchema
        },
        // {
        //   title: t('RoadMap'),
        //   path: `/stories/${storyId}/roadmap`,
        //   icon: <AssistantDirection />,
        //   //disabled: !hasSchema
        // },
      ]
    },
  ];
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        {false && (
        <Button
          startIcon={<ArrowBack />}
          variant='outlined'
          fullWidth
          size='large'
          onClick={() => navigate('/dashboard')}
        />
        )}
        {selectedStory && (
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='center'
          //spacing={!loading && !updating ? 1 : 0}
          spacing='1'
          sx={{ p: 3 }}
        >

          {/* {!loading && !updating ? ( */}
            <Avatar
              variant='rounded'
              sx={{ width: '80px', height: '80px' }}
              src={selectedStory.data_story.logo}
            >
{/*               {(!selectedStory || !selectedStory.logo) && <Folder />}
              {' '} */}
            </Avatar>
         {/*  ) : ( */}
            {/* <Skeleton
              variant='rounded'
              sx={{ m: 1, width: '80px', height: '80px' }}
            /> */}
          {/* )} */}
          <Typography
            sx={{ textAlign: 'center', width: '100%' }}
            variant='h6'
          >
            {selectedStory.data_story.title}
           {/*  {!loading && !updating && process ? process.name : <Skeleton />} */}
          </Typography>

          <Rating
            readOnly
            size='small'
            value={selectedStory.rating || 0}
          />

          


        </Stack>
        )}

            <Divider/>
            
          <Typography
            sx={{ textAlign: 'center', width: '100%',mt:3,mb:3 }}
            variant='h6'
          >
            Topics
           {/*  {!loading && !updating && process ? process.name : <Skeleton />} */}
          </Typography>
           
           {selectedStory?(<>
            {selectedStory.data_story.keywords != "" && (
                <Grid item xs={6} md={6} lg={3} xl={3} sx={{ m: 3 }}>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                    align="center"
                  >
                    {selectedStory.data_story.keywords &&
                      selectedStory.data_story.keywords
                        .split(",")
                        .map((el) => (
                          <Chip
                            label={el}
                            key={el}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                        ))}
                  </Typography>
                </Grid>
              )}
           </>):(<></>)}
           
         {/*  {!loading && !updating && process ? (
            <StatusChip
              t={t}
              status={process.status}
            />
          ) : <Skeleton sx={{ width: 80, height: 45, m: 0, p: 0 }} />}
          {!loading && !updating && process ? (
            <Chip
              size='small'
              color='default'
              label={LANGUAGES.find((el) => el.value === process.language).label}
            />
          ) : <Skeleton sx={{ width: 80, height: 45, m: 0, p: 0 }} />} */}





        <Divider />
        <Box sx={{ p: 2 }}>
           { sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                },
                color: 'text.secondary'
              }}
              {...section}
            />
          ))} 
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor='left'
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: '260px',
            zIndex: 0
          }
        }}
        variant='permanent'
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor='left'
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 300,
          zIndex: 0
        }
      }}
      variant='temporary'
    >
      {content}
    </Drawer>
  );
};

StorySidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default StorySidebar;