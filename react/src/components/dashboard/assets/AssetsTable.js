import {
  Alert, Avatar, Box, CircularProgress, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu,
  MenuItem, Skeleton, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { Article, CopyAll, Delete, Download, Edit, MoreVert as MoreVertIcon, OpenInNew, Share } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import { InterlinkerDialog } from 'components/dashboard/interlinkers';
import SearchBox from 'components/SearchBox';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { assetsApi } from '__api__';
import { InterlinkerReference } from '../interlinkers';

const MyMenuItem = ({ onClick, text, icon, id, loading }) => {
  return <MenuItem aria-describedby={id} onClick={onClick}>
    <ListItemIcon>
      {loading === id ? <CircularProgress /> : icon}
    </ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </MenuItem>
}

const AssetRow = ({ addName, language, asset, onChange, actions, openInterlinkerDialog }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState("data")
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const mounted = useMounted();
  const t = useCustomTranslation(language)
  const showInterlinkerId = data && (data.externalinterlinker_id || data.knowledgeinterlinker_id || data.softwareinterlinker_id)
  const isInternal = asset.type === "internalasset"

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setLoading("info")
    if (isInternal) {
      assetsApi.getInternal(asset.id).then((res) => {
        if (mounted.current) {
          setData({ ...asset, ...res })
          addName(asset.id, res.name)
          setLoading("")
        }
      })
    } else {
      if (mounted.current) {
        setData({ ...asset })
        addName(asset.id, asset.name)
        setLoading("")
      }
    }

  }, [asset, mounted])

  const handleOpen = () => window.open(data.link + "/view", "_blank")

  const handleDelete = () => {
    setLoading("delete");
    assetsApi.delete(asset.id).then(() => {
      setLoading("");
      onChange && onChange();
      setAnchorEl(null);
    });
  }

  const handleClone = () => {
    setLoading("clone");
    assetsApi.clone(asset.id).then(() => {
      setLoading("");
      onChange && onChange();
      setAnchorEl(null);
    })
  }

  const handleDownload = () => {
    window.open(asset.link + "/download", "_blank");
    setAnchorEl(null);
  }

  const handleEdit = () => {
    window.open(asset.link + "/edit", "_blank");
    setAnchorEl(null);
  }

  const getActions = (data) => {
    const actions = []
    if (!data) {
      return actions
    }
    if (data.type === "internalasset" && data.capabilities) {
      const { id, capabilities } = data
      actions.push(<MyMenuItem key={`${id}-open-action`} loading={loading} id="open" onClick={handleOpen} text={t("Open")} icon={<OpenInNew fontSize="small" />} />)

      if (capabilities.edit) {
        actions.push(<MyMenuItem key={`${id}-edit-action`} loading={loading} id="edit" onClick={handleEdit} text={t("Edit")} icon={<Edit fontSize="small" />} />)
      }
      if (capabilities.clone) {
        actions.push(<MyMenuItem key={`${id}-clone-action`} loading={loading} id="clone" onClick={handleClone} text={t("Clone")} icon={<CopyAll fontSize="small" />} />)
      }
      if (capabilities.delete) {
        actions.push(<ConfirmationButton
          key={`${id}-delete-action`}
          Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text={t("Delete")} icon={<Delete fontSize="small" />} />}
          ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
          onClick={handleDelete}
          text={t("Are you sure?")} />)
      }
      if (false && capabilities.clone) {
        actions.push(<MyMenuItem key={`${id}-share-action`} loading={loading} id="publish" onClick={() => { }} text={t("Publish")} icon={<Share fontSize="small" />} />)
      }
      if (capabilities.download) {
        actions.push(<MyMenuItem key={`${id}-download-action`} loading={loading} id="download" onClick={handleDownload} text={t("Download")} icon={<Download fontSize="small" />} />)
      }
    }
    if (data.type === "externalasset") {
      const { id } = data
      // actions.push(<MyMenuItem key={`${id}-edit-action`} loading={loading} id="edit" onClick={handleEdit} text="Edit" icon={<Edit fontSize="small" />} />)
      actions.push(<MyMenuItem key={`${id}-clone-action`} loading={loading} id="clone" onClick={handleClone} text={t("Clone")} icon={<CopyAll fontSize="small" />} />)
      actions.push(<ConfirmationButton
        key={`${id}-delete-action`}
        Actionator={({ onClick }) => <MyMenuItem loading={loading} id="delete" onClick={onClick} text={t("Delete")} icon={<Delete fontSize="small" />} />}
        ButtonComponent={({ onClick }) => <LoadingButton sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</LoadingButton>}
        onClick={handleDelete}
        text={t("Are you sure?")} />)

    }

    return actions
  }
  const avatarSize = { height: "30px", width: "30px" }
  return <TableRow
    hover
    key={asset.id}
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    {data && loading !== "info" ? <>
      <TableCell width="5%" component="th" scope="row" onClick={handleOpen}>
        <Avatar src={data.icon} sx={avatarSize} >{!data.icon && <Article />}</Avatar>
      </TableCell>
      <TableCell width="35%" style={{ cursor: "pointer" }} onClick={() => {
        if (isInternal) {
          window.open(data.link + "/view", "_blank")
        } else {
          window.open(data.uri)
        }
      }} align="left">{data.name}</TableCell>
      <TableCell width="15%" align="left">
        {moment(data.created_at).format("LL")}
      </TableCell>
      <TableCell width="15%" align="left">
        {moment(data.updated_at || data.created_at).fromNow()}
      </TableCell>
      <TableCell width="20%" align="center">
        {showInterlinkerId ? <InterlinkerReference onClick={() => {
          openInterlinkerDialog(showInterlinkerId)
        }}
          interlinker_id={showInterlinkerId}
        /> : t("external-resource")}
      </TableCell>
      <TableCell width="10%" align="center">
        {actions ? actions(data) : <IconButton aria-label="settings" id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>}

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {getActions(data)}
        </Menu>
      </TableCell></> : <>
      <TableCell colSpan={5}><Skeleton animation="wave" sx={{ width: "100%" }} height={60} /></TableCell>
      <TableCell><IconButton aria-label="actions"> <MoreVertIcon /> </IconButton></TableCell>
    </>
    }
  </TableRow>

}

