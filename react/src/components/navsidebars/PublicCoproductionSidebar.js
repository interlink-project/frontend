import {
  Grid,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  IconButton,
  Chip,
  Divider,
  Drawer,
  Stack,
  Paper,
  Typography,
  useMediaQuery,
  Rating,
} from "@mui/material";
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Close,
  Hail,
  ArrowBack,
  PermMedia,
  Balcony,
} from "@mui/icons-material";
import useDependantTranslation from "hooks/useDependantTranslation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import NavSection from "../NavSection";
import Scrollbar from "../Scrollbar";
import ConfirmationButton from "components/ConfirmationButton";
import { coproductionProcessesApi } from "__api__";
import InterlinkAnimation from "components/home/InterlinkLoading";
import { styled } from "@mui/material/styles";
import ApplytoCoproductionDialog from "components/dashboard/publiccoproductions/profile/ApplytoCoproductionDialog";
import ApplytoCoproductionDialogV2 from "components/dashboard/publiccoproductions/profile/ApplytoCoproductionDialogV2";
import { set } from "store";


const PublicCoproductionSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  //const { process, hasSchema, loading, updating } = useSelector((state) => state.process);
  const navigate = useNavigate();
  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  //const processId = process && process.id;

  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const { selectedPubliccoproduction } = useSelector((state) => state.general);
  let publiccoproductionId = 1;
  if (selectedPubliccoproduction) {
    publiccoproductionId = selectedPubliccoproduction.id;
  }
  const { t } = useDependantTranslation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const sections = [
    {
      id: 1,
      title: "",
      items: [
        // {
        //   title: t("Process Overview"),
        //   path: `/publiccoproductions/${publiccoproductionId}/profile`,
        //   icon: <Balcony />,
        //   disabled: false,
        // },

        // {
        //   title: t("Resources"),
        //   path: `/publiccoproductions/${publiccoproductionId}/resources`,
        //   icon: <PermMedia />,
        //   // disabled: !hasSchema
        // },
        // {
        //   title: t('RoadMap'),
        //   path: `/publiccoproductions/${publiccoproductionId}/roadmap`,
        //   icon: <AssistantDirection />,
        //   //disabled: !hasSchema
        // },
      ],
    },
  ];

  const onClone = () => {
    //alert("You have succefully apllied to this coproduction process.")
    setApplyDialogOpen(true);
    // setLoadingDialogOpen(true);
    // coproductionProcessesApi
    //   .copy(
    //     selectedPubliccoproduction.coproductionprocess_cloneforpub_id,
    //     "Clone of_ ",
    //     "publiccoproduction"
    //   )
    //   .then(() => {
    //     setLoadingDialogOpen(false);
    //     navigate("/dashboard");
    //   });
  };

  const logoStyle = {
    width: "300px",
    height: "auto",
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Scrollbar options={{ suppressScrollX: true }}>
          {false && (
            <Button
              startIcon={<ArrowBack />}
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => navigate("/dashboard")}
            />
          )}
          {selectedPubliccoproduction && (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              //spacing={!loading && !updating ? 1 : 0}
              spacing="1"
              sx={{ p: 3 }}
            >
              {/* {!loading && !updating ? ( */}
              <Avatar
                variant="rounded"
                sx={{ width: "80px", height: "80px" }}
                src={'/coproduction'+selectedPubliccoproduction.logotype}
              >
                {/*               {(!selectedPubliccoproduction || !selectedPubliccoproduction.logo) && <Folder />}
              {' '} */}
              </Avatar>
              {/*  ) : ( */}
              {/* <Skeleton
              variant='rounded'
              sx={{ m: 1, width: '80px', height: '80px' }}
            /> */}
              {/* )} */}
              <Typography
                sx={{ textAlign: "center", width: "100%" }}
                variant="h6"
              >
                {selectedPubliccoproduction.name}
                {/*  {!loading && !updating && process ? process.name : <Skeleton />} */}
              </Typography>

              <Rating readOnly size="small" value={selectedPubliccoproduction.rating || 0} />
            </Stack>
          )}
      

          <Divider />

          <Typography
            sx={{ textAlign: "center", width: "100%", mt: 3, mb: 3 }}
            variant="h6"
          >
            Topics
            {/*  {!loading && !updating && process ? process.name : <Skeleton />} */}
          </Typography>

          {selectedPubliccoproduction ? (
            <>
              {selectedPubliccoproduction.tags != "" && (
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
            </>
          ) : (
            <></>
          )}

          {/*  {!loading && !updating && process ? (
            <StatusChip
              t={t}
              status={process.status}
            />
          ) : <Skeleton sx={{ width: 80, height: 45, m: 0, p: 0 }} />}
          {!loading && !updating && process ? (
            <Chip
              size='small'
              color='default'
              label={LANGUAGES.find((el) => el.value === process.language).label}
            />
          ) : <Skeleton sx={{ width: 80, height: 45, m: 0, p: 0 }} />} */}

          <Divider />
          <Box sx={{ p: 2 }}>
            
              <>
              {sections.map((section) => (
                <NavSection
                  key={section.id}
                  pathname={location.pathname}
                  sx={{
                    "& + &": {
                      mt: 3,
                    },
                    color: "text.secondary",
                  }}
                  {...section}
                />
                ))}
                

                <Box sx={{ textAlign: "center", width: "100%", mt: 3, mb: 3 }}>
                  <ConfirmationButton
                    Actionator={({ onClick }) => (
                      <Button
                        variant="contained"
                        //disabled={!isAdministrator}
                        color="success"
                        onClick={onClick}
                        size="large"
                        startIcon={<Hail />}
                      >
                        {t("Apply to be part of this coproduction")}
                      </Button>
                    )}
                    ButtonComponent={({ onClick }) => (
                      <Button
                        sx={{ mt: 1 }}
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={onClick}
                      >
                        {t("Yes")}
                      </Button>
                    )}
                    //onClick={onRemove}
                    onClick={onClone}
                    text={t("Are you sure?")}
                  />
                </Box>
              </>
            
          </Box>
        </Scrollbar>
      </Box>

      <Dialog
        open={loadingDialogOpen}
        onClose={() => setLoadingDialogOpen(false)}
      >
        <IconButton
          aria-label="close"
          onClick={() => setLoadingDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Item>
              <div style={logoStyle}>
                <InterlinkAnimation />
              </div>
            </Item>
            <Item>
              <div>{t("Cloning the PublicCoproduction please wait.")}</div>
            </Item>
            <Item>
              <div>{t("The process could last some minutes.")}</div>
            </Item>
          </Stack>
        </DialogContent>
      </Dialog>

    <ApplytoCoproductionDialogV2 open={applyDialogOpen} handleClose={() => setApplyDialogOpen(false)} />

    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            height: "calc(100% - 64px) !important",
            top: "64px !Important",
            width: "260px",
            zIndex: 0,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          width: 300,
          zIndex: 0,
        },
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

PublicCoproductionSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default PublicCoproductionSidebar;
