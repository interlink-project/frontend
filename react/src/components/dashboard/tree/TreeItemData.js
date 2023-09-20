import { useMatomo } from "@datapunt/matomo-tracker-react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  MenuItem,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import ConfirmationButton from "components/ConfirmationButton";
import { FinishedIcon, InProgressIcon } from "components/dashboard/assets";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  getTree,
  setSelectedTreeItemById,
  setUpdatingTree,
} from "slices/process";
import { tree_items_translations } from "utils/someCommonTranslations";
import { gamesApi, objectivesApi, phasesApi, tasksApi } from "__api__";
import { AwaitingIcon, statusIcon, StatusText } from "../../Icons";
import { assetsApi } from "__api__";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import * as locales from "react-date-range/dist/locale";
import { setDataTempSave } from "slices/general";
import { updateSaveTempDatos } from 'utils/tempDataSave';
import { data } from "jquery";

const apis = {
  task: tasksApi,
  objective: objectivesApi,
  phase: phasesApi,
};

const TreeItemData = ({ language, processId, element, assets,setOpenSnackbar,setSnackbarMessage }) => {
  //const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [listAssetsNames, setListAssetsNames] = useState("");
  const [description, setDescription] = useState("");
  //const [management, setManagement] = useState('');
  const [development, setDevelopment] = useState("");
  //const [exploitation, setExploitation] = useState('');
  // const [taskDataContributions, setTaskDataContributions] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const {
    process,
    updatingTree,
    treeitems,
    selectedTreeItem,
    isAdministrator,
  } = useSelector((state) => state.process);
  const { datatempsave } = useSelector((state) => state.general);
  const isTask = selectedTreeItem && selectedTreeItem.type === "task";
  const [resetContributions, setResetContributions] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useCustomTranslation(language);
  const { trackEvent } = useMatomo();

  const [selectionRangeDatePicker, setSelectionRangeDatePicker] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [changeTheDate, setChangeTheDate] = useState(false);

  const handleSelectDatePicker = (ranges) => {

    setChangeTheDate(true);
    setSelectionRangeDatePicker([ranges.selection]);
 
    let rangesTemp=
      {
        startDate: ranges.selection.startDate.toISOString(), // Convert Date object to ISO string
        endDate: ranges.selection.endDate.toISOString(), 
        key: "selection",
      };

    //Save the change in the temp data
    let datos = updateSaveTempDatos(datatempsave, "task", selectedTreeItem.id, selectedTreeItem.name, { date_ranges: rangesTemp});
    dispatch(setDataTempSave(datos));
  };

  const restart = (el) => {
    setName(el.name);
    setDescription(el.description);

    setDevelopment(el.development);

    setStatus(el.status);


    if (el.start_date && el.end_date) {
      setSelectionRangeDatePicker([
        {
          startDate: el.start_date ? new Date(el.start_date) : null,
          endDate: el.end_date ? new Date(el.end_date) : null,
          key: "selection",
        },
      ]);
    } else {
      setSelectionRangeDatePicker([
        {
          startDate: null,
          endDate: null,
          key: "selection",
        },
      ]);
    }

    //Loading temp save data if exist
    if (datatempsave) {
      const index = datatempsave.findIndex(
        (item) => item.model === "task" && item.id === selectedTreeItem.id
      );
      if (index !== -1) {
        setEditMode(true);
        datatempsave[index].parameters.name
          ? setName(datatempsave[index].parameters.name)
          : setName(el.name);
        datatempsave[index].parameters.description
          ? setDescription(datatempsave[index].parameters.description)
          : setDescription(el.description);
        datatempsave[index].parameters.complexityLevel
          ? setDevelopment(datatempsave[index].parameters.complexityLevel)
          : setDevelopment(el.development);
        datatempsave[index].parameters.status
          ? setStatus(datatempsave[index].parameters.status)
          : setStatus(el.status);
        if(datatempsave[index].parameters.date_ranges){

          let rangesTemp=
          {
            startDate: new Date(datatempsave[index].parameters.date_ranges.startDate), // Convert Date object to ISO string
            endDate: new Date(datatempsave[index].parameters.date_ranges.endDate), 
            key: "selection",
          };


          setSelectionRangeDatePicker([
            rangesTemp
          ]);
          setChangeTheDate(true);
        }else{
          setSelectionRangeDatePicker([
            {
              startDate: el.start_date ? new Date(el.start_date) : null,
              endDate: el.end_date ? new Date(el.end_date) : null,
              key: "selection",
            },
          ]);
        }
          
        let fieldList = "";
        
        for (const key in datatempsave[index].parameters) {
          if (fieldList !== "") {
            fieldList +=  ", " ;
          } 
            fieldList +=  key ;
        };
        fieldList += "]";

      
        setSnackbarMessage(
          t("The fields")+": [" +
          fieldList +
              t(" has unsaved changes! Please save or discard the changes." )
        );

        setOpenSnackbar(true);
      } else {
        if (datatempsave.length > 0) {
          let text = "";
          for (let i = 0; i < datatempsave.length; i++) {
            if (datatempsave[i].model === "task") {
              if (i == 0) {
                text =
                  text +
                  "There are unsaved changes in the tasks: [" +
                  datatempsave[i].model_name;
              } else {
                text = text + "," + datatempsave[i].model_name;
              }
            }
          }
          text = text + "]. ";
          setSnackbarMessage(text);
          setOpenSnackbar(true);
        }
      }
    }

  };

  const discardTempInfoEvent = () => {
    setEditMode(false);
    //remove temp save data if exist
    if (datatempsave) {
      const index = datatempsave.findIndex(
        (item) => item.model === "task" && item.id === selectedTreeItem.id
      );
      if (index !== -1) {
        dispatch(setDataTempSave(datatempsave.filter((item) => item.id !== selectedTreeItem.id)));
      }
    }
  }

  useEffect(() => {
    restart(element);
  }, [editMode]);

  useEffect(() => {
    setEditMode(false);
    restart(element);
  }, [element]);

  const saveData = () => {
    const data = {};
    // Do not update because the message received through sockets triggers the update
    
    if (changeTheDate) {
      if (selectionRangeDatePicker[0].startDate && selectionRangeDatePicker[0].endDate) {
        let start_date = null;
        let end_date = null;

        if (!data.start_date) {
          start_date = addDays(selectionRangeDatePicker[0].startDate, 1)
            .toISOString()
            .slice(0, 10);

          end_date = addDays(selectionRangeDatePicker[0].endDate, 1)
            .toISOString()
            .slice(0, 10);
        } else {
          start_date = selectionRangeDatePicker[0].startDate
            .toISOString()
            .slice(0, 10);
          end_date = selectionRangeDatePicker[0].endDate.toISOString().slice(0, 10);
        }

        if (start_date !== element.start_date) {
          //alert(element.start_date + " <- " + start_date);
          data.start_date = start_date;
        }

        if (end_date !== element.end_date) {
          //alert(data.end_date + " <- " + end_date);
          data.end_date = end_date;
        }
      }
    }

    if (status !== element.status) {
      data.status = status;
      if (resetContributions) {
        //TODO: Method that removes the completion of a task in the game
        gamesApi.revertTask(process.id, selectedTreeItem.id).then((res) => {
          console.log(res);
        });
        setResetContributions(false);
      }
    }
    if (name !== element.name) {
      data.name = name;
    }
    if (description !== element.description) {
      data.description = description;
    }
    
    if (development !== element.development) {
      data.development = parseInt(development);
      if (process.game_id) {
        // TODO: If we put the game in the slice the checking of the task status will be faster
        gamesApi.getTask(process.id, selectedTreeItem.id).then((res) => {
          if (!res.completed) {
            gamesApi
              .updateTask(process.id, selectedTreeItem.id, data.development)
              .then((res) => {
                console.log(res);
              });
          }
        });
      }
    }
    
    trackEvent({
      category: process.name,
      action: "update-treeitem",
      name: element.id,
    });

    if (
      selectedTreeItem.status == "finished" &&
      development !== element.development
    ) {
      alert(
        "The status of the task is finished, the complexity values can not be modified."
      );
    } else {
      apis[element.type].update(element.id, data).then(() => {
        update(element.id);
      });
    }
    discardTempInfoEvent();
  };

  const update = (selectedTreeItemId) => {
    dispatch(getTree(processId, selectedTreeItemId));
    if (selectedTreeItemId) {
      dispatch(setSelectedTreeItemById(selectedTreeItemId));
    }
  };

  const deleteTreeItem = () => {
    trackEvent({
      category: process.name,
      action: "delete-treeitem",
      name: element.id,
    });
    dispatch(setUpdatingTree(true));
    apis[element.type].delete(element.id).then(() => {
      let setSelectedTreeItem = null;
      if (element.type === "task") {
        setSelectedTreeItem = element.objective_id;
      } else if (element.type === "objective") {
        setSelectedTreeItem = element.phase_id;
      } else {
        //Change to the next possible phase that is not disabled
        const nextPhase = treeitems.find(
          (el) =>
            el.id != element.id &&
            el.type === "phase" &&
            el.is_disabled === false
        );
        if (nextPhase) {
          setSelectedTreeItem = nextPhase.id;
        } else {
          setSelectedTreeItem = null;
        }
      }

      update(setSelectedTreeItem);
    });
  };


  let listAssets = [];

  
  
  const treeitem_translations = tree_items_translations(t);

  const complexityLevelsF = (status) => {
    switch (status) {
      case 0:
        return t("None");
      case 20:
        return t("Very low");
      case 40:
        return t("Low");
      case 60:
        return t("Medium");
      case 80:
        return t("High");
      case 100:
        return t("Very high");
      default:
        return t("No defined");
    }
  };

  
  return (
    <>
      {isAdministrator && !editMode && (
        <IconButton
          onClick={() => setEditMode(true)}
          sx={{
            position: "relative",
            right: 0,
            float: "right",
          }}
        >
          <Edit />
        </IconButton>
      )}
      <Typography variant="h6">{t("Name")}</Typography>
      {editMode ? (
        <TextField
          onChange={(event) => {
            setName(event.target.value);

            //Save the change in the temp data
            let datos = updateSaveTempDatos(datatempsave, "task",  selectedTreeItem.id,selectedTreeItem.name, { name: event.target.value });
            dispatch(setDataTempSave(datos));
            
          }}
          variant="standard"
          fullWidth
          value={name}
        />
      ) : (
        name
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>
        {t("Description")}
      </Typography>
      {editMode ? (
        <TextField
          onChange={(event) => {
            setDescription(event.target.value);

            //Save the change in the temp data
            let datos = updateSaveTempDatos(datatempsave, "task",  selectedTreeItem.id, selectedTreeItem.name, { description: event.target.value });//Add new values
            dispatch(setDataTempSave(datos));
          }}
          multiline
          fullWidth
          variant="standard"
          value={description}
        />
      ) : (
        <p
          style={{
            whiteSpace: "pre-wrap",
            marginTop: 0,
          }}
        >
          {description}
        </p>
      )}
      {isTask ? (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t("Complexity level")}{" - " + development*3 + " "+t("points")}  
          </Typography>

          {editMode ? (
            <>
              <Box justifyContent="center" sx={{ mt: 2, gap: 10, margin: 2 }}>
                <TextField
                  id="development_txt"
                  select
                  label={t("Development")}
                  value={development}
                  type="number"
                  sx={{ mt: 2, gap: 10, margin: 2, minWidth: 120 }}
                  onChange={(event) => {
                    setDevelopment(event.target.value);

                    //Save the change in the temp data
                    let datos = updateSaveTempDatos(datatempsave, "task",  selectedTreeItem.id, selectedTreeItem.name, { complexityLevel: event.target.value });//Add new values
                    dispatch(setDataTempSave(datos));
                  }}
                >
                  <MenuItem key="mi_d_1" value="0">
                    {t("None")}
                  </MenuItem>
                  <MenuItem key="mi_d_2" value="20">
                    {t("Very low")}
                  </MenuItem>
                  <MenuItem key="mi_d_3" value="40">
                    {t("Low")}
                  </MenuItem>
                  <MenuItem key="mi_d_4" value="60">
                    {t("Medium")}
                  </MenuItem>
                  <MenuItem key="mi_d_5" value="80">
                    {t("High")}
                  </MenuItem>
                  <MenuItem key="mi_d_6" value="100">
                    {t("Very high")}
                  </MenuItem>
                </TextField>

               
              </Box>
            </>
          ) : (
            <p
              style={{
                whiteSpace: "pre-wrap",
                marginTop: 0,
              }}
            >
              <Box justifyContent="center" sx={{ mt: 2, gap: 10, margin: 2 }}>
                <Box>
                  <span sx={{}}></span> {complexityLevelsF(development)}
                </Box>

                <Box sx={{ mt: 2, gap: 10, margin: 2 }}></Box>

                <Box sx={{ mt: 2, gap: 10, margin: 2 }}></Box>
              </Box>
            </p>
          )}
        </>
      ) : (
        <></>
      )}

      {false && element.problemprofiles && (
        <>
          <Typography variant="h6">{t("Problem profiles")}</Typography>
          {element.problemprofiles.map((pp) => (
            <Chip
              sx={{ mr: 1, mt: 1 }}
              label={pp}
              key={`task-problemprofile-${pp}`}
            />
          ))}
        </>
      )}

      {!process.is_part_of_publication && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            <>{t("Current status")}</>
          </Typography>
          {editMode ? (
            <>
              {element.type === "task" ? (
                <ToggleButtonGroup
                  sx={{ mt: 1 }}
                  color={
                    status === "finished"
                      ? "success"
                      : status === "in_progress"
                      ? "warning"
                      : "primary"
                  }
                  value={status}
                  exclusive
                  fullWidth
                  onChange={(event, newStatus) => {
                    console.log(status);
                    console.log(newStatus);
                    if (
                      status === "finished" &&
                      newStatus === "in_progress" &&
                      process.game_id
                    ) {
                      setResetContributions(true);
                    }
                    setStatus(newStatus);

                     //Save the change in the temp data
                     let datos = updateSaveTempDatos(datatempsave, "task", selectedTreeItem.id, selectedTreeItem.name, { status: newStatus });//Add new values
                     dispatch(setDataTempSave(datos));

                  }}
                >
                  <ToggleButton value="awaiting">
                    <>
                      {t("Awaiting")}
                      <AwaitingIcon />
                    </>
                  </ToggleButton>
                  <ToggleButton value="in_progress">
                    <>
                      {t("In progress")}
                      <InProgressIcon />
                    </>
                  </ToggleButton>
                  <ToggleButton value="finished">
                    <>
                      {t("Finished")} <FinishedIcon />
                    </>
                  </ToggleButton>
                </ToggleButtonGroup>
              ) : (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  <>{t("Status can only be set for tasks")}</>
                </Alert>
              )}
            </>
          ) : (
            <Stack alignItems="center" direction="row" spacing={1}>
              {statusIcon(status)}
              <div>
                <StatusText status={status} t={t} />
              </div>
            </Stack>
          )}
          <Link
            component="button"
            variant="h6"
            onClick={() => {
              navigate(
                `/dashboard/coproductionprocesses/${processId}/workplan`
              );
            }}
            sx={{ mt: 2 }}
            underline="none"
          >
            {t("Time planification")}:
          </Link>

          {editMode ? (
            <>
              {element.type === "task" ? (
                <Box justifyContent="center" sx={{ mt: 2 }}>
                  <DateRangePicker
                    ranges={selectionRangeDatePicker}
                    onChange={handleSelectDatePicker}
                    locale={locales[language]}
                  />

                 
                </Box>
              ) : (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {t("Start and end dates can only be set for tasks")}
                </Alert>
              )}
            </>
          ) : (
            <Box sx={{ mt: 2 }}>
              {selectionRangeDatePicker[0] !== null ? (
                <>
                  <b>{t("Start")}: </b>
                  {moment(selectionRangeDatePicker[0].startDate).format("LL")}
                  <br />
                  
                  <b>{t("End")}: </b>
                  {moment(selectionRangeDatePicker[0].endDate).format("LL")}
                </>
              ) : (
                <Alert severity="warning">{t("Not set")}</Alert>
              )}
            </Box>
          )}
        </>
      )}

      {editMode && (
        <Box
          sx={{ width: "100%", justifyContent: "center", textAlign: "center" }}
        >
          <Stack
            sx={{ mt: 2 }}
            justifyContent="center"
            direction="row"
            spacing={2}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={discardTempInfoEvent}
              color="warning"
            >
              {t("Discard changes")}
            </Button>
            <LoadingButton
              loading={updatingTree}
              sx={{ width: "200px" }}
              variant="contained"
              onClick={saveData}
              color="primary"
              size="small"
            >
              {t("Save")}
            </LoadingButton>
          </Stack>
          <Divider sx={{ my: 2 }}>{t("other actions")}</Divider>
          <ConfirmationButton
            Actionator={({ onClick }) => (
              <Button
                size="small"
                variant="text"
                onClick={onClick}
                color="error"
              >
                {t("Remove {{what}}", {
                  what: treeitem_translations[element.type].toLowerCase(),
                })}
              </Button>
            )}
            ButtonComponent={({ onClick }) => (
              <LoadingButton
                sx={{ mt: 1 }}
                fullWidth
                variant="contained"
                color="error"
                onClick={onClick}
              >
                {t("Confirm deletion")}
              </LoadingButton>
            )}
            onClick={deleteTreeItem}
            text={t("Are you sure?")}
          />
        </Box>
      )}
    </>
  );
};

export default TreeItemData;
