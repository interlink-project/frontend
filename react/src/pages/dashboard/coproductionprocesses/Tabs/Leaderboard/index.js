import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { gamesApi, usersApi } from '__api__';
import { AppBar, Box, Paper, Tab, Tabs, Grid, Typography } from '@mui/material';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import OverallLeaderboard from 'components/dashboard/coproductionprocesses/OverallLeaderboard';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const LeaderboardTab = ({ }) => {
    const { process } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language);
    const [value, setValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLeaderboard = async (game) => {
        setLoading(true);
        const us = [];
        for (let player of game.content) {
            let user = await usersApi.get(player.playerId);
            us.push({ id: player.playerId, name: user.full_name, score: player.score });
        }
        setUsers(us);
        setLoading(false);
    };




    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };



    useEffect(() => {
        gamesApi.getLeaderboard(process.id).then((res) => {
            handleLeaderboard(res)
        });
    }, []);




    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Grid container>
                <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    xs={12}
                >

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{
                            '& .Mui-selected': {
                                background: '#a4cbd8',
                                color: 'black',
                            },
                            '& .MuiTabs-flexContainer': {
                                'justify-content': 'center',

                            }
                        }}>
                            <Tab label="Leaderboard" />
                        </Tabs>
                    </Box>




                    <TabPanel value={value} index={0}>
                        <OverallLeaderboard
                            users={users}
                            loading={loading} />
                    </TabPanel>


                </Grid>
            </Grid>
        </Box>

    );
}

export default LeaderboardTab;