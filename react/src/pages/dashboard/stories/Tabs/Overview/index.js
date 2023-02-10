import { AppBar, Box, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import { AccountTree, OpenInNew } from '@mui/icons-material';
// import { ReviewsTable } from 'components/dashboard/reviews';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// import { setSelectedTreeItemById } from 'slices/process';
// import { coproductionProcessesApi } from '__api__';
import TimeLine from 'components/dashboard/coproductionprocesses/TimeLine';
//import CoproNotifications from 'components/dashboard/coproductionprocesses/CoproNotifications';
import {  getCoproductionProcessNotifications } from 'slices/general';
import useAuth from 'hooks/useAuth';
// import { cleanProcess } from 'slices/process';
import { defaultReduceAnimations } from '@mui/lab/CalendarPicker/CalendarPicker';
import StoryReviews from 'components/dashboard/stories/profile/StoryReviews';

export default function OverviewStory({ }) {
//   const { process, isAdministrator, tree } = useSelector((state) => state.process);

const story={
    id:'1',
    title:'Families Share @ Work',
    name:'Families Share @ Work',
    short_description:'Co-creation of childcare services within companies by exploiting the time-shift model experimented in the Families Share approach',
    description:`Families Share @ Work  offers a bottom-up solution to work/life balance by supporting families with childcare, parenting advice and after-school activities. 
    It has been co-produced within the EU funded project Families Share and already tested  in 3 European Cities. 
    Families Share represents an innovative solution for work-life balance, and can constitute a valuable integration to the existing local public childcare offers, during holiday periods in particular but even beyond. Co-playing weeks or activities can be either set up as new services or integrate existing ones.
    In addition, it lays the basis for establishing good neighbourhood relationships from which to start for a wide range of other possible initiatives based on mutual help and solidarity.
    Last but not least, if under-utilized or unused public spaces are made available for the activities, Families Share can serve regeneration of urban common goods purposes too.
    
    The Families Share approach has already been tested and validated in several pilot case studies, in different European countries where different models have been explored. In the Italian Cities of Venice and Bologna and in the Dutch City of Kortrijk, Families Share has been exploited to integrate the existing local public childcare offers (during holiday periods for instance) thanks to  neighborhood relationships based on mutual help and solidarity.
    Different legal and ethical regulations, as well as local financial support, might apply locally when the initiative is replicated in specific contexts.`,
    isLiked:false,
    likes:0,
    logotype_link:'/static/coproductionprocesses/47c40b06-2147-440b-8f08-fac9e976af38.png',
    updated_at:'2021-08-23',
    created_at:'2021-08-23',
    rating:10,
    language:'en',
    tags:['salud','dinero','amor']

};

const t = useCustomTranslation(story.language);
  const [tab, setTab] = useState('showcase');
  const [loading, setLoading] = React.useState(true);
//   const [reviews, setReviews] = React.useState([]);
  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');


  const { user, isAuthenticated } = useAuth();

//   React.useEffect(() => {
//     setLoading(true);
//     coproductionProcessesApi.getReviews(process.id).then((res) => {
//       if (mounted.current) {
//         setReviews(res);
//         setLoading(false);
//       }
//     });
//   }, [process]);

//   React.useEffect(() => {
//     if(tab === "notifications"){
//       //Load notifications when the tab change to notifications:
//       dispatch(getCoproductionProcessNotifications({'coproductionprocess_id':process.id,'asset_id':''}));

//     }
//   }, [tab]);

//   const getReviewsActions = (asset) => {
//     const actions = [];
//     actions.push({
//       id: `${asset.id}-open-action`,
//       onClick: (closeMenuItem) => {
//         window.open(`${asset.link}/view`, '_blank');
//         closeMenuItem();
//       },
//       text: t('Open'),
//       icon: <OpenInNew fontSize='small' />
//     });
//     actions.push({
//       id: `${asset.id}-open-task-action`,
//       onClick: (closeMenuItem) => {
//         dispatch(setSelectedTreeItemById(asset.task_id, () => {
//           navigate(`/dashboard/coproductionprocesses/${process.id}/guide`);
//         }));
//       },
//       text: t('Go to the task'),
//       icon: <AccountTree fontSize='small' />
//     });
//     return actions;
//   };

//   if (!process || !tree) {
//     return;
//   }


  return (
    <Box sx={{ pb: 3, justifyContent: "center" }}>
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
                  variant='h6'
                 align='center'
                 sx={{mb:3}}
                >
{story.title}

                </Typography>

                <Divider />
           
           <Typography
                  color='textSecondary'
                  variant='body2'
                  sx={{mt:5}}
                >

{story.description}
                </Typography>


        </Box>
      ) : <></>}

      {tab === "reviews" ? (
        <Box sx={{ p: 3, justifyContent: "center" }}>
           Review Tab
           <StoryReviews story={story} />
        </Box>
      ) : (
        <></>
      )}
      
      
    </Box>
  );
}
