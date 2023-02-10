import { Alert, Box, Button, Card, CardActionArea, CardMedia, Container, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import useAuth from 'hooks/useAuth';
import useSettings from 'hooks/useSettings';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getLanguage } from 'translations/i18n';
import { usersApi } from '__api__';

const getValues = (settings) => ({
  // direction: settings.direction,
  theme: settings.theme,
  language: getLanguage()
});

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

const Settings = () => {
  const { t } = useTranslation();
  const { settings, saveSettings } = useSettings();
  const { user, setUser } = useAuth()
  const [values, setValues] = useState(getValues(settings));
  const [emails, setEmails] = useState(user.additionalEmails || [])
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (emails.map(el => el !== "" && el) !== user.additionalEmails || []) {
      setLoading(true)
      console.log(emails)
      usersApi.update(user.id, {
        "additionalEmails": emails
      }).then(() => {
        usersApi.me().then((data) => {
          setUser(data)
        }).finally(() => setLoading(false))
      })
        
    } else {
      console.log("Nothing to save")
    }

  }

  useEffect(() => {
    setValues(getValues(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    const res = {
      ...values,
      [field]: value,
    }
    setValues(res);
    saveSettings(res);
  };



  return (
    <>
      <Helmet>
        <title>{t('settings')}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5,
          px: 1,
        }}
      >
        <Container maxWidth='lg'>
          <Grid
            container
            spacing={3}
          >
            <Grid
              alignItems='center'
              container
              justifyContent='space-between'
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Typography
                  color='textSecondary'
                  variant='overline'
                >
                  {t('Settings')}
                </Typography>
                <Typography
                  color='textPrimary'
                  variant='h5'
                >
                  {t('Settings of the collaborative environment')}
                </Typography>
                <Typography
                  color='textSecondary'
                  variant='subtitle2'
                >
                  {t('Here you can set the language, appearance and some other settings used by the different interlinkers')}
                </Typography>
              </Grid>

            </Grid>
          </Grid>
          <Typography sx={{ mt: 4 }} variant="h6">
            {t("Appearance")}
          </Typography>
          <Typography
            color='textSecondary'
            variant='subtitle2'
            sx={{ mb: 2 }}
          >
            {t('There are two themes available, light and dark. Click on the image to switch it.')}
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <CardActionArea onClick={() => handleChange("theme", "LIGHT")}>
                <Card>
                  <CardMedia
                    component="img"
                    image="/static/graphics/light.png"
                    alt="Light mode"
                  />

                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardActionArea onClick={() => handleChange("theme", "DARK")}>
                <Card>
                  <CardMedia
                    component="img"
                    image="/static/graphics/dark.png"
                    alt="Dark mode"
                  />

                </Card>
              </CardActionArea>
            </Grid>
          </Grid>

          <Typography sx={{ mt: 4 }} variant="h6">
            {t("Personal information")}
          </Typography>
          <Typography
            color='textSecondary'
            variant='subtitle2'
            sx={{ mb: 2 }}
          >
            {t('Here you can modify your profile information, such as the avatar or the name, or add additional emails.')}
          </Typography>

          <Alert sx={{ mb: 1 }} severity="info">{t("Additional emails are used by some software interlinkers. For example, the google drive interlinker shares the documents you have access to with both your main and additional emails.")}</Alert>

          <Stack justifyContent="center">
            {t("Primary email")}:
            <TextField sx={{ mt: 1, mb: 2 }} disabled value={user.email} variant="outlined" />
            {t("Additional email")}:

            <IconButton disabled={loading || (emails.length > 0 && !emails.every(validateEmail))} variant="contained" sx={{ mt: 2 }} onClick={() => setEmails([...emails, ""])}>
              <Add />
            </IconButton>
            {emails.map((email, i) =>
              <Stack sx={{ mt: 2 }} key={"email" + i.toString()} direction="row"><TextField fullWidth id={"email" + i.toString()} error={!validateEmail(email)} value={email} onChange={(e) => {
                let cp = [...emails]
                cp[i] = e.target.value
                setEmails(cp)
              }} /><IconButton onClick={() => {
                const cp = [...emails]
                cp.splice(i, 1)
                setEmails(cp)
              }}><Delete /></IconButton></Stack>)}

          </Stack>
          <Button disabled={emails.equals(user.additionalEmails) || loading || (emails.length > 0 && !emails.every(validateEmail))} fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => submit()}>
            {t("Save")}
          </Button>


        </Container>
      </Box>
    </>
  );
};

export default Settings;
