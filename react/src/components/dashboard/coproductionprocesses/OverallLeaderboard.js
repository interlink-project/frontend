import { AppBar, Box, Paper, Tab, Tabs, Grid, Card, CardContent, CardActions, Typography, CardMedia, Button, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import UserAvatar from 'components/UserAvatar';



const OverallLeaderboard = ({ users }) => {
    const [orderedUsers, setOrderedUsers] = useState([]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        }
    ];
    const rows = [
        { id: 1, firstName: 'Jon' }
    ];

    useEffect(() => {
        if (users.length > 0) {
            orderUsers();
        }
    }, [users]);


    const orderUsers = () => {
        setOrderedUsers(users.sort((a, b) => b.development > a.development));
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6}>
                    <Typography variant="h3" component="h2" gutterBottom>
                        Leaderboard
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Here you can see the overall standings. The amount of points is based on your contribute in each finished task, decided by the admins.
                        At the end of the project the admin will decide who can be rewarded, <b>the podium is only to show who is giving more contribute into the project</b>. The reward is external from this platform and a responsability of the admins.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ textAlign: 'right' }}>
                    <img
                        src={'/static/graphics/podium.png'}
                        alt={'podium'}
                        loading="lazy"
                    />
                </Grid>
            </Grid>
            <Divider variant="middle" sx={{ m: 3 }} />
            <Grid container spacing={2} >
                {/* Second position */}
                <Grid item xs={12} md={4} lg={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="40"
                            sx={{
                                background: "#9CB8BE",
                            }}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            {users && users.length > 1 ? <UserAvatar
                                id={users[1].id} /> : <></>}

                            <Typography gutterBottom variant="h5" component="div">
                                {users && users.length > 1 ? users[1].name : "No users here... "}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {users && users.length > 1 ? users[1].name : "No users here... "}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>
                {/* First position */}
                <Grid item xs={12} md={4} lg={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="40"
                            sx={{
                                background: "#FDD41F",
                            }}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            {users && users.length > 0 ? <UserAvatar
                                id={users[0].id} /> : <></>}

                            <Typography gutterBottom variant="h5" component="div">
                                {users && users.length > 0 ? users[0].name : "No users here... "}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {users && users.length > 0 ? users[0].name : "No users here... "}
                            </Typography>

                        </CardContent>

                    </Card>
                </Grid>
                {/* Third position */}
                <Grid item xs={12} md={4} lg={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="40"
                            sx={{
                                background: "#DB803D",
                            }}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            {users && users.length > 2 ? <UserAvatar
                                id={users[2].id} /> : <></>}

                            <Typography gutterBottom variant="h5" component="div">
                                {users && users.length > 2 ? users[2].name : "No users here... "}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {users && users.length > 2 ? users[2].name : "No users here... "}
                            </Typography>

                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
            {users && users.length > 3 ?
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
                : <></>
            }
        </>
    )
}

export default OverallLeaderboard;