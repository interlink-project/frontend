import { Alert, Avatar, Box, Button, Card, CardActionArea, CardHeader, Grid, List, ListItem, Paper, Stack, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { CheckOutlined, Close } from '@material-ui/icons';
import { OrganizationChip, TreeItemTypeChip } from 'components/Icons';
import TeamAvatar from 'components/TeamAvatar';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import TeamProfile from 'components/dashboard/organizations/TeamProfile';
import UsersList from 'components/dashboard/organizations/UsersList';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import PermissionCreate from 'components/dashboard/coproductionprocesses/PermissionCreate';

export default function TeamsTab() {
  const { process, treeitems } = useSelector((state) => state.process);
  const dispatch = useDispatch();
  const mounted = useMounted();
  const t = useCustomTranslation(process.language);
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [permissionCreatorOpen, setOpenPermissionCreator] = React.useState(false);
  const [creatingPermission, setCreatingPermission] = React.useState(false);
  const navigate = useNavigate();

  const update = () => {
    dispatch(getProcess(process.id, false));
  };
  const permitted_treeitems = treeitems.filter((el) => process.enabled_permissions.findIndex((perm) => perm.treeitem_id === el.id) >= 0);
  return (
    <>
      {selectedTeam && (
      <TeamProfile
        teamId={selectedTeam}
        open={!!selectedTeam}
        setOpen={setSelectedTeam}
        onChanges={() => console.log('refresh')}
      />
      )}
      {process.enabled_teams.length > 0 ? (
        <>
          <Grid
            container
            spacing={3}
            sx={{ p: 3 }}
          >

            {process.enabled_teams.map((team) => (
              <Grid
                item
                key={team.id}
                xs={12}
                md={6}
                lg={6}
                xl={4}
                sx={{ textAlign: 'center' }}
              >
                <Card
                  sx={{ p: 1 }}
                  key={team.id}
                >
                  <Paper>
                    <CardActionArea
                      sx={{ p: 1 }}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <CardHeader
                        avatar={
                          <TeamAvatar team={team} />
                                }
                        title={team.name}
                        subheader={(
                          <OrganizationChip
                            t={t}
                            type={team.type}
                          />
)}
                      />
                    </CardActionArea>
                  </Paper>

                  {false && (
                  <UsersList
                    users={team.users}
                    size='small'
                  />
                  )}
                  <Typography variant='h6'>
                    {t('This team has permissions on:')}
                  </Typography>
                  <List>
                    {permitted_treeitems.map((treeitem) => {
                      const permission = process.enabled_permissions.find((el) => el.treeitem_id === treeitem.id && el.team_id === team.id);
                      return permission && (
                      <ListItem key={permission.id}>
                        <Grid
                          container
                          spacing={3}
                          alignItems='center'
                        >
                          <Grid
                            item
                            xs={7}
                          >
                            <Button
                              variant='outlined'
                              fullWidth
                              color={treeitem.type === 'phase' ? 'primary' : treeitem.type === 'objective' ? 'secondary' : 'inherit'}
                              onClick={() => {
                                dispatch(setSelectedTreeItem(treeitem, () => navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)));
                              }}
                            >
                              <Box sx={{ m: 1 }}>
                                <TreeItemTypeChip
                                  treeitem={treeitem}
                                  t={t}
                                />

                              </Box>

                              {treeitem.name}
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={5}
                          >
                            <Stack
                              alignItems='center'
                              direction='row'
                            >
                              {t('access_assets_permission')}
                              :
                              {permission.access_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                            </Stack>
                            <Stack
                              alignItems='center'
                              direction='row'
                            >
                              {t('create_assets_permission')}
                              :
                              {permission.create_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                            </Stack>
                            <Stack
                              alignItems='center'
                              direction='row'
                            >
                              {t('delete_assets_permission')}
                              :
                              {permission.delete_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                            </Stack>
                          </Grid>
                        </Grid>

                        <Stack />
                      </ListItem>
                      );
                    })}
                  </List>

                </Card>
              </Grid>
            ))}

          </Grid>
        </>
      ) : (
        <>
          <Alert
            severity='warning'
            sx={{ p: 3, m: 3 }}
          >
            {t('There are no teams working on the coproduction process yet. To add a new team, navigate to the guide section, select a tree item and add a new permission.')}
          </Alert>
        </>
      )}

      <PermissionCreate
        open={permissionCreatorOpen}
        setOpen={setOpenPermissionCreator}
        onCreate={update}
        loading={creatingPermission}
        setLoading={setCreatingPermission}
        coproductionprocess={process}
      />
    </>
  );
}
