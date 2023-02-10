import * as React from 'react';
import { Button } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import RightSide from '../coproductionprocesses/RightSide';


export default function ContributionsTable() {
  const [pageSize, setPageSize] = React.useState(5);


  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        autoHeight
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        rows={rows}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        sx={{
          boxShadow: 1,
          border: 1,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
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
        }}
      />
    </div>
  );
}

const contribValues = ['Low', 'Average', 'High'];

const columns = [
  { field: 'name', headerName: 'Name', flex: 0.5, editable: false },
  {
    field: 'activity', headerName: 'Activity', flex: 0.3, editable: false, headerAlign: 'center', align: 'center',
    renderCell: () => (
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Activity
        </Button>
      </strong>) },
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

const rows = [
  {
    id: 1,
    name: 'Diego',
    contribution: 'Low',

  },
  {
    id: 2,
    name: 'Rubén',
    contribution: 'Average',

  },
  {
    id: 3,
    name: 'Daniel',
    contribution: 'High',

  },

];