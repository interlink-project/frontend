import {
 Button,Dialog, DialogContent,Alert, Avatar, Box, CircularProgress, Fade, Grow, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu,
  MenuItem, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Zoom, TableSortLabel
} from '@mui/material';
import { Close, CopyAll, Delete, RecordVoiceOver, Download, Edit, KeyboardArrowDown, OpenInNew } from '@mui/icons-material';

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
import { useDispatch, useSelector} from 'react-redux';
import {  getCoproductionProcessNotifications } from "slices/general";
import { useLocation } from 'react-router';






function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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

const AssetRow = ({ inputValue, language, asset, actions, openInterlinkerDialog }) => {
  //const [data, setData] = useState(null);
  let data=asset
  let dataExtra={}

  //Add extra information needed:
  const backend =asset['software_response']['backend'];
  dataExtra['link']=backend+'/'+asset['external_asset_id'];

  const api_path=asset['software_response']['api_path'];
  dataExtra['internal_link']="http://"+backend+api_path+"/"+asset['external_asset_id'];

  dataExtra['capabilities']={
    "clone": asset['software_response']['clone'],
    "view": asset['software_response']['view'],
    "edit": asset['software_response']['edit'],
    "delete": asset['software_response']['delete'],
    "download": asset['software_response']['download'],
}

dataExtra['softwareinterlinker']=null
  if(asset['software_response']){
    dataExtra['softwareinterlinker']={
      "id": asset['software_response']['id'],
      "name": asset['software_response']['name'],
      "description": asset['software_response']['description'],
      "logotype_link": asset['software_response']['logotype_link'],
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

  const location=useLocation();
  const isLocationCatalogue=location.pathname.startsWith('/stories/');

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    
  };
  const handleClickHistory = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setactivitiesDialogOpen(true);
    
    dispatch(getCoproductionProcessNotifications({'coproductionprocess_id':process.id,'asset_id':asset.id}))
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    //setLoading('info');
    if (isInternal) {

      // if (isLocationCatalogue){
      //   assetsApi.getInternalCatalogue(asset.id).then((res) => {
      //     if (mounted.current) {
      //       setData({ ...asset, ...res });
      //       setLoading('');
      //     }
      //   });

      // }else{
      //   assetsApi.getInternal(asset.id).then((res) => {
      //     if (mounted.current) {
      //       setData({ ...asset, ...res });
      //       setLoading('');
      //     }
      //   });

      // }
      


    } else if (mounted.current) {
      //setData({ ...asset });
      //setLoading('');
    }
     }, [asset, mounted]);

  const handleOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isInternal) {
      window.open(`${dataExtra.link}/view`, '_blank');
    } else {
      window.open(dataExtra.uri);
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
              id={'bt-'+asset.id}
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

            {isLocationCatalogue ?(
            <></>
            ):(
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
                    <CoproNotifications  />
                  </DialogContent>
                </Dialog>
    </>
  );
};

const headCells = [
  {
    id: 'icon',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'updated',
    numeric: false,
    disablePadding: false,
    label: 'Updated',
  },
  {
    id: 'interlinker',
    numeric: false,
    disablePadding: false,
    label: 'INTERLINKER',
  },
  {
    id: 'history',
    numeric: false,
    disablePadding: false,
    label: 'History',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  }
];




function EnhancedTableHead(order, orderBy, onRequestSort) {
  const location=useLocation();
  const isLocationCatalogue=location.pathname.startsWith('/stories/');
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };


 let cabeceras=headCells;

 if(isLocationCatalogue){
  //Skip the heads of History and Actions (no needed for the catalogue)
  cabeceras=headCells.slice(0, -2);
 }

 
  return (
    <TableHead>
      <TableRow>
        {cabeceras.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const Assets = ({ language, loading,  getActions = null }) => {
  const [interlinkerDialogOpen, setInterlinkerDialogOpen] = useState(false);
  const [selectedInterlinker, setSelectedInterlinker] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('updated');
  const { assetsList } = useSelector((state) => state.general);
  
  const t = useCustomTranslation(language);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const location=useLocation();
  const isLocationCatalogue=location.pathname.startsWith('/stories/');

  return (
    <>
      <InterlinkerDialog
        language={language}
        open={interlinkerDialogOpen}
        setOpen={setInterlinkerDialogOpen}
        interlinker={selectedInterlinker}
      />
      <Box sx={{ my: 2, mx: 10 }}>
        <SearchBox
          size='small'
          language={language}
          loading={loading}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </Box>

      <Table
        sx={{ minWidth: 300 }}
        aria-label='resources table'
        size='small'
      >
        
        <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
        <TableBody>
          { assetsList.map((asset) => (
            <React.Fragment key={asset.id}>
              {isLocationCatalogue ?(
              <><AssetRow
                inputValue={inputValue}
                language={language}
                openInterlinkerDialog={(id) => { setInterlinkerDialogOpen(true); setSelectedInterlinker(id); }}
                asset={asset}
                actions={[]}
              /></>
              ):(
              <AssetRow
                inputValue={inputValue}
                language={language}
                openInterlinkerDialog={(id) => { setInterlinkerDialogOpen(true); setSelectedInterlinker(id); }}
                asset={asset}
                actions={getActions && getActions(asset)}
              />

              )}
              
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {assetsList.length === 0 && (
      <Alert
        severity='info'
        sx={{ my: 2 }}
      >
        {t('No resources yet')}
      </Alert>
      )}
    </>
  );
};

export default Assets;
