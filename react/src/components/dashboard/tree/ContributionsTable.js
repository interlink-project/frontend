import { useState, useEffect } from 'react';
import { Button, Dialog, IconButton, DialogContent } from '@mui/material';
import { DataGrid, GridApi } from '@mui/x-data-grid';
import clsx from 'clsx';
import useMounted from 'hooks/useMounted';
import { getUserActivities } from "slices/general";
import { useDispatch, useSelector } from 'react-redux';
import { Close, CopyAll, Delete, RecordVoiceOver, Download, Edit, KeyboardArrowDown, OpenInNew } from '@mui/icons-material';
import CoproNotifications from 'components/dashboard/coproductionprocesses/CoproNotifications';



export default function ContributionsTable({ rows, assets }) {
  const [stateRows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const contribValues = ['Low', 'Average', 'High'];
  const [activitiesDialogOpen, setactivitiesDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { process } = useSelector((state) => state.process);
  // const [ userId, setUserId ] = useState(null);

  const handleClickHistory = (userId) => {
    console.log("Selected user: " + userId);
    if (userId == null) {
      return;
    }
    setactivitiesDialogOpen(true);
    dispatch(getUserActivities({
      'coproductionprocess_id': process.id, 'assets': assets, 'user_id': userId
    }));
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 0.5, editable: false },
    {
      field: 'activity', headerName: 'Activity', flex: 0.3, editable: false, headerAlign: 'center', align: 'center',
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          // setUserId(params.row.id);
          return handleClickHistory(params.row.id);
        };
        return (
          <Button variant="contained" onClick={onClick} color="primary">
            Activities
          </Button>)
      }
    },
    {
      field: 'contribution', headerName: 'Contribution',
      type: 'singleSelect',
      flex: 1,
      editable: true,
      valueOptions: contribValues,
      headerAlign: 'center',
      align: 'center',
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }

        return clsx('super-app', {
          low: params.value === 'Low',
          average: params.value === 'Average',
          high: params.value === 'High',
        });
      },
    },

  ];

  useEffect(() => {
    if (rows && rows.length > 0) {
      console.log(rows);
      setRows(rows);
    } else {
      setRows([]);
    }
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
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        sx={{
          // boxShadow: 1,
          // border: 1,
          // borderColor: 'primary.light',
          // '& .MuiDataGrid-cell:hover': {
          //   color: 'primary.main',
          // },
          '& .super-app.low': {
            color: '#f44336',
            fontWeight: '600',
          },
          '& .super-app.average': {
            color: '#ffe607',
            fontWeight: '600',
          },
          '& .super-app.high': {
            color: '#44c949',
            fontWeight: '600',
          },
          p:2
        }}
      />
      <Dialog
        open={activitiesDialogOpen}
        onClose={() => setactivitiesDialogOpen(false)}
      >
        <IconButton
          aria-label='close'
          onClick={() => setactivitiesDialogOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 3 }}>
          <CoproNotifications
            mode={'activity'} />
        </DialogContent>
      </Dialog>
    </>
  );
}

