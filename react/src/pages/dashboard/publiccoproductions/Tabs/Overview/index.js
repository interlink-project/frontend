import {
  Avatar,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Button,
  AppBar,
  Box,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  AccountTree,
  OpenInNew,
  MoreVert,
  YouTube,
  ArrowForward,
} from "@mui/icons-material";

import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import moment from 'moment';
import TimeLine from "components/dashboard/coproductionprocesses/TimeLine";
import {
  getCoproductionProcessNotifications,
  getSelectedPubliccoproduction,
} from "slices/general";
import useAuth from "hooks/useAuth";
import { defaultReduceAnimations } from "@mui/lab/CalendarPicker/CalendarPicker";
import PublicCoproductionReviews from "components/dashboard/publiccoproductions/profile/PublicCoproductionReviews";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/styles";
import { getProcessCatalogue } from "slices/process";

function TwoColumnsText(props) {
  const { text, mobileDevice, largeDevice, xlargeDevice, ...other } = props;
  const sentences = text.split(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
  return (
    <>
      {mobileDevice ? (
        <Typography color="textSecondary" variant="body2" sx={{ m: 2 }}>
          {text}
        </Typography>
      ) : (
        <>
          {(largeDevice || xlargeDevice) ? (
            
            <Typography color="textSecondary" variant="body2" sx={{ m: 5 }}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={6} sx={{ textAlign: "justify" }}>
                  {sentences.slice(0, sentences.length / 2)}
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "justify" }}>
                  {sentences.slice(sentences.length / 2, sentences.length)}
                </Grid>
              </Grid>
            </Typography>

          ) : (
            <Typography color="textSecondary" variant="body2" sx={{ m: 5 }}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={4} sx={{ textAlign: "justify" }}>
                  {sentences.slice(0, sentences.length / 3)}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "justify" }}>
                  {sentences.slice(
                    sentences.length / 3,
                    sentences.length - sentences.length / 3
                  )}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "justify" }}>
                  {sentences.slice(
                    sentences.length - sentences.length / 3,
                    sentences.length
                  )}
                </Grid>
              </Grid>
            </Typography>          )}
        </>
      )}
    </>
  );
}

export default function OverviewPubliccoproduction({}) {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const largeDevice = useMediaQuery(theme.breakpoints.down("lg"));
  const xlargeDevice = useMediaQuery(theme.breakpoints.down("xl"));

  const { selectedPubliccoproduction } = useSelector((state) => state.general);
  var userLang = navigator.language.substring(0, 2);
  const t = useCustomTranslation(userLang);
  const [tab, setTab] = useState("showcase");
  const [loading, setLoading] = React.useState(true);

  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");


  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    if (selectedPubliccoproduction) {
      if (selectedPubliccoproduction.id != id) {
        dispatch(getSelectedPubliccoproduction(id));
       
      } //else{
    } else {
      dispatch(getSelectedPubliccoproduction(id));
    }

   
    console.log("selectedPubliccoproduction:", selectedPubliccoproduction);
  }, []);


  //Every time another publiccoproduction is selected then the data info of the process is loaded
  useEffect(() =>{
    //console.log("La STORY A CAMBIADO:")
    if(selectedPubliccoproduction){
      //console.log(selectedPubliccoproduction.coproductionprocess_cloneforpub_id)
      dispatch(getProcessCatalogue(selectedPubliccoproduction.coproductionprocess_cloneforpub_id))
    }
    
  },[selectedPubliccoproduction])

  return (
    <Box sx={{ pb: 3, justifyContent: "center" }}>
      {selectedPubliccoproduction && (
        <>
          <AppBar sx={{ position: "relative" }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              {t("Public co-production process")}
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
            <Box sx={{ p: 3, justifyContent: "center", height: "100%" }}>
              <Grid
                container
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  component="img"
                  sx={{
                    height: "100px",
                    width: "auto",
                    maxHeight: { xs: 233, md: 167 },
                    maxWidth: { xs: 350, md: 250 },
                    mr: 2,
                  }}
                  alt={selectedPubliccoproduction.name}
                  src={'/coproduction'+selectedPubliccoproduction.logotype}
                />

                <Typography color="textSecondary" variant="h4">
                  {selectedPubliccoproduction.name}
                </Typography>
              </Grid>

             

               {selectedPubliccoproduction.tags && (
                <Grid item xs={6} md={6} lg={3} xl={3} sx={{ m: 3 }}>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                    align="center"
                  >
                    {selectedPubliccoproduction.tags &&
                      selectedPubliccoproduction.tags
                        .map((el) => (
                          <Chip
                            label={el.name}
                            key={el.id}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                        ))}
                  </Typography>
                </Grid>
              )} 

              <Typography
                color="textSecondary"
                variant="h6"
                align="center"
                sx={{ mb: 3, mr: 3, ml: 3 }}
              >
                {selectedPubliccoproduction.description}
              </Typography>


              <Grid
                container
                spacing={3}
                direction="column"
                justifyContent="left"
                alignItems="left"
                sx={{ mt: 3,mb:3,ml:5 }}
              >
                <Typography color="textSecondary" variant="subtitle2">
                  Created: {moment(selectedPubliccoproduction.created_at).format('MMMM Do YYYY')}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  Status: {selectedPubliccoproduction.status}
                </Typography>
              </Grid>

             



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
      )}
    </Box>
  );
}
