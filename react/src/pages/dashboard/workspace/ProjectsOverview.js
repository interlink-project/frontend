import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Add, Folder, MenuBook,FileUpload, Close, ViewList } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import AuthGuardSkeleton from "components/guards/AuthGuardSkeleton";
import useMounted from "hooks/useMounted";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  getCoproductionProcesses,
  getUnseenUserNotifications,
} from "slices/general";
import { cleanProcess } from "slices/process";
import useAuth from "../../../hooks/useAuth";
import CoproductionprocessCreate from "./CoproductionProcessCreate";
import CentricCircularProgress from "components/CentricCircularProgress";
import { StatusChip, WarningIcon } from "components/Icons";
import HelpAlert from "components/HelpAlert";
import SearchBox from "components/SearchBox";
import moment from "moment";
import TeamAvatar from "components/TeamAvatar";
import Ballot from "@mui/icons-material/Ballot";

import { coproductionProcessesApi } from "__api__";

function ProcessRow({ process, t }) {
  const navigate = useNavigate();

  return (
    <TableRow
      key={process.id}
      hover
      sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
      onClick={() => {
        if (process.hideguidechecklist) {
          navigate(`/dashboard/coproductionprocesses/${process.id}/profile`);
        } else {
          navigate(`/dashboard/coproductionprocesses/${process.id}/overview`);
        }
      }}
    >
      <TableCell align="center">
        <Box style={{ justifyContent: "center", display: "flex" }}>
          {process.is_part_of_publication && <MenuBook sx={{ mr: 1 }} />}

          {process.logotype_link ? (
            <Avatar
              sx={{ height: "25px", width: "25px" }}
              variant="rounded"
              src={process.logotype_link}
            />
          ) : (
            <Folder />
          )}
        </Box>
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        <b>{process.name}</b>
      </TableCell>
      <TableCell align="center">
        {moment(process.created_at).fromNow()}
      </TableCell>
      <TableCell align="center">
        <StatusChip t={t} status={process.status} />
      </TableCell>
      <TableCell align="center">
        <AvatarGroup max={5} variant="rounded">
          {process.enabled_teams.length > 0 ? (
            process.enabled_teams.map((team) => (
              <TeamAvatar
                sx={{ height: 25, width: 25 }}
                key={team.id}
                team={team}
              />
            ))
          ) : (
            <Stack direction="row" alignItems="center">
              <WarningIcon />
              <Typography sx={{ ml: 2 }}>{t("No teams")}</Typography>
            </Stack>
          )}
        </AvatarGroup>
      </TableCell>
      <TableCell align="center">
        {process.current_user_participation.map((p) => (
          <Chip key={p} label={p} />
        ))}
      </TableCell>
    </TableRow>
  );
}
const ProjectsOverview = () => {
  const { processes, loadingProcesses } = useSelector((state) => state.general);
  const [coproductionProcessCreatorOpen, setCoproductionProcessCreatorOpen] =
    React.useState(false);
  const [coproductionProcessLoading, setCoproductionProcessLoading] =
    React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [pageSize, setPageSize] = React.useState(5);
  const navigate = useNavigate();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();

  const momentComparator = (a, b) => {
    return moment(a).diff(moment(b));
  };

  const [importDialogOpen, setImportDialogOpen] = React.useState(false);

  const [fileContent, setFileContent] = React.useState('');

  

  const QuickSearchToolbar = () => {
    return (
      <Box
        sx={{
          pl: 1,
          pr: 1,
          pb: 2,
          pt: 1,
          display: 'flex',
        }}
      >
        <GridToolbarQuickFilter
          style={{ flex: 1 }}

          quickFilterParser={(searchInput) =>
            searchInput
              .split(',')
              .map((value) => value.trim())
              .filter((value) => value !== '')
          }
          debounceMs={600}
        />
      </Box>
    );

  };

  const columns = [
    {
      field: "icon",
      headerName: "",
      sortable: false,
      flex: 0.05,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => {
        return params.row.is_part_of_publication ? (
          <MenuBook sx={{ mr: 1 }} />
        ) : params.row.logotype_link ? (
          <Avatar
            sx={{ height: "25px", width: "25px" }}
            variant="rounded"
            src={params.row.logotype_link}
          />
        ) : (
          <Folder />
        );
      },
    },
    {
      field: "name",
      headerName: t("Name"),
      flex: 2,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <b>{params.row.name}</b>;
      },
      valueGetter: (params) => { return params.row.name },
    },
    {
      field: "tags",
      headerName: t("Tags"),
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      valueGetter: (params) => {
        if (params.value.length == 0) return t("No tags");
        let tmp_tags = [];
        tmp_tags.push(params.value.map((tag) => tag.name));
        return tmp_tags.toString();
      },
      renderCell: (params) => {
        return (
          <>
            {params.row.tags.length > 0 ? (
              <Chip
                key={params.row.tags[0].name}
                label={params.row.tags[0].name}
              />
            ) : (
              <Typography sx={{ ml: 2 }}>{t("No tags")}</Typography>
            )}
          </>
        );
      },
    },
    {
      field: "created",
      headerName: t("Created"),
      flex: 1,
      align: "center",
      headerAlign: "center",
      filterable: false,
      valueGetter: (params) => {
        return params.row.created_at;
      },
      sortComparator: momentComparator,
      renderCell: (params) => {
        return moment(params.row.created_at).fromNow();
      },
    },
    {
      field: "status",
      headerName: t("Status"),
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => {
        return <StatusChip t={t} status={params.row.status} />;
      },
    },
    {
      field: "teams",
      headerName: t("Teams"),
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => {
        return (
          <AvatarGroup max={5} variant="rounded">
            {params.row.teams.length > 0 ? (
              params.row.teams.map((team) => (
                <TeamAvatar
                  sx={{ height: 25, width: 25 }}
                  // key={team.id}
                  team={team}
                />
              ))
            ) : (
              <Stack direction="row" alignItems="center">
                <WarningIcon />
                <Typography sx={{ ml: 2 }}>{t("No teams")}</Typography>
              </Stack>
            )}
          </AvatarGroup>
        );
      },
    },
    {
      field: "participation",
      headerName: t("Roles"),
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => {
        return params.row.participation.map((p) => <Chip key={p} label={p} />);
      },
    },
  ];

  const rows = processes.map((process) => {
    return {
      id: process.id,
      name: process.name,
      created_at: process.created_at,
      status: process.status,
      teams: process.enabled_teams,
      participation: process.current_user_participation,
      tags: process.tags,
      is_part_of_publication: process.is_part_of_publication,
      logotype_link: process.logotype_link,
      hideguidechecklist: process.hideguidechecklist,
    };
  });

  const getCoproductionProcessesData = React.useCallback(
    async (search) => {
      if (isAuthenticated) {
        dispatch(cleanProcess());
        dispatch(getCoproductionProcesses(search));
      }
    },
    [isAuthenticated, mounted]
  );

  const getUnseenUserNotificationsData = React.useCallback(
    async (search) => {
      if (isAuthenticated) {
        dispatch(cleanProcess());
        dispatch(getUnseenUserNotifications(search));
        //dispatch(getUnseenUserNotifications({'user_id':user.id}));
      }
    },
    [isAuthenticated, mounted]
  );

  // if (mounted.current) {
  //   dispatch(cleanProcess());
  //   dispatch(getUnseenUserNotifications(search));
  // }

  React.useEffect(() => {
    let delayDebounceFn;
    if (mounted.current) {
      delayDebounceFn = setTimeout(
        () => {
          getCoproductionProcessesData(searchValue);
        },
        searchValue ? 800 : 0
      );
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [getCoproductionProcessesData, searchValue]);

  React.useEffect(() => {
    let delayDebounceFn;
    if (mounted.current) {
      delayDebounceFn = setTimeout(
        () => {
          getUnseenUserNotificationsData({ user_id: user?.id });
        },
        searchValue ? 800 : 0
      );
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [getUnseenUserNotificationsData]);

  const onProcessCreate = (res) => {
    navigate(`/dashboard/coproductionprocesses/${res.id}/overview`);
  };

  const handleDiscovery= () => {
    // Navigate to the desired page
    navigate("/dashboard/interlinkers?tab=Processes");
  };

  const handleImportProcess= () => {
    // Show panel to import a process from a zip file.
    //alert("show panel of import with a file");
    setImportDialogOpen(true);
  };


  const handleCapture = async ({ target }) => {
    const file = target.files[0];
    if (file) {
      const fileName = file.name;
      console.log('File Name: ', fileName);
      const response = await coproductionProcessesApi.importProcess(file);
      // handle the response
      console.log(response)
      navigate(`/dashboard/coproductionprocesses/${response.id}/overview`);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("workspace-title")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 5,
          px: 1,
        }}
      >
        <Container maxWidth="lg">
          <AuthGuardSkeleton height="60vh" width="100%">
            <Grid container spacing={3}>
              <Grid
                alignItems="center"
                container
                justifyContent="space-between"
                spacing={3}
                item
                xs={12}
              >
                <Grid item>
                  <Typography
                    color="textSecondary"
                    variant="overline"
                    data-cy="workspace-title"
                  >
                    {t("Workspace")}
                  </Typography>
                  <Typography
                    color="textPrimary"
                    variant="h5"
                    data-cy="welcome-to-user"
                  >
                    {t("Welcome", {
                      name: user ? user.given_name : "",
                    })}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    data-cy="workspace-subtitle"
                  >
                    {t("workspace-subtitle")}
                  </Typography>
                </Grid>
                <Stack direction="row"  spacing={2} alignItems="center">

                <Grid sx={{m:2}} item>
                  <LoadingButton
                    onClick={() => setCoproductionProcessCreatorOpen(true)}
                    loading={loadingProcesses}
                    fullWidth
                    variant="contained"
                    sx={{ textAlign: "center", mt: 1, mb: 2 }}
                    startIcon={<Add />}
                    size="small"
                    data-cy="add-process"
                  >
                    {t("add-process")}
                  </LoadingButton>
                  

                </Grid>

                <Grid sx={{m:2}}  item>
                <Button variant="contained" color="primary" startIcon={<FileUpload />} size="small" sx={{ textAlign: "center", mt: 1, mb: 2 }} onClick={handleImportProcess} data-cy="help">
                    {t("Import a processes")}
                  </Button>
                  </Grid>
                
                <Grid sx={{m:2}}  item>
                  <Button variant="contained" color="primary" startIcon={<Ballot />} size="small" sx={{ textAlign: "center", mt: 1, mb: 2 }} onClick={handleDiscovery} data-cy="help">
                    {t("Discover open processes")}
                  </Button>

                  </Grid>
                  </Stack>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                components={{
                  Toolbar: QuickSearchToolbar,
                }}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                rowSelection={false}
                disableRowSelectionOnClick={true}
                autoHeight
                onRowClick={(params) => {
                  if (params.row.hideguidechecklist) {
                    navigate(
                      `/dashboard/coproductionprocesses/${params.row.id}/profile`
                    );
                  } else {
                    navigate(
                      `/dashboard/coproductionprocesses/${params.row.id}/overview`
                    );
                  }
                }}
                localeText={{
                  noRowsLabel: t("No coproduction processes found"),
                }}
                sx={{
                  // pointer cursor on ALL rows
                  "& .MuiDataGrid-row:hover": {
                    cursor: "pointer",
                  },
                }}
              />
              <CoproductionprocessCreate
                open={coproductionProcessCreatorOpen}
                setOpen={setCoproductionProcessCreatorOpen}
                loading={coproductionProcessLoading}
                setLoading={setCoproductionProcessLoading}
                onCreate={onProcessCreate}
              />
            </Box>
          </AuthGuardSkeleton>
        </Container>
      </Box>

      <Dialog
        open={importDialogOpen}
        onClose={() => {
          setImportDialogOpen(false);
      
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            setImportDialogOpen(false);
      
          }}
          sx={{
            position: "absolute",
            right: 4,
            top: 4,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 3 }}>
        <>
            <Typography variant="h6" sx={{ mt: 3 }}>
              {t("Import a Coproduction Process")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={8}>
                <Typography variant="p" sx={{ mt: 3 }}>
                  {t("Set up a new collaborative coproduction process utilizing an already downloaded zip file"+".")}
                </Typography>

                {/* <Typography variant="p" sx={{ mt: 3 }}>
                  {t("Example file:")}
                </Typography>

                <Link
                  to="/static/story/ExampleTemplate.json"
                  target="_blank"
                  download
                >
                  <Download sx={{ ml: 1 }} />{" "}
                </Link> */}
              </Grid>

              <Grid item xs={6} md={4}>
                <Stack direction="row" spacing={0}>
                  <LoadingButton
                    variant="contained"
                    disabled={false}
                    loading={false}
                    //color="warning"
                    //onClick={handleCapture}
                    component="label"
                    startIcon={<ViewList />}
                    sx={{ mb: 3, justifyContent: "right", textAlign: "center" }}
                  >
                    {t("Import from file")}
                    <input
                      type="file"
                      accept=".zip"
                      hidden
                      onChange={handleCapture}
                    />
                  </LoadingButton>
                </Stack>

                {/* <Button sx={{ mt: 2 }} variant="contained" component="label">
                  {t("Publish from a File")}
                  <input
                    type="file"
                    accept=".json"
                    hidden
                    onChange={handleCapture}
                  />
                </Button> */}
              </Grid>
            </Grid>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectsOverview;
