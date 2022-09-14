import { Alert, Avatar, Box, Button, Card, CardActionArea, CardHeader, Grid, List, ListItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { Add, CheckOutlined, Close } from '@material-ui/icons';
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

function TeamRow({ t, team, process, treeitems, setSelectedTeam, setSelectedTreeItem }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [teamItems, setTeamItems] = React.useState([])

  React.useEffect(() => {
    const li = []
    process.enabled_permissions.filter(el => el.team_id === team.id).forEach((permission) => {
      const index = treeitems.findIndex((el => el.id === permission.treeitem_id))
      if(index >= 0){
        li.splice(index + 1, 0, { permission: permission, treeitem: treeitems[index]})
      }else{
        // insert at position 0
        li.splice(0, 0, { permission: permission, treeitem: null})
      }
    })
    const without_undefined = li.filter(function( element ) {
      return element !== undefined;
   })
   console.log(li, without_undefined)
    setTeamItems(without_undefined)
  }, [process])

  return (
    <Grid
      item
      key={team.id}
      xs={12}
      md={12}
      lg={12}
      xl={6}
      sx={{ textAlign: 'center' }}
    >
      <Card
        sx={{ p: 1 }}
        key={team.id}
      >
        <Grid container>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                sx={{ p: 1, height: "100%" }}
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
            </Card>
            {false && (
              <UsersList
                users={team.users}
                size='small'
              />
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right">{t("For")}</TableCell>
                  <TableCell align="right">{t('access_assets_permission')}</TableCell>
                  <TableCell align="right">{t('create_assets_permission')}</TableCell>
                  <TableCell align="right">{t('delete_assets_permission')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamItems.map(el => {
                  const { permission, treeitem } = el
                  return permission && (
                    <TableRow
                      key={permission.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="right" component="th" scope="row">
                        {treeitem ? <Button
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
                        </Button> : <Button
                          variant='outlined'
                          fullWidth
                          color={'inherit'}
                        >
                          {t("Overall process")}
                        </Button>}
                      </TableCell>
                      <TableCell align="right">
                        {permission.access_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                      </TableCell>
                      <TableCell align="right">
                        {permission.create_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                      </TableCell>
                      <TableCell align="right">
                        {permission.delete_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
export default function TeamsTab() {
  const { process, hasSchema, isAdministrator, treeitems } = useSelector((state) => state.process);
  const dispatch = useDispatch();
  const mounted = useMounted();
  const t = useCustomTranslation(process.language);
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [permissionCreatorOpen, setOpenPermissionCreator] = React.useState(false);
  const [creatingPermission, setCreatingPermission] = React.useState(false);
  const navigate = useNavigate();

  if (!hasSchema) {
    navigate(`/dashboard/coproductionprocesses/${process.id}`)
    return null
  }

  const update = () => {
    dispatch(getProcess(process.id, false));
  };

  return (
    <>
      {isAdministrator && (
        <Grid
          alignItems='center'
          container
          justifyContent='space-between'
          spacing={3}
          item
          xs={12}
          sx={{ my: 2 }}
        >
          <Grid item>
          </Grid>
          <Grid item>
            <Button
              onClick={() => setOpenPermissionCreator(true)}
              fullWidth
              startIcon={<Add />}
              variant='contained'
            >
              {`${t('Add new permission to the overall process')}`}
            </Button>
          </Grid>
        </Grid>

      )}
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
            sx={{ mb: 1 }}
          >
            {process.enabled_teams.map((team) => <TeamRow key={team.id} t={t} team={team} process={process} treeitems={treeitems} setSelectedTeam={setSelectedTeam} setSelectedTreeItem={setSelectedTreeItem} />)}
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
