import { Dialog, Box, DialogContent, IconButton, Grid, Card, CardContent, Container, Typography, CardMedia, Button, Divider, Link, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import UserAvatar from 'components/UserAvatar';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { Close, ViewTimeline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserActivities } from "slices/general";
import CoproNotifications from 'components/dashboard/coproductionprocesses/CoproNotifications';



const OverallLeaderboard = ({ users, loading }) => {
    const [rows, setRows] = useState([]);
    const [activitiesDialogOpen, setactivitiesDialogOpen] = useState(false);

    const { process } = useSelector((state) => state.process);
    const { assetsList } = useSelector((state) => state.general);

    const dispatch = useDispatch();
    const t = useCustomTranslation(process.language);

    const columns = [
        {
            field: 'position',
            width: 90,
            renderHeader: () => (

                <LeaderboardOutlinedIcon />

            ),
            sortable: false,
            disableColumnMenu: true,
            flex: 0.2,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'collab_name',
            headerName: 'Collaborator name',
            width: 150,
            sortable: false,
            disableColumnMenu: true,
            flex: 2
        },
        {
            field: 'activity',
            headerName: t('Activity'),
            sortable: false,
            disableColumnMenu: true,
            flex: 2,
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
            field: 'points',
            headerName: 'Points',
            sortable: false,
            disableColumnMenu: true,
            flex: 0.5,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    const handleClickHistory = (userId) => {
        console.log("Selected user: " + userId);
        if (userId == null) {
            return;
        }
        setactivitiesDialogOpen(true);
        dispatch(getUserActivities({
            'coproductionprocess_id': process.id, 'assets': assetsList, 'user_id': userId
        }));
    };


    const handleRows = () => {
        let tmpRows = [];
        
        for (let i = 3; i < users.length; i++) {
            tmpRows.push({
                id: users[i].id,
                position: i + 1,
                collab_name: users[i].name,
                points: users[i].score,
            });
        }
        setRows(tmpRows);
        
    };

    useEffect(() => {
        if (users.length > 0) {
            if (users.length > 3) {
                handleRows();
            }
        }
    }, [users]);


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
           
            {users && !loading ? (
                <Grid container spacing={2} >
                    {/* Second position */}
                    <Grid item xs={12} md={4} lg={4}>
                        {users.length > 1 &&
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="40"
                                    sx={{
                                        background: "#9CB8BE",
                                    }}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <UserAvatar
                                        id={users[1].id}
                                        sx={{ margin: 'auto' }} />
                                    <Typography gutterBottom variant="h5" component="div" sx={{ mt: 1 }}>
                                        {users[1].name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {users[1].score + ' points'}
                                        <IconButton color="primary" aria-label="upload picture" component="label"
                                            onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    handleClickHistory(users[1].id);
                                                }
                                            }>
                                            <ViewTimeline />
                                        </IconButton>
                                    </Typography>

                                </CardContent>
                            </Card>
                        }
                    </Grid>
                    {/* First position */}
                    <Grid item xs={12} md={4} lg={4}>
                        {users.length > 0 &&
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="40"
                                    sx={{
                                        background: "#FDD41F",
                                    }}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <UserAvatar
                                        id={users[0].id}
                                        sx={{ margin: 'auto' }} />

                                    <Typography gutterBottom variant="h5" component="div" sx={{ mt: 1 }}>
                                        {users[0].name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {users[0].score + ' points'}
                                        <IconButton color="primary" aria-label="upload picture" component="label"
                                            onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    handleClickHistory(users[0].id);
                                                }
                                            }>
                                            <ViewTimeline />
                                        </IconButton>
                                    </Typography>

                                </CardContent>

                            </Card>
                        }
                    </Grid>
                    {/* Third position */}
                    <Grid item xs={12} md={4} lg={4}>
                        {users.length > 2 &&
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="40"
                                    sx={{
                                        background: "#DB803D",
                                    }}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <UserAvatar
                                        id={users[2].id}
                                        sx={{ margin: 'auto' }} />
                                    <Typography gutterBottom variant="h5" component="div" sx={{ mt: 1 }}>
                                        {users[2].name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {users[2].score + ' points'}
                                        <IconButton color="primary" aria-label="upload picture" component="label"
                                            onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    handleClickHistory(users[2].id);
                                                }
                                            }>
                                            <ViewTimeline />
                                        </IconButton>
                                    </Typography>

                                </CardContent>

                            </Card>
                        }
                    </Grid>
                </Grid>
            ) : (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center'  }}>
                    <CircularProgress />
                </Box>
            )
            }
            {users && users.length > 3 &&
                <Container sx={{ width: '100%', mt: 2 }}>
                    <DataGrid
                        autoHeight
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                    />
                </Container>
            }
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
                    <CoproNotifications
                        mode={'activity'} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default OverallLeaderboard;