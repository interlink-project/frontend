import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { gamesApi } from '__api__';
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
    const { process, hasSchema, loading } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language);
    const [value, setValue] = useState(0);
    const [users, setUsers] = useState([]);


    const handleGame = (game) => {
        const users = [];
        for (let task of game.taskList) {
            for (let player of task.players) {
                if (users.find((user) => user.id === player.id)) {
                    users.find((user) => user.id === player.id).development += player.development;
                } else {
                    users.push({id: player.id, name: player.name, development: player.development});
                    
                }
            }
        }
        setUsers(users);
    };

    

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };



    useEffect(() => {
        gamesApi.getGame(process.id).then((res) => {
            handleGame(res[0]);
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
                            <Tab label="Item One" />
                            <Tab label="Item Two" />
                            <Tab label="Item Three" />
                        </Tabs>
                    </Box>




                    <TabPanel value={value} index={0}>
                        <OverallLeaderboard
                            users={users} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item Two
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>


                </Grid>
            </Grid>
        </Box>

    );
}

export default LeaderboardTab;