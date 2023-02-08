import { AppBar, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { AccountTree, OpenInNew } from '@material-ui/icons';
// import { AssetsTable } from 'components/dashboard/assets';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// import { setSelectedTreeItemById } from 'slices/process';
// import { coproductionProcessesApi } from '__api__';
import TimeLine from 'components/dashboard/coproductionprocesses/TimeLine';
import CoproNotifications from 'components/dashboard/coproductionprocesses/CoproNotifications';
import {  getCoproductionProcessNotifications } from 'slices/general';
import useAuth from 'hooks/useAuth';
// import { cleanProcess } from 'slices/process';
import { defaultReduceAnimations } from '@material-ui/lab/CalendarPicker/CalendarPicker';

export default function OverviewStory({ }) {
//   const { process, isAdministrator, tree } = useSelector((state) => state.process);

const story={
    id:'1',
    title:'Coproduce a Hackaton',
    name:'Hackaton',
    description:'Story description is that it has a more-or-less normal distribution of letters, as opposed to using  making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
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
  const [tab, setTab] = useState('progress');
  const [loading, setLoading] = React.useState(true);
//   const [assets, setAssets] = React.useState([]);
  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');


  const { user, isAuthenticated } = useAuth();

//   React.useEffect(() => {
//     setLoading(true);
//     coproductionProcessesApi.getAssets(process.id).then((res) => {
//       if (mounted.current) {
//         setAssets(res);
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

//   const getAssetsActions = (asset) => {
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
            <Tab value="progress" label={t("Progress")} />
            {/* )} */}
            <Tab
              value="assets"
              label={`${t("Resources")} (${loading ? "..." : assets.length})`}
            />
            <Tab value="notifications" label={t("Notifications")} />
          </Tabs>
        </Paper>
      )}
      {tab === "progress" ? <></> : <></>}

      {tab === "assets" ? (
        <Box sx={{ p: 3, justifyContent: "center" }}>
            Table
          {/* <AssetsTable
            language={process.language}
            loading={loading}
            assets={assets}
            getActions={getAssetsActions}
          /> */}
        </Box>
      ) : (
        <></>
      )}
      
      {tab === "notifications" ? <CoproNotifications /> : <></>}
    </Box>
  );
}
