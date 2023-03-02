import { useState, useEffect } from 'react';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import ContributionsTable from 'components/dashboard/tree/ContributionsTable';
import { gamesApi, usersApi } from '__api__';
import { Button, Dialog, DialogTitle, DialogContent, FormControl, Select, InputLabel, MenuItem, DialogActions, TextField } from '@mui/material';
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
        setContributor(user);
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
            <h3 sx={{
                display: 'inline-block'
            }}> Contributions </h3>

            <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                sx={{
                    display: 'inline-block'
                }}>
                Add a row
            </Button>
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
                        color='error'
                        onClick={onClick}
                        startIcon={<Delete />}
                    >
                        {t('Remove coproduction process')}
                    </Button>
                )}
                ButtonComponent={({ onClick }) => (
                    <Button
                        sx={{ mt: 1 }}
                        fullWidth
                        variant='contained'
                        color='error'
                        onClick={onClick}
                    >
                        {t('Confirm deletion')}
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