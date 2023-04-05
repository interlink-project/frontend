import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { InterlinkerDialog } from "components/dashboard/interlinkers";
import InterlinkerBrowse from "components/dashboard/interlinkers/browse/InterlinkerBrowse";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getLanguage } from "translations/i18n";
import { getUnseenUserNotifications } from "slices/general";
import React from "react";
import { cleanProcess } from "slices/process";
import useAuth from "hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import useMounted from "hooks/useMounted";

const Catalogue = () => {
  const [open, setOpen] = useState(false);
  const [interlinker, setInterlinker] = useState(null);

  const { t } = useTranslation();
  const language = getLanguage();

  const [searchValue] = React.useState("");
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const mounted = useMounted();

  const getUnseenUserNotificationsData = React.useCallback(
    async (search) => {
      if (isAuthenticated) {
        dispatch(cleanProcess());
        dispatch(getUnseenUserNotifications(search));
        //dispatch(getUnseenUserNotifications({'user_id':user.id}));
      }
    },
    [isAuthenticated, mounted]
  );

  React.useEffect(() => {
    let delayDebounceFn;
    if (mounted.current) {
      delayDebounceFn = setTimeout(
        () => {
          getUnseenUserNotificationsData({ user_id: user?.id });
        },
        searchValue ? 800 : 0
      );
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [getUnseenUserNotificationsData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { trackEvent } = useMatomo();

  return (
    <>
      <Helmet>
        <title data-cy="catalogue-title">{t("catalogue-title")}</title>
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
                  color="textSecondary"
                  variant="overline"
                  data-cy="Catalogue-page-title"
                >
                  {t("Catalogue")}
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h5"
                  data-cy="interlinkers-catalogue"
                >
                  {t("interlinkers-catalogue")}
                </Typography>
              </Grid>
              <Grid item />
            </Grid>
          </Grid>

          <InterlinkerBrowse
            language={language}
            onInterlinkerClick={(interlinker) => {
              trackEvent({
                category: "catalogue",
                action: "interlinker-open",
                name: interlinker.id,
              });
              setInterlinker(interlinker);
              handleClickOpen();
            }}
          />
          <InterlinkerDialog
            language={language}
            interlinker={interlinker}
            open={open}
            setOpen={setOpen}
          />
        </Container>
      </Box>
    </>
  );
};

export default Catalogue;
