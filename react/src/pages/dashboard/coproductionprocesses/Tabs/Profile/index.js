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

export default function Profile({}) {
  const { process, isAdministrator, tree } = useSelector(
    (state) => state.process
  );

  const logoExists = process && process.logotype;
  const t = useCustomTranslation(process.language);
  const [tab, setTab] = useState(
    isAdministrator & !process.is_part_of_publication ? "progress" : "assets"
  );
  const [loading, setLoading] = React.useState(true);
  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");

  const { user, isAuthenticated } = useAuth();

  React.useEffect(() => {
    setLoading(true);

    // coproductionProcessesApi.getAssets(process.id).then((res) => {
    //   if (mounted.current) {
    //     setAssets(res);
    //     setLoading(false);
    //   }
    // });
    dispatch(getAssetsList_byCopro(process.id));
    setLoading(false);
  }, [process]);
  /* 
  React.useEffect(() => {
    if(tab === "notifications"){
      //Load notifications when the tab change to notifications:
      dispatch(getCoproductionProcessNotifications({'coproductionprocess_id':process.id,'asset_id':''}));

    }
  }, [tab]); */

  /*   const notificationsList = useSelector((state) => {
      return state.general.coproductionprocessnotifications;
  }); */

  const listAdmins = () => {
    return process.administrators.map((admin) => {
      <Avatar alt={admin.full_name} src={admin.picture}></Avatar>;
    });
  };

  return (
    <Box sx={{ pb: 3 }}>
      <AppBar sx={{ position: "relative" }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          {t("Profile")}
        </Typography>
      </AppBar>
      <Paper>
        <Grid container columns={{ xs: 12, md: 12 }} sx={{ m: 2 }} spacing={2}>
          <Grid item xs={12} md={1}>
            <Stack>
              <Avatar
                variant="rounded"
                sx={{ width: "80px", height: "80px" }}
                src={process && process.logotype_link}
              >
                {" "}
              </Avatar>
              <Typography variant="h6" sx={{ mb: 2, ml: 1 }}>
                <Chip
                  label={t("Finished")}
                  size="small"
                  sx={{ mt: "-5px" }}
                  color="primary"
                />
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h5" sx={{ mb: 1, mt: 2 }}>
              {process.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, mt: 0 }}>
              <b>{t("Created")}:</b> {moment(process.created_at).format("LL")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-end"
              spacing={0}
            >
              <Typography variant="h7" sx={{ mb: 1,mr:2 }}>
                <b>Admin:</b>
              </Typography>
              <AvatarGroup max={4}>
                {process.administrators.map((admin) => {
                  return (
                    <Avatar alt={admin.full_name} src={admin.picture}></Avatar>
                  );
                })}
              </AvatarGroup>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Description of the project")}
          </Typography>
          <Description color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {process.description}
        </Typography>
      </Card>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Aim of the project")}
          </Typography>
          <EmojiObjects color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {process.aim}
        </Typography>
      </Card>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Challenges of the project")}
          </Typography>
          <FlashOn color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {process.challenges}
        </Typography>
      </Card>

      <Card variant="outlined" sx={{ p: 2, m: 2 }}>
        <Stack direction="row" sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }} color="primary">
            {t("Idea of the project")}
          </Typography>
          <TipsAndUpdates color="primary" sx={{ ml: 1 }} />
        </Stack>
        <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
          {process.idea}
        </Typography>
      </Card>
    </Box>
  );
}