const Assets = ({ language, loading, assets, onChange = () => { }, actions = null }) => {
  const [interlinkerDialogOpen, setInterlinkerDialogOpen] = useState(false);
  const [selectedInterlinker, setSelectedInterlinker] = useState(false);
  const [assetNames, setAssetNames] = useState([])
  const [inputValue, setInputValue] = useState("");

  const t = useCustomTranslation(language)

  const addName = (id, name) => {
    setAssetNames([...assetNames.filter(asset => asset.id !== id), { id, name }])
  }

  function find(text) {
    if (!text) {
      return assets
    }

    const result = assetNames.filter(item => {
      return item.name ? item.name.toLowerCase().includes(text) : false;
    });
    return assets.filter(asset => result.find(el => el.id === asset.id))
  }

  return <>
    <InterlinkerDialog language={language} open={interlinkerDialogOpen} setOpen={setInterlinkerDialogOpen} interlinker={selectedInterlinker} />
    <Box sx={{ my: 2, mx: 10 }}>
      <SearchBox size="small" language={language} loading={loading} inputValue={inputValue} setInputValue={setInputValue} />
    </Box>

    <Table sx={{ minWidth: 300 }} aria-label="resources table" size="small">
      <TableHead>
        <TableRow>
          <TableCell width="5%"></TableCell>
          <TableCell width="35%" align="center">{t("Name")}</TableCell>
          <TableCell width="15%" align="center">{t("Created")}</TableCell>
          <TableCell width="15%" align="center">{t("Updated")}</TableCell>
          <TableCell width="20%" align="center">{t("Interlinker")}</TableCell>
          <TableCell width="10%" align="center">{t("Actions")}</TableCell>
        </TableRow>
        {false && loading && <TableRow>
          <TableCell colSpan={6}> <LinearProgress /></TableCell>
        </TableRow>}
      </TableHead>

      <TableBody>
        {!loading && find(inputValue).map((asset) => (
          <React.Fragment key={asset.id}>
            <AssetRow addName={addName} language={language} openInterlinkerDialog={(id) => { setInterlinkerDialogOpen(true); setSelectedInterlinker(id) }} asset={asset} onChange={onChange} actions={actions} />
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
    {assets.length === 0 && <Alert severity="info" sx={{ my: 2 }}>{t("No resources yet")}</Alert>}
  </>
}

export default Assets;
