import React from 'react';
import { Formik, Field, useField } from 'formik';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import * as Yup from 'yup';

const MyTextField = ({ label, type, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return <TextField label={label} type={type} {...field} helperText={errorText} error={!!errorText} fullWidth />;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  emailConfirm: Yup.string().oneOf([Yup.ref('email'), null], 'Emails must match').required('Required'),
  phone: Yup.string(),
  process_name: Yup.string().required('Required'),
  process_id: Yup.string().required('Required'),
});

const ApplytoCoproductionDialogV2 = ({ open, handleClose }) => (
  <Formik
    initialValues={{ 
      name: '', 
      email: '', 
      emailConfirm: '',
      phone: '', 
      process_name: '', 
      process_id: '',
      skills: '',
      more_info: ''
    }}
    validationSchema={validationSchema}
    onSubmit={async(values, { setSubmitting }) => {
      alert("Heyheyhey");
      // setTimeout(() => {
      //   alert(JSON.stringify(values, null, 2));
      //   setSubmitting(false);
      // }, 400);
    }}
  >
    {({ submitForm, isSubmitting, handleSubmit }) => (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Application</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MyTextField name="name" type="text" label="Name" />
              </Grid>
              <Grid item xs={12}>
                <MyTextField name="email" type="email" label="Email" />
              </Grid>
              <Grid item xs={12}>
                <MyTextField name="emailConfirm" type="email" label="Confirm Email" />
              </Grid>
              <Grid item xs={12}>
                <MyTextField name="phone" type="text" label="Phone" />
              </Grid>
              <Grid item xs={12}>
                <MyTextField name="skills" type="text" label="Skills" multiline rows={4} />
              </Grid>
              <Grid item xs={12}>
                <MyTextField name="more_info" type="text" label="More Info" multiline rows={4} />
              </Grid>
              <Field name="process_name" type="hidden" />
              <Field name="process_id" type="hidden" />
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )}
  </Formik>
);

export default ApplytoCoproductionDialogV2;