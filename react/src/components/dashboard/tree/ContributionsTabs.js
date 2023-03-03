import { useState, useEffect } from 'react';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import ContributionsTable from 'components/dashboard/tree/ContributionsTable';
import { gamesApi, usersApi } from '__api__';
import { Alert, Button, Dialog, DialogTitle, DialogContent, FormControl, Select, InputLabel, MenuItem, DialogActions, TextField, Typography, Grid } from '@mui/material';
import ConfirmationButton from 'components/ConfirmationButton';
import UserSearch from '../coproductionprocesses/UserSearch';
import { Delete, Edit, Save } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const ContributionsTabs = ({ contributions }) => {
    const [rows, setRows] = useState([]);
    const [addRowDialogOpen, setAddRowDialogOpen] = useState(false);

    // Data for new contributions 
    const [contributor, setContributor] = useState(null);
    const [contribution, setContribution] = useState(null);

    const [errorUser, setErrorUser] = useState(false);

    const [taskClosed, setTaskClosed] = useState(false);

    const { process, selectedTreeItem } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language);


    const handleCloseDialog = () => {
        setAddRowDialogOpen(false);
        setContributor("");
    };

    const handleAddRow = () => {
        setAddRowDialogOpen(true);
    };

    const handleContributionChange = (event) => {
        setContribution(event.target.value);
    };

    const handleNewContributor = () => {
        console.log("NEW CONTRIBUTOR");
        setRows(rows => [...rows, {
            id: contributor.id,
            name: contributor.full_name,
            contribution: contribution,
        }]);
        console.log(rows);
        setAddRowDialogOpen(false);
        setContributor(null);
    };

    const handleAddUser = (user) => {
        if (rows.find((row) => user.id === row.id)) {
            setErrorUser(true);
        } else {
            setContributor(user);
        }
    };

    const handleCloseTask = async () => {
        console.log("CLOSE TASK");
        for (let row of rows) {
            console.log(process);

            await gamesApi.addClaim(process.game_id,
                selectedTreeItem.id,
                row.id,
                row.name);
            // gamesApi.addClaim(
            //     process.game_id,
            //     selectedTreeItem.id,
            //     row.id,
            //     row.name).then((res) => {
            //     console.log(res);
            // });
        }
        gamesApi.completeTask(process.game_id, selectedTreeItem.id).then((res) => {
            console.log(res);
        });
    };

    useEffect(() => {
        console.log(contributions);
        if (contributions.length === 0) {
            console.log("NO CONTRIBUTIONS");
            setRows([]);
            return;
        }
        let contribs = {};
        for (let i = 0; i < contributions.length; i++) {
            for (let j = 0; j < contributions[i].contributors.length; j++) {
                if (!contribs[contributions[i].contributors[j].user_id]) {
                    contribs[contributions[i].contributors[j].user_id] = 1;
                } else {
                    contribs[contributions[i].contributors[j].user_id] += 1;
                }
            }
        }

        for (let id in contribs) {
            usersApi.get(id).then((res) => {
                setRows(rows => [...rows, { id: id, name: res.full_name, contribution: "Average" }]);
            }).catch((err) => {
                console.log(err);
            });
        }

    }, [contributions]);

    return (
        <>
            {/* Header */}
            <Grid container sx={{ p: 2 }}>
                <Grid item xs={6}>

                    <Typography variant="h3" sx={{}}>
                        Contributions
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddRow}
                        sx={{
                            // display: 'inline-block',
                            float: 'right',
                        }}>
                        Add a row
                    </Button>

                </Grid>
            </Grid>
            {/* Table */}
            <ContributionsTable
                rows={rows}
                assets={contributions}
            />
            {/* Button for closing the task and giving the points */}
            <ConfirmationButton
                Actionator={({ onClick }) => (
                    <Button
                        variant='contained'
                        // disabled={!isAdministrator}
                        color='warning'
                        onClick={onClick}
                        startIcon={<Delete />}
                    >
                        {t('Close the task')}
                    </Button>
                )}
                ButtonComponent={({ onClick }) => (
                    <Button
                        sx={{ mt: 1 }}
                        fullWidth
                        variant='contained'
                        color='warning'
                        onClick={onClick}
                    >
                        {t('Confirm closing the task')}
                    </Button>
                )}
                onClick={handleCloseTask}
                text={t('Are you sure?')}
            />

            <Dialog
                open={addRowDialogOpen}
                onClose={handleCloseDialog}>
                <DialogTitle> Add new contributor </DialogTitle>
                <DialogContent sx={{ mt: 4 }}>
                    {!contributor ?
                        <UserSearch
                            error={errorUser}
                            alert={false}
                            importCsv={false}
                            onClick={handleAddUser}
                        ></UserSearch>
                        :
                        <TextField
                            fullWidth
                            sx={{ mt: 4 }}
                            id="outlined-disabled"
                            label="User"
                            value={contributor.full_name}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    }
                    <FormControl fullWidth sx={{ mt: 4 }}>
                        <InputLabel id="contribution-select-label">Contribution</InputLabel>
                        <Select
                            labelId="contribution-select-label"
                            id="contribution-select"
                            value={contribution}
                            label="Contribution"
                            onChange={handleContributionChange}
                        >
                            <MenuItem value={'Low'}>Low</MenuItem>
                            <MenuItem value={'Average'}>Average</MenuItem>
                            <MenuItem value={'High'}>High</MenuItem>
                        </Select>
                    </FormControl>
                    <DialogActions>
                        <Button
                            disabled={contributor == "" || contribution == null}
                            variant="contained"
                            color="primary"
                            onClick={handleNewContributor}>
                            Add
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

        </>
    );
}

export default ContributionsTabs;