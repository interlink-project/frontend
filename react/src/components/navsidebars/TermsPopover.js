import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Popover,
    Toolbar,
    Tooltip,
    Typography,
  } from "@mui/material";
  import { Close, Policy, OpenInNew } from "@mui/icons-material";
  import { Component, useRef, useState } from "react";
  import { useTranslation } from "react-i18next";
  import { getLanguage } from "translations/i18n";
  import useSettings from "../../hooks/useSettings";
  
  class Iframe extends Component {
    componentDidMount() {
      const element = document.getElementById("iframe");
      element.addEventListener("load", this.props.onLoad);
    }
  
    render() {
      return (
        <iframe
          id="iframe"
          src={this.props.src}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        />
      );
    }
  }
  
  const TermsPopover = () => {
    const anchorRef = useRef(null);
    const { settings, saveSettings } = useSettings();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(null);
  
    const ENVIRONMENTS = {
      "mef.interlink-project.eu": "MEF",
      "zgz.interlink-project.eu": "ZARAGOZA",
      "varam.interlink-project.eu": "VARAM",
      "dev.interlink-project.eu": "OTHER",
      "demo.interlink-project.eu": "OTHER",
      localhost: "OTHER",
    };
  
    const { t } = useTranslation();
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleSave = (settings) => {
      saveSettings(settings);
      setOpen(false);
    };
  
    const onLoad = function () {
      console.log("Iframe refreshed", openDialog, this);
    };
  
    return (
      <>
        {" "}
        <Tooltip title={t("Policy")}>
          <IconButton
            color="inherit"
            ref={anchorRef}
            onClick={handleOpen}
            data-cy="help"
          >
            <Policy fontSize="small" />
          </IconButton>
        </Tooltip>{" "}
        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          keepMounted
          onClose={handleClose}
          open={open}
          PaperProps={{
            sx: { width: 200 },
          }}
        >
          
  
          
          <Box sx={{ my: 2, mx: 2 }}>
            <Button
              startIcon={<OpenInNew />}
              fullWidth
              variant="text"
              onClick={() => window.open(`/terms`, "_blank")} 
            >
              {t("Terms of Use")}
            </Button>
          </Box>
          <Box sx={{ my: 2, mx: 2 }}>
            <Button
              startIcon={<OpenInNew />}
              fullWidth
              variant="text"
              onClick={() => window.open(`/privacy`, "_blank")} 
            >
              {t("Privacy Policy")}
            </Button>
          </Box>
          <Box sx={{ my: 2, mx: 2 }}>
            <Button
              startIcon={<OpenInNew />}
              fullWidth
              variant="text"
              onClick={() => window.open(`/cookie-policy`, "_blank")} 
            >
              {t("Cookie Policy")}
            </Button>
          </Box>
          
        </Popover>
      </>
    );
  };
  
  export default TermsPopover;
  