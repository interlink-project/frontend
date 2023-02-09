import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function BasicEditingGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}

const contribValues = ['low', 'average', 'high'];

const columns = [
  { field: 'name', headerName: 'Name', flex: 0.5, editable: false },
  { field: 'contribution', headerName: 'Contribution', type: 'singleSelect', flex: 1, editable: true, valueOptions: contribValues },
  
];

const rows = [
  {
    id: 1,
    name: 'Paco',
    contribution: 'average',
   
  },
  
];