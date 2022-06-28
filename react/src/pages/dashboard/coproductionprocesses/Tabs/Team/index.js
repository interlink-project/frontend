import { Alert, Avatar, Box, Button, Card, CardActionArea, CardHeader, Grid, List, ListItem, Paper, Stack, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { CheckOutlined, Close } from '@material-ui/icons';
import { OrganizationChip, TreeItemTypeChip } from 'components/dashboard/assets/Icons';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import TeamProfile from 'pages/dashboard/organizations/TeamProfile';
import UsersList from 'pages/dashboard/organizations/UsersList';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import PermissionCreate from './PermissionCreate';

export default function TeamsTab() {
    const { process, treeitems } = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();
    const { t } = useDependantTranslation()
    const [selectedTeam, setSelectedTeam] = React.useState(null)
    const [permissionCreatorOpen, setOpenPermissionCreator] = React.useState(false);
    const [creatingPermission, setCreatingPermission] = React.useState(false);
    const navigate = useNavigate()

    const update = () => {
        dispatch(getProcess(process.id, false));
    }
    const permitted_treeitems = treeitems.filter(el => process.permissions.findIndex(perm => perm.treeitem_id === el.id) >= 0)
    return <>
        {selectedTeam && <TeamProfile teamId={selectedTeam} open={selectedTeam ? true : false} setOpen={setSelectedTeam} onChanges={() => console.log("refresh")} />}
        {process.teams.length > 0 ? <>
            <Grid container spacing={3} sx={{ p: 3 }}>

                {process.teams.map(team => <Grid item key={team.id} xs={12} md={6} lg={6} xl={4} sx={{ textAlign: "center" }}>
                    <Card sx={{ p: 1 }}>
                        <Paper>
                        <CardActionArea sx={{p: 1 }} onClick={() => setSelectedTeam(team.id)}>
                            <CardHeader
                                avatar={
                                    <Avatar src={team.logotype_link} />
                                }
                                title={team.name}
                                subheader={<OrganizationChip t={t} type={team.type} />}
                            />
                            </CardActionArea>
                        </Paper>
                            
                            

                        {false && <UsersList users={team.users} size="small" showEmail={false} />}
                        <Typography variant="h6">
                            {t("This team has permissions on:")}
                        </Typography>
                        <List>
                            {process.permissions.filter(el => el.team_id === team.id).map(permission => {
                                const treeitem = permitted_treeitems.find(el => el.id === permission.treeitem_id)
                                return treeitem && <ListItem key={permission.id}>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={7}>
                                            <Button variant="outlined" fullWidth color={treeitem.type === "phase" ? "primary" : treeitem.type === "objective" ? "secondary" : "inherit"} onClick={() => {
                                                dispatch(setSelectedTreeItem(treeitem, () => navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)))

                                            }}>
                                                <Box sx={{ m: 1 }}>
                                                    <TreeItemTypeChip treeitem={treeitem} t={t} />

                                                </Box>

                                                {treeitem.name}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Stack alignItems="center" direction="row">
                                                {t("Access resources")}: <CheckOutlined style={{ color: green[500] }} />
                                            </Stack>
                                            <Stack alignItems="center" direction="row">
                                                {t("Create resources")}: {permission.create_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                                            </Stack>
                                            <Stack alignItems="center" direction="row">
                                                {t("Delete resources")}: {permission.delete_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    <Stack>

                                    </Stack>
                                </ListItem>
                            })}
                        </List>

                    </Card>
                </Grid>
                )}

            </Grid>
        </> : <>
            <Alert severity='warning' sx={{ p: 3, m: 3 }}>
                {t("There are no teams working on the coproduction process yet. To add a new team, navigate to the guide section, select a tree item and add a new permission.")}
            </Alert></>}

        <PermissionCreate
            open={permissionCreatorOpen}
            setOpen={setOpenPermissionCreator}
            onCreate={update}
            loading={creatingPermission}
            setLoading={setCreatingPermission}
            coproductionprocess={process}
        />
    </>
}