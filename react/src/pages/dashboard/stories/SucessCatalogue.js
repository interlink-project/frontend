import { Box, Container, Grid, Typography } from "@mui/material";
import StoryBrowse from "components/dashboard/stories/browse/StoryBrowse";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getLanguage } from "translations/i18n";
import React from "react";
import useMounted from "hooks/useMounted";
import { useNavigate } from "react-router-dom";

const SuccessCatalogue = () => {
  const [open, setOpen] = useState(false);
  const [story, setStory] = useState(null);

  const { t } = useTranslation();
  const language = getLanguage();

  const mounted = useMounted();
  const navigate = useNavigate();

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
        <title>{t("catalogue-title")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 5,
          px: 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid
              alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                
                <Typography
                  color="textPrimary"
                  variant="h5"
                  data-cy="interlinkers-success-catalogue"
                >
                  {t("success stories catalogue").toUpperCase()}
                </Typography>

                <Typography color="textSecondary" variant="h6" sx={{m:1}}>
                {t(
                    "Here, you'll discover a selection of successful coproduction case studies, which could serve as valuable references for your own coproduction endeavors"
                  )+'.'}
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
              navigate(story.id + "/overview");
            }}
          />
        </Container>
      </Box>
    </>
  );
};

export default SuccessCatalogue;
