import { Alert, Avatar, Box,Switch, Button, Card, CardHeader, Grid, IconButton, Input, Stack, TextField as MuiTextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';
import ConfirmationButton from 'components/ConfirmationButton';
import { LoadingButton } from '@mui/lab';
import UsersList from 'components/dashboard/organizations/UsersList';
import { Form, Formik } from 'formik';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import $ from 'jquery';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getProcess, updateProcess } from 'slices/process';
import * as Yup from 'yup';
import { coproductionProcessesApi } from '__api__';
import { withStyles } from '@material-ui/core/styles';

const SettingsTab = () => {
  const[isCloning, setIsCloning] = useState(false);
  const [editMode, setEditMode] = useState(false);
 
  const { process, hasSchema, isAdministrator } = useSelector((state) => state.process);
 
  const [isIncentiveModuleActive,setIsIncentiveModuleActive]= useState(process.incentive_and_rewards_state);
  const [logotype, setLogotype] = useState(null);
  const mounted = useMounted();
  const t = useCustomTranslation(process.language);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCopy = () => {
    setIsCloning(true);
    coproductionProcessesApi.copy(process.id).then(() => navigate('/dashboard'));
  };

  const onRemove = () => {
    coproductionProcessesApi.delete(process.id).then(() => navigate('/dashboard'));
  };
  const onCoproductionProcessClear = () => {
    coproductionProcessesApi.clearSchema(process.id).then(() => dispatch(getProcess(process.id, false)));
  };

  const handleAdministratorAdd = (user) => {
    coproductionProcessesApi.addAdministrator(process.id, user.id).then((res) => {
      if (mounted.current) {
        dispatch(getProcess(process.id, false));
      }
    });
  };
  const handleAdministratorRemove = (user) => {
    coproductionProcessesApi.removeAdministrator(process.id, user.id).then((res) => {
      if (mounted.current) {
        dispatch(getProcess(process.id, false));
      }
    });
  };

  const handleFileSelected = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (file) {
        file.path = URL.createObjectURL(file);
        setLogotype(file);
      }
    }
  };

  const TextField = (props) => (
    <>
      <Typography
        variant='overline'
        display='block'
        gutterBottom
        color='primary'
      >
        {props.label}
      </Typography>
      <MuiTextField
        fullWidth
        minRows={props.minRows || 4}
        variant={editMode ? 'filled' : 'standard'}
        InputProps={{
          readOnly: !editMode,
        }}
        {...props}
        label={null}
        name={props.name}
      />
    </>
  );

  const toggleIncentivesRewards = () => {
    setIsIncentiveModuleActive((prev) => !prev);
   
      //Active the incentive and reguards
      const values={incentive_and_rewards_state:!isIncentiveModuleActive};
      console.log('La bandera es:')
      console.log(isIncentiveModuleActive)
      try {
        dispatch(updateProcess({
          id: process.id,
          data: values,
          logotype,
          onSuccess: () => {
            if (mounted.current) {
              //alert("se ha grabado la bandera")
            }
          }
        }));
      } catch (err) {
        console.error(err);
       
      }
  };

  const GoldSwitch = withStyles({
    switchBase: {
      color: '#6f7598',
      '&$checked': {
        color: '#b2b200',
      },
      '&$checked + $track': {
        backgroundColor: '#b2b1a1',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  return (
    <Box style={{ minHeight: '87vh', backgroundColor: 'background.default' }}>
      <CardHeader
        avatar={
          editMode ? (
            <label htmlFor='contained-button-file'>
              <Input
                inputProps={{ accept: 'image/*' }}
                id='contained-button-file'
                type='file'
                sx={{ display: 'none' }}
                onChange={handleFileSelected}
              />
              <IconButton
                component='span'
                color='inherit'
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  position: 'relative'
                }}
                >
                  <Avatar
                    src={logotype ? logotype.path : process.logotype_link}
                    variant='rounded'
                    style={{
                      width: '100px',
                      height: '100px',
                      position: 'absolute'
                    }}
                  />
                  <Edit style={{
                    width: '50%',
                    height: '50%',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                  />
                </div>

              </IconButton>
            </label>
          ) : (
            <Avatar
              src={process.logotype_link}
              variant='rounded'
              style={{
                margin: '10px',
                width: '100px',
                height: '100px',
              }}
            />
          )
        }
        title={(
          <Stack
            justifyContent='center'
            spacing={1}
          >
            <Typography variant='subtitle1'>
              <b>
                {t('Created')}
                :
              </b>
              {' '}
              {moment(process.created_at).format('LL')}
            </Typography>
            {process.updated_at && (
              <Typography variant='subtitle1'>
                <b>
                  {t('Last update')}
                  :
                </b>
                {' '}
                {moment(process.updated_at).format('LLL')}
              </Typography>
            )}


          </Stack>

        )}
      />



      <Box sx={{ mx: 4 }}>
      <Grid
                container
                direction='row'
                justifyContent='right'
                spacing={2}
              >
      {!editMode && isAdministrator && (
          <Button
            sx={{ mb: 3, justifyContent: 'right', textAlign: 'center' }}
            variant='contained'
            color='primary'
            onClick={() => setEditMode(true)}
            startIcon={<Edit />}
          >
            {t('Edit coproduction process')}
          </Button>
        )}
        </Grid>

        <Formik
          initialValues={{
            name: process.name || '',
            status: process.status || '',
            description: process.description || '',
            organization_desc: process.organization_desc || '',
            aim: process.aim || '',
            idea: process.idea || '',
            challenges: process.challenges || '',
            submit: null
          }}
          validationSchema={Yup
            .object()
            .shape({
              name: Yup.string().required(t('Required')),
              /* description: Yup.string().required('required'),
                                aim: Yup.string().required('required'),
                                organization: Yup.string().required('required'),
                                idea: Yup.string().required('required'),
                                challenges: Yup.string().required('required'), */

            })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              dispatch(updateProcess({
                id: process.id,
                data: values,
                logotype,
                onSuccess: () => {
                  if (mounted.current) {
                    setEditMode(false);
                    setStatus({ success: true });
                    setSubmitting(false);
                  }
                }
              }));
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            submitForm,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            resetForm,
            touched,
            isValid,
            values
          }) => (
            <Form>
              <Grid
                container
                direction='row'
                justifyContent='right'
                spacing={2}
              >
              {editMode && (
                <Stack
                  direction='row'
                  spacing={2}
                  sx={{ justifyContent: 'right', mt: 3, mb: 2 }}
                >
                  <Button
                    variant='contained'
                    disabled={isSubmitting}
                    color='warning'
                    size='medium'
                    startIcon={<Delete />}
                    onClick={() => { setEditMode(false); resetForm(); setLogotype(null); }}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button
                    variant='contained'
                    disabled={isSubmitting}
                    color='success'
                    size='large'
                    startIcon={<Save />}
                    onClick={submitForm}
                    disabled={!isValid}
                  >
                    {t('Save')}
                  </Button>
                </Stack>
              )}
              </Grid>
              


              <Grid
                container
                direction='row'
                justifyContent='center'
                spacing={2}
              >



                <Grid
                  item
                  xs={6}
                >
                  <TextField
                    label={t('NAME OF THE PROJECT')}
                    helperText={touched.name && errors.name}
                    error={Boolean(touched.name && errors.name)}
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='name'
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  container
                  direction="row"
                  justifyContent="flex-start"
                >
                  <Typography variant="overline" sx={{ color: 'primary.main' }}>{t('STATE OF THE PROYECT')}</Typography>
                  <Select
                    labelId="select-status-label"
                    id="status"
                    value={values.status}
                    onChange={handleChange}
                    fullWidth
                    label={t('STATE OF THE PROYECT')}
                    helperText={touched.status && errors.status}
                    error={Boolean(touched.status && errors.status)}
                    onBlur={handleBlur}
                    name='status'
                    variant={editMode ? 'filled' : 'standard'}
                    inputProps={{ readOnly: !editMode }}


                  >
                    <MenuItem value="in_progress">{t('In progress')}</MenuItem>
                    <MenuItem value="finished">{t('Finished')}</MenuItem>
                  </Select>
                </Grid>

                <Grid
                  item
                  xs={12}
                >
                  <TextField
                    minRows={8}
                    label={t('SHORT DESCRIPTION OF THE PROJECT')}
                    multiline
                    helperText={touched.description && errors.description}
                    error={Boolean(touched.description && errors.description)}
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='description'
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <TextField
                    minRows={8}
                    label={t('ACTUAL ORGANIZATION OF THE SERVICE')}
                    multiline
                    helperText={touched.organization_desc && errors.organization_desc}
                    error={Boolean(touched.organization_desc && errors.organization_desc)}
                    value={values.organization_desc}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='organization_desc'
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <TextField
                    minRows={8}
                    label={t('AIM OF THE PROJECT')}
                    multiline
                    helperText={touched.aim && errors.aim}
                    error={Boolean(touched.aim && errors.aim)}
                    value={values.aim}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='aim'
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <TextField
                    minRows={8}
                    label={t('IDEA OF SERVICE TO BE CO-DELIVERED')}
                    multiline
                    helperText={touched.idea && errors.idea}
                    error={Boolean(touched.idea && errors.idea)}
                    value={values.idea}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='idea'
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <TextField
                    minRows={8}
                    label={t('CHALLENGES OF THE PROJECT')}
                    multiline
                    helperText={touched.challenges && errors.challenges}
                    error={Boolean(touched.challenges && errors.challenges)}
                    value={values.challenges}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name='challenges'
                  />
                </Grid>

              </Grid>
              
            </Form>
          )}
        </Formik>
        
        <Card sx={{ border: '1px solid red', p: 5, my: 4 }}>
          <Typography variant='h5'  sx={{fontWeight: 'bold',mb:0}}>
            {t('Administrators of the coproduction process')}
          </Typography>
          <Alert
            severity='error'
            sx={{ my: 2 }}
          >
            {t('Administrators of a co-production process can edit the co-production tree, assign new permissions to teams and even delete the co-production process. Be careful who you assign as an administrator.')}
          </Alert>
          <UsersList
            size='small'
            onSearchResultClick={isAdministrator && handleAdministratorAdd}
            users={process.administrators}
            getActions={(user) => isAdministrator && (
              [
                {
                  id: `${user.id}-remove-action`,
                  onClick: handleAdministratorRemove,
                  text: t('Remove {{what}}'),
                  icon: <Delete />,
                  disabled: process.administrators_ids.length === 1
                }
              ]
            )}
          />
        </Card>
        <Card sx={{ border: '1px solid red', p: 5, my: 4 }}>
          <Typography variant='h5'  sx={{fontWeight: 'bold',mb:0}}>
            {t('Clear coproduction process tree')}
          </Typography>
          <Alert
            severity='error'
            sx={{ mt: 2 }}
            action={(
              <ConfirmationButton

                Actionator={({ onClick }) => (
                  <Button
                    variant='contained'
                    disabled={!isAdministrator || !hasSchema}
                    color='error'
                    onClick={onClick}
                    startIcon={<Delete />}
                  >
                    {t('Clear coproduction process tree')}
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
                onClick={onCoproductionProcessClear}
                text={t('Are you sure?')}
              />
            )}
          >
            {t('The clearing of the co-production tree is irreversible. All resources created in it will disappear. However, the co-production process will not be deleted.')}
          </Alert>

          <Box sx={{ mt: 2 }} />
        </Card>
        <Card sx={{ border: '1px solid red', p: 5, my: 4 }}>
          <Typography variant='h5'  sx={{fontWeight: 'bold',mb:0}}>
            {t('Delete coproduction process')}
          </Typography>
          <Alert
            severity='error'
            sx={{ mt: 2 }}
            action={(
              <ConfirmationButton

                Actionator={({ onClick }) => (
                  <Button
                    variant='contained'
                    disabled={!isAdministrator}
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
                onClick={onRemove}
                text={t('Are you sure?')}
              />
            )}
          >
            {t('The deletion of the co-production process is irreversible. All resources created in it will disappear.')}
          </Alert>
        </Card>

        {/* Cloning coprod */}
        <Card sx={{ border: '1px solid red', p: 5, my: 4 }}>
          <Typography variant='h5'  sx={{fontWeight: 'bold',mb:0}}>
            {t('Copy coproduction process')}
          </Typography>
          <Alert
            severity='warning'
            sx={{ mt: 3 }}
            action={(
              <ConfirmationButton

                Actionator={({ onClick }) => (
                  <LoadingButton
                    variant='contained'
                    disabled={!isAdministrator}
                    loading={isCloning}
                    color='warning'
                    onClick={onClick}
                    startIcon={<Delete />}
                  >
                    {t('Copy coproduction process')}
                  </LoadingButton>
                )}
                ButtonComponent={({ onClick }) => (
                  <Button
                    sx={{ mt: 1 }}
                    fullWidth
                    variant='contained'
                    color='warning'
                    onClick={onClick}
                  >
                    {t('Confirm clonation')}
                  </Button>
                )}
                onClick={onCopy}
                text={t('Are you sure?')}
              />
            )}
          >
            {t('The deletion of the co-production process is irreversible. All resources created in it will disappear.')}
          </Alert>
        </Card>
       {/* Cloning coprod */}
       <Card  sx={{ border: '1px solid #b2b200', p: 5, my: 4 }}>
          <Typography variant='h5'  sx={{fontWeight: 'bold',mb:0}}>
            {t('Reward system')}
          </Typography>
          <Alert
            severity='info'
            
          
            sx={{ mt: 2}}
            action={(
              <>
              <GoldSwitch
                checked={isIncentiveModuleActive}
                onChange={toggleIncentivesRewards}
                name="incentiveSwitch"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                disabled={!isAdministrator}
                color="secondary"
              />
              
              </>
            )}
          >
            {t('If you disable the Reward system every data will be deleted, so if you want to enable again this option, you will not able to restore the old data.')}
          </Alert>
        </Card>

      </Box>
    </Box>
  );
};

export default SettingsTab;
