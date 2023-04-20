import {
  Button, Dialog, DialogContent, Alert, Avatar, Box, CircularProgress, Fade, Grow, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu,
  MenuItem, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Zoom, TableSortLabel
} from '@mui/material';
import { Close, CopyAll, Delete, RecordVoiceOver, Download, Edit, KeyboardArrowDown, OpenInNew } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { Article, MoreVert as MoreVertIcon, ShowChart } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { InterlinkerDialog } from 'components/dashboard/interlinkers';
import SearchBox from 'components/SearchBox';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { assetsApi } from '__api__';
import { InterlinkerReference } from '../interlinkers';
import PropTypes from 'prop-types';
import CoproNotifications from 'components/dashboard/coproductionprocesses/CoproNotifications';
import { useDispatch, useSelector } from 'react-redux';
import { getCoproductionProcessNotifications } from "slices/general";
import { useLocation } from 'react-router';


const MyMenuItem = ({ onClick, text, icon, id, loading }) => (
  <MenuItem
    aria-describedby={id}
    onClick={onClick}
  >
    <ListItemIcon>
      {loading === id ? <CircularProgress /> : icon}
    </ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </MenuItem>
);

// Not used now. Let as reference for future fixes
const AssetRow = ({ inputValue, language, asset, actions, openInterlinkerDialog }) => {
  //const [data, setData] = useState(null);
  let data = asset
  let dataExtra = {}

  if (asset.type == 'externalasset') {

  } else {
    //Add extra information needed:
    const backend = asset['software_response']['backend'];
    dataExtra['link'] = backend + '/' + asset['external_asset_id'];

    const api_path = asset['software_response']['api_path'];
    dataExtra['internal_link'] = "http://" + backend + api_path + "/" + asset['external_asset_id'];

    dataExtra['capabilities'] = {
      "clone": asset['software_response']['clone'],
      "view": asset['software_response']['view'],
      "edit": asset['software_response']['edit'],
      "delete": asset['software_response']['delete'],
      "download": asset['software_response']['download'],
    }

    dataExtra['softwareinterlinker'] = null
    if (asset['software_response']) {
      dataExtra['softwareinterlinker'] = {
        "id": asset['software_response']['id'],
        "name": asset['software_response']['name'],
        "description": asset['software_response']['description'],
        "logotype_link": asset['software_response']['logotype_link'],
      }
    }

  }

  //const [loading, setLoading] = useState('data');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const mounted = useMounted();
  const t = useCustomTranslation(language);
  const showInterlinkerId = data && (data.externalinterlinker_id || data.knowledgeinterlinker_id || data.softwareinterlinker_id);
  const isInternal = asset.type === 'internalasset';
  const [activitiesDialogOpen, setactivitiesDialogOpen] = useState(false);
  const show = inputValue ? data ? data.internalData.name.toLowerCase().includes(inputValue) : false : true;
  const dispatch = useDispatch();
  const { process } = useSelector((state) => state.process);

  const location = useLocation();
  const isLocationCatalogue = location.pathname.startsWith('/stories/');

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);

  };
  const handleClickHistory = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setactivitiesDialogOpen(true);

    dispatch(getCoproductionProcessNotifications({ 'coproductionprocess_id': process.id, 'asset_id': asset.id }))
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isInternal) {
      window.open(`${dataExtra.link}/view`, '_blank');
    } else {
      window.open(data.uri);
    }
  };

  const avatarSize = { height: '30px', width: '30px' };
  //console.log(actions);


  return (
    <>
      <Grow in={show}>
        <TableRow
          hover
          key={asset.id}
          sx={{ display: !show && 'none', '&:last-child td, &:last-child th': { border: 0 }, '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
          onClick={handleOpen}
        >
          {data ? (
            <>
              <TableCell
                width='5%'
                component='th'
                scope='row'
              >
                <Avatar
                  src={data.internalData.icon}
                  sx={avatarSize}
                >
                  {!data.internalData.icon && <Article />}
                </Avatar>
              </TableCell>
              <TableCell
                width='35%'
                style={{ cursor: 'pointer' }}
                align='left'
              >
                <span
                  id={'bt-' + asset.id}
                >
                  {data.internalData.name}
                </span>

              </TableCell>

              <TableCell
                width='15%'
                align='left'
              >
                {moment(data.internalData.updated_at || data.internalData.created_at).fromNow()}
              </TableCell>
              <TableCell
                width='20%'
                align='center'
              >
                {showInterlinkerId ? (
                  <InterlinkerReference
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      openInterlinkerDialog(showInterlinkerId);
                    }}
                    interlinker_id={showInterlinkerId}
                  />
                ) : t('external-resource')}
              </TableCell>

              {isLocationCatalogue ? (
                <></>
              ) : (
                <>
                  <TableCell
                    width='15%'
                    align='left'
                  >
                    <Button variant="contained" onClick={handleClickHistory} color="primary">
                      Activities
                    </Button>

                  </TableCell>
                  <TableCell
                    width='10%'
                    align='center'
                  >
                    {actions && (
                      <IconButton
                        aria-label='settings'

                        aria-controls='basic-menu'
                        aria-haspopup='true'

                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}

                    <Menu
                      id='basic-menu'
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                      }}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      {actions && actions.map(({ id, loading, onClick, text, icon }) => (
                        <MyMenuItem
                          key={id}
                          loading={loading}
                          id={id}
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            onClick(handleClose);
                          }}
                          text={text}
                          icon={icon}
                        />
                      ))}

                    </Menu>
                  </TableCell>
                </>

              )


              }


            </>
          ) : (
            <>
              <TableCell colSpan={6}>
                <Skeleton
                  animation='wave'
                  sx={{ width: '100%' }}
                  height={60}
                />
              </TableCell>
            </>
          )}
        </TableRow>
      </Grow>
      <Dialog
        open={activitiesDialogOpen}
        onClose={() => setactivitiesDialogOpen(false)}
      >
        <IconButton
          aria-label='close'
          onClick={() => setactivitiesDialogOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 3 }}>
          <CoproNotifications />
        </DialogContent>
      </Dialog>
    </>
  );
};





