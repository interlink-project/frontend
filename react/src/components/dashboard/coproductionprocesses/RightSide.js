import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Snackbar
} from "@mui/material";
import {
  Close,
  CopyAll,
  Delete,
  RecordVoiceOver,
  Download,
  Edit,
  KeyboardArrowDown,
  OpenInNew,
  Share,
  CoPresent,
} from "@mui/icons-material";

import { useMatomo } from "@datapunt/matomo-tracker-react";
import { LoadingButton } from "@mui/lab";
import { AssetsTable } from "components/dashboard/assets";
import InterlinkerBrowse from "components/dashboard/interlinkers/browse/InterlinkerBrowse";
import { ContributionsTabs, TreeItemData } from "components/dashboard/tree";
import PermissionsTable from "components/dashboard/tree/PermissionsTable";
import { Formik } from "formik";
import useDependantTranslation from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProcess, getTree, setUpdatingTree } from "slices/process";
import { information_about_translations } from "utils/someCommonTranslations";
import * as Yup from "yup";
import {
  assetsApi,
  permissionsApi,
  coproductionprocessnotificationsApi,
  tasksApi,
  gamesApi,
  teamsApi,
} from "__api__";
import NewAssetModal from "components/dashboard/coproductionprocesses/NewAssetModal";
import { useLocation } from "react-router";
import { getAssetsList_byTask, setContributionsListLevels } from "slices/general";
import { getContributions } from "slices/general";
import useAuth from "hooks/useAuth";

import { REACT_APP_COMPLETE_DOMAIN } from "configuration";
import AssetsShare from "./AssetsShare";
import { set } from "store";
import { claimsApi } from "__api__/coproduction/claimsApi";
import { ClaimDialog } from "./ClaimDialog";


