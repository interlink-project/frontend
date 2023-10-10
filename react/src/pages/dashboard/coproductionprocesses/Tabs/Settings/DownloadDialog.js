import React, { useEffect, useState } from "react";
import {
  Alert,
  TextField,
  Button,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { coproductionProcessesApi } from "__api__";
import { useTranslation } from "react-i18next";
import { inArray } from "jquery";
import { Link } from "react-router-dom";
import useMounted from "hooks/useMounted";

const DownloadDialog = ({ open, handleClose, title }) => {
  const { t } = useTranslation();
  const { process } = useSelector((state) => state.process);

  // State variables

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLinkReady, setIsLinkReady] = useState(false);
  const [isWorkingInLink, setIsWorkingInLink] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [lastdownloadURL, setLastdownloadURL] = useState(null);
  const mounted = useMounted();
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);
  const [lastZipInfo, setLastZipInfo] = useState("");

  function formatDate(dateTimeStr) {
    const year = dateTimeStr.substring(0, 4);
    const month = dateTimeStr.substring(4, 6);
    const day = dateTimeStr.substring(6, 8);
    const hour = dateTimeStr.substring(9, 11);
    const minute = dateTimeStr.substring(11, 13);
    const second = dateTimeStr.substring(13, 15);

    const dateObj = new Date(year, month - 1, day, hour, minute, second); // month is 0-indexed

    // Use toLocaleDateString and toLocaleTimeString to format date and time
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  }

  const fetchLastZipInfo = async () => {
    try {
      let response = await coproductionProcessesApi.last_created_zip(
        process.id
      );

      // Assuming the response contains file name and datetime information
      if (response.data) {
        const last_url = window.URL.createObjectURL(new Blob([response.data]));
        setLastdownloadURL(last_url);

        console.log(response);
        const dateStr = response.headers["x-file-creation-datetime"];
        setLastZipInfo(formatDate(dateStr));
      }
    } catch (error) {
      console.error("Error fetching last zip info:", error);
    }
  };

  useEffect(() => {
    setLastZipInfo(null);
    fetchLastZipInfo();
    setIsLinkReady(false);
    setTimeoutExceeded(false);
  }, [open]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLinkReady(false);
    setIsWorkingInLink(true);
    setTimeoutExceeded(false);

    // Initialize the timeout
    const timeoutId = setTimeout(() => {
      setIsWorkingInLink(false); // Stop loading
      setTimeoutExceeded(true); // Indicate that the timeout has been exceeded
    }, 15000); // e.g., wait for 15 seconds

    coproductionProcessesApi
      .download(process.id)
      .then((res) => {
        clearTimeout(timeoutId); // Clear the timeout if the download is successful
        if (mounted.current) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          setDownloadURL(url);
          setIsLinkReady(true);
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId); // Clear the timeout in case of an error
        console.error(error);
        setErrorMessage(t("Error generating download link."));
        setIsError(true);
      })
      .finally(() => {
        setIsWorkingInLink(false);
      });
  };

  // Form cancellation handler
  const handleCancel = (e) => {
    e.preventDefault();

    handleClose();
  };

  const downloadFile = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ mt: 1, fontWeight: "bold", minWidth: "400px" }}>
        {t(title)}
      </DialogTitle>
      
      {lastZipInfo && (
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            
              <>
                <Typography sx={{ fontWeight: "bold" }}>
                  Last zip file created on:
                </Typography>

                <Typography>{lastZipInfo}</Typography>

                <a href={lastdownloadURL} download={`${process.name}.zip`}>
                  Download Last Created Zip
                </a>
              </>
            
          </Grid>
        </Grid>
      </DialogContent>
      )}
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              {" "}
              {/* Added textAlign: 'center' */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                startIcon={
                  isWorkingInLink ? (
                    <CircularProgress size={24}  color="secondary" />
                  ) : (
                    <Download />
                  )
                }
              >
                {t("Create a new download zip file")}
              </Button>
              <br />
              {timeoutExceeded && !isLinkReady && (
                <span>
                  {t(
                    "The process of creating the ZIP file is a lengthy process. You can either wait or return later to check the most recently generated link once the export has been completed"
                  )+""}
                </span>
              )}
              {isLinkReady && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <InputLabel
                    id="add-contribution-label"
                    sx={{ m: 1, fontWeight: "bold", whiteSpace: "normal" }}
                  >
                    {t("Please click in the link to download a zip file") + ":"}
                  </InputLabel>

                  <a href={downloadURL} download={`${process.name}.zip`}>
                    Newly created export zip download
                  </a>
                </div>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        {isError && (
          <Alert variant="outlined" severity="error" sx={{ m: 1 }}>
            {errorMessage}
          </Alert>
        )}
        <Button onClick={handleCancel}>{t("Cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
