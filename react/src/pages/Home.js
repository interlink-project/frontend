import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Grid,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { HomeRow } from "components/home";
import { HomeLogo } from "components/Logo";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from 'react-router-dom';
import HomeBottomRow from "components/home/HomeBottomRow";
import i18n from "translations/i18n";





const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleAcceptAll = () => {
    console.log('Accepted all cookies');
    // Here, implement logic to accept all cookies
    setOpen(false);  // close the Snackbar
  };

  const handleAcceptEssential = () => {
    console.log('Accepted only essential cookies');
    // Here, implement logic to accept only essential cookies
    setOpen(false);  // close the Snackbar
  };

  const links = [
    { path: "/", label: "Project" },
    { path: "/platform", label: "INTERLINK platform" },
    { path: "/copro", label: "Co-production" },
    { path: "/catal", label: "Catalogue" },
    { path: "/about", label: "About" },
  ];

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

              <Snackbar
                open={open}
                onClose={handleClose}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Alert
                  severity="info"
                  sx={{
                    width: "95vw",

                    border: "1px solid black",
                    typography: {
                      fontWeight: "bold",
                      fontSize: "1.2em",
                    },
                    ".MuiAlert-icon": {
                      fontSize: "2em",
                      alignSelf: "center", // Center the icon vertically
                    },
                    display: "flex", // Make the Alert a flex container
                    alignItems: "center", // Center children vertically
                    justifyContent: "center",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                      This site uses cookies to offer a better browsing
                      experience. More information about <Link to="/cookie-policy">how we use cookies.</Link>
                    </Grid>
                    <Grid item xs={4} container justifyContent="flex-end">
                      <Stack direction="row" spacing={2}>
                      <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleAcceptAll}
                        >
                            Accept all cookies
                        </Button>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleAcceptEssential}
                        >
                            Accept only essential cookies
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Alert>
              </Snackbar>
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




        
        <HomeBottomRow
          light={false}
          graphic={
            <HomeLogo style={{ width: "60%", height: "auto" }} />
          }
          right={
            <>
             

             {links.map(link => (
              <Typography
                color="textSecondary"
                sx={{ my: 3 }}
                variant="subtitle1"
                data-cy={`home-link-${link.path.slice(1)}`}
              >
               
                <Link

                  color={
                    location.pathname === link.path ? "primary" : "textSecondary"
                  }



                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  variant="body1"


                  sx={{
                    color: location.pathname === link.path ? 'primary.main' : 'grey.600 !important', // Adjust the colors
                    textDecoration: 'none !important',
                    '&:hover': {
                      textDecoration: 'underline !important' // Optional: Add an underline on hover
                    },
                    transition: 'color 0.3s ease'
                  }}



                
                  data-cy={`landingPage_link_${i18n.t(link.label).replace(" ", "_")}`}
                >
                  {i18n.t(link.label)}
                </Link>
             
              </Typography>
            ))}

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  m: -1,
                  padding:2,
                  gap:2,
                  alignItems: 'center',  // centers items vertically
                  justifyContent: 'center'  // centers items horizontally
                }}
              >

           
            

            <Typography color="textSecondary" sx={{ my: 3 }} variant="subtitle1" >
              <Link
                color={location.pathname === "/cookie-policy" ? "primary" : "textSecondary"}
                component={RouterLink}
                to="/cookie-policy"
                underline="none"
                variant="body1"
              >
                Cookie Policy
              </Link>
            </Typography>

            <Typography color="textSecondary" sx={{ my: 3 }} variant="subtitle1" >
              <Link
                color={location.pathname === "/terms-of-use" ? "primary" : "textSecondary"}
                component={RouterLink}
                to="/privacy"
                underline="none"
                variant="body1"
              >
                Terms of Use
              </Link>
            </Typography>

              </Box>

              
            </>
          }
        />
      </div>
    </>
  );
};

export default Home;
