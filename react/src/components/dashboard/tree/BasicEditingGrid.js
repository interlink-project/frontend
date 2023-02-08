// import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Typography } from '@mui/material';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { Fragment, useEffect, useState, useCallback } from 'react';


const BasicEditingGrid = ({ language }) => {

  const t = useCustomTranslation(language);
  const contribValues = ['Significant contribution', 'Average contribution', 'Minor contribution']

  const rows = [
    {
      id: 1,
      user: 'Rubén',
      contribution: 'Average contribution'
    },

  ];
  const columns = [
    { field: 'user', headerName: 'User', flex: 0.5, editable: false },
    { field: 'contribution', headerName: 'Contribution', flex: 1, type: 'singleSelect', editable: true, valueOptions: contribValues },

  ];

  const [editRowsModel, setEditRowsModel] = useState({});

  const handleEditRowModelChange = useCallback((params) => {
    setEditRowsModel(params.model);
  }, []);

  const handleBlur = useCallback((params, event) => {
    event.stopPropagation();
  }, []);


  return (
    <>
      <Typography
        variant='h6'
        sx={{ mt: 2 }}
      >
        <>{t('Contribution level')}</>
      </Typography>
      <div style={{ height: 300, width: '100%', border: 1 }}>
        <DataGrid
          autoheight
          rows={rows}
          columns={columns}
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          editRowsModel={editRowsModel}
          onEditRowModelChange={handleEditRowModelChange}
          experimentalFeatures={{ newEditingApi: true }}
          onCellBlur={handleBlur}
        />
      </div>
    </>
  );
};

export default BasicEditingGrid;
