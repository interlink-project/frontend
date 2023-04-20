import { Grid, Typography, Box } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import {
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
} from "../../../../../icons";
import "./RewardSettings.css";
import { useTranslation } from "react-i18next";

const RewardSettings = () => {
  const { t } = useTranslation();
  return (
    <>
      <Grid container className="col-reward-setting">
        <Grid item sm={12} md={6} className="col-reward-left">
          <Grid container sm={12}>
            <Typography variant="h1" style={{ fontWeight: 700 }}>
              {t("Reward System")}
            </Typography>
            <Typography sx={{ my: "2rem" }} style={{ fontWeight: 600 }}>
              {t(
                "The reward system permits to reward your contributors, but how?"
              )}
            </Typography>
          </Grid>

          <Grid container sm={12}>
            <Grid item sm={1} className="reward-left-number">
              <Typography variant="h1" sx={{ mt: 0 }}>
                1.
              </Typography>
            </Grid>
            <Grid item sm={11} sx={{ mt: 0 }}>
              <Typography variant="body1">
                {t(
                  "You will able to set the difficulty of every task on three levels"
                )}
                :
                <Box className="box-reward">
                  <li>
                    <Typography variant="body1">• Easy</Typography>
                    <SentimentSatisfied />
                  </li>
                  <li>
                    <Typography variant="body1">• Normal</Typography>
                    <SentimentNeutral />
                  </li>
                  <li>
                    <Typography variant="body1">• Hard</Typography>
                    <SentimentDissatisfied />
                  </li>
                </Box>
              </Typography>
            </Grid>
          </Grid>
          <Grid container sm={12}>
            <Box
              alt="Medals"
              component="img"
              src={`/static/reward/Reward_image_1.svg`}
              sx={{
                height: "auto",
                maxWidth: "100%",
              }}
            ></Box>
          </Grid>
        </Grid>
        <Grid item sm={12} md={6} className="col-reward-right">
          <Box
            alt="Medals"
            component="img"
            src={`/static/reward/Medals.svg`}
            sx={{
              maxWidth: "60%",
            }}
          />
        </Grid>
      </Grid>
      <Grid container className="footer">
        <Grid item sm={8}>
          <Typography variant="body1">
            If you change your mind during the process, you can disable this
            function in the settings
          </Typography>
        </Grid>
        <Grid item sm={2}>
          <Typography variant="body1">I want to skip that part</Typography>
        </Grid>
        <Grid item sm={2}>
          <Typography variant="body1"> Active this function</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default RewardSettings;
