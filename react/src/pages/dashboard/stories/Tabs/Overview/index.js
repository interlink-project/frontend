import { AppBar, Box, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import { AccountTree, OpenInNew } from '@mui/icons-material';
// import { ReviewsTable } from 'components/dashboard/reviews';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import * as React from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

// import { setSelectedTreeItemById } from 'slices/process';
// import { coproductionProcessesApi } from '__api__';
import TimeLine from 'components/dashboard/coproductionprocesses/TimeLine';
//import CoproNotifications from 'components/dashboard/coproductionprocesses/CoproNotifications';
import {  getCoproductionProcessNotifications, getSelectedStory } from 'slices/general';
import useAuth from 'hooks/useAuth';
// import { cleanProcess } from 'slices/process';
import { defaultReduceAnimations } from '@mui/lab/CalendarPicker/CalendarPicker';
import StoryReviews from 'components/dashboard/stories/profile/StoryReviews';
import { storiesApi } from "__api__";

export default function OverviewStory({ }) {
  
  const { selectedStory } = useSelector((state) => state.general);
 
  var userLang = navigator.language.substring(0, 2); 

  //const t = useCustomTranslation(selectedStory.story_language);
  
  const t = useCustomTranslation(userLang);
  

  const [tab, setTab] = useState('showcase');
  


  const [loading, setLoading] = React.useState(true);
//   const [reviews, setReviews] = React.useState([]);


  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');


  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const id = window.location.pathname.split('/')[2];
    if(selectedStory){
      if(selectedStory.id!=id){
        dispatch(getSelectedStory(id));
      }//else{
    }else{
      dispatch(getSelectedStory(id));
      
    }
      
 
    // storiesApi.getStoriesbyId(id).then((res) => {
    //   res.data=JSON.parse(res.data_story)
    //   selectedStory=res
      
    // });
  //}
  }, []);



  return (
    
     
    <Box sx={{ pb: 3, justifyContent: "center" }}>
      {selectedStory && (
        <>
      <AppBar sx={{ position: "relative" }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          {t("Success Story Overview")}
        </Typography>
      </AppBar>
      {  (
        <Paper sx={{ bgcolor: "background.default" }}>
          <Tabs
            value={tab}
            onChange={(event, newValue) => {
              setTab(newValue);
            }}
            aria-label="overview-tabs"
            centered
          >
            {/* { isAdministrator &&( */}
            <Tab value="showcase" label={t("Showcase")} />
            {/* )} */}
            <Tab
              value="reviews"
              label={t("Reviews")}
            />
            
          </Tabs>
        </Paper>
      )}
      {tab === "showcase" ? (
        <Box sx={{ p: 3, justifyContent: "center" }}>
           <Typography
                  color='textSecondary'
                  variant='h5'
                  align='center'
                  sx={{mb:3}}
                >
{selectedStory.data_story.title}

                </Typography>

                <Divider />
           
           <Typography
                  color='textSecondary'
                  variant='body2'
                  sx={{mt:5}}
                >

{selectedStory.data_story.description}
                </Typography>


        </Box>
      ) : <></>}

      {tab === "reviews" ? (
        <Box sx={{ p: 3, justifyContent: "center" }}>
           Review Tab
           <StoryReviews story={selectedStory} />
        </Box>
      ) : (
        <></>
      )}
      </>
      )}
    </Box>
   
  );
}
