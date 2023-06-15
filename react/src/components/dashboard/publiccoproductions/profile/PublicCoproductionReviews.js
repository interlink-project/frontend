import PropTypes from 'prop-types';
import { Box, Button, Card, CardContent, Grid, Paper, Rating, TextField, Typography, Stack, CircularProgress, Dialog } from '@mui/material';
import PubliccoproductionReviewCard from './PublicCoproductionReviewCard';
import { useEffect, useState } from 'react';
import axiosInstance from 'axiosInstance';
import { ratingsApi } from '__api__/coproduction/ratingsApi';
import { LoadingButton } from '@mui/lab';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { usersApi } from '__api__';

import { useDispatch, useSelector } from 'react-redux';
import { getSelectedPubliccoproduction } from 'slices/general';


const PubliccoproductionRatings = ({ publiccoproduction }) => {


  const dispatch = useDispatch();
  


  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);

  const [newCommentDialog, _setNewCommentDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [value, setValue] = useState(5);
  const auth = useAuth();

  const { user, isAuthenticated } = auth;
  const { t } = useTranslation();

  const setNewCommentDialog = (bool) => {
    setTitle('');
    setText('');
    setValue('');
    _setNewCommentDialog(bool);
  };

  const update = async() => {
    dispatch(getSelectedPubliccoproduction(publiccoproduction.id));
    setLoading(true);
    let res= await ratingsApi.getMulti(publiccoproduction.id,"publiccoproduction")
    setLoading(false);

   
    //Add users info
    for(let i=0;i<res.items.length;i++){
      let user=await usersApi.get(res.items[i].user_id);
      res.items[i].user=user;
    }
    
    setRatings(res.items);
    setNewCommentDialog(false);
    
  };
  useEffect(() => {
    update();
  }, []);

  const rating = ratings.reduce((acc, rating) => acc + rating.value, 0) / ratings.length;

  return (
    <div>
      <Card>
        <CardContent>
          <Grid
            alignItems='center'
            container
            spacing={3}
          >
            <Grid item>
              <Typography
                color='textPrimary'
                variant='subtitle2'
              >
                {t('overall-rating')}
              </Typography>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <Rating
                  value={rating}
                  precision={0.5}
                  readOnly
                />
                <Typography
                  color='textPrimary'
                  sx={{ ml: 2 }}
                  variant='subtitle2'
                >
                  {rating ? rating.toFixed(1) : 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Typography
                color='textSecondary'
                variant='body2'
              >
                {ratings.length}
                {' '}
                {t('ratings-in-total')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {isAuthenticated && (
      <Button
        variant='contained'
        fullWidth
        onClick={() => setNewCommentDialog(true)}
        sx={{ mt: 2 }}
        size="medium"
      >
        {t('Rate this public co-production process')}
      </Button>
      )}

      {loading ? <CircularProgress /> : ratings.map((rating) => (
        <Box
          key={rating.id}
          sx={{ mt: 2 }}
        >
          <PubliccoproductionReviewCard
            authorAvatar={rating.user.picture}
            authorName={rating.user.full_name}
            title={rating.title}
            comment={rating.text}
            createdAt={rating.created_at}
            value={rating.value}
            mine={isAuthenticated && (user.id === rating.user_id)}
          />
        </Box>
      ))}
      <Dialog
        open={newCommentDialog}
        onClose={() => setNewCommentDialog(false)}
        fullWidth
      >
        <Stack
          spacing={3}
          direction='column'
          sx={{ p: 3 }}
        >
          <TextField
            fullWidth
            label={t('title')}
            variant='standard'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label={t('body')}
            multiline
            rows={3}
            variant='standard'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Rating
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
          <LoadingButton
            loading={loading}
            variant='contained'
            size='small'
            onClick={() => {
              ratingsApi.create(title, text, value, publiccoproduction.id,"publiccoproduction").then(update)}}
          >
            {t('Send')}
          </LoadingButton>
        </Stack>

      </Dialog>

    </div>
  );
};

PubliccoproductionRatings.propTypes = {
  ratings: PropTypes.array
};

export default PubliccoproductionRatings;
