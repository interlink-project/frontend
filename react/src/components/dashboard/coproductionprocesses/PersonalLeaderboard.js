import { Dialog, Box, List, Chip, DialogContent, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Grid, Card, CardContent, Container, Typography, CardMedia, Button, Divider, Link, CircularProgress } from '@mui/material';
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
import { getAllChildren } from 'slices/process';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from 'react-router';
import { setSelectedTreeItemById } from 'slices/process';


const DEVELOPMENT_COMPLEXITY = {
    0: 'None',
    20: 'Very low',
    40: 'Low',
    60: 'Medium',
    80: 'High',
    100: 'Very high',
    default: 'No defined'
}

const RANKING = {
    1: 'gold',
    2: 'silver',
    3: 'bronze',
}

const CONTRIBUTION_LEVELS = {
    1: 'Low contribution',
    2: 'Average contribution',
    3: 'High contribution',
}

const CONTRIBUTION_COLORS = {
    1: 'low_contribution.main',
    2: 'average_contribution.main',
    3: 'high_contribution.main',
}

const PersonalLeaderboard = ({ user, game, place, loading }) => {

    const { process, tree, treeitems } = useSelector((state) => state.process);
    const [filteredGame, setFilteredGame] = useState({});
    const [phases, setPhases] = useState({});
    const [points, setPoints] = useState(0);
    const dispatch = useDispatch();
    const t = useCustomTranslation(process.language);
    const navigate = useNavigate();

    const filterGame = () => {
        let tmpGame = {};
        let tmpPhases = {};
        let tmpPoints = 0;
        for (let task of game.taskList) {
            for (let player of task.players) {
                if (player.id === user.id) {
                    tmpGame[task.id] = {
                        "score": task.development * player.development,
                        "contribution": player.development,
                    }
                    console.log(tmpGame);
                    let phase_id = treeitems.find((item) => item.id === task.id).phase_id
                    if (tmpPhases[phase_id] === undefined) {
                        tmpPhases[phase_id] = task.development * player.development;
                    } else {
                        tmpPhases[phase_id] += task.development * player.development;
                    }
                    tmpPoints += task.development * player.development;
                }
            }
        }
        setPoints(tmpPoints);
        setPhases(tmpPhases);
        setFilteredGame(tmpGame);
    }

    useEffect(() => {
        filterGame();
    }, []);


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8} lg={8}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <UserAvatar user={user} sx={{ width: '15%', height: '100%' }} />
                        <Box sx={{ m: 2, textAlign: 'left' }}>
                            <Typography variant="h3" component="h3" gutterBottom>
                                {user.full_name}
                            </Typography>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ ml: 0.3 }}>
                                    {user.email}
                                </Typography>
                                <Chip label={`${points} points`} sx={{ ml: 2, backgroundColor: `${RANKING[place]}.main`, color: `${RANKING[place]}.contrastText` }} />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} lg={4} sx={{ textAlign: 'center', }}>
                    <Typography variant="h3" component="h2" gutterBottom>
                        {t("Place")}:
                    </Typography>

                    {place < 4 && place != 0 ?
                        <img
                            src={`/static/graphics/${place}place.svg`}
                            alt={'medal'}
                            loading="lazy"
                        />
                        : place === 0 ?
                            <Typography variant="h6" component="h6" gutterBottom>
                                {t("No contributions yet")}</Typography>
                            : <Typography variant="h2" component="h2" gutterBottom>
                                {place}</Typography>}


                </Grid>
            </Grid >
            <Box>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item xs={3} sx={{ mt: 2 }}>
                        <Typography variant="h5" component="h5">
                            {t("Your contribution in each task")}
                        </Typography>
                    </Grid>
                </Grid>

                {tree.map((node) => (
                    <>
                        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                            {node.name} - {phases[node.id] ? phases[node.id] : '0'} {t("points")}
                        </Typography>
                        <List >
                            {node.children.map((objective) => (
                                <>
                                    {objective.children.map((child) => (
                                        <ListItem>
                                            <ListItemSecondaryAction>
                                                <Typography variant="body2" color={filteredGame[child.id] ? CONTRIBUTION_COLORS[filteredGame[child.id].contribution] : "primary"}>
                                                    {filteredGame[child.id] ? CONTRIBUTION_LEVELS[filteredGame[child.id].contribution] + ' - ' + filteredGame[child.id].score + ' points' : "No contribution"}
                                                </Typography>

                                            </ListItemSecondaryAction>
                                            <ListItemText
                                                primary={
                                                    <Link
                                                        onClick={dispatch(setSelectedTreeItemById(child.id, () => {
                                                            navigate(`/dashboard/coproductionprocesses/${process.id}/guide`);
                                                        }))} color="inherit">{child.name}</Link>
                                                }
                                                secondary={DEVELOPMENT_COMPLEXITY[child.development]}
                                                sx={{
                                                    bgcolor: '',
                                                    borderRadius: '5px',
                                                    p: 0,
                                                }}
                                            />
                                        </ListItem >
                                    ))}
                                </>
                            ))}
                        </List >
                    </>
                ))}
            </Box >
        </>
    )
}

export default PersonalLeaderboard;