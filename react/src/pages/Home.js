import { Box, Button, Container, Fade, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { HomeRow } from "components/home";
import { HomeLogo } from "components/Logo";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <Fade in>
          <Box
            sx={{
              backgroundColor: "background.paper",
              pt: 6,
              pb: 4,
            }}
          >
            <Container
              maxWidth="md"
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                px: {
                  md: "130px !important",
                },
                py: 5,
              }}
            >
              <HomeLogo style={{ width: "90%", height: "auto" }} />
              <Typography
                align="center"
                variant="h5"
                sx={{ my: 5 }}
                data-cy="home-1-1"
              >
                {t("home-1-1")}
              </Typography>
              <Button
                color="primary"
                component={RouterLink}
                size="large"
                to="/dashboard"
                variant="contained"
                sx={{ fontSize: "20px" }}
                endIcon={<ChevronRight />}
                data-cy="home-1-2"
              >
                {t("home-1-2")}
              </Button>
            </Container>
          </Box>
        </Fade>

        <HomeRow
          light={false}
          graphic={
            <iframe
              data-cy="home-2-0"
              style={{
                minHeight: "300px",
                width: "100%",
              }}
              src="https://www.youtube.com/embed/oCPz7dxN2Hk"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          }
          right={
            <div>
              <Typography data-cy="home-2-1" variant="h4">
                {t("home-2-1")}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ my: 3, textAlign: "justify" }}
                variant="subtitle1"
                data-cy="home-2-2"
              >
                {t("home-2-2")}
              </Typography>
            </div>
          }
        />
        <HomeRow
          graphic={
            <img
              style={{ width: "100%", height: "auto" }}
              src="/static/graphics/figure7.png"
              data-cy="home-3-0"
            />
          }
          right={
            <>
              <Typography variant="h3">{t("home-3-1")}</Typography>
              <Typography
                color="textSecondary"
                sx={{ my: 3 }}
                variant="subtitle1"
                data-cy="home-3-2"
              >
                {t("home-3-2")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  m: -1,
                }}
              >
                <Button
                  onClick={() => navigate("/coprod")}
                  size="large"
                  sx={{ m: 1 }}
                  variant="outlined"
                  data-cy="home-3-3"
                >
                  {t("home-3-3")}
                </Button>
              </Box>
            </>
          }
        />

        <HomeRow
          graphic={
            <img
              style={{ width: "100%", height: "auto" }}
              src="/static/graphics/wordcloud-white.png"
              data-cy="home-4-0"
            />
          }
          light={false}
          right={
            <>
              <Typography variant="h3" data-cy="home-4-1">
                {t("home-4-1")}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ my: 3 }}
                variant="subtitle1"
                data-cy="home-4-2"
              >
                {t("home-4-2")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  m: -1,
                }}
              >
                <Button
                  onClick={() => navigate("/catal")}
                  size="large"
                  sx={{ m: 1 }}
                  variant="outlined"
                  data-cy="home-4-3"
                >
                  {t("home-4-3")}
                </Button>
              </Box>
            </>
          }
        />
        <HomeRow
          graphic={
            <img
              style={{ width: "100%", height: "auto" }}
              src="/static/graphics/map2.png"
              data-cy="home-5-0"
            />
          }
          right={
            <>
              <Typography variant="h3" data-cy="home-5-1">
                {t("home-5-1")}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ my: 3 }}
                variant="subtitle1"
                data-cy="home-5-2"
              >
                {t("home-5-2")}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  m: -1,
                }}
              >
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="large"
                  sx={{ m: 1 }}
                  variant="outlined"
                  data-cy="home-5-3"
                >
                  {t("home-5-3")}
                </Button>
              </Box>
            </>
          }
        />
      </div>
    </>
  );
};

export default Home;