const RightSide = ({ softwareInterlinkers }) => {
  const { process, isAdministrator, selectedTreeItem } = useSelector(
    (state) => state.process
  );
  const [openSnackbar,setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { assetsList, contributions, contributionslistlevels } = useSelector((state) => state.general);
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState([]);
  const [userTeams, setUserTeams] = useState([]);

  const isTask = selectedTreeItem && selectedTreeItem.type === "task";
  const [step, setStep] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loading, setLoading] = useState("");
  const [assetsShareOpen, setAssetsShareOpen] = useState(false);
  const [assetsShareLoading, setAssetsShareLoading] = useState(false);

  // new asset modal
  const [selectedInterlinker, setSelectedInterlinker] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false);
  const mounted = useMounted();
  const [externalAssetOpen, setExternalAssetOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const { t } = useDependantTranslation();
  const dispatch = useDispatch();
  // const [contributions, setContributions] = useState([]);

  const [permissions, setPermissions] = useState(null);

  const location = useLocation();
  const isLocationCatalogue = location.pathname.startsWith("/stories/");
  const { trackEvent } = useMatomo();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };


  useEffect(() => {
    if (isLocationCatalogue) {
      if (isTask && mounted.current) {
        getAssetsCatalogue();
      }
    } else {
      setPermissions(null);
      permissionsApi.for(selectedTreeItem.id).then((res) => {
        setPermissions(res);
        if (
          isTask &&
          mounted.current &&
          res &&
          res.your_permissions &&
          res.your_permissions.access_assets_permission
        ) {
          getAssets();
        } else {
          setAssets([]);
        }
      });
      if (isTask && mounted.current) {
        getContributionsData(selectedTreeItem.id);
        //Empty contributions list levels Temporal Memory
        dispatch(setContributionsListLevels([]));
      }
    }
  }, [selectedTreeItem]);

  function getContributionsData(selectTreeItemId) {
    dispatch(getContributions(selectTreeItemId));
    //console.log("contributions", contributions);
  }

  function obtenerNroContributions(contributions) {
    let nroContribution = 0;
    if (contributions && contributions) {
      if (contributions.length !== 0) {
        for (var j = 0; j < contributions.length; j++) {
          let asset = contributions[j];
          nroContribution = nroContribution + asset["contributors"].length;
        }
      }
    }

    return nroContribution;
  }

  const getAssets = async () => {
    setLoadingAssets(true);
    // assetsApi.getMulti({ task_id: selectedTreeItem.id }).then((assets) => {
    //   if (mounted.current) {
    //     setAssets(assets);
    //     setLoadingAssets(false);
    //   }
    // });
    dispatch(getAssetsList_byTask(selectedTreeItem.id));
    setAssets(assetsList);
    setLoadingAssets(false);
  };

  const getAssetsCatalogue = async () => {
    setLoadingAssets(true);
    assetsApi
      .getMultiCatalogue({ task_id: selectedTreeItem.id })
      .then((assets) => {
        if (mounted.current) {
          setAssets(assets);
          setLoadingAssets(false);
        }
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const information_translations = information_about_translations(t);

  const [tabValue, setTabValue] = useState("data");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (isTask && tabValue === "assets") {
      dispatch(getAssetsList_byTask(selectedTreeItem.id));
      setLoadingAssets(false);
    }
    if (!isTask && tabValue === "assets") {
      setTabValue("data");
    }
    if (!isTask && tabValue === "contributions") {
      setTabValue("data");
    }
  }, [selectedTreeItem, tabValue]);

  const can = {
    delete:
      isAdministrator ||
      (permissions && permissions.your_permissions.delete_assets_permission),
    create:
      isAdministrator ||
      (permissions && permissions.your_permissions.create_assets_permission),
    view:
      isAdministrator ||
      (permissions && permissions.your_permissions.access_assets_permission),
  };

  const handleOpen = (asset) => {
    //console.log(asset);
    if (asset.type === "internalasset") {
      const backend = asset["software_response"]["backend"];
      const linktoAsset = backend + "/" + asset["external_asset_id"];

      window.open(`${linktoAsset}/view`, "_blank");
    } else {
      //alert('external',asset.uri);
      window.open(asset.uri);
    }
    setAnchorEl(null);
  };

  const handleShare = (asset) => {
    const linkToAsset = `${REACT_APP_COMPLETE_DOMAIN}/dashboard/coproductionprocesses/${process.id}/${asset.id}/view`;

    copyTextToClipboard(linkToAsset);

    setSelectedAsset(asset);
    setAssetsShareOpen(true);

    setAnchorEl(null);
  };

  const handleDelete = (asset, callback) => {
    dispatch(setUpdatingTree(true));
    setLoading("delete");
    //Obtain the name with the id
    // const nombreAsset = document.getElementById('bt-' + asset.id).innerHTML;
    //console.log(asset);
    const nombreAsset = asset.internalData.name;
    localStorage.setItem("assetId", asset.id);
    const capitalizeAssetName = nombreAsset.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (letter) => letter.toUpperCase()
    );
    localStorage.setItem("assetName", capitalizeAssetName);

    //Enviar el nombre a guardar
    assetsApi.delete(asset.id).then(() => {
      setLoading("");
      callback && callback();
      setAnchorEl(null);
      dispatch(setUpdatingTree(false));

      //Update the dinamic name with a static name for the asset
      //on the coproduction notifications
      const dataUpdateParameter = {
        asset_id: localStorage.getItem("assetId"),
        name: localStorage.getItem("assetName"),
        coproductionprocess_id: process.id,
      };

      //console.log('El proceso a actualizar')
      coproductionprocessnotificationsApi
        .updateAssetNameParameter(dataUpdateParameter)
        .then((res) => {
          //console.log('Actualizacion Exitosa');
          //console.log(res.data)
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const handleClone = (asset, callback) => {
    dispatch(setUpdatingTree(true));
    setLoading("clone");

    assetsApi.clone(asset.id).then(() => {
      setLoading("");
      callback && callback();
      setAnchorEl(null);
    });
  };

  const handleDownload = (asset) => {
    window.open(`${asset.link}/download`, "_blank");
    setAnchorEl(null);
  };

  const handleClaim = (asset) => {
    //window.open(`${asset.link}/download`, '_blank');
    setSelectedAsset(asset);

    setAnchorEl(null);
    setClaimDialogOpen(true);

    
    

  };

  const handleEdit = (asset) => {
    // const backend =asset['software_response']['backend'];
    // const linktoAsset =backend+'/'+asset['external_asset_id'];

    window.open(`${linktoAsset}/edit`, "_blank");

    setAnchorEl(null);
  };

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  const getAssetsActions = (asset) => {
    const actions = [];

    let dataExtra = {};

    if (asset.type == "internalasset") {
      dataExtra["capabilities"] = {
        clone: asset["software_response"]["clone"],
        view: asset["software_response"]["view"],
        edit: asset["software_response"]["edit"],
        delete: asset["software_response"]["delete"],
        download: asset["software_response"]["download"],
      };
    }

    if (asset.type === "internalasset" && dataExtra.capabilities) {
      //const { id, capabilities } = asset;
      const id = asset.id;
      const capabilities = dataExtra.capabilities;

      actions.push({
        id: `${id}-open-action`,
        loading: loading === "open",
        onClick: (closeMenuItem) => {
          handleOpen(asset);
          closeMenuItem();
        },
        text: t("Open"),
        icon: <OpenInNew fontSize="small" />,
      });

      actions.push({
        id: `${id}-share-action`,
        loading: loading === "share",
        onClick: (closeMenuItem) => {
          handleShare(asset);
          closeMenuItem();
        },
        text: t("Assign/Share"),
        icon: <CoPresent fontSize="small" />,
      });

      if (capabilities.edit) {
        actions.push({
          id: `${id}-edit-action`,
          loading: loading === "edit",
          onClick: (closeMenuItem) => {
            handleEdit(asset);
            closeMenuItem();
            getAssets();
          },
          text: t("Edit"),
          icon: <Edit fontSize="small" />,
        });
      }

      if (capabilities.clone && can.create) {
        actions.push({
          id: `${id}-clone-action`,
          loading: loading === "clone",
          onClick: (closeMenuItem) => {
            handleClone(asset, () => {
              closeMenuItem();
              getAssets();
            });
            getAssets();
          },
          text: t("Clone"),
          icon: <CopyAll fontSize="small" />,
        });
      }
      if (capabilities.delete && can.delete) {
        actions.push({
          id: `${id}-delete-action`,
          loading: loading === "delete",
          onClick: (closeMenuItem) => {
            handleDelete(asset, () => {
              closeMenuItem();
              getAssets();
            });
            getAssets();
          },
          disabled: !can.delete,
          text: t("Delete"),
          icon: <Delete fontSize="small" />,
        });
        /*
              actions.push(<ConfirmationButton
                key={`${id}-delete-action`}
                Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text={t("Delete")} icon={<Delete fontSize="small" />} />}
                ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
                onClick={handleDelete}
                text={t("Are you sure?")} />)
                */
      }

      actions.push({
        id: `${id}-claim-action`,
        loading: loading === "clain",
        onClick: (closeMenuItem) => {
          handleClaim(asset);
          closeMenuItem();
        },
        text: t("Claim"),
        icon: <RecordVoiceOver fontSize="small" />,
      });

      // if (capabilities.download) {
      //   actions.push({
      //     id: `${id}-download-action`,
      //     loading: loading === 'download',
      //     onClick: (closeMenuItem) => {
      //       handleDownload(asset);
      //       closeMenuItem();
      //     },
      //     text: t('Download'),
      //     icon: <Download fontSize='small' />
      //   });
      // }
    }
    if (asset.type === "externalasset") {
      const { id } = asset;
      actions.push({
        id: `${id}-open-action`,
        loading: loading === "open",
        onClick: (closeMenuItem) => {
          handleOpen(asset);
          closeMenuItem();
        },
        text: t("Open"),
        icon: <OpenInNew fontSize="small" />,
      });

      actions.push({
        id: `${id}-share-action`,
        loading: loading === "share",
        onClick: (closeMenuItem) => {
          handleShare(asset);
          closeMenuItem();
        },
        text: t("Share"),
        icon: <Share fontSize="small" />,
      });

      if (can.create) {
        actions.push({
          id: `${id}-clone-action`,
          loading: loading === "clone",
          onClick: (closeMenuItem) => {
            handleClone(asset, () => {
              closeMenuItem();
              getAssets();
            });
          },
          text: t("Clone"),
          icon: <CopyAll fontSize="small" />,
        });
      }
      if (can.delete) {
        actions.push({
          id: `${id}-delete-action`,
          loading: loading === "delete",
          onClick: (closeMenuItem) => {
            handleDelete(asset, () => {
              closeMenuItem();
              getAssets();
            });
          },
          text: t("Delete"),
          icon: <Delete fontSize="small" />,
        });
      }

      actions.push({
        id: `${id}-claim-action`,
        loading: loading === "clain",
        onClick: (closeMenuItem) => {
          handleClaim(asset);
          closeMenuItem();
        },
        text: t("Claim"),
        icon: <RecordVoiceOver fontSize="small" />,
      });
    }

    return actions;
  };


  useEffect(() => {
    let listofRoles = [];
    setUserRoles([]);
    async function getRoles() {
      for (let i = 0; i < user.teams_ids.length; i++) {
        const listAllowedTeams=selectedTreeItem.teams;
        for (let j = 0; j < listAllowedTeams.length; j++) {
          if (user.teams_ids[i] === listAllowedTeams[j].id) {
            const user_team = await teamsApi.get(user.teams_ids[i]);
        
            if (!listofRoles.includes(user_team.type)){
            listofRoles.push(user_team.type);
            }
          }
        }
      }
      setUserRoles(listofRoles);
    }
    getRoles();

   
  }, [selectedTreeItem]);

  function escape(htmlStr) {
    return htmlStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  
  

  return (
    selectedTreeItem && (
      <>
        <Grid item xl={8} lg={8} md={9} xs={12}>
          <Box sx={{ p: 2 }}>
            <Paper sx={{ bgcolor: "background.default" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="guide-right-side-tabs"
                sx={{ mb: 2 }}
                
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab
                  wrapped
                  value="data"
                  label={information_translations[selectedTreeItem.type]}
                />
                <Tab
                  value="assets"
                  disabled={!isTask}
                  //label={t('Resources') + (isTask ? ` ${loadingAssets ? '(...)' : ''}` : '')}
                  label={
                    t("Resources") +
                    (isTask
                      ? ` (${loadingAssets ? "..." : assetsList.length})`
                      : "")
                  }
                />

                {!isLocationCatalogue && (
                  <Tab
                    value="permissions"
                    label={`${t("Permissions")} (${
                      selectedTreeItem.permissions.length
                    })`}
                  />
                )}
                {!isLocationCatalogue &&
                  isTask &&
                  isAdministrator &&
                  !process.is_part_of_publication &&
                  process.game_id && (
                    <Tab
                      value="contributions"
                      label={`${t("Contributions")} (${obtenerNroContributions(
                        contributions
                      )})`}
                    />
                  )}
              </Tabs>
            </Paper>

            {tabValue === "data" && (
              <TreeItemData
                language={process.language}
                processId={process.id}
                element={selectedTreeItem}
                assets={assets}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarMessage={setSnackbarMessage}
              />
            )}
            {tabValue === "permissions" && (
              <PermissionsTable
                your_permissions={permissions && permissions.your_permissions}
                your_roles={permissions && permissions.your_roles}
                onChanges={() =>
                  dispatch(getProcess(process.id, false, selectedTreeItem.id))
                }
                language={process.language}
                processId={process.id}
                element={selectedTreeItem}
                isAdministrator={isAdministrator}
              />
            )}
            {tabValue === "assets" && (
              <>
                <Box>
                  <Box sx={{ mt: 2 }}>
                    {isLocationCatalogue ? (
                      <>
                        <AssetsTable
                          language={process.language}
                          loading={loadingAssets}
                          //assets={assetsList}
                        />
                      </>
                    ) : (
                      <>
                        {permissions && (
                          <>
                            {can.view ? (
                              <AssetsTable
                                language={process.language}
                                loading={loadingAssets}
                                getActions={getAssetsActions}
                              />
                            ) : (
                              <Alert severity="error">
                                {t(
                                  "You do not have access to the resources of this task"
                                )}
                              </Alert>
                            )}
                          </>
                        )}

                        <Box sx={{ textAlign: "center", width: "100%" }}>
                          <Stack spacing={2}>
                            <Button
                              id="basic-button"
                              aria-controls={open ? "basic-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              onClick={() => setCatalogueOpen(true)}
                              variant="contained"
                              sx={{ mt: 2 }}
                              disabled={!can.create}
                            >
                              <>{t("Open catalogue")}</>
                            </Button>
                            <Button
                              id="basic-button"
                              aria-controls={open ? "basic-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              onClick={handleClick}
                              variant="contained"
                              endIcon={<KeyboardArrowDown />}
                              disabled={!can.create}
                            >
                              <>{t("Initiate procedure")}</>
                            </Button>
                          </Stack>
                        </Box>
                      </>
                    )}
                  </Box>

                  <Dialog
                    open={catalogueOpen}
                    onClose={() => setCatalogueOpen(false)}
                    maxWidth="lg"
                    fullWidth
                  >
                    <IconButton
                      aria-label="close"
                      onClick={() => setCatalogueOpen(false)}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Close />
                    </IconButton>
                    <Box
                      sx={{
                        minWidth: "70vh",
                        p: 7,
                        backgroundColor: "background.default",
                      }}
                    >
                      <InterlinkerBrowse
                        language={process.language}
                        initialFilters={{
                          problemprofiles: selectedTreeItem.problemprofiles,
                        }}
                        onInterlinkerClick={(interlinker) => {
                          setCatalogueOpen(false);
                          setStep(0);
                          setSelectedInterlinker(interlinker);
                          setNewAssetDialogOpen(true);
                        }}
                      />
                    </Box>
                  </Dialog>
                  <Dialog
                    open={externalAssetOpen}
                    onClose={() => setExternalAssetOpen(false)}
                  >
                    <DialogContent sx={{ p: 2 }}>
                      <Formik
                        initialValues={{
                          name: "",
                          uri: "",
                        }}
                        validationSchema={Yup.object().shape({
                          name: Yup.string()
                            .min(3, "Must be at least 3 characters")
                            .max(255)
                            .required("Required"),
                          uri: Yup.string()
                            .min(3, "Must be at least 3 characters")
                            .required("Required"),
                        })}
                        onSubmit={(
                          values,
                          { setErrors, setStatus, setSubmitting }
                        ) => {
                          setSubmitting(true);
                          assetsApi
                            .create_external(
                              selectedTreeItem.id,
                              null,
                              values.name,
                              values.uri
                            )
                            .then((res) => {
                              setStatus({ success: true });
                              setSubmitting(false);
                              getAssets();
                              setExternalAssetOpen(false);
                            })
                            .catch((err) => {
                              setStatus({ success: false });
                              setErrors({ submit: err });
                              setSubmitting(false);
                            });
                        }}
                      >
                        {({
                          errors,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldTouched,
                          touched,
                          values,
                        }) => (
                          <form onSubmit={handleSubmit}>
                            <Box sx={{ mt: 2 }}>
                              <TextField
                                required
                                error={Boolean(touched.name && errors.name)}
                                fullWidth
                                helperText={touched.name && errors.name}
                                label="Name"
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                onClick={() => setFieldTouched("name")}
                                value={values.name}
                                variant="outlined"
                              />
                              <TextField
                                required
                                sx={{ mt: 2 }}
                                error={Boolean(touched.uri && errors.uri)}
                                fullWidth
                                helperText={touched.uri && errors.uri}
                                label="URI"
                                name="uri"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                onClick={() => setFieldTouched("uri")}
                                value={values.uri}
                                variant="outlined"
                              />
                              <LoadingButton
                                sx={{ mt: 2 }}
                                variant="contained"
                                fullWidth
                                loading={isSubmitting}
                                onClick={handleSubmit}
                              >
                                {t("Create")}
                              </LoadingButton>
                            </Box>
                          </form>
                        )}
                      </Formik>
                    </DialogContent>
                  </Dialog>

                  <ClaimDialog 
                  claimDialogOpen={claimDialogOpen} 
                  setClaimDialogOpen={setClaimDialogOpen} 
                  selectedAsset={selectedAsset}
                  afterRefreshEvent={getContributions(selectedTreeItem.id)}
                  />

                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setExternalAssetOpen(true);
                        handleMenuClose();
                      }}
                    >
                      <Avatar
                        src="https://cdn-icons-png.flaticon.com/512/282/282100.png"
                        sx={{ mr: 2, height: "20px", width: "20px" }}
                      />
                      {t("Link an external resource")}
                    </MenuItem>
                    {softwareInterlinkers.map((si) => (
                      <MenuItem
                        key={si.id}
                        onClick={() => {
                          setStep(1);
                          setSelectedInterlinker(si);
                          setNewAssetDialogOpen(true);
                          handleMenuClose();
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          src={si.logotype_link}
                          sx={{ mr: 2, height: "20px", width: "20px" }}
                        />
                        {si.instantiate_text}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                {selectedInterlinker && (
                  <NewAssetModal
                    handleUserClose={() => {
                      setNewAssetDialogOpen(false);
                      setTimeout(() => {
                        setStep(0);
                      }, 1000);
                      setCatalogueOpen(true);
                    }}
                    handleFinish={() => {
                      setNewAssetDialogOpen(false);
                      setTimeout(() => {
                        setStep(0);
                      }, 1000);
                    }}
                    open={newAssetDialogOpen}
                    activeStep={step}
                    setStep={setStep}
                    selectedInterlinker={selectedInterlinker}
                    treeitem={selectedTreeItem}
                    onCreate={() =>
                      dispatch(getTree(process.id, selectedTreeItem.id))
                    }
                  />
                )}
              </>
            )}
            {tabValue === "contributions" && (
              <ContributionsTabs
              //contributions={contributions}
              //setContributions={setContributions}

              // element={selectedTreeItem}
              // your_permissions={permissions && permissions.your_permissions}
              // your_roles={permissions && permissions.your_roles}
              // language={process.language}
              // processId={process.id}
              // element={selectedTreeItem}
              // isAdministrator={isAdministrator}
              />
            )}
          </Box>

          <AssetsShare
            open={assetsShareOpen}
            setOpen={setAssetsShareOpen}
            loading={assetsShareLoading}
            setLoading={setAssetsShareLoading}
            asset={selectedAsset}
          />
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          key={"top" + "center"}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%", fontSize: "1rem", fontWeight: "600" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
    )
  );
};

export default RightSide;
