import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { objectivesApi, phasesApi, tasksApi } from '__api__';

// Create the constant
const TreeItemCreate = ({ open, setOpen, loading, setLoading, onCreate }) => {

    // Set the properties
    const [type, setType] = useState("")
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [parentid, setParentid] = useState("");
    const [prerequistes_id, setPrerequistes_id] = useState("");

    const [activeStep, setActiveStep] = useState(0);
    const mounted = useMounted();
    const { t } = useTranslation();
    const { treeitems, process } = useSelector((state) => state.process);

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

    const sendOnCreate = (data) => {
        console.log(mounted)
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
        var item={}
        if(prerequistes_id!=''){
            item = {
                name,
                description,
                "prerequisites_ids": [prerequistes_id]
            }
        }else{
            item = {
                name,
                description
            }
        }


        if (type === "phase") {
            item["coproductionprocess_id"] = process.id;
            item["is_part_of_codelivery"] = true;
        }else if (type === "objective"){
            item["phase_id"] = parentid;
        }else if (type === "task"){
            item["objective_id"] = parentid;
        }
        console.log(item);
        apis[type].create(
            item
        ).then(res => {
            console.log(res);
            sendOnCreate(res.data);
        }).catch(err => {
            console.log(err);
            setLoading(false);
            alert("You don't have enought permissions to make this action. (You must have administrator role)");

        })
    };

    useEffect(() => {
        if (open && mounted) {
            setName("")
            setDescription("")
            setType("")
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
                                }}
                                label={t("Type")}
                            >
                                {
                                    TYPES.map(type => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }} >
                            <InputLabel id="select-parentid">{t("Parent item")}</InputLabel>
                            <Select
                                fullWidth
                                labelId="select-parentid-label"
                                id="select-parentid"
                                value={parentid}
                                disabled={type === "phase"}
                                onChange={(event) => {
                                    setParentid(event.target.value);

                                }}
                                label={t("Type")}
                            >
                                {type === "objective" &&
                                    treeitems.filter(el => el.type === "phase" && !el.is_disabled).map(el => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                                {type === "task" &&
                                    treeitems.filter(el => el.type === "objective" && !el.is_disabled).map(el => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="select-prerequisiteid">{t("Prerequisite item")}</InputLabel>
                            <Select
                                fullWidth
                                labelId="select-prerequisiteid-label"
                                id="select-prerequisiteid"
                                value={prerequistes_id}
                                onChange={(event) => {
                                    setPrerequistes_id(event.target.value);
                                }}
                                label={t("Prerequisite item")}
                            >
                                {type === "phase" &&
                                    treeitems.filter(el => el.type === type && !el.is_disabled).map(el => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                                {type === "objective" &&
                                    treeitems.filter(el => el.type === type && el.phase_id === parentid && !el.is_disabled).map(el => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                                {type === "task" &&
                                    treeitems.filter(el => el.type === type && el.objective_id === parentid && !el.is_disabled).map(el => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
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
