import { useState, useEffect } from 'react';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import ContributionsTable from 'components/dashboard/tree/ContributionsTable';
import { gamesApi, usersApi, coproductionprocessnotificationsApi } from '__api__';
import { IconButton, Box, Button, Dialog, DialogTitle, DialogContent, Select, InputLabel, MenuItem, DialogActions, TextField, Typography, Grid } from '@mui/material';
import ConfirmationButton from 'components/ConfirmationButton';
import { LoadingButton } from '@mui/lab';
import UserSearch from '../coproductionprocesses/UserSearch';
import { Delete, Edit, Save, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';



const ContributionsTabs = ({ contributions }) => {
    // Data for new contributions 
    const [rows, setRows] = useState([]);
    const [contributor, setContributor] = useState(null);
    const [closedTask, setClosedTask] = useState(false);

    const [loading, setLoading] = useState(false);
    const [claimDialogOpen, setClaimDialogOpen] = useState(false);

    const { assetsList } = useSelector((state) => state.general);
    const { process, selectedTreeItem } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language);

    const CONTRIBUTION_LEVELS = {
        "Low": 1,
        "Average": 2,
        "High": 3
    }

    // Map contributions to a value. TODO: make this configurable
    const mapContributions = (total_contribs, user_contribs) => {
        const percentage = user_contribs / total_contribs;
        if (percentage < 0.15) {
            return "Low";
        }
        if (percentage < 0.60) {
            return "Average";
        }
        return "High";
    };


    const handleCloseDialog = () => {
        setClaimDialogOpen(false);
        setContributor("");
    };

    const handleAddRow = () => {
        setClaimDialogOpen(true);
    };

    const handleCloseTask = async () => {
        console.log("CLOSE TASK");
        for (let row of rows) {
            // console.log(row);
            // console.log(CONTRIBUTION_LEVELS[row.contribution]);
            await gamesApi.addClaim(process.game_id,
                selectedTreeItem.id,
                row.id,
                row.name,
                CONTRIBUTION_LEVELS[row.contribution]);
        }
        gamesApi.completeTask(process.game_id, selectedTreeItem.id).then((res) => {
            console.log(res);
            setClosedTask(true);
        });
    };

    useEffect(() => {
        gamesApi.getTask(process.game_id, selectedTreeItem.id).then((res) => {
            if (res) {
                setClosedTask(res.completed);
            }
        });

        console.log(contributions);
        if (contributions.length === 0) {
            console.log("NO CONTRIBUTIONS");
            setRows([]);
            return;
        }
        let total_contribs = 0;
        let contribs = {};
        for (let i = 0; i < contributions.length; i++) {
            for (let j = 0; j < contributions[i].contributors.length; j++) {
                if (!contribs[contributions[i].contributors[j].user_id]) {
                    contribs[contributions[i].contributors[j].user_id] = 1;
                } else {
                    contribs[contributions[i].contributors[j].user_id] += 1;
                }
                total_contribs += 1;
            }
        }

        setRows([]);
        for (let id in contribs) {
            usersApi.get(id).then((res) => {
                setRows(rows => [...rows, { id: id, name: res.full_name, contribution: mapContributions(total_contribs, contribs[id]), contrib_value: contribs[id] }]);
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
                <Grid item xs={6} sx={{ position: "relative" }}>
                    {!closedTask &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddRow}
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                            }}>
                    Add a row
                </Button>
                    }
            </Grid>
        </Grid>
            {/* Table */ }
    <ContributionsTable
        rows={rows}
        assets={contributions}
        closedTask={closedTask}
    />
    {/* Button for closing the task and giving the points */ }
    {
        !closedTask &&
            <Box sx={{ p: 2, float: 'right' }}>
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
            </Box>
    }

    <Dialog
        open={claimDialogOpen}
        onClose={handleCloseDialog}
    >
        <IconButton
            aria-label='close'
            onClick={() => handleCloseDialog}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
        >
            <Close />
        </IconButton>

        <DialogContent sx={{ p: 2 }}>
            <Formik
                initialValues={{
                    user: '',
                    asset: '',
                    title: '',
                    description: '',
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string()
                        .min(3, 'Must be at least 3 characters')
                        .max(255)
                        .required('Required'),
                    description: Yup.string()
                        .min(3, 'Must be at least 3 characters')
                        .required('Required'),
                    user: Yup.object().required('Required'),
                    asset: Yup.object().required('Required'),

                })}
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                    setSubmitting(true);

                    const selectedAsset = values.asset;

                    //Defino el link del asset
                    let selectedAssetLink = '';
                    let selectedAssetIcon = '';
                    let selectedShowIcon = '';
                    let selectedShowLink = '';
                    if (selectedAsset.type == 'externalasset') {
                        //Is external
                        selectedAssetLink = selectedAsset.uri;
                        selectedAssetIcon = selectedAsset.icon_path;
                        selectedShowIcon = '';
                        selectedShowLink = 'hidden';

                    } else {
                        //Is internal
                        selectedAssetLink = selectedAsset.link + '/view'
                        selectedShowIcon = '';
                        selectedShowLink = 'hidden';
                    }

                    const parametersList = {
                        assetId: selectedAsset.id,
                        assetName: '{assetid:' + selectedAsset.id + '}',
                        assetLink: selectedAssetLink,
                        assetIcon: selectedAssetIcon,
                        commentTitle: values.title,
                        commentDescription: values.description,
                        treeitem_id: selectedTreeItem.id,
                        treeItemName: selectedTreeItem.name,
                        copro_id: process.id,
                        showIcon: selectedShowIcon,
                        showLink: selectedShowLink
                    };
                    const paramListJson = JSON.stringify(parametersList)
                    const dataToSend = {
                        coproductionprocess_id: process.id,
                        notification_event: 'add_contribution_asset',
                        asset_id: selectedAsset.id,
                        parameters: paramListJson,
                        claim_type: 'Development',
                        user_id: values.user.id
                    };

                    coproductionprocessnotificationsApi.createbyEvent(dataToSend).then((res) => {
                        setStatus({ success: true });
                        setSubmitting(false);
                        // getAssets();
                        handleCloseDialog();

                    }).catch((err) => {
                        setStatus({ success: false });
                        setErrors({ submit: err });
                        console.log(err);
                        setSubmitting(false);
                    });


                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    setFieldTouched,
                    touched,
                    values,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mt: 3 }}>

                            <Typography variant="h6" component="h2">
                                Introduce the details of the contribution:
                            </Typography>
                            {!contributor ?
                                <Box sx={{ mt: 3 }}>
                                    <InputLabel id="resource-select-label" sx={{ mt: 2, mb: -1 }}>User</InputLabel>
                                    <UserSearch
                                        error={Boolean(touched.user && errors.user)}
                                        alert={false}
                                        importCsv={false}
                                        onClick={(user) => {
                                            setFieldValue('user', user);
                                            setFieldTouched('user');
                                            setContributor(user);
                                        }} />
                                </Box>
                                :
                                <Grid container>
                                    <Grid item xs={10}>
                                        <TextField
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            id="outlined-disabled"
                                            label="User"
                                            value={values.user.full_name}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton
                                            aria-label='close'
                                            sx={{
                                                verticalAlign: 'center',
                                            }}
                                            onClick={() => {
                                                setContributor(null);
                                                setFieldValue('user', '');
                                            }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            }

                            <InputLabel id="resource-select-label" sx={{ mt: 2 }}>Resource</InputLabel>
                            <Select
                                required
                                error={Boolean(touched.asset && errors.asset)}
                                helperText={touched.asset && errors.asset}
                                onBlur={handleBlur}
                                labelId="resource-select-label"
                                id="resource-select"
                                value={values.asset}
                                name='asset'
                                onChange={handleChange}
                                onClick={() => setFieldTouched('asset')}
                                // onChange={(event) => {
                                //     setAsset(event.target.value);
                                // }}
                                sx={{ width: '100%', mt: 1 }}
                            >
                                {assetsList.map(el => <MenuItem key={el.id} value={el}>{el.internalData.name}</MenuItem>)}

                            </Select>

                            <Typography variant="h6" component="h5" sx={{ mt: 2 }}>
                                Contribution
                            </Typography>
                            <TextField
                                required
                                error={Boolean(touched.title && errors.title)}
                                fullWidth
                                helperText={touched.title && errors.title}
                                label='Title'
                                name='title'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                onClick={() => setFieldTouched('title')}
                                value={values.title}
                                variant='outlined'
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                required
                                sx={{ mt: 2 }}
                                rows={4}
                                multiline
                                error={Boolean(touched.description && errors.description)}
                                fullWidth
                                helperText={touched.description && errors.description}
                                label='Description'
                                name='description'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                onClick={() => setFieldTouched('description')}
                                value={values.description}
                                variant='outlined'
                            />

                            <LoadingButton
                                sx={{ mt: 2 }}
                                variant='contained'
                                fullWidth
                                loading={isSubmitting}
                                onClick={handleSubmit}
                            >
                                {t('Claim')}
                            </LoadingButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </DialogContent>
    </Dialog>
        </>
    );
}

export default ContributionsTabs;