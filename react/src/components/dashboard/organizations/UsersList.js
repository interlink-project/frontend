import { Alert, Snackbar, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserSearch from 'components/dashboard/coproductionprocesses/UserSearch';
import UserRow from './UserRow';
import { useState } from 'react';

const UsersList = ({ users, size = 'medium', searchOnOrganization = null, onSearchResultClick = null, getActions = null, disableContainer = true, disableHeader = true, showLastLogin = true }) => {
  const [openSnackbarChangeUser, setSnackbarChangeUserOpen] = useState(false);
  const { t } = useTranslation();

  const handlClickShowUserMsn = () => {
    setSnackbarChangeUserOpen(true);
  };

  const handleCloseShowUserMsn = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarChangeUserOpen(false);
  };


  const table = (
    <>
    <Table size={size}>
      {!disableHeader && (
      <TableHead>
        <TableRow>
          <TableCell align='center' />
          <TableCell align='center'>{t('Name')}</TableCell>
          {showLastLogin && <TableCell align='center'>{t('Last login')}</TableCell>}
          {getActions && <TableCell align='center' />}
        </TableRow>
      </TableHead>
      )}
      <TableBody>
        {users.length > 0 && users.map((user) => (
          <UserRow
            size={size === 'small' ? 30 : 50}
            key={user.id}
            user={user}
            t={t}
            actions={getActions && getActions(user)}
            showLastLogin={showLastLogin}
            showTemporalMessage= {handlClickShowUserMsn}
          />
        ))}
      </TableBody>
    </Table>
  <Snackbar open={openSnackbarChangeUser} autoHideDuration={4000} onClose={handleCloseShowUserMsn} anchorOrigin={{ vertical:'bottom', horizontal: 'center' }} key={ 'bottom' + 'center'}>
  
        <Alert onClose={handleCloseShowUserMsn} severity="success">
        {t('The admin list has been modified, please wait a couple of minutes for the changes to take effect.')}
        </Alert>
      </Snackbar>
    </>
  );

  return (
    <>
      {!disableContainer ? (
        <TableContainer component={Paper}>
          {table}
        </TableContainer>
      ) : table}

      {onSearchResultClick && (
      <>
        <Divider sx={{ my: 3 }} />
        <UserSearch
          exclude={users.map((user) => user.id)}
          organization_id={searchOnOrganization}
          onClick={onSearchResultClick}
          showTemporalMessage= {handlClickShowUserMsn}
        />
      </>
      )}
    </>
  );
};

export default UsersList;
