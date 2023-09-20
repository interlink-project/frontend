import { useState, useEffect, useCallback } from "react";
import { Button, Dialog, IconButton, DialogContent } from "@mui/material";
import { DataGrid, GridApi } from "@mui/x-data-grid";
import clsx from "clsx";
import useMounted from "hooks/useMounted";
import { getUserActivities, setContributionsListLevels } from "slices/general";
import { useDispatch, useSelector } from "react-redux";
import { getContributions } from "slices/general";
import {
  Close,
  CopyAll,
  Delete,
  RecordVoiceOver,
  Download,
  Edit,
  KeyboardArrowDown,
  OpenInNew,
} from "@mui/icons-material";
import CoproNotifications from "components/dashboard/coproductionprocesses/CoproNotifications";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import { gamesApi } from "__api__";

export default function ContributionsTable({ rows, closedTask }) {
  const { contributions, contributionslistlevels } = useSelector(
    (state) => state.general
  );

  const [stateRows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  
  const [activitiesDialogOpen, setactivitiesDialogOpen] = useState(false);
  
  const dispatch = useDispatch();
  const { process, selectedTreeItem } = useSelector((state) => state.process);
  const t = useCustomTranslation(process.language);
  const contribValues = [t("Low"), t("Average"), t("High")];

  const handleClickHistory = (userId) => {
    console.log("Selected user: " + userId);
    if (userId == null) {
      return;
    }
    setactivitiesDialogOpen(true);
    dispatch(
      getUserActivities({
        coproductionprocess_id: process.id,
        assets: contributions,
        user_id: userId,
      })
    );
  };

  const columns = [
    { field: "name", headerName: t("Name"), flex: 0.5, editable: false },
    {
      field: "activity",
      headerName: t("Activity"),
      flex: 0.3,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          // setUserId(params.row.id);
          return handleClickHistory(params.row.id);
        };
        return (
          <Button variant="contained" onClick={onClick} color="primary">
            {t("Activities")}
          </Button>
        );
      },
    },
    {
      field: "contribution",
      headerName: t("Contribution"),
      type: "singleSelect",
      flex: 1,
      editable: !closedTask,
      valueOptions: contribValues,
      headerAlign: "center",
      align: "center",
      cellClassName: (params) => {
        if (params.value == null) {
          return "";
        }

        return clsx("super-app", {
          low: params.value === t("Low"),
          average: params.value === t("Average"),
          high: params.value === t("High"),
        });
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    let temporalRows = [];
    if (rows && rows.length > 0) {
      //Set the complexity levels from temporal Memory:
      temporalRows = rows.map((row) => {
        let level = contributionslistlevels.find((obj) => obj.id === row.id);
        if (level) {
          row.contribution = t(level.contribution);
        } else{
          row.contribution = t(row.contribution);
        }
        return row;
      });

      setRows(temporalRows);
    } else {
      setRows([]);
    }
    setLoading(false);
  }, [rows]);

  return (
    <>
      <DataGrid
        autoHeight
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        rows={stateRows}
        loading={loading}
        columns={columns}
        onCellEditCommit={(props, event) => {
          rows[rows.findIndex((row) => row.id === props.id)][props.field] =
            props.value;

          // Get the new values
          let values = { id: props.id, contribution: props.value };
          const index = contributionslistlevels.findIndex(
            (obj) => obj.id === props.id
          );
          let listaTemporal = [];
          if (Array.isArray(contributionslistlevels)) {
            if (index === -1) {
              listaTemporal = [...contributionslistlevels, values];
            } else {
              listaTemporal[index] = {
                id: props.id,
                contribution: props.value,
              };
            }
            //Save selection in temporal memory (Redux):
            dispatch(setContributionsListLevels(listaTemporal));
          }
        }}
        sx={{
          boxShadow: 1,
          // border: 1,
          borderColor: "primary.light",
          "& .super-app.low:after": {
            content: "''",
            display: "inline-block",
            background:
              "url(/static/graphics/chevronIcon.png) no-repeat center center",
            backgroundSize: "10px",
            width: "10px",
            height: "10px",
            marginLeft: "10px",
          },
          "& .super-app.average:after": {
            content: "''",
            display: "inline-block",
            background:
              "url(/static/graphics/chevronIcon.png) no-repeat center center",
            backgroundSize: "10px",
            width: "10px",
            height: "10px",
            marginLeft: "10px",
          },
          "& .super-app.high:after": {
            content: "''",
            display: "inline-block",
            background:
              "url(/static/graphics/chevronIcon.png) no-repeat center center",
            backgroundSize: "10px",
            width: "10px",
            height: "10px",
            marginLeft: "10px",
          },
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .super-app.low": {
            color: "#f44336",
            fontWeight: "600",
          },
          "& .super-app.average": {
            color: "#077878",
            fontWeight: "600",
          },
          "& .super-app.high": {
            color: "#44c949",
            fontWeight: "600",
          },

          p: 2,
        }}
      />
      <Dialog
        open={activitiesDialogOpen}
        onClose={() => setactivitiesDialogOpen(false)}
      >
        <IconButton
          aria-label="close"
          onClick={() => setactivitiesDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 3 }}>
          <CoproNotifications mode={"activity"} />
        </DialogContent>
      </Dialog>
    </>
  );
}
