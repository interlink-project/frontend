import {
  Grid,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import {
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
} from "../../../../../icons";
import "./RewardSettings.css";
import { useTranslation } from "react-i18next";

const RewardSettings = () => {
  const [leaderboard, setLeaderboard] = useState(true);

  const { t } = useTranslation();
  return (
    <>
      <Grid container className="col-reward-setting">
        <Grid item sm={12} md={6} className="col-reward-left">
          <Grid container md={12}>
            <Typography variant="h1" style={{ fontWeight: 700 }}>
              {t("Reward System")}
            </Typography>
            <Typography sx={{ my: "2rem" }} style={{ fontWeight: 600 }}>
              {t(
                "The reward system permits to reward your contributors, but how?"
              )}
            </Typography>
          </Grid>

          <Grid container md={12} className="mb-2">
            <Grid item md={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0, mr: 1 }}>
                1.
              </Typography>
            </Grid>
            <Grid item md={11} sx={{ mt: 0 }}>
              <Grid container md={12} className="row-reward-left">
                <Typography variant="body1">
                  {t(
                    "You will able to set the difficulty of every task on three levels"
                  )}
                  :
                  <Box className="box-reward">
                    <li>
                      <Typography variant="body1">• {t("Easy")}</Typography>
                      <SentimentSatisfied />
                    </li>
                    <li>
                      <Typography variant="body1">• {t("Medium")}</Typography>
                      <SentimentNeutral />
                    </li>
                    <li>
                      <Typography variant="body1">• {t("Hard")}</Typography>
                      <SentimentDissatisfied />
                    </li>
                  </Box>
                </Typography>
              </Grid>
            </Grid>

            <Box
              alt="Reward image 1"
              component="img"
              src={`/static/reward/Reward_image_1.svg`}
              sx={{
                height: "auto",
                maxWidth: "100%",
                margin: "0 auto",
              }}
            ></Box>
          </Grid>
          <Grid container md={12} className="mb-2">
            <Grid item md={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0 }}>
                2.
              </Typography>
            </Grid>
            <Grid item md={11} sx={{ mt: 0 }}>
              <Typography variant="body1" className="reward-left-text">
                {t(
                  "Every time someone adds a resource to the task, he will be able to claim is contribute"
                )}
              </Typography>
              <Box
                className="mt-1"
                alt="Reward image 2"
                component="img"
                src={`/static/reward/Reward_image_2.svg`}
                sx={{
                  height: "auto",
                  maxWidth: "100%",
                }}
              ></Box>
            </Grid>
          </Grid>
          <Grid container md={12}>
            <Grid item md={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0 }}>
                3.
              </Typography>
            </Grid>
            <Grid item md={11} sx={{ mt: 0 }}>
              <Typography variant="body1" className="reward-left-text">
                Once finished a task you will have to set the contribute of
                every collaborator assigning a level of contribution based on
                four levels:{" "}
                <Box className="box-reward">
                  <li>
                    <Typography variant="body1">
                      •{" "}
                      <span style={{ color: "#F44336" }}>
                        {t("No contribute")}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      •{" "}
                      <span style={{ color: "#FF7A00" }}>
                        {t("Low contribute")}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      •{" "}
                      <span style={{ color: "#FFE607" }}>
                        {t("Medium contribute")}
                      </span>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      •{" "}
                      <span style={{ color: "#44C949" }}>
                        {t("High contribute")}
                      </span>
                    </Typography>
                  </li>
                </Box>
              </Typography>
              <Box
                className="mt-1 mb-1"
                alt="Reward image 3"
                component="img"
                src={`/static/reward/Reward_image_3.svg`}
                sx={{
                  height: "auto",
                  maxWidth: "100%",
                }}
              ></Box>
            </Grid>
          </Grid>
          <Grid container md={12}>
            <Grid item md={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0 }}>
                4.
              </Typography>
            </Grid>
            <Grid item md={11} sx={{ mt: 0 }}>
              <Typography variant="body1" className="reward-left-text">
                Now you have two ways, you can active the Leaderboard or not.
                This function permit to the users to see (in addition to his
                profile) the points of others collaborators. Obviously
                activating this function you have to bear in mind that could
                incetivize the competion beetween users.{" "}
                <strong>
                  Remember that in any case the admins will see the Leaderboard.
                </strong>
                <p>
                  <Radio
                    checked={leaderboard}
                    onChange={(e) => setLeaderboard(!leaderboard)}
                    value="noleaderboard"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "A" }}
                  />
                  2. Leaderboard + profile
                </p>
                <p>
                  <Radio
                    checked={!leaderboard}
                    onChange={(e) => setLeaderboard(!leaderboard)}
                    value="noleaderboard"
                    name="radio-buttons"
                  />
                  No Leaderboard, only personal profile
                </p>
              </Typography>
            </Grid>
          </Grid>
          <Grid container md={12}>
            <Grid item md={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0 }}>
                5.
              </Typography>
            </Grid>
            <Grid item md={11} sx={{ mt: 0 }}>
              <Typography variant="body1" className="reward-left-text">
                xxxxxxxxxxxxxxxx
              </Typography>
            </Grid>
          </Grid>
          <Grid container md={12}>
            <Grid item md={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0 }}>
                6.
              </Typography>
            </Grid>
            <Grid item md={11} sx={{ mt: 0 }}>
              <Typography variant="body1" className="reward-left-text">
                xxxxxxxxxxxxxxxx
              </Typography>
            </Grid>
          </Grid>
          <Grid container md={12}>
            <Grid item md={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0 }}>
                7.
              </Typography>
            </Grid>
            <Grid item md={11} sx={{ mt: 0 }}>
              <Typography variant="body1" className="reward-left-text">
                xxxxxxxxxxxxxxxx
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} className="col-reward-right">
          <Box
            alt="Medals"
            component="img"
            src={`/static/reward/Medals.svg`}
            className="medals-image"
          />
        </Grid>
      </Grid>
      <Grid container className="footer">
        <Grid item md={8} sm={12}>
          <Typography variant="body1" className="footer-instruction">
            If you change your mind during the process, you can disable this
            function in the settings
          </Typography>
        </Grid>
        <Grid item md={2} sm={6} className="skip-reward">
          <Typography variant="body1">I want to skip that part</Typography>
        </Grid>
        <Grid item md={2} sm={6} className="activate-reward">
          <Typography variant="body1"> Active this function</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default RewardSettings;
