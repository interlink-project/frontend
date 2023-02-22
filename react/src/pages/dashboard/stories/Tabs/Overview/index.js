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
// import { ReviewsTable } from 'components/dashboard/reviews';
import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

// import { setSelectedTreeItemById } from 'slices/process';
// import { coproductionProcessesApi } from '__api__';
import TimeLine from "components/dashboard/coproductionprocesses/TimeLine";
//import CoproNotifications from 'components/dashboard/coproductionprocesses/CoproNotifications';
import {
  getCoproductionProcessNotifications,
  getSelectedStory,
} from "slices/general";
import useAuth from "hooks/useAuth";
// import { cleanProcess } from 'slices/process';
import { defaultReduceAnimations } from "@mui/lab/CalendarPicker/CalendarPicker";
import StoryReviews from "components/dashboard/stories/profile/StoryReviews";
import { storiesApi } from "__api__";

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

export default function OverviewStory({}) {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const largeDevice = useMediaQuery(theme.breakpoints.down("lg"));
  const xlargeDevice = useMediaQuery(theme.breakpoints.down("xl"));

  const { selectedStory } = useSelector((state) => state.general);

  var userLang = navigator.language.substring(0, 2);

  //const t = useCustomTranslation(selectedStory.story_language);

  const t = useCustomTranslation(userLang);

  const [tab, setTab] = useState("showcase");

  const [loading, setLoading] = React.useState(true);
  //   const [reviews, setReviews] = React.useState([]);

  const mounted = useMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");


  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    if (selectedStory) {
      if (selectedStory.id != id) {
        dispatch(getSelectedStory(id));
       
      } //else{
    } else {
      dispatch(getSelectedStory(id));
    }

    // storiesApi.getStoriesbyId(id).then((res) => {
    //   res.data=JSON.parse(res.data_story)
    //   selectedStory=res

    // });
    //}
  }, []);


  //Every time another story is selected then the data info of the process is loaded
  useEffect(() =>{
    //console.log("La STORY A CAMBIADO:")
    if(selectedStory){
      //console.log(selectedStory.coproductionprocess_cloneforpub_id)
      dispatch(getProcessCatalogue(selectedStory.coproductionprocess_cloneforpub_id))
    }
    
  },[selectedStory])

  return (
    <Box sx={{ pb: 3, justifyContent: "center" }}>
      {selectedStory && (
        <>
          <AppBar sx={{ position: "relative" }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              {t("Success Story Overview")}
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
                  alt={selectedStory.data_story.title}
                  src={selectedStory.data_story.logo}
                />

                <Typography color="textSecondary" variant="h4">
                  {selectedStory.data_story.title}
                </Typography>
              </Grid>

             

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

              <Typography
                color="textSecondary"
                variant="h6"
                align="center"
                sx={{ mb: 3, mr: 3, ml: 3 }}
              >
                {selectedStory.data_story.short_description}
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
                  Start: {selectedStory.data_story.start_at}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  End: {selectedStory.data_story.end_at}
                </Typography>
              </Grid>

              <Divider />

              <TwoColumnsText
                text={selectedStory.data_story.description}
                mobileDevice={mobileDevice}
                largeDevice={largeDevice}
                xlargeDevice={xlargeDevice}
              />

              {selectedStory.data_story.objectives != "" && (
                <>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ ml: 5, mt: 3 }}
                  >
                    Objectives
                  </Typography>
                  <TwoColumnsText
                    text={selectedStory.data_story.objectives}
                    mobileDevice={mobileDevice}
                    largeDevice={largeDevice}
                    xlargeDevice={xlargeDevice}
                  />
                </>
              )}

              {selectedStory.data_story.results != "" && (
                <>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ ml: 5, mt: 3 }}
                  >
                    Results
                  </Typography>
                  <TwoColumnsText
                    text={selectedStory.data_story.results}
                    mobileDevice={mobileDevice}
                    largeDevice={largeDevice}
                    xlargeDevice={xlargeDevice}
                  />
                </>
              )}

              {selectedStory.data_story.lessons_learned != "" && (
                <>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ ml: 5, mt: 3 }}
                  >
                    Lessons Learned
                  </Typography>
                  <TwoColumnsText
                    text={selectedStory.data_story.lessons_learned}
                    mobileDevice={mobileDevice}
                    largeDevice={largeDevice}
                    xlargeDevice={xlargeDevice}
                  />
                </>
              )}

              {selectedStory.data_story.incentives != "" && (
                <>
                  <Divider />
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ ml: 5, mt: 3 }}
                  >
                    Incentives
                  </Typography>
                  <TwoColumnsText
                    text={selectedStory.data_story.incentives}
                    mobileDevice={mobileDevice}
                    largeDevice={largeDevice}
                    xlargeDevice={xlargeDevice}
                  />
                </>
              )}

              <Divider />
              <Typography color="textSecondary" variant="h6" sx={{ ml: 5,mt:3 }}>
                Materials
              </Typography>

              <Grid
                container
                spacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                sx={{ m: 3 }}
              >
                {selectedStory.data_story.materials.map((material) => (
                  <Card sx={{ minWidth: 275 }}>
                    <CardHeader
                      avatar={(() => {
                        switch (material.type) {
                          case "video_channel":
                            return <YouTube />;
                          //case "video_channel": return <Component2 />;
                          default:
                            null;
                        }
                      })()}
                      title={material.name}
                    />

                    <CardActions>
                      <Button href={material.link} size="small">
                        View
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Grid>

              <Divider />
              <Typography color="textSecondary" variant="h6" sx={{ ml: 5,mt:3 }}>
                Owners
              </Typography>

              <Grid
                container
                spacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                direction="row"
                justifyContent="center"
                alignItems="stretch"
              >
                {selectedStory.data_story.owners.map((owner) => (
                  <Card sx={{ minWidth: 275, m: 2 }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          variant="rounded"
                          sx={owner.logo}
                          aria-label="recipe"
                          src={owner.logo}
                        ></Avatar>
                      }
                      title={owner && owner.name}
                    />
                    <CardContent>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {owner.link}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button href={owner.link} size="small">
                        More
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Grid>


              



              <Divider />
              <Typography color="textSecondary" variant="h6" sx={{ ml: 5,mt:3 }}>
                Licenses
              </Typography>
              <Grid
                container
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="stretch"
              >
                <Typography
                  color="textSecondary"
                  variant="body2"
                  maxWidth={(theme) => theme.breakpoints.values.md}
                  sx={{ m: 5, textAlign: "justify" }}
                >
                  {selectedStory.data_story.licenses}
                </Typography>
              </Grid>





              <Divider />
              <Typography color="textSecondary" variant="h6" sx={{ ml: 5,mt:3 }}>
                Countries
              </Typography>

              <Grid
                container
                spacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                direction="row"
                justifyContent="center"
                alignItems="center"
                
              >
                {selectedStory.data_story.countries.split(',').map((country) => (
                  <Card sx={{ minWidth: 275, m: 2 }}>
                    
                    <CardContent>
                      <Typography variant="h6"  align='center' color="text.secondary">
                        {country}
                      </Typography>
                    </CardContent>
                   
                  </Card>
                ))}
              </Grid>



            </Box>
          ) : (
            <></>
          )}

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