const Assets = ({ language, loading, getActions = null }) => {
  const [interlinkerDialogOpen, setInterlinkerDialogOpen] = useState(false);
  const [selectedInterlinker, setSelectedInterlinker] = useState(false);
  const [activitiesDialogOpen, setactivitiesDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState('');
  const { process } = useSelector((state) => state.process);
  const { assetsList } = useSelector((state) => state.general);

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickHistory = (id) => {
    setactivitiesDialogOpen(true);
    dispatch(getCoproductionProcessNotifications({ 'coproductionprocess_id': process.id, 'asset_id': id }))
  };



  const t = useCustomTranslation(language);

  const columns = [
    {
      field: 'icon',
      headerName: '',
      sortable: false,
      flex: 0.05,
      renderCell: (params) => {
        return (
          <Avatar
            src={params.row.icon}
            sx={{ height: '30px', width: '30px' }}
          >
            {!params.row.icon && <Article />}
          </Avatar>
        );
      }
    },
    {
      field: 'name',
      headerName: t("Name"),
      flex: 1,
      headerAlign: 'left',
    },
    {
      field: 'updated',
      disablePadding: false,
      headerAlign: 'center',
      headerName: t("Updated"),
      flex: 0.3,
    },
    {
      field: 'interlinker',
      disablePadding: false,
      headerAlign: 'center',
      headerName: t("INTERLINKER"),
      flex: 0.5,
      renderCell: (params) => {
        {
          const showInterlinkerId = params.row.data && (params.row.data.externalinterlinker_id || params.row.data.knowledgeinterlinker_id || params.row.data.softwareinterlinker_id);
          return showInterlinkerId ? (
            <InterlinkerReference
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setInterlinkerDialogOpen(true);
                setSelectedInterlinker(showInterlinkerId);
              }}
              interlinker_id={showInterlinkerId}
            />
          ) : t('external-resource')
        }
      }
    },
    {
      field: 'history',
      sortable: false,
      headerName: t('History'),
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          return handleClickHistory(params.row.id);
        };
        return (
          <Button variant="contained" onClick={onClick} color="primary">
            {t("Activities")}
          </Button>)
      }
    },
    {
      field: 'actions',
      disablePadding: false,
      headerName: t("Actions"),
      sortable: false,
      flex: 0.15,
      renderCell: (params) => {
        // console.log(params.row.actions);
        return (
          <>
            <IconButton
              aria-label='settings'
              aria-controls='basic-menu'
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
              }}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {params.row.actions && params.row.actions.map(({ id, loading, onClick, text, icon }) => (
                <MyMenuItem
                  key={id}
                  loading={loading}
                  id={id}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    onClick(handleClose);
                  }}
                  text={text}
                  icon={icon}
                />
              ))}

            </Menu>
          </>
        );
      }
    }
  ];

  const rows = assetsList.map((asset) => {
    let dataExtra = {};
    if (asset.type == 'externalasset') {

    } else {
      //Add extra information needed:
      const backend = asset['software_response']['backend'];
      dataExtra['link'] = backend + '/' + asset['external_asset_id'];
  
      const api_path = asset['software_response']['api_path'];
      dataExtra['internal_link'] = "http://" + backend + api_path + "/" + asset['external_asset_id'];
  
      dataExtra['capabilities'] = {
        "clone": asset['software_response']['clone'],
        "view": asset['software_response']['view'],
        "edit": asset['software_response']['edit'],
        "delete": asset['software_response']['delete'],
        "download": asset['software_response']['download'],
      }
    console.log("Assets: "+JSON.stringify(assetsList))

      dataExtra['softwareinterlinker'] = null
      if (asset['software_response']) {
        dataExtra['softwareinterlinker'] = {
          "id": asset['software_response']['id'],
          "name": asset['software_response']['name'],
          "description": asset['software_response']['description'],
          "logotype_link": asset['software_response']['logotype_link'],
        }
      }
  
    }
    return {
      id: asset.id,
      icon: asset.internalData.icon,
      name: asset.internalData.name,
      updated: moment(asset.internalData.updated_at || asset.internalData.created_at).fromNow(),
      actions: getActions && getActions(asset),
      data: asset,
      dataExtra: dataExtra
    }

  });

  const location = useLocation();
  const isLocationCatalogue = location.pathname.startsWith('/stories/');

  return (
    <>
      {!loading ? (
        <>
          <InterlinkerDialog
            language={language}
            open={interlinkerDialogOpen}
            setOpen={setInterlinkerDialogOpen}
            interlinker={selectedInterlinker}
          />
          {/* <Box sx={{ my: 2, mx: 10 }}>
            <SearchBox
              size='small'
              language={language}
              loading={loading}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </Box> */}
          <Box sx={{ my: 1, mx: 2 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5]}
              disableSelectionOnClick
              rowSelection={false}
              disableRowSelectionOnClick={true}
              autoHeight
              onRowClick={(params) => {
                console.log(params.row);
                if (params.row.data.type === 'internalasset') {
                  window.open(`${params.row.dataExtra.link}/view`, '_blank');
                } else {
                  window.open(params.row.data.uri);
                }
              }}
              localeText={{
                noRowsLabel: 'No assets found'
              }}

            />
          </Box>
        </>
      ) : (
        <CircularProgress />
      )}

      <Dialog
        open={activitiesDialogOpen}
        onClose={() => setactivitiesDialogOpen(false)}
      >
        <IconButton
          aria-label='close'
          onClick={() => setactivitiesDialogOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 3 }}>
          <CoproNotifications />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Assets;
