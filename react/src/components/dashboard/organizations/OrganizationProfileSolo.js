import { Alert, Avatar, Box, Button, Chip, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Select, Skeleton, Stack, Switch, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material';
import { Add, Delete, Edit, People, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import CentricCircularProgress from 'components/CentricCircularProgress';
import ConfirmationButton from 'components/ConfirmationButton';
import { OrganizationChip } from 'components/Icons';
import { TEAM_TYPES, WHO_CAN_CREATE_OPTIONS } from 'constants';
import useAuth from 'hooks/useAuth';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import React from 'react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getLanguage } from 'translations/i18n';
import { defaultTeamTypesTranslations, teamCreationPermissionTranslations } from 'utils/someCommonTranslations';
import { organizationsApi, teamsApi, usersApi } from '__api__';
import TeamCreate from './TeamCreate';
import TeamProfile from './TeamProfile';
import UsersList from './UsersList';
import { getOrganizations } from 'slices/general';
import { useSearchParams, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'components/UserAvatar';

const OrganizationProfileSolo = ({ organizationId = null, onChanges = null, onTeamClick = null }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [isPublic, _setPublic] = useState(false);
  const [defaultTeamType, setDefaultTeamType] = useState('');
  const [teamCreationPermission, setTeamCreationPermission] = useState('administrators');
  const [description, setDescription] = useState('');
  const [logotype, setLogotype] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [organization, setOrganization] = useState({ teams_ids: [], administrators_ids: [] });
  const [teams, setTeams] = useState([]);
  const [teamCreatorOpen, setOpenTeamCreator] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [profileLanguage, setProfileLanguage] = useState(getLanguage());
  const { user } = useAuth()
  const mounted = useMounted();
  const { t } = useDependantTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [selectedTeam, setSelectedTeam] = useState(null);

  // Get the search parameters for the invitation
  const [searchParams, setSearchParams] = useSearchParams();
  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);

  const getOrganizationsData = React.useCallback(async (search) => {
    dispatch(getOrganizations(search));
  }, [mounted]);


  const { teamId } = useParams();

  const searchValue = '';
  useEffect(() => {
    let delayDebounceFn;
    if (mounted.current) {
      delayDebounceFn = setTimeout(() => {

        //Obtain the Organization 
        getOrganizationsData(searchValue);

        //Obtain selected Team and Open the panel
        if (teamId != null) {
          //Obtain the team by id
          teamsApi.get(teamId).then((res) => {
            //Set the selected team
            setSelectedTeam(res);
          });

        }
        onTeamClick = setSelectedTeam;

      }, searchValue ? 800 : 0);
    }

    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [getOrganizationsData, searchValue]);



  const updateOrganizations = (res) => {

    getOrganizationsData('');

  };

  onChanges = updateOrganizations;




  if (organizationId == null) {
    const { organizationIdPage } = useParams();
    organizationId = organizationIdPage;
  }



  const setPublic = (val) => {
    if (val === false && teamCreationPermission === 'anyone') {
      setTeamCreationPermission('administrators');
    }
    _setPublic(val);
  };

  const getTeams = () => {
    setLoadingTeams(true);
    organizationsApi.getOrganizationTeams(organizationId).then((res) => {
      setTeams(res);
      setLoadingTeams(false);
    });
  };

  const handleAdministratorAdd = (user) => {
    organizationsApi.addAdministrator(organizationId, user.id).then((res) => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges();
        });
      }
    });
  };
  const handleAdministratorRemove = (user) => {
    organizationsApi.removeAdministrator(organizationId, user.id).then((res) => {
      if (mounted.current) {
        update(() => {
          onChanges && onChanges();
        });
      }
    });
  };

  const nameAndDescChanged = (name !== organization.name) || (description !== organization.description) || (isPublic !== organization.public) || (teamCreationPermission !== organization.team_creation_permission) || (defaultTeamType !== organization.default_team_type);
  const somethingChanged = nameAndDescChanged || logotype !== null;

  const handleSave = async () => {
    const calls = [];

    let send = false;
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
        default_team_type: defaultTeamType,
        public: isPublic,
        team_creation_permission: teamCreationPermission,
      };
      console.log('UPDATE', data);
      calls.push(organizationsApi.update(organization.id, data));
      send = true;
    }

    // change logotype if specified
    if (logotype) {
      calls.push(organizationsApi.setFile(organization.id, 'logotype', logotype));
      send = true;
    }

    if (send) {
      await Promise.all(calls);
      onChanges && onChanges();
      update(() => {
        setEditMode(false);
      });
    }
  };

  const handleRemove = () => {
    organizationsApi.delete(organizationId).then(() => {
      onChanges && onChanges();
    });
  };

  const update = (callback) => {
    organizationsApi.get(organizationId).then((res) => {
      if (mounted.current) {
        setOrganization(res);
        setName(res.name);
        setDescription(res.description);
        setTeamCreationPermission(res.team_creation_permission);
        setDefaultTeamType(res.default_team_type);
        setPublic(res.public);
        getTeams();
        callback && callback(res);
      }
    });
  };

  useEffect(() => {
    update();
  }, []);

  const handleFileSelected = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (file) {
        file.path = URL.createObjectURL(file);
        setLogotype(file);
      }
    }
  };

  const organization_trans = t('organization');
  const canCreateTeams = organization.team_creation_permission === 'anyone' || (organization.team_creation_permission === 'administrators' && organization.administrators_ids.includes(user.id)) || (organization.team_creation_permission === 'members' && !organization.public);
  const isAdmin = organization && organization.current_user_participation && organization.current_user_participation.includes('administrator');

  const [tabValue, setTabValue] = useState('teams');
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [invitationUser, setInvitationUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (mounted.current && selectedTeam) {
      if (selectedTeam.users.some((u) => u.email === searchParams.get("user"))) {
        setInvitationUser(null);
        setOpenInvitationDialog(true);
        return;
      }

      if (isAdmin && searchParams.get("user")) {
        let u = await usersApi.search(searchParams.get("user"));
        if (u.length > 0) {
          setInvitationUser(u[0]);
          setOpenInvitationDialog(true);
          return;
        }
      }
    }
  }, [isAdmin]);

  const handleDeclineInvitation = () => {
    setOpenInvitationDialog(false);
    navigate("/dashboard/organizations/" + organizationId + "/" + teamId);
  };

  const handleAcceptInvitation = () => {
    setLoading(true);
    teamsApi.addUser(teamId, invitationUser.id).then((res) => {
      console.log("Added user to team", res);
      setOpenInvitationDialog(false);
      navigate("/dashboard/organizations/" + organizationId + "/" + teamId);
      window.location.reload();
    });
  };

  return (

    <Box>
      {organization ? (

        <>
          {selectedTeam && (
            <TeamProfile
              teamId={selectedTeam.id}
              open={!!selectedTeam}
              setOpen={setSelectedTeam}
              onChanges={updateOrganizations}
            />
          )}
          <Grid container>
            <Grid
              item
              md={4}
            >
              <Stack
                direction='column'
                sx={{ textAlign: 'center', justifyContent: 'center', p: 2 }}
                spacing={2}
              >
                {editMode ? (
                  <label htmlFor='contained-button-file'>
                    <Input
                      inputProps={{ accept: 'image/*' }}
                      id='contained-button-file'
                      type='file'
                      sx={{ display: 'none' }}
                      onChange={handleFileSelected}
                    />
                    <IconButton
                      component='span'
                      color='inherit'
                    >
                      <div style={{
                        width: '100px',
                        height: '100px',
                        position: 'relative'
                      }}
                      >
                        <Avatar
                          src={logotype ? logotype.path : organization.logotype_link}
                          variant='rounded'
                          style={{
                            width: '100px',
                            height: '100px',
                            position: 'absolute'
                          }}
                        />
                        <Edit style={{
                          width: '50%',
                          height: '50%',
                          position: 'absolute',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                        />
                      </div>

                    </IconButton>
                  </label>
                ) : (
                  <IconButton
                    component='span'
                    color='inherit'
                    disabled
                  >
                    <Avatar
                      src={logotype ? logotype.path : organization.logotype_link}
                      variant='rounded'
                      style={{
                        width: '100px',
                        height: '100px',
                      }}
                    />
                  </IconButton>
                )}
                {!editMode ? <Typography variant='h5'>{organization.name}</Typography> : (
                  <TextField
                    autoFocus
                    margin='dense'
                    id='name'
                    label='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type='text'
                    fullWidth
                    variant='standard'
                  />
                )}
                {!editMode ? <Typography variant='body1'>{organization.description}</Typography> : (
                  <TextField
                    margin='dense'
                    id='description'
                    label='Description'
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    variant='standard'
                  />
                )}
                {!editMode ? <></> : (
                  <Stack
                    sx={{ mt: 2 }}
                    spacing={1}
                    direction='row'
                    alignItems='center'
                  >
                    <Typography variant='body2'>{t('Public')}</Typography>
                    <Switch
                      checked={isPublic}
                      onChange={(event) => setPublic(event.target.checked)}
                    />
                  </Stack>
                )}
                {!editMode ? (
                  <>
                    <Typography variant='overline'>{t('Who can create teams in this organization?')}</Typography>
                    <Typography variant='body1'>{teamCreationPermissionTranslations(t)[organization.team_creation_permission]}</Typography>
                  </>
                ) : (
                  <FormControl
                    variant='standard'
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    <InputLabel id='select-creation-permission-label'>{t('Who can create teams')}</InputLabel>
                    <Select
                      fullWidth
                      labelId='select-creation-permission-label'
                      id='select-creation-permission'
                      value={teamCreationPermission}
                      onChange={(event) => {
                        setTeamCreationPermission(event.target.value);
                      }}
                      label={t('Who can create teams')}
                    >
                      {WHO_CAN_CREATE_OPTIONS(t, isPublic).map((lan) => (
                        <MenuItem
                          key={lan.value}
                          disabled={lan.disabled}
                          value={lan.value}
                        >
                          {lan.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {!editMode ? (
                  <>
                    <Typography variant='overline'>{t('Default team type')}</Typography>
                    <OrganizationChip
                      type={organization.default_team_type}
                      t={t}
                    />
                  </>
                ) : (
                  <FormControl
                    variant='standard'
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    <InputLabel id='select-type'>{t('Default team type')}</InputLabel>
                    <Select
                      fullWidth
                      labelId='select-type-label'
                      id='select-type'
                      value={defaultTeamType}
                      onChange={(event) => {
                        setDefaultTeamType(event.target.value);
                      }}
                      label={t('Default team type')}
                    >
                      {TEAM_TYPES(t).map((lan) => (
                        <MenuItem
                          key={lan.value}
                          disabled={lan.disabled}
                          value={lan.value}
                        >
                          {lan.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {isAdmin && (
                  <>
                    {!editMode ? (
                      <Button
                        disabled={!isAdmin}
                        startIcon={<Edit />}
                        variant='contained'
                        color='primary'
                        onClick={() => onChanges && setEditMode(true)}
                      >
                        {t('Edit')}
                      </Button>
                    )
                      : (
                        <Stack
                          direction='row'
                          justifyContent='center'
                          sx={{ mt: 2 }}
                        >
                          <Button
                            variant='text'
                            color='warning'
                            onClick={() => setEditMode(false)}
                          >
                            {t('Discard changes')}
                          </Button>
                          <Button
                            disabled={!somethingChanged}
                            startIcon={<Save />}
                            variant='contained'
                            color='success'
                            onClick={handleSave}
                          >
                            {t('Save')}
                          </Button>
                        </Stack>
                      )}
                    <ConfirmationButton
                      Actionator={({ onClick }) => (
                        <Button
                          startIcon={<Delete />}
                          disabled={!editMode}
                          variant='text'
                          color='error'
                          onClick={onClick}
                        >
                          {t('Remove {{what}}', { what: organization_trans })}
                        </Button>
                      )}
                      ButtonComponent={({ onClick }) => (
                        <Button
                          sx={{ mt: 1 }}
                          fullWidth
                          variant='contained'
                          color='error'
                          onClick={onClick}
                        >
                          {t('Confirm deletion')}
                        </Button>
                      )}
                      onClick={handleRemove}
                      text={t('Are you sure?')}
                    />
                  </>
                )}
              </Stack>
            </Grid>
            <Grid
              item
              md={8}
              sx={{ p: 2 }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label='organization-right-side-tabs'
                sx={{ mb: 2 }}
                centered
              >
                <Tab
                  value='teams'
                  label={`${t('Teams')} (${organization.teams_ids.length})`}
                />
                <Tab
                  value='administrators'
                  label={`${t('Administrators')} (${organization.administrators_ids.length})`}
                />
              </Tabs>
              <TeamCreate
                open={teamCreatorOpen}
                setOpen={setOpenTeamCreator}
                onCreate={getTeams}
                loading={creatingTeam}
                setLoading={setCreatingTeam}
                organization={organization}
              />
              {tabValue === 'teams' && (
                <>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'>{t('Name')}</TableCell>
                        <TableCell align='center'>{t('Type')}</TableCell>
                        <TableCell align='center'>{t('Created')}</TableCell>
                        <TableCell align='center'>{t('Members')}</TableCell>
                        <TableCell align='center'>{t('Your participation in the team')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teams && teams.map((team) => (
                        <TableRow
                          sx={{ cursor: onTeamClick ? 'pointer' : '' }}
                          key={team.id}
                          onClick={() => onTeamClick(team)}
                          hover={onTeamClick !== null}
                        >
                          <TableCell align='center'>
                            <Stack
                              alignItems='center'
                              direction='row'
                              spacing={1}
                            >
                              {team.logotype_link ? (
                                <Avatar
                                  sx={{ height: '25px', width: '25px' }}
                                  variant='rounded'
                                  src={team.logotype_link}
                                />
                              ) : <People />}
                              <b>{team.name}</b>
                            </Stack>
                          </TableCell>
                          <TableCell
                            align='center'
                            component='th'
                            scope='row'
                          >
                            <OrganizationChip
                              type={team.type}
                              t={t}
                            />
                          </TableCell>
                          <TableCell align='center'>{moment(team.created_at).fromNow()}</TableCell>
                          <TableCell align='center'>
                            {team.users_count}
                          </TableCell>
                          <TableCell align='center'>
                            {team.current_user_participation.length > 0 ? team.current_user_participation.map((p) => (
                              <Chip
                                size='small'
                                sx={{ mr: 1 }}
                                key={team.id + p}
                                title={`You are ${p} of the organization`}
                                variant={p === 'administrator' ? 'contained' : 'outlined'}
                                label={p}
                              />
                            )) : <Chip label={t('None')} />}
                          </TableCell>
                        </TableRow>
                      ))}
                      {loadingTeams && [...Array(organization.teams_ids.length).keys()].map((i) => (
                        <TableRow key={`skeleton-${i}`}>
                          <TableCell
                            align='center'
                            colSpan={6}
                          >
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {(!loadingTeams && (!teams || teams.length) === 0) && (
                    <Alert severity='warning'>
                      {t('No teams found in this organization')}
                    </Alert>
                  )}
                  <Box sx={{ textAlign: 'center' }}>
                    <LoadingButton
                      loading={loadingTeams || creatingTeam}
                      sx={{ mt: 3 }}
                      size='small'
                      variant='contained'
                      startIcon={<Add />}
                      onClick={() => setOpenTeamCreator(true)}
                      disabled={!canCreateTeams}
                    >
                      {t('Create new team')}
                    </LoadingButton>
                  </Box>
                </>
              )}
              {tabValue === 'administrators' && (
                <UsersList
                  size='small'
                  searchOnOrganization={isAdmin && organization.id}
                  users={organization.administrators}
                  onSearchResultClick={isAdmin && handleAdministratorAdd}
                  getActions={(user) => isAdmin && (
                    [
                      {
                        id: `${user.id}-remove-action`,
                        onClick: handleAdministratorRemove,
                        text: t('Remove {{what}}'),
                        icon: <Delete />,
                        disabled: organization.administrators_ids.length === 1
                      }
                    ]
                  )}
                />
              )}
            </Grid>
          </Grid>
        </>
      ) : <CentricCircularProgress />}

      <Dialog
        open={openInvitationDialog}
        onClose={handleDeclineInvitation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ zIndex: 9000 }}
      >
        <DialogTitle id="alert-dialog-title">
          {t("User invitation")}
        </DialogTitle>
        <DialogContent>
          {invitationUser ? (
            <>
              <Typography variant="body1">
                Do you want to add this user to your team?
              </Typography>
              <Box sx={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 2,
              }}>
                <UserAvatar
                  user={invitationUser}
                  sx={{ mr: 2 }}
                ></UserAvatar>
                <Typography variant="body1" sx={{}}>
                  {invitationUser ? invitationUser.full_name : "..."}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1">
                This user is already in your team!
              </Typography>
            </>
          )}
        </DialogContent>
        {invitationUser ? (
          <DialogActions>
            <Button color="error" onClick={handleDeclineInvitation}>Decline</Button>
            <LoadingButton loading={loading} onClick={handleAcceptInvitation} autoFocus>
              Accept
            </LoadingButton>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={handleDeclineInvitation} autoFocus>
              Close
            </Button>
          </DialogActions>
        )}

      </Dialog>

    </Box>
  );
};

export default OrganizationProfileSolo;
