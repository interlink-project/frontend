import {
  Grid,
  Chip,
  AppBar,
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Avatar,
  Stack,
  Card,
  AvatarGroup,
  useMediaQuery,
} from "@mui/material";
import {
  AccountTree,
  Description,
  EmojiObjects,
  FlashOn,
  OpenInNew,
  TipsAndUpdates,
} from "@mui/icons-material";
import { AssetsTable } from "components/dashboard/assets";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelectedTreeItemById } from "slices/process";
import { coproductionProcessesApi } from "__api__";
import TimeLine from "components/dashboard/coproductionprocesses/TimeLine";
import CoproNotifications from "components/dashboard/coproductionprocesses/CoproNotifications";
import {
  getAssetsList_byCopro,
  getCoproductionProcessNotifications,
} from "slices/general";
import useAuth from "hooks/useAuth";
import { cleanProcess } from "slices/process";
import { defaultReduceAnimations } from "@mui/lab/CalendarPicker/CalendarPicker";
import SwipeableViews from "react-swipeable-views";
import moment from "moment";
import PublicCoproductionReviews from "components/dashboard/publiccoproductions/profile/PublicCoproductionReviews";


export default function Profile({}) {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const { selectedPubliccoproduction } = useSelector(
    (state) => state.general
  );

  const logoExists = selectedPubliccoproduction && selectedPubliccoproduction.logotype;
  const t = useCustomTranslation(selectedPubliccoproduction.language);
  const [tab, setTab] = useState("showcase");

  const [loading, setLoading] = React.useState(true);
  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");

  const { user, isAuthenticated } = useAuth();

  React.useEffect(() => {
    setLoading(true);

    // coproductionselectedPubliccoproductionesApi.getAssets(selectedPubliccoproduction.id).then((res) => {
    //   if (mounted.current) {
    //     setAssets(res);
    //     setLoading(false);
    //   }
    // });
    dispatch(getAssetsList_byCopro(selectedPubliccoproduction.id));
    setLoading(false);
  }, [selectedPubliccoproduction]);
  /* 
  React.useEffect(() => {
    if(tab === "notifications"){
      //Load notifications when the tab change to notifications:
      dispatch(getCoproductionselectedPubliccoproductionNotifications({'coproductionselectedPubliccoproduction_id':selectedPubliccoproduction.id,'asset_id':''}));

    }
  }, [tab]); */

  /*   const notificationsList = useSelector((state) => {
      return state.general.coproductionselectedPubliccoproductionnotifications;
  }); */

  const listAdmins = () => {
    return selectedPubliccoproduction.administrators.map((admin) => {
      <Avatar alt={admin.full_name} key={admin.id} src={admin.picture}></Avatar>;
    });
  };

  return (
    <>
    <AppBar sx={{ position: "relative" }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              {t("Public Coproduction Overview")}
            </Typography>
          </AppBar>
          {
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

                <Tab value="reviews" label={t("Reviews")} />
              </Tabs>
            </Paper>
          }

{tab === "showcase" ? (
    <Box sx={{ pb: 3 }}>
     
      <Paper>
        {!mdUp ? (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              variant="rounded"
              sx={{ width: "90px", height: "90px", m: 1 }}
              src={selectedPubliccoproduction && selectedPubliccoproduction.logotype_link}
            />

            <Stack direction="column">
              <Typography variant="h5" sx={{ mb: 1, mt: 1 }}>
                {selectedPubliccoproduction.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, mt: 0 }}>
                <b>{t("Created")}:</b> {moment(selectedPubliccoproduction.created_at).format("LL")}
              </Typography>
              <Typography variant="h7" sx={{ mb: 1, mr: 2 }}>
                <b>Admin:</b>
              </Typography>
              <AvatarGroup max={4} sx={{ mb: 1 }}>
                {selectedPubliccoproduction.administrators.map((admin) => {
                  return (
                    <Avatar alt={admin.full_name} key={admin.id} src={admin.picture}></Avatar>
                  );
                })}
              </AvatarGroup>
            </Stack>
          </Grid>
        ) : (
          <Grid
            container
            columns={{ xs: 12, md: 12 }}
            sx={{ m: 2 }}
            spacing={2}
          >
            <Stack>
              <Avatar
                variant="rounded"
                sx={{ width: "90px", height: "90px", m: 1 }}
                src={selectedPubliccoproduction && selectedPubliccoproduction.logotype_link}
              >
                {" "}
              </Avatar>
              <Typography variant="h6" sx={{ mb: 2, ml: 1 }}>
                <Chip
                  label={t(selectedPubliccoproduction.status)}
                  size="small"
                  sx={{ width: "95px", mt: "-5px" }}
                  color="primary"
                />
              </Typography>
            </Stack>

            <Grid item xs={12} md={7}>
              <Typography variant="h5" sx={{ mb: 1, mt: 2 }}>
                {selectedPubliccoproduction.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, mt: 0 }}>
                <b>{t("Created")}:</b> {moment(selectedPubliccoproduction.created_at).format("LL")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="column" alignItems="flex-end" spacing={0}>
                <Typography variant="h7" sx={{ mb: 1, mr: 2 }}>
                  <b>Admin:</b>
                </Typography>
                <AvatarGroup max={4}>
                  {selectedPubliccoproduction.administrators.map((admin) => {
                    return (
                      <Avatar
                        alt={admin.full_name}
                        src={admin.picture}
                        key={admin.id}
                      ></Avatar>
                    );
                  })}
                </AvatarGroup>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Description of the process")}
          </Typography>
          <Description color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {selectedPubliccoproduction.description}
        </Typography>
      </Card>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Aim of the process")}
          </Typography>
          <EmojiObjects color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {selectedPubliccoproduction.aim}
        </Typography>
      </Card>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Challenges of the process")}
          </Typography>
          <FlashOn color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {selectedPubliccoproduction.challenges}
        </Typography>
      </Card>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Idea of the process")}
          </Typography>
          <TipsAndUpdates color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {selectedPubliccoproduction.idea}
        </Typography>
      </Card>
    </Box>
    ) : (
      <></>
    )}

    {tab === "reviews" ? (
      <Box sx={{ p: 3, justifyContent: "center" }}>
        Review Tab
        <PublicCoproductionReviews publiccoproduction={selectedPubliccoproduction} />
      </Box>
    ) : (
      <></>
    )}
    </>
  );
}
