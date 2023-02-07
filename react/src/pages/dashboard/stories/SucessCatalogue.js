import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { InterlinkerDialog } from 'components/dashboard/interlinkers';
import StoryBrowse from 'components/dashboard/stories/browse/StoryBrowse';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { getLanguage } from 'translations/i18n';
import { getUnseenUserNotifications } from 'slices/general';
import React from 'react';
import { cleanProcess } from 'slices/process';
import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import useMounted from 'hooks/useMounted';

const SuccessCatalogue = () => {
  const [open, setOpen] = useState(false);
  const [story, setStory] = useState(null);

  const { t } = useTranslation();
  const language = getLanguage();

  const [searchValue] = React.useState('');
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const mounted = useMounted();


  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //const { trackEvent } = useMatomo();


  return (
    <>
      <Helmet>
        <title>{t('catalogue-title')}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5,
          px: 1
        }}
      >
        <Container maxWidth='lg'>
          <Grid
            container
            spacing={3}
          >
            <Grid
              alignItems='center'
              container
              justifyContent='space-between'
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Typography
                  color='textSecondary'
                  variant='overline'
                >
                  {t('Catalogue')}
                </Typography>
                <Typography
                  color='textPrimary'
                  variant='h5'
                >
                  {t('interlinkers-success-catalogue')}
                </Typography>
              </Grid>
              <Grid item />
            </Grid>
          </Grid>

          <StoryBrowse
            language={language}
            onStoryClick={(story) => {
              // trackEvent({
              //   category: 'catalogue',
              //   action: 'story-open',
              //   name: story.id
              // });
              setStory(story);
              handleClickOpen();
            }}
          />





          </Container>
      </Box>
    </>
  );
};

export default SuccessCatalogue;
