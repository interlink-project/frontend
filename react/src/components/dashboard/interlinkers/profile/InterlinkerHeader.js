import { Avatar, Button, Rating, Snackbar, Stack, Typography } from '@mui/material';
import { Share } from '@mui/icons-material';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useState } from 'react';

const InterlinkerHeader = ({ language, interlinker }) => {
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const handleShareClick = () => {
    navigator.clipboard.writeText(`${window.location.protocol}//${window.location.hostname}/dashboard/interlinkers/${interlinker.id}`);
    setSnackbarOpen(true);
  };
  const t = useCustomTranslation(language);

  return (
    <Stack
      direction='column'
      sx={{ m: 0 }}
    >
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={1}
      >
        {interlinker.logotype_link && (
        <Avatar
          sx={{ width: '30px', height: '30px' }}
          alt='Logotype'
          src={interlinker.logotype_link}
          variant='rounded'
        >
          {interlinker.name}
        </Avatar>
        )}

        <Typography
          color='textPrimary'
          variant='h5'
        >
          {interlinker.name}
        </Typography>
        <Button
          color='primary'
          startIcon={<Share fontSize='small' />}
          variant='text'
          onClick={handleShareClick}
        >
          Share
        </Button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={t('copied-clipboard')}
        />
      </Stack>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={1}
      >
        <Rating
          readOnly
          value={interlinker.rating || 0}
        />
        <Typography variant='subtitle1'>
          (
          {interlinker.ratings_count}
          )
        </Typography>
      </Stack>
    </Stack>
  );
};

export default InterlinkerHeader;
