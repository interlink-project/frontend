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



const PersonalLeaderboard = ({ user, loading }) => {


    const [rows, setRows] = useState([]);
    const [activitiesDialogOpen, setactivitiesDialogOpen] = useState(false);

    const { process, tree } = useSelector((state) => state.process);
    console.log(tree);

    const dispatch = useDispatch();
    const t = useCustomTranslation(process.language);

    // const handleClickHistory = (userId) => {
    //     console.log("Selected user: " + userId);
    //     if (userId == null) {
    //         return;
    //     }
    //     setactivitiesDialogOpen(true);
    //     dispatch(getUserActivities({
    //         'coproductionprocess_id': process.id, 'assets': assetsList, 'user_id': userId
    //     }));
    // };


    // const handleRows = () => {
    //     let tmpRows = [];

    //     for (let i = 3; i < users.length; i++) {
    //         tmpRows.push({
    //             id: users[i].id,
    //             position: i + 1,
    //             collab_name: users[i].name,
    //             points: users[i].score,
    //         });
    //     }
    //     setRows(tmpRows);

    // };

    // useEffect(() => {
    //     if (users.length > 0) {
    //         if (users.length > 3) {
    //             handleRows();
    //         }
    //     }
    // }, [users]);


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8} lg={8}>
                    <UserAvatar user={user} />
                    <Typography variant="h3" component="h2" gutterBottom>
                        {user.full_name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {user.email}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={4} sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" component="h2" gutterBottom>
                        Place
                    </Typography>
                    {/* TODO: Set images depending on the position in the leaderboard */}
                    <img
                        src={'/static/graphics/podium.png'}
                        alt={'podium'}
                        loading="lazy"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Typography>
                    Your contribution in each task
                </Typography>
                
                <Box sx={{ width: '100%' }}>
                    {tree.map((node) => {
                        <Typography variant="h5" component="h2">
                            {node.name}
                        </Typography>
                        // }
                    })}
                </Box>
            </Grid>
        </>
    )
}

export default PersonalLeaderboard;