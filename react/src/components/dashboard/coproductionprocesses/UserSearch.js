import { Alert, Avatar, LinearProgress, Menu, MenuItem, Paper, TextField, Button, Snackbar } from '@material-ui/core';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useRef, useState } from 'react';
import { usersApi } from '__api__';
import Papa from 'papaparse';
import { ExportToCsv } from 'export-to-csv';

const UserSearch = ({ exclude = [], onClick, showTemporalMessage = null, organization_id = null }) => {
  const [loading, setLoading] = useState(false);
  const mounted = useMounted();
  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const { t } = useDependantTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const textInput = useRef(null);
  const [fileParsedMsn, setFileParsedMsn] = useState(false);
  const [mailErrors, setMailErrors] = useState(false);



  const handleOpenParseMsn = () => {
    setFileParsedMsn(true);
  };

  const handleCloseParseMsn = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFileParsedMsn(false);
    setMailErrors(false);
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  useEffect(() => {
    if (open && textInput.current) {
      textInput.current.focus();
    }
  }, [open]);

  useEffect(() => {
    let delayDebounceFn;
    if (mounted && inputValue) {
      setLoading(true);
      delayDebounceFn = setTimeout(() => {
        usersApi.search(inputValue, organization_id).then((res) => {
          if (mounted.current) {
            setSearchResults(res);
            setOpen(true);
          }
        }).catch(() => {
          if (mounted.current) {
            setSearchResults([]);
          }
        }).finally(() => {
          if (mounted.current) {
            setLoading(false);
          }
        });
      }, 3500);
    }
    return () => {
      clearTimeout(delayDebounceFn);
      setLoading(false);
    };
  }, [mounted, inputValue]);

  const parseFile = (evt) => {
    if (!(evt.target && evt.target.files && evt.target.files[0])) {
      return;
    }
    let options = {
      fieldSeparator: ',',
      decimalSeparator: '.',
      showLabels: false,
      filename: 'Rejected mails',
      useTextFile: false,
      useBom: true,
      headers: ['mails']
    };
    let csvExporter = new ExportToCsv(options);
    let rejected_users = [];
    Papa.parse(evt.target.files[0], {
      header: false,
      skipEmptyLines: true,
      complete: async function (results) {
        console.log(results.data)
        for (let i = 0; i < results.data.length; i++) {
          await usersApi.search(results.data[i]).then((res) => {
            if (res.length > 0) {
              onClick(res[0]);
            } else {
              rejected_users.push(results.data[i]);
            }
          });
        }
        if (rejected_users.length > 0) {
          setMailErrors(true)
          csvExporter.generateCsv(rejected_users);
        }
        handleOpenParseMsn();
      }
    });
  };

  return (
    <>
      <Snackbar open={fileParsedMsn} autoHideDuration={6000} onClose={handleCloseParseMsn}>
        {mailErrors ? (
          <Alert onClose={handleCloseParseMsn} severity="warning">
            {t('Some of the users could not be added. Check the csv file with the rejected mails')}
          </Alert>
        ) : (
          <Alert onClose={handleCloseParseMsn} severity="success">
            {t('All the users have been added successfully')}
          </Alert>
        )}

      </Snackbar>
      <Alert severity='warning'>{t('Only registered users can be added')}</Alert>
      <TextField
        sx={{ mt: 1 }}
        variant='standard'
        fullWidth
        value={inputValue}
        inputRef={textInput}
        onChange={(event) => {
          setOpen(false);
          setInputValue(event.target.value);
          handleClick(event);
        }}
        id='outlined-basic'
        label={t('Type here to add users')}
      />
      {loading && <LinearProgress />}
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        component="label">
        {t('Import from csv')}
        <input
          type="file"
          accept=".csv"
          hidden
          onChange={parseFile}
        />
      </Button>
      {open && (
        <Paper>
          <Menu
            anchorEl={anchorEl}
            id='account-menu'
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {searchResults.length === 0
              ? (
                <MenuItem disabled>
                  {t('No results. Try to type the complete email of the user')}
                </MenuItem>
              )
              : open && searchResults.slice(0, 4).map((user) => {
                const alreadySelected = exclude.includes(user.id);
                return (
                  <MenuItem
                    key={user.id}
                    disabled={alreadySelected}
                    onClick={(event) => {
                      onClick(user);
                      if (showTemporalMessage !== null) { showTemporalMessage(); }
                      setInputValue('');
                      handleClose();
                    }}
                  >
                    <Avatar
                      sx={{ mr: 2, height: 30, width: 30 }}
                      src={user.picture}
                    />
                    {user.full_name + (alreadySelected ? ` (${t('already added')})` : '')}
                  </MenuItem>
                );
              })}
          </Menu>
        </Paper>

      )}
    </>
  );
};

export default UserSearch;
