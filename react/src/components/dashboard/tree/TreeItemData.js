import { useMatomo } from '@datapunt/matomo-tracker-react';
import {
  Alert, Grid,
  Box, Button, Chip, Divider, IconButton, Link, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,Select, MenuItem,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import {
  DesktopDateRangePicker, LoadingButton
} from '@material-ui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import { FinishedIcon, InProgressIcon } from 'components/dashboard/assets';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getTree, setSelectedTreeItemById, setUpdatingTree } from 'slices/process';
import { tree_items_translations } from 'utils/someCommonTranslations';
import { objectivesApi, phasesApi, tasksApi } from '__api__';
import { AwaitingIcon, statusIcon, StatusText } from '../../Icons';
import { coproductionprocessnotificationsApi } from '__api__';


const apis = {
  task: tasksApi,
  objective: objectivesApi,
  phase: phasesApi
};

const TreeItemData = ({ language, processId, element, assets }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [listAssetsNames,setListAssetsNames] = useState('');
  const [description, setDescription] = useState('');
  const [management, setManagement] = useState('');
  const [development, setDevelopment] = useState('');
  const [exploitation, setExploitation] = useState('');
  const [taskDataContributions,setTaskDataContributions] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { process, updatingTree, treeitems,selectedTreeItem, isAdministrator } = useSelector((state) => state.process);
  const isTask = selectedTreeItem && selectedTreeItem.type === 'task';

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useCustomTranslation(language);
  const { trackEvent } = useMatomo();



  const restart = (el) => {
    setName(el.name);
    setDescription(el.description);
    setManagement(el.management);
    setDevelopment(el.development);
    setExploitation(el.exploitation);
    setStatus(el.status);
    setDateRange([el.start_date ? new Date(el.start_date) : null, el.end_date ? new Date(el.end_date) : null]);
  };

  useEffect(() => {
    restart(element);
  }, [editMode]);

  useEffect(() => {
    setEditMode(false);
    restart(element);
    if (element.type === 'task') {
    tasksApi.getAssetsAndContributions(selectedTreeItem.id).then(datos=> {
      setTaskDataContributions(datos);
    })}
  }, [element]);

  const saveData = () => {
    const data = {};
    // Do not update because the message received through sockets triggers the update
    // dispatch(setUpdatingTree(true));

    const start_date = dateRange[0] && dateRange[0].toISOString().slice(0, 10);
    const end_date = dateRange[1] && dateRange[1].toISOString().slice(0, 10);
    if (start_date !== element.start_date) {
      data.start_date = start_date;
    }
    if (end_date !== element.end_date) {
      data.end_date = end_date;
    }
    if (status !== element.status) {
      data.status = status;
    }
    if (name !== element.name) {
      data.name = name;
    }
    if (description !== element.description) {
      data.description = description;
    }
    if (management !== element.management) {
      data.management = parseInt(management);
    }
    if (development !== element.development) {
      data.development = parseInt(development);
    }
    if (exploitation !== element.exploitation) {
      data.exploitation = parseInt(exploitation);
    }
    trackEvent({
      category: processId,
      action: 'update-treeitem',
      name: element.id,
    });
    apis[element.type].update(element.id, data).then(() => {
      update(element.id);
    });
  };

  const update = (selectedTreeItemId) => {
    // dispatch(getTree(processId, selectedTreeItemId));
    dispatch(setSelectedTreeItemById(selectedTreeItemId));
  };

  const deleteTreeItem = () => {
    trackEvent({
      category: processId,
      action: 'delete-treeitem',
      name: element.id,
    });
    dispatch(setUpdatingTree(true));
    apis[element.type].delete(element.id).then(() => {
      let setSelectedTreeItem = null;
      if (element.type === 'task') {
        setSelectedTreeItem = element.objective_id;
      } else if (element.type === 'objective') {
        setSelectedTreeItem = element.phase_id;
      } else {
        const nextPhase = treeitems.find((el) => el.id != element.id && el.type === 'phase');
        setSelectedTreeItem = nextPhase.id;
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

                    if(nodes.length>0){
                    for (let i = 0; i < nodes.length; i++) {
                      nodes[i].innerHTML = assetName;
                    }
                  }

                    const nodes2 = document.getElementsByClassName(
                      "im_" + entidadId
                    );
                    if(nodes2.length>0){
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
  };


  if(isTask){
    
   
  }
  
  const treeitem_translations = tree_items_translations(t);


  const complexityLevelsF= (status) => {
    
    switch(status) {
      case 33: 
        return 'light';
      case 66: 
        return 'normal'
      case 100: 
        return 'substancial';  
      default: 
        return 'no defined';
    }
  }


  return (
    <>
      {isAdministrator && !editMode && (
      <IconButton
        onClick={() => setEditMode(true)}
        sx={{
          position: 'relative',
          right: 0,
          float: 'right'
        }}
      >
        <Edit />
      </IconButton>
      )}
      <Typography variant='h6'>
        {t('Name')}
      </Typography>
      {editMode ? (
        <TextField
          onChange={(event) => {
            setName(event.target.value);
          }}
          variant='standard'
          fullWidth
          value={name}
        />
      ) : name}
      <Typography
        variant='h6'
        sx={{ mt: 2 }}
      >
        {t('Description')}
      </Typography>
      {editMode ? (
        <TextField
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          multiline
          fullWidth
          variant='standard'
          value={description}
        />
      ) : (
        <p style={{
          whiteSpace: 'pre-wrap',
          marginTop: 0
        }}
        >
          {description}
        </p>
      )}
     { isTask ? (
     <>
      <Typography
        variant='h6'
        sx={{ mt: 2 }}
      >
        {t('Complexity Levels')}
      </Typography>
      
   
    
      {editMode ? (
        <>
        <Box  
              justifyContent='center'
              sx={{ mt: 2, gap: 10,margin: 2 }}
            >
        
        <TextField
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
          
        </TextField>


        <TextField
          id="development_txt"
          select
          label={t('Development')}
          value={development}
          type="number"
          sx={{ mt: 2, gap: 10, margin: 2, minWidth: 120 }}
          onChange={(event) => {
            setDevelopment(event.target.value);
          }}
        
        >
          
          <MenuItem key='mi_d_1' value='33'>
            {t('light')}
          </MenuItem>
          <MenuItem key='mi_d_2' value='66'>
            {t('normal')}
          </MenuItem>
          <MenuItem key='mi_d_3' value='100'>
            {t('substancial')}
          </MenuItem>
          
        </TextField>

        <TextField
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
          
        </TextField>

        
      
         </Box>
        </>
      ) : (
        <p style={{
          whiteSpace: 'pre-wrap',
          marginTop: 0
        }}
        >

          <Box  
              justifyContent='center'
              sx={{ mt: 2, gap: 10,margin: 2 }}
            >
              

        <Box 
        >
          <span sx={{}}></span>Management={complexityLevelsF(management)} | Development={complexityLevelsF(development)} | Exploitation={complexityLevelsF(exploitation)}
        </Box>

        <Box
        sx={{ mt: 2, gap: 10, margin: 2}}
        >
          
        </Box>

        <Box
        sx={{ mt: 2, gap: 10, margin: 2}}
        >
          
        </Box>
          
              
          
          </Box>
        </p>
      )}
      </>
      ):(<></>)}
      
      <>
      
      <Typography
        variant='h6'
        sx={{ mt: 2 }}
      >
        {t('Levels of Participation')}

      </Typography>
      
      <ul>
      { taskDataContributions && taskDataContributions['assetsWithContribution']?.map((asset) => {
        const hasContribution=asset.contributors.length;
        if (!hasContribution){
          return (
            <>
              <li>
              <Typography
                variant='h6'
                sx={{ mt: 2 }}
               
              >
                Asset: 
                <Box  
                
                class={"lk_" + asset.id}
              component="span">
                  {includeObjectNames('{assetid:'+asset.id+'}')}

              </Box>
                
              </Typography>
                
              </li>

            </>

          );
        }

        return (  
          <>
              
            <li>

            <Typography
                variant='h6'
                sx={{ mt: 2 }}
               
              >
                Asset:  
                <Box  
            
                class={"lk_" + asset.id}
                
              component="span">
                  {includeObjectNames(' {assetid:'+asset.id+'}')}

              </Box>
                
              </Typography>

     
            </li>
            Contributions:{asset.contributors.parameters}
            <ol>
            { asset.contributors && asset.contributors?.map((contribution) => ( 
              <li>
              The user '{JSON.parse(contribution.parameters).userName}' made a ({contribution.claim_type}) claim: {JSON.parse(contribution.parameters).commentTitle} 
              </li>
             ))}
            </ol>
  
  
          </> 
  
             
            );
      })}
          </ul>
      </>


      {false && element.problemprofiles && (
      <>
        <Typography variant='h6'>
          {t('Problem profiles')}
        </Typography>
        {element.problemprofiles.map((pp) => (
          <Chip
            sx={{ mr: 1, mt: 1 }}
            label={pp}
            key={`task-problemprofile-${pp}`}
          />
        ))}
      </>
      )}

      <Typography
        variant='h6'
        sx={{ mt: 2 }}
      >
        <>{t('Current status')}</>
      </Typography>
      {editMode ? (
        <>
          {element.type === 'task' ? (
            <ToggleButtonGroup
              sx={{ mt: 1 }}
              color={status === 'finished' ? 'success' : status === 'in_progress' ? 'warning' : 'primary'}
              value={status}
              exclusive
              fullWidth
              onChange={(event, newStatus) => {
                setStatus(newStatus);
              }}
            >
              <ToggleButton value='awaiting'>
                <>
                  {t('Awaiting')}
                  <AwaitingIcon />
                </>
              </ToggleButton>
              <ToggleButton value='in_progress'>
                <>
                  {t('In progress')}
                  <InProgressIcon />
                </>
              </ToggleButton>
              <ToggleButton value='finished'>
                <>
                  {t('Finished')}
                  {' '}
                  <FinishedIcon />
                </>
              </ToggleButton>
            </ToggleButtonGroup>
          ) : (
            <Alert
              severity='warning'
              sx={{ mt: 1 }}
            >
              <>{t('Status can only be set for tasks')}</>
            </Alert>
          )}
        </>
      )

        : (
          <Stack
            alignItems='center'
            direction='row'
            spacing={1}
          >
            {statusIcon(status)}
            <div>
              <StatusText
                status={status}
                t={t}
              />
            </div>
          </Stack>
        )}
      <Link
        component='button'
        variant='h6'
        onClick={() => {
          navigate(`/dashboard/coproductionprocesses/${processId}/workplan`);
        }}
        sx={{ mt: 2 }}
        underline='none'
      >
        {t('Time planification')}
        :
      </Link>

      {editMode ? (
        <>
          {element.type === 'task' ? (
            <Box
              justifyContent='center'
              sx={{ mt: 2 }}
            >
              <DesktopDateRangePicker
                startText='Start date'
                endText='End date'
                value={dateRange}
                onChange={(newValue) => {
                  setDateRange(newValue);
                }}

                renderInput={(startProps, endProps) => (
                  <Stack
                    spacing={3}
                    direction='row'
                    sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <TextField {...startProps} />
                    <TextField {...endProps} />
                  </Stack>
                )}
              />
            </Box>
          ) : (
            <Alert
              severity='warning'
              sx={{ mt: 1 }}
            >
              {t('Start and end dates can only be set for tasks')}
            </Alert>
          )}
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          {dateRange[0] !== null ? (
            <>
              <b>
                {t('Start')}
                :
                {' '}
              </b>
              {moment(dateRange[0]).format('LL')}
              <br />
              <b>
                {t('End')}
                :
                {' '}
              </b>
              {moment(dateRange[1]).format('LL')}
            </>
          ) : <Alert severity='warning'>{t('Not set')}</Alert>}
        </Box>
      )}

      {editMode
      && (
      <Box sx={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
        <Stack
          sx={{ mt: 2 }}
          justifyContent='center'
          direction='row'
          spacing={2}
        >
          <Button
            size='small'
            variant='outlined'
            onClick={() => setEditMode(false)}
            color='warning'
          >
            {t('Discard changes')}
          </Button>
          <LoadingButton
            loading={updatingTree}
            sx={{ width: '200px' }}
            variant='contained'
            onClick={saveData}
            color='primary'
            size='small'
          >
            {t('Save')}
          </LoadingButton>
        </Stack>
        <Divider sx={{ my: 2 }}>
          {t('other actions')}
        </Divider>
        <ConfirmationButton
          Actionator={({ onClick }) => (
            <Button
              size='small'
              variant='text'
              onClick={onClick}
              color='error'
            >
              {t('Remove {{what}}', { what: treeitem_translations[element.type].toLowerCase() })}
            </Button>
          )}
          ButtonComponent={({ onClick }) => (
            <LoadingButton
              sx={{ mt: 1 }}
              fullWidth
              variant='contained'
              color='error'
              onClick={onClick}
            >
              {t('Confirm deletion')}
            </LoadingButton>
          )}
          onClick={deleteTreeItem}
          text={t('Are you sure?')}
        />
      </Box>
      )}
    </>
  );
};

export default TreeItemData;
