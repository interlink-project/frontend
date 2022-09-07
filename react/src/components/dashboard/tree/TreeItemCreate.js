import {
    Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputLabel, MenuItem, Select, TextField, Typography
} from '@material-ui/core';
import { Close, KeyboardArrowRight } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useMounted from 'hooks/useMounted';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getLanguage, LANGUAGES } from 'translations/i18n';
import { coproductionProcessesApi, objectivesApi, phasesApi, tasksApi } from '__api__';

// Create the constant
const TreeItemCreate = ({ open, setOpen, loading, setLoading, onCreate }) => {
    
    // Set the properties
    const [type, setType] = useState("")
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState(getLanguage());
    const [logotype, setLogotype] = useState(null);

    const [activeStep, setActiveStep] = useState(0);
    const mounted = useMounted();
    const { t } = useTranslation()
    const { treeitems } = useSelector((state) => state.process);

    const apis = {
        task: tasksApi,
        objective: objectivesApi,
        phase: phasesApi
      }

    const TYPES = [
        {
            label: 'Phase',
            value: 'phase',
        },
        {
            label: 'Objective',
            value: 'objective',
        },
        {
            label: 'Task',
            value: 'task',
        },
        
    ]

    console.log(treeitems)

    const sendOnCreate = (data) => {
        if (mounted.current) {
            setLoading(false)
            handleClose()
            if (onCreate) {
                onCreate(data)
            }
        }
    }

    const handleNext = async () => {
        setLoading(true)
        console.log({
            name,
            description,
            language
            // team_id: team.id
        })
        coproductionProcessesApi.create({
            name,
            description,
            language
            // team_id: team.id
        }).then(res => {
            if (!logotype) {
                sendOnCreate(res.data)
            } else {
                coproductionProcessesApi.setFile(res.data.id, "logotype", logotype).then(res2 => {
                    sendOnCreate(res2.data)
                }).catch(() => {
                    sendOnCreate(res.data)
                })
            }
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    };

    useEffect(() => {
        if (open && mounted) {
            setName("")
            setDescription("")
            setType(null)
            setActiveStep(0)
        }
    }, [open, mounted])

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>{t("treeitem-creation-title")}</DialogTitle>
                <DialogContent>
                    {activeStep === 0 && <>
                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="select-type">{t("Type")}</InputLabel>
                            <Select
                                fullWidth
                                labelId="select-type-label"
                                id="select-type"
                                value={type}
                                onChange={(event) => {
                                    setType(event.target.value);
                                    getTreeItems(event.target.value);
                                }}
                                label={t("Type")}
                            >
                                {TYPES.map(type => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={t("Name")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            sx={{ mt: 2 }}
                            margin="dense"
                            id="description"
                            label={t("Description")}
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            variant="standard"
                        />
                    </>}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <LoadingButton sx={{ my: 2 }} loading={loading} size="small" onClick={handleNext} disabled={!name}>
                        {t("Create")}
                        <KeyboardArrowRight />
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TreeItemCreate;
