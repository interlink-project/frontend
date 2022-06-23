import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Step, StepButton, StepContent, StepLabel, Stepper, Typography } from '@material-ui/core';
import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab';
import CreateSchema from 'components/dashboard/SchemaSelector';
import { user_id } from 'contexts/CookieContext';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import moment from "moment";
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const DoneAlert = ({ t, date = null }) => {
    return <Alert sx={{ mt: 1 }} severity="success">{date ? t("Done on", { date: moment(date).fromNow() }) : t("Done")}</Alert>
}

const WarningAlert = ({ t, explanation }) => {
    return <Alert sx={{ mt: 1 }} severity="warning">{explanation}</Alert>
}

export default function TimeLine({ }) {
    const { process, isAdministrator, hasSchema, tree } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language)
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        if(activeStep === 0 && process.aim && hasSchema)
        {
            setActiveStep(1)
        }
    }, [process])

    if (!process || !tree) {
        return
    }

    return (<Box>
        <Paper sx={{ m: 2, p: 2, bgcolor: "background.default", overflow: "scroll" }}>
            <Stepper nonLinear activeStep={activeStep} orientation="horizontal" sx={{ mx: 3 }}>
                <Step completed={hasSchema}>
                <StepButton color="inherit" onClick={() => setActiveStep(0)}>
                        {t("Process initialization")}
                    </StepButton>
                </Step>

                {tree.map((phase, index) => !phase.is_disabled && (
                <Step key={phase.id} completed={phase.status === "finished"}>
                    <StepButton color="inherit" onClick={() => setActiveStep(1 + index)}>
                        {t("Complete phase {{phase}}", { phase: phase.name })}
                    </StepButton>
                </Step>)
                )}

                {(!tree || tree.length === 0) && ["1", "2", "3", "4"].map((phase) => <Step key={phase}>
                    <StepLabel />

                </Step>)}


                <Step>
                    <StepLabel>
                        {t("Process completion")}
                    </StepLabel>
                </Step>
            </Stepper>
        </Paper>
        <Box sx={{ p: 3, justifyContent: "center" }}>
            {activeStep === 0 && <>
                <Stepper activeStep={activeStep} orientation="vertical">
                    <Step active completed={process.aim}>
                        <StepLabel>
                            <Stack spacing={1}>
                                <Typography variant="subtitle1">
                                    {t("Set coproduction process data")}
                                </Typography>
                                <Button disabled={process.aim || !isAdministrator} onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/settings`)} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Go to settings")}</Button>
                            </Stack>
                        </StepLabel>
                    </Step>
                    <Step active completed={hasSchema}>
                        <StepLabel>
                            <Stack spacing={1}>
                                <Typography variant="subtitle1">
                                    {t("Select the coproduction schema")}
                                </Typography>
                                <Typography variant="body2">
                                    {t("Click on the button and search for the optimal coproduction schema for your process.")}
                                </Typography>
                                <Button disabled={hasSchema || !isAdministrator} onClick={handleClickOpen} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Select an schema")}</Button>
                            </Stack>
                        </StepLabel>
                    </Step>
                    <Step active completed={process.administrators_ids !== [user_id]}>
                        <StepLabel>
                            <Stack spacing={1}>
                                <Typography variant="subtitle1">
                                    {t("Set coproduction process administrators")}
                                </Typography>
                                <Typography variant="body2">
                                    {t("Administrators can update the coproduction proccess information, add permissions to the tree items or add new administrators")}
                                </Typography>
                                <Button disabled={!isAdministrator} onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/settings`)} size="small" variant="contained" sx={{ maxWidth: "200px" }}>{t("Go to settings")}</Button>
                            </Stack>
                        </StepLabel>
                    </Step>
                </Stepper>

                {!hasSchema && <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
                    <Box sx={{minHeight: "93vh"}}>
                    <CreateSchema />
                    </Box>
                </Dialog>}
            </>
            }
            {activeStep > 1 && <>
                <Stack direction="column" textAlign="center" sx={{ mt: 10 }}>
                    {tree[activeStep - 1].children.map(objective => {
                        return objective.name
                    })}
                </Stack>
            </>}
        </Box>
    </Box>)
}