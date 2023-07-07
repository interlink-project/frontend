import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Catalogue from "pages/dashboard/interlinkers/Catalogue";
import PublicCoproductionCatalogue from "pages/dashboard/publiccoproductions/PublicCoproductionCatalogue";
import { useTranslation } from "react-i18next";
import useMounted from "hooks/useMounted";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function CatalogueSelector() {

  const { t } = useTranslation();

  const [value, setValue] = React.useState(0);

  // The values are:
  // 0: Interlinkers
  // 1: Processes

  const mounted = useMounted();

  React.useEffect(() => {
    if (mounted) {
      const search = location.search;
      const params = new URLSearchParams(search);
      const selectedTabTemp = params.get('tab');
      if (selectedTabTemp){
        if (selectedTabTemp === "Processes"){
          setValue(1);
        }
      } 

    }
  
  }, []);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
     
      <AppBar position="static" color="default"  >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={t("Interlinkers")}  />
          <Tab label={t("Processes")}  />
        </Tabs>
      </AppBar>
      <SwipeableViews
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} >
          <Catalogue />
        </TabPanel>
        <TabPanel value={value} index={1} >
          <PublicCoproductionCatalogue />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
