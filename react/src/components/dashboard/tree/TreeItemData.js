import { useMatomo } from "@datapunt/matomo-tracker-react";
import {
  Alert,
  Grid,
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
  Select,
  MenuItem,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import ConfirmationButton from "components/ConfirmationButton";
import { FinishedIcon, InProgressIcon } from "components/dashboard/assets";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
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
import { coproductionprocessnotificationsApi } from "__api__";
import { assetsApi } from "__api__";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import * as locales from "react-date-range/dist/locale";
import { setDataTempSave } from "slices/general";
import { set } from "store";
import { data } from "jquery";

const apis = {
  task: tasksApi,
  objective: objectivesApi,
  phase: phasesApi,
};

const TreeItemData = ({ language, processId, element, assets,setOpenSnackbar,setSnackbarMessage }) => {
  const [dateRange, setDateRange] = useState([null, null]);
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

  const [selectionRangeState, setSelectionRangeState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [changeTheDate, setChangeTheDate] = useState(false);

  const handleSelect = (ranges) => {
    console.log(ranges);

    setChangeTheDate(true);
    setSelectionRangeState([ranges.selection]);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  };

  const restart = (el) => {
    setName(el.name);
    setDescription(el.description);
    //setManagement(el.management);
    setDevelopment(el.development);
    //setExploitation(el.exploitation);
    setStatus(el.status);
    setDateRange([
      el.start_date ? new Date(el.start_date) : null,
      el.end_date ? new Date(el.end_date) : null,
    ]);

    if (el.start_date && el.end_date) {
      setSelectionRangeState([
        {
          startDate: el.start_date ? new Date(el.start_date) : null,
          endDate: el.end_date ? new Date(el.end_date) : null,
          key: "selection",
        },
      ]);
    } else {
      setSelectionRangeState([
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
        
        setSnackbarMessage(t("This task "+selectedTreeItem.name+" has unsaved changes!"+"\n"));
        setOpenSnackbar(true);

      }else{

        if(datatempsave.length>0){
          let text="";
          for(let i=0;i<datatempsave.length;i++){
            if(datatempsave[i].model==="task"){
              if(i==0){
              text=text+"There are unsaved changes in the tasks: ["+datatempsave[i].parameters.name+"\n";
              }else{
                text=text+","+datatempsave[i].parameters.name;
              }
            }
          }
          text=text+"]. Please save or discard them before continuing.";
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
    setChangeTheDate(false);
  }, [editMode]);

  useEffect(() => {
    setEditMode(false);
    restart(element);
    // if (element.type === 'task') {
    //   tasksApi.getAssetsAndContributions(selectedTreeItem.id).then(datos => {
    //     setTaskDataContributions(datos);
    //   })
    // }
  }, [element]);

  const saveData = () => {
    const data = {};
    // Do not update because the message received through sockets triggers the update
    // dispatch(setUpdatingTree(true));

    // const start_date = dateRange[0] && dateRange[0].toISOString().slice(0, 10);
    // const end_date = dateRange[1] && dateRange[1].toISOString().slice(0, 10);
    if (changeTheDate) {
      if (selectionRangeState[0].startDate && selectionRangeState[0].endDate) {
        let start_date = null;
        let end_date = null;

        if (!data.start_date) {
          start_date = addDays(selectionRangeState[0].startDate, 1)
            .toISOString()
            .slice(0, 10);

          end_date = addDays(selectionRangeState[0].endDate, 1)
            .toISOString()
            .slice(0, 10);
        } else {
          start_date = selectionRangeState[0].startDate
            .toISOString()
            .slice(0, 10);
          end_date = selectionRangeState[0].endDate.toISOString().slice(0, 10);
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
    // if (management !== element.management) {
    //   data.management = parseInt(management);
    // }
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
    // if (exploitation !== element.exploitation) {
    //   data.exploitation = parseInt(exploitation);
    // }
    trackEvent({
      category: processId,
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
      category: processId,
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

  // console.log('Te assets are:');
  // console.log(assets);

  let listAssets = [];

  const includeObjectNames = (text) => {
    //Search and reemplace que assetName and icon
    const paramsPattern = /[^{}]+(?=})/g;
    let extractParams = text.match(paramsPattern);
    //Loop over each parameter value and replace in the text
    if (extractParams) {
      extractParams = [...new Set(extractParams)];
      for (let i = 0; i < extractParams.length; i++) {
        if (extractParams[i].includes(":")) {
          // console.log('----->'+extractParams[i]);
          const entidadName = extractParams[i].split(":")[0];
          const entidadId = extractParams[i].split(":")[1];

          if (entidadName == "assetid") {
            //Obtain the asset name:

            if (!listAssets.includes(entidadId)) {
              listAssets.push(entidadId);
              //alert('retrive the data');
              assetsApi.getInternal(entidadId).then((res) => {
                const assetdata = res;
                const assetName = assetdata.name.replace(
                  /(^\w{1})|(\s+\w{1})/g,
                  (letter) => letter.toUpperCase()
                );
                const nodes = document.getElementsByClassName(
                  "lk_" + entidadId
                );

                for (let i = 0; i < nodes.length; i++) {
                  nodes[i].innerHTML = assetName;
                }

                const nodes2 = document.getElementsByClassName(
                  "im_" + entidadId
                );
                for (let i = 0; i < nodes.length; i++) {
                  nodes2[i].src = assetdata.icon;
                }
              });
            }
          }
        }
      }
    }

    return text;
  };
  /* const includeObjectNames = (text) => {

    //Search and reemplace que assetName and icon
    const paramsPattern = /[^{}]+(?=})/g;
    let extractParams = text.match(paramsPattern);
    //Loop over each parameter value and replace in the text
    if (extractParams) {

      for (let i = 0; i < extractParams.length; i++) {
        if (extractParams[i].includes(":")) {
          // console.log('----->'+extractParams[i]);
          const entidadName = extractParams[i].split(":")[0];
          const entidadId = extractParams[i].split(":")[1];

          if (entidadName == "assetid") {
            //Obtain the asset name:
            const xhr = new XMLHttpRequest();

            if (!listAssets.includes(entidadId)) {
              listAssets.push(entidadId);
              xhr.open(
                "GET",
                `/coproduction/api/v1/assets/internal/${entidadId}`,
                true
              ); // `false` makes the request synchronous
              xhr.onload = (e) => {

                if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    const assetdata = JSON.parse(xhr.responseText);
                    const assetName = assetdata.name.replace(
                      /(^\w{1})|(\s+\w{1})/g,
                      (letter) => letter.toUpperCase()
                    );
                    const nodes = document.getElementsByClassName(
                      "lk_" + entidadId
                    );

                    if (nodes.length > 0) {
                      for (let i = 0; i < nodes.length; i++) {
                        nodes[i].innerHTML = assetName;
                      }
                    }

                    const nodes2 = document.getElementsByClassName(
                      "im_" + entidadId
                    );
                    if (nodes2.length > 0) {
                      for (let i = 0; i < nodes.length; i++) {
                        nodes2[i].src = assetdata.icon;
                      }
                    }


                  } else {
                    console.error(xhr.statusText);
                  }

                }
              };
              xhr.onerror = (e) => {
                console.error(xhr.statusText);
              };
              xhr.send(null);
            }
          }
        }
      }

    }

    return text;
  }; */

  if (isTask) {
  }

  const treeitem_translations = tree_items_translations(t);

  const complexityLevelsF = (status) => {
    switch (status) {
      case 0:
        return "None";
      case 20:
        return "Very low";
      case 40:
        return "Low";
      case 60:
        return "Medium";
      case 80:
        return "High";
      case 100:
        return "Very high";
      default:
        return "No defined";
    }
  };

  function updateSaveTempDatos (datos= [], model, id, parameters) {
    
    const index = datos.findIndex((item) => item.model === model && item.id === id);

  if (index === -1) {
    // Object not found, add new object to array
    const newDatos = [...datos, {
      model: model,
      id: id,
      parameters: parameters,
    }];
    return newDatos;
  } else {
     // Object found, update parameters property
     const newDatos = [...datos];
     newDatos[index] = {
       ...newDatos[index],
       parameters: {
         ...newDatos[index].parameters,
         ...parameters,
       },
     };
     return newDatos;
  }
  }

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
            let datos=datatempsave;// Copy the data to a new variable
            datos = updateSaveTempDatos(datos, "task", selectedTreeItem.id, { name: event.target.value });
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
            let datos=datatempsave;// Copy the data to a new variable
            datos = updateSaveTempDatos(datos, "task", selectedTreeItem.id, { description: event.target.value });//Add new values
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
            {t("Complexity Level")}
          </Typography>

          {editMode ? (
            <>
              <Box justifyContent="center" sx={{ mt: 2, gap: 10, margin: 2 }}>
                {/* <TextField
          id="management_txt"
          select
          label={t('Management')}
          value={management}
          type="number"
          sx={{ mt: 2, gap: 10, margin: 2, minWidth: 120 }}
          onChange={(event) => {
            setManagement(event.target.value);
          }}
        
        >
          
          <MenuItem key='mi_m_1' value='33'>
            {t('light')}
          </MenuItem>
          <MenuItem key='mi_m_2' value='66'>
            {t('normal')}
          </MenuItem>
          <MenuItem key='mi_m_3' value='100'>
            {t('substancial')}
          </MenuItem>
          
        </TextField> */}

                <TextField
                  id="development_txt"
                  select
                  label={t("Development")}
                  value={development}
                  type="number"
                  sx={{ mt: 2, gap: 10, margin: 2, minWidth: 120 }}
                  onChange={(event) => {
                    setDevelopment(event.target.value);
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

                {/* <TextField
          id="exploitation_txt"
          select
          label={t('Exploitation')}
          value={exploitation}
          type="number"
          sx={{ mt: 2, gap: 10, margin: 2, minWidth: 120 }}
          onChange={(event) => {
            setExploitation(event.target.value);
          }}
     
        >
          
          <MenuItem key='mi_e_1' value='33'>
            {t('light')}
          </MenuItem>
          <MenuItem key='mi_e_2' value='66'>
            {t('normal')}
          </MenuItem>
          <MenuItem key='mi_e_3' value='100'>
            {t('substancial')}
          </MenuItem>
          
        </TextField> */}
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
                    ranges={selectionRangeState}
                    onChange={handleSelect}
                    locale={locales[language]}
                  />

                  {/*  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    localeText={{ start: "Desktop start", end: "Desktop end" }}
                  >
                    
                    <DesktopDateRangePicker
                      startText="Start date"
                      endText="End date"
                      value={dateRange}
                      onChange={(newValue) => {
                        setDateRange(newValue);
                      }}
                      renderInput={(startProps, endProps) => (
                        <Stack
                          spacing={3}
                          direction="row"
                          sx={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TextField {...startProps} />
                          <TextField {...endProps} />
                        </Stack>
                      )}
                    />
                  </LocalizationProvider> */}
                </Box>
              ) : (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {t("Start and end dates can only be set for tasks")}
                </Alert>
              )}
            </>
          ) : (
            <Box sx={{ mt: 2 }}>
              {dateRange[0] !== null ? (
                <>
                  <b>{t("Start")}: </b>
                  {moment(dateRange[0]).format("LL")}
                  <br />
                  <b>{t("End")}: </b>
                  {moment(dateRange[1]).format("LL")}
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
