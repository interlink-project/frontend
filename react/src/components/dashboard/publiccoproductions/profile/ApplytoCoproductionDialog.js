import {
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Formik,useField } from "formik";
import * as Yup from "yup";

const ApplytoCoproductionDialog = ({ open, handleClose, t }) => {
  // const validationSchema = Yup.object().shape({
  //   name: Yup.string().required("Required"),
  //   email: Yup.string().email("Invalid email").required("Required"),
  //   emailConfirm: Yup.string()
  //     .oneOf([Yup.ref("email"), null], "Emails must match")
  //     .required("Required"),
  //   phone: Yup.string(),
  //   process_name: Yup.string().required("Required"),
  //   process_id: Yup.string().required("Required"),
  // });

  const MyTextField = ({ label, type, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
  
    return <TextField label={label} type={type} {...field} helperText={errorText} error={!!errorText} fullWidth />;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "left", m: 1 }}>
          <Typography>{t("Apply to be part of the coproduction")}</Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 2 }} dividers>
          <Formik
            initialValues={{
              user: "",
              teams: "",
              file: "",
              asset: "",
              title: "",
              description: "",
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string()
                .min(3, "Must be at least 3 characters")
                .max(255)
                .required("Required"),
              description: Yup.string()
                .min(3, "Must be at least 3 characters")
                .required("Required"),

              asset: Yup.object().required("Required"),
            })}
            onSubmit={(
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              alert("Lets send the contribution to the server!!");
              // Get the values from the form using (values.user)
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

                
                <Box sx={{ mt: 0 }}>
                  {/* <Typography   sx={{ mt: 2 }}>
                {t("Select the Resource")}
              </Typography> */}

                  {/* <Select
                required
                error={Boolean(touched.asset && errors.asset)}
                helperText={touched.asset && errors.asset}
                onBlur={handleBlur}
                labelId="resource-select-label"
                id="resource-select"
                value={values.asset}
                name="asset"
                onChange={handleChange}
                onClick={() => setFieldTouched("asset")}
                // onChange={(event) => {
                //     setAsset(event.target.value);
                // }}
                sx={{ width: "100%", mt: 1 }}
              >
                {assetsList.map((el) => (
                  <MenuItem key={el.id} value={el}>
                    {el.internalData.name}
                  </MenuItem>
                ))}
              </Select> */}

                  <Typography sx={{ mt: 2 }}>
                    {t("Fill in contribution information")}
                  </Typography>

                  <TextField
                    required
                    error={Boolean(touched.title && errors.title)}
                    fullWidth
                    helperText={touched.title && errors.title}
                    label={t("Title")}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onClick={() => setFieldTouched("title")}
                    value={values.title}
                    variant="outlined"
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
                    label={t("Description")}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onClick={() => setFieldTouched("description")}
                    value={values.description}
                    variant="outlined"
                  />

                  <LoadingButton
                    sx={{ mt: 2 }}
                    variant="contained"
                    fullWidth
                    loading={isSubmitting}
            
                  >
                    {t("Apply")}
                  </LoadingButton>

                
                  
                  
                </Box>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplytoCoproductionDialog;
