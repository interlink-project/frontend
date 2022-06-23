import { Alert, Avatar, Box, Button, Chip, CircularProgress, Grid, IconButton, Input, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography } from '@material-ui/core';
import { Add, Delete, Edit, MoreVert, People, Save } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import CentricCircularProgress from 'components/CentricCircularProgress';
import ConfirmationButton from 'components/ConfirmationButton';
import { OrganizationChip } from 'components/dashboard/assets/Icons';
import { user_id } from 'contexts/CookieContext';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getLanguage } from 'translations/i18n';
import { whoCanCreateTeams } from 'utils/someCommonTranslations';
import { organizationsApi } from '__api__';
import TeamCreate from './TeamCreate';
import UsersList from './UsersList';

const MyMenuItem = ({ onClick, text, icon, id, loading = false }) => {
    return <MenuItem aria-describedby={id} onClick={onClick}>
        <ListItemIcon>
            {loading === id ? <CircularProgress /> : icon}
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
    </MenuItem>
}

const OrganizationProfile = ({ organizationId, onChanges = null, onTeamClick = null }) => {
    const [editMode, setEditMode] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [logotype, setLogotype] = useState(null);
    const [loadingTeams, setLoadingTeams] = useState(true)
    const [organization, setOrganization] = useState({ teams_ids: [], administrators_ids: [] })
    const [teams, setTeams] = useState([]);
    const [teamCreatorOpen, setOpenTeamCreator] = useState(false);
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [profileLanguage, setProfileLanguage] = useState(getLanguage())

    const mounted = useMounted();
    const { t } = useDependantTranslation()

    const getTeams = () => {
        setLoadingTeams(true)
        organizationsApi.getOrganizationTeams(organizationId).then(res => {
            setTeams(res)
            setLoadingTeams(false)
        })
    }

    const handleAdministratorAdd = (user) => {
        organizationsApi.addAdministrator(organizationId, user.id).then(res => {
            if (mounted.current) {
                update(() => {
                    onChanges && onChanges()
                })
            }
        })
    }
    const handleAdministratorRemove = (user) => {
        organizationsApi.removeAdministrator(organizationId, user.id).then(res => {
            if (mounted.current) {
                update(() => {
                    onChanges && onChanges()
                })
            }
        })
    }

    const nameAndDescChanged = (name !== organization.name) || (description !== organization.description)
    const somethingChanged = nameAndDescChanged || logotype !== null

    const handleSave = async () => {
        const calls = []

        let send = false
        if (nameAndDescChanged) {
            const data = {
                name_translations: {
                    ...organization.name_translations,
                    [profileLanguage]: name
                },
                description_translations: {
                    ...organization.description_translations,
                    [profileLanguage]: description
                },
            }
            console.log("UPDATE", data)
            calls.push(organizationsApi.update(organization.id, data))
            send = true
        }

        // change logotype if specified
        if (logotype) {
            calls.push(organizationsApi.setFile(organization.id, "logotype", logotype))
            send = true
        }

        if (send) {
            await Promise.all(calls);
            onChanges && onChanges()
            update(() => {
                setEditMode(false)
            })
        }

    }

    const handleRemove = () => {
        organizationsApi.delete(organizationId).then(() => {
            onChanges && onChanges()
        })
    }

    const update = (callback) => {
        organizationsApi.get(organizationId).then(res => {
            if (mounted.current) {
                setOrganization(res)
                setName(res.name)
                setDescription(res.description)
                getTeams()
                callback && callback(res)
            }
        })
    }

    useEffect(() => {
        update()
    }, [])

    const handleFileSelected = (e) => {
        const files = e.target.files
        if (files.length > 0) {
            const file = files[0]
            if (file) {
                file.path = URL.createObjectURL(file)
                setLogotype(file)
            }

        }
    }

    const organization_trans = t("organization")
    const canCreateTeams = organization.team_creation_permission === "anyone" || (organization.team_creation_permission === "administrators" && organization.administrators_ids.includes(user_id)) || (organization.team_creation_permission === "members" && !organization.public)
    const isAdmin = organization && organization.current_user_participation && organization.current_user_participation.includes('administrator')

    const [tabValue, setTabValue] = useState('teams');
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleActionsClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const WHOCAN_TRANSLATIONS = whoCanCreateTeams(t)

    return (<Box>
        {organization ? <Grid container>
            <Grid item md={4}>
                <Stack direction="column" sx={{ textAlign: "center", justifyContent: "center", p: 2 }} spacing={2}>
                    {editMode ? <label htmlFor="contained-button-file">
                        <Input inputProps={{ accept: 'image/*' }} id="contained-button-file" type="file" sx={{ display: "none" }} onChange={handleFileSelected} />
                        <IconButton component="span" color="inherit">
                            <div style={{
                                width: "100px",
                                height: "100px",
                                position: "relative"
                            }}>
                                <Avatar
                                    src={logotype ? logotype.path : organization.logotype_link}
                                    variant="rounded"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        position: "absolute"
                                    }}
                                />
                                <Edit style={{
                                    width: "50%",
                                    height: "50%",
                                    position: "absolute",
                                    top: "50%",
                                    transform: "translateY(-50%)"
                                }} />
                            </div>


                        </IconButton>
                    </label> : <IconButton component="span" color="inherit" disabled>
                        <Avatar
                            src={logotype ? logotype.path : organization.logotype_link}
                            variant="rounded"
                            style={{
                                width: "100px",
                                height: "100px",
                            }}
                        />
                    </IconButton>}
                    {!editMode ? <Typography variant="h5">{organization.name}</Typography> : <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        fullWidth
                        variant="standard"
                    />}
                    {!editMode ? <Typography variant="body1">{organization.description}</Typography> : <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                    />}
                    
                    {!editMode ? <>
                        <Typography variant="overline">{t("Who can create teams in this organization?")}</Typography>
                        <Typography variant="body1">{WHOCAN_TRANSLATIONS[organization.team_creation_permission]}</Typography>
                        </> : <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                    />}
                    {isAdmin && <>
                        {!editMode ? <Button disabled={!isAdmin} startIcon={<Edit />} variant="contained" color="primary" onClick={() => onChanges && setEditMode(true)}>{t("Edit")}</Button>
                            : <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                                <Button variant="text" color="warning" onClick={() => setEditMode(false)}>{t("Discard changes")}</Button>
                                <Button disabled={!somethingChanged} startIcon={<Save />} variant="contained" color="success" onClick={handleSave}>{t("Save")}</Button>
                            </Stack>
                        }
                        <ConfirmationButton
                            Actionator={({ onClick }) => <Button startIcon={<Delete />} disabled={!editMode} variant="text" color="error" onClick={onClick}>{t("Remove {{what}}", { what: organization_trans })}</Button>}
                            ButtonComponent={({ onClick }) => <Button sx={{ mt: 1 }} fullWidth variant='contained' color="error" onClick={onClick}>{t("Confirm deletion")}</Button>}
                            onClick={handleRemove}
                            text={t("Are you sure?")}
                        />
                    </>}
                </Stack>
            </Grid>
            <Grid item md={8} sx={{ p: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="organization-right-side-tabs"
                    sx={{ mb: 2 }}
                    centered
                >
                    <Tab value="teams" label={t("Teams") + ` (${organization.teams_ids.length})`} />
                    <Tab value="administrators" label={t("Administrators") + ` (${organization.administrators_ids.length})`} />
                </Tabs>
                <TeamCreate
                    open={teamCreatorOpen}
                    setOpen={setOpenTeamCreator}
                    onCreate={getTeams}
                    loading={creatingTeam}
                    setLoading={setCreatingTeam}
                    organization={organization}
                />
                {tabValue === "teams" && <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">{t("Name")}</TableCell>
                                <TableCell align="center">{t("Type")}</TableCell>
                                <TableCell align="center">{t("Created")}</TableCell>
                                <TableCell align="center">{t("Members")}</TableCell>
                                <TableCell align="center">{t("Your participation in the team")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams && teams.map((team) => (
                                <TableRow sx={{ cursor: onTeamClick ? 'pointer' : '' }} key={team.id} onClick={() => onTeamClick(team)} hover={onTeamClick !== null}>
                                    <TableCell align="center">
                                        <Stack alignItems="center" direction="row" spacing={1}>
                                            {team.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={team.logotype_link} /> : <People />}
                                            <b>{team.name}</b>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        <OrganizationChip type={team.type} />
                                    </TableCell>
                                    <TableCell align="center">{moment(team.created_at).fromNow()}</TableCell>
                                    <TableCell align="center">
                                        {team.users_count}
                                    </TableCell>
                                    <TableCell align="center">
                                        {team.current_user_participation.length > 0 ? team.current_user_participation.map(p => <Chip size="small" sx={{ mr: 1 }} key={team.id + p} title={`You are ${p} of the organization`} variant={p === "administrator" ? "contained" : "outlined"} label={p} />) : <Chip label={t("None")} />}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {loadingTeams && [...Array(organization.teams_ids.length).keys()].map((i) => <TableRow key={`skeleton-${i}`}>
                                <TableCell align="center" colSpan={6}>
                                    <Skeleton />
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {(!loadingTeams && (!teams || teams.length) === 0) && <Alert severity="warning">
                        {t("No teams found in this organization")}
                    </Alert>}
                    <Box sx={{ textAlign: "center" }}>
                        <LoadingButton loading={loadingTeams || creatingTeam} sx={{ mt: 3 }} size="small" variant="contained" startIcon={<Add />} onClick={() => setOpenTeamCreator(true)} disabled={!canCreateTeams}>{t("Create new team")}</LoadingButton>
                    </Box>
                </>}
                {tabValue === "administrators" && <UsersList useContainer={false} useHeader={false} searchOnOrganization={isAdmin && organization.id} users={organization.administrators} onSearchResultClick={isAdmin && handleAdministratorAdd} getActions={(user) => (
                    isAdmin && <>
                        <IconButton aria-label="settings" id="basic-button"
                            aria-controls="basic-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleActionsClick}
                        >
                            <MoreVert />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MyMenuItem key={`${user.id}-remove-action`} id="remove" onClick={handleAdministratorRemove} text={t("Remove {{what}}")} icon={<Delete />} />
                        </Menu>
                    </>
                )} />}
            </Grid>
        </Grid> : <CentricCircularProgress />
        }
    </Box >
    );
};

export default OrganizationProfile;
