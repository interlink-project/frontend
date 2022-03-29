import { Avatar, Button, Select, AvatarGroup, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, IconButton, Typography, Collapse, Box, MenuItem, Alert } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowUp as KeyboardArrowUpIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Remove, Save, Edit, Delete } from '@material-ui/icons';
import TeamAdd from './TeamAdd';
import { LoadingButton } from '@material-ui/lab';
import { useNavigate } from 'react-router';
import { rolesApi } from '__fakeApi__';


function MemberRow({ user, acl, onChanges }) {
    const { process } = useSelector((state) => state.process);
    const { roles } = acl
    const role = roles.find(role => role.membership_ids.includes(user.id)) || roles.find(el => el.id === acl.default_role_id)
    const [editMode, setEditMode] = React.useState(false);
    const [newRole, setNewRole] = React.useState(role.id);
    const [loading, setLoading] = React.useState(false);

    const updateRole = () => {
        setLoading(true)
        rolesApi.switch({
            "new_role": newRole,
            "old_role": role.id,
            "user_id": user.id

        }).then((res) => {
            onChanges(res)
            setEditMode(false)
        }).finally(() => setLoading(false))
    }

    return <TableRow key={user.id}>
        <TableCell align="center">
            <Avatar src={user.picture} />

        </TableCell>
        <TableCell align="center">
            {user.created_at}
        </TableCell>
        <TableCell align="center">
            {editMode ? <Select
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value)}
            >

                {roles.filter(role => role.selectable).map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
            </Select> : role.name}
        </TableCell>
        <TableCell align="center">{user.email}</TableCell>
        <TableCell align="center">
            {editMode ? <>
                <LoadingButton loading={loading} size="small" onClick={updateRole}>
                    <Save fontSize="small" />
                </LoadingButton>
                <IconButton size="small" onClick={() => setEditMode(false)}>
                    <Remove fontSize="small" />
                </IconButton>
            </> :
                <>
                    {process.creator_id !== user.user_id ? <IconButton size="small" onClick={() => setEditMode(true)}>
                        <Edit fontSize="small" />
                    </IconButton> : <Alert severity="warning">Is the creator</Alert>}

                </>
            }
        </TableCell>
    </TableRow>
}
function TeamRow({ team }) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate()

    const deleteTeam = () => {
        console.log(team.id, "delete")
    }

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="center">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <Button variant="text" fullWidth onClick={() => navigate(`/dashboard/teams/${team.id}`)}>
                        {team.name}
                    </Button>

                </TableCell>
                <TableCell align="center">
                    <AvatarGroup max={4} variant='circular'>
                        {team.memberships.map(member => <Avatar key={member.id} src={member.picture} sx={{ height: "30px", width: "30px", border: "0px" }} />)}
                    </AvatarGroup>
                </TableCell>
                <TableCell align="center">
                    <IconButton size="small" onClick={deleteTeam}>
                        <Delete fontSize="small" />
                    </IconButton>
                </TableCell>

            </TableRow>{/*
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Members of {team.name}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell align="center">Joined</TableCell>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {team.memberships.map((member) => (
                                        <MemberRow key={member.id} member={member} acl={acl} onChanges={onChanges} />
                                    ))}

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
                                    </TableRow> */}

        </React.Fragment>
    );
}

export default function TeamsTable() {
    const { process } = useSelector((state) => state.process);

    return <TableContainer component={Paper}>

        <Table aria-label="collapsible table">
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Members</TableCell>
                    <TableCell align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {process.teams.map((team) => (
                    <TeamRow key={team.id} team={team} />
                ))}
            </TableBody>
        </Table>

        <TeamAdd currentTeams={process.teams} />
    </ TableContainer>
}