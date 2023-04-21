import React from "react";
import {
  Avatar,
  Box,
  Grid,
  Item,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardContent,
  Button,
  CardActions,
  Card,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Chip
} from "@mui/material";




import { LoadingButton } from "@mui/lab";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLanguage, LANGUAGES } from "translations/i18n";
import { Done, Delete, Close, KeyboardArrowRight } from "@mui/icons-material";
import SelectGovernanceModel from "./SelectGovernanceModel";



export default function SelectTypeCoproProcess({
  open,
  setOpen,
  loading,
  setLoading

}) {


  const [language, setLanguage] = useState(getLanguage());
  const { t } = useTranslation();

  const [listKeywords, setListKeywords] = useState(t("list-tags-governance-predefined").split(","));
  const [listSelectedKeywords, setListSelectedKeywords] = useState([]);

  

  const [openGovernanceSelector, setOpenGovernanceSelector] = React.useState(false);
  const [selectorGovTypeLoading,setSelectorGovTypeLoading]= React.useState(false);


  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleNext = async () => {
    setLoading(true);
    console.log({
      language,
    });

    //Actions for next
    //Save the tags related to the process.
    

    setOpen(false);
    setLoading(false);
    setOpenGovernanceSelector(true);
  };

  const handleClick = (keyword) => {
    const newSelectedList = listSelectedKeywords.concat(keyword);
    setListSelectedKeywords(newSelectedList);

    const newKeyList = listKeywords.filter((item) => item !== keyword);
    setListKeywords(newKeyList);

  }

  const handleDelete = (keyword) => {
    const newSelectedList = listSelectedKeywords.filter((item) => item !== keyword);
    setListSelectedKeywords(newSelectedList);

    const newKeyList = listKeywords.concat(keyword);
    setListKeywords(newKeyList);
 
  }

  const listChipsKeywords = listKeywords.map((keyword) =>
    <Chip
      
      key={`active-keyword-${keyword}`}
      label={keyword}
      onClick={() => handleClick(keyword)} 
      onDelete={() => handleClick(keyword)}
      deleteIcon={<Done />}
    />
  );

  const listChipsSelectedKeywords = listSelectedKeywords.map((keyword) =>
    <Chip
      key={`active-sel-keyword-${keyword}`}
      label={keyword}
      onClick={() => handleDelete(keyword)} 
      onDelete={() => handleDelete(keyword)}
      deleteIcon={<Delete />}
      variant="outlined"
    />
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ textAlign: "center", m: 2 }} >{t("Select the features of your process")}</DialogTitle>
        <DialogContent>
          <>
            <Box sx={{ textAlign: "center" }}>
              <label htmlFor="contained-button-file">
                <Input
                  inputProps={{ accept: "image/*" }}
                  id="contained-button-file"
                  type="file"
                  sx={{ display: "none" }}
                //onChange={handleFileSelected}
                />
                {/* <IconButton component='span'>
                  <Avatar
                    src={logotype && logotype.path}
                    style={{
                      margin: '10px',
                      width: '60px',
                      height: '60px',
                    }}
                  />
                  {!logotype && (
                  <Typography variant='body1'>
                    {t('Click here to add a logo')}
                  </Typography>
                  )}
                </IconButton> */}
              </label>
              {/* {logotype && (
              <IconButton onClick={(event) => {
                setLogotype(null);
              }}
              >
                <Close />
              </IconButton>
              )} */}
            </Box>
            <Typography sx={{ mb: 1 }} variant="body1">
              {t(
                "Select the keywords that represent you type of co-production process"
              ) + "."}
            </Typography>

            <Box sx={{ minWidth: 275,flexGrow: 1, p: 2 }}>
              <Card className="h-50 d-flex flex-column" variant="outlined">
                <CardContent>

                  <Grid container spacing={1} >
                   
                    {listChipsKeywords}
                    
                  </Grid>

                  
                </CardContent>

              </Card>
            </Box>

            <Typography sx={{ textAlign: "center", m: 2 }} variant="body1">
              {t(
                "Your Keywords"
              )}
            </Typography>

            <Box sx={{ minWidth: 275 }}>
              <Card variant="outlined">
                <CardContent>
                    <Grid container spacing={1} >

                    {listChipsSelectedKeywords}
                    </Grid>
                </CardContent>

              </Card>
            </Box>


          </>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <LoadingButton
            sx={{ my: 2 }}
            loading={loading}
            size="small"
            onClick={handleNext}
          >
            {t("Next")}
            <KeyboardArrowRight />
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <SelectGovernanceModel
        open={openGovernanceSelector}
        setOpen={setOpenGovernanceSelector}
        loading={selectorGovTypeLoading}
        setLoading={setSelectorGovTypeLoading}
        
      />
    </>
  );
}
