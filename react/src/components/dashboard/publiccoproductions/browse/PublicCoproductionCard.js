import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  Grid,
  Link,
  Rating,
  Typography,
} from "@mui/material";
//import { NatureChip } from 'components/Icons';
import SwipeableTextMobileStepper from "components/SwipeableTextMobileStepper";
import { formatDistanceToNowStrict } from "date-fns";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import { truncate } from "lodash";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { HTMLtoText } from "utils/safeHTML";

const GridMode = ({ publiccoproduction, t, linkProps }) => (
  <>
    <Box sx={{ p: 3, pb: 1 }}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          textAlign: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        {publiccoproduction.logotype ? (
          <>
          <Avatar alt={t("Logotype")} src={'/coproduction'+publiccoproduction.logotype} variant="square">
            {publiccoproduction.name}
          </Avatar>
     
          </>
        ) : (
          <div />
        )}
        <Box sx={{ ml: 2 }}>
          <Link
            color="textPrimary"
            {...linkProps}
            variant="h6"
            title={publiccoproduction.name}
          >
            {truncate(publiccoproduction.name, {
              length: 100,
              separator: " ",
            })}
          </Link>
          <Typography color="textSecondary" variant="body2">
            {t("by")}{" "}
            <Link
              color="textPrimary"
              component={RouterLink}
              to="#"
              variant="subtitle2"
              title="teamname"
            >
              {t("Interlink platform")}
            </Link>
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {t("Last update")}:{" "}
            {t("time-ago", {
              when: formatDistanceToNowStrict(
                new Date(publiccoproduction.updated_at || publiccoproduction.created_at)
              ),
            })}
          </Typography>
        </Box>
        <Box
          sx={{
            alignItems: "right",
            display: "flex",
          }}
        >
          {/* isLiked ? (
          <Tooltip title={t('Unlike')}>
            <IconButton
              onClick={handleUnlike}
              sx={{ color: red['600'] }}
            >
              <FavoriteIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={t('Like')}>
            <IconButton onClick={handleLike}>
              <FavoriteBorderIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        ) */}
        </Box>
      </Box>
    </Box>
    <Box
      sx={{
        pb: 1,
        px: 3,
      }}
    >
      <Typography color="textSecondary" variant="body2">
        {HTMLtoText(
          truncate(publiccoproduction.description, {
            length: 200,
            separator: " ",
          })
        )}
      </Typography>
    </Box>

    <Box
      sx={{
        px: 3,
        pb: 1,
      }}
    >
      <Grid
        alignItems="center"
        sx={{ textAlign: "center" }}
        container
        justifyContent="space-between"
        spacing={3}
      >
        {/* <Grid item>
        <Typography
          color='textPrimary'
          variant='subtitle2'
          sx={{ mb: 1 }}
        >
          Creator
        </Typography>
        <Typography
          color='textPrimary'
          variant='subtitle2'
        >
          <OfficialityChip t={t} />
        </Typography>
  </Grid> */}
        <Grid item>
          <Typography color="textPrimary" variant="subtitle2" sx={{ mb: 1 }}>
            {t("Types")}
          </Typography>
          <Typography color="textPrimary" variant="subtitle2">
            {/* <NatureChip
                t={t}
                publiccoproduction={publiccoproduction}
              /> */}
               {publiccoproduction.intergovernmental_model &&
          publiccoproduction.intergovernmental_model.split(',').map((el) => {
            //console.log(el);
            return (
              <Chip
                label={el}
                key={el}
                size="small"
                variant="outlined"
                sx={{ mr: 1 }}
              />
            );
          })}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textPrimary" variant="subtitle2" sx={{ mb: 1 }}>
            {t("Rating")}
          </Typography>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Rating readOnly size="small" value={publiccoproduction.rating || 0} />
            {publiccoproduction.ratings_count &&
            <Typography color="textPrimary" sx={{ ml: 1 }}>
                {publiccoproduction.ratings_count}
            </Typography>
            }
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Box
      sx={{
        pb: 2,
        px: 3,
      }}
    >
      <Typography
        color="textPrimary"
        variant="subtitle2"
        sx={{ mb: 1, textAlign: "center" }}
      >
        {t("Topics")}
      </Typography>


       <Typography
        color="textPrimary"
        variant="subtitle2"
        sx={{ mb: 1, textAlign: "center" }}
      >
      {publiccoproduction.tags &&
          publiccoproduction.tags.map((el) => {
            //console.log(el);
            return (
              <Chip
                label={el.name}
                key={el.id}
                size="small"
                variant="outlined"
                sx={{ mr: 1 }}
              />
            );
          })}

</Typography> 


{/* 
      {publiccoproduction.tags &&
        publiccoproduction.tags.map((el) => (
          <Chip
            label={el}
            key={el}
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
          />
        ))} */}
    </Box>
    {publiccoproduction.snapshots_links && 
    <Box sx={{ bottom: 0 }}>
      <SwipeableTextMobileStepper
        images={publiccoproduction.snapshots_links}
        height="300px"
      />
    </Box>
    }
  </>
);

const ListMode = ({ publiccoproduction, t, linkProps }) => (
  <>
    <Grid container>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <CardHeader
          avatar={
            <>
              <Avatar
                alt={t("Logotype")}
                src={'/coproduction'+publiccoproduction.logotype}
                variant="rounded"
              >
                {publiccoproduction.name}
         
              </Avatar>
             
            </>
          }
          title={
            <Link
              color="textPrimary"
              {...linkProps}
              variant="h6"
              title={publiccoproduction.name}
            >
              {publiccoproduction.name}
           
            </Link>
          }
          subheader={
            <Box>
              <Typography color="textSecondary" variant="body2">
                {t("by")}{" "}
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="#"
                  variant="subtitle2"
                  title="teamname"
                >
                  {publiccoproduction.owners &&
                    publiccoproduction.owners.map((el) => {
                      //console.log(el);
                      return (
                        <Chip
                          label={el.name}
                          key={el.name}
                          size="small"
                          variant="filled"
                          sx={{ mr: 1 }}
                        />
                      );
                    })}
                </Link>
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {t("Last update")}:{" "}
                {t("time-ago", {
                  when: formatDistanceToNowStrict(
                    new Date(publiccoproduction.updated_at || publiccoproduction.created_at)
                  ),
                })}
              </Typography>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12} md={6} lg={8} xl={8}>
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography color="textSecondary" variant="body2">
            {HTMLtoText(
              truncate(publiccoproduction.description, {
                length: 500,
                separator: " ",
              })
            )}
          </Typography>
        </Box>
      </Grid>
    </Grid>

    <Grid
      alignItems="center"
      sx={{ textAlign: "center", p: 2, pt: 0 }}
      container
      justifyContent="center"
      spacing={3}
    >
      <Grid item xs={6} md={6} lg={3} xl={3}>
        <Typography color="textPrimary" variant="subtitle2" sx={{ mb: 1 }}>
          {t("Topics")}
        </Typography>
        <Typography color="textPrimary" variant="subtitle2">
          {publiccoproduction.tags &&
            publiccoproduction.tags.map((el) => {
              //console.log(el);
              return (
                <Chip
                  label={el.name}
                  key={el.id}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              );
            })}
        </Typography>
      </Grid>
      
      <Grid item xs={6} md={6} lg={3} xl={3}>
        <Typography color="textPrimary" variant="subtitle2" sx={{ mb: 1 }}>
          {t("Rating")}
        </Typography>
        <Rating readOnly size="small" value={publiccoproduction.rating || 0} />
      </Grid> 
      <Grid item xs={12} md={12} lg={6} xl={6}>
        <Typography
          color="textPrimary"
          variant="subtitle2"
          sx={{ mb: 1, textAlign: "center" }}
        >
          {t("Type")}
        </Typography> 
                  {publiccoproduction.intergovernmental_model && publiccoproduction.intergovernmental_model.split(',').map(
             (el) => (
              <Chip
                label={el}
                key={el}
                size='small'
                variant='outlined'
                sx={{ mr: 1 }}
              />
            ) 

          )} 
       {/*  {publiccoproduction.tags &&
          publiccoproduction.tags.split(",").map((el) => {
            console.log(el);
            return (
              <Chip
                label={el}
                key={el}
                size="small"
                variant="outlined"
                sx={{ mr: 1 }}
              />
            );
          })} */}
      </Grid>
    </Grid>
  </>
);

const PublicCoproductionCard = ({ language, publiccoproduction, mode, onPublicCoproductionClick }) => {
  const [isLiked, setIsLiked] = useState(publiccoproduction.isLiked || false);
  const [likes, setLikes] = useState(publiccoproduction.likes || 0);
  const t = useCustomTranslation(language);
  


  const sameHeightCards = {
    minHeight: "200px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const handleLike = () => {
    setIsLiked(true);
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleUnlike = () => {
    setIsLiked(false);
    setLikes((prevLikes) => prevLikes - 1);
  };
  //     <CardActionArea component={RouterLink} to="/">

  const linkProps = onPublicCoproductionClick
    ? {
        onClick: () => onPublicCoproductionClick(publiccoproduction),
      }
    : {
        component: RouterLink,
        onClick: onPublicCoproductionClick,
        to: `/dashboard/publiccoproductions/${publiccoproduction.id}`,
      };
  return (
    <Card
      style={sameHeightCards}
      aria-haspopup="true"
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
    >
      {mode === "grid" && (
        <GridMode publiccoproduction={publiccoproduction} t={t} linkProps={linkProps} />
      )}
      {mode === "list" && (
        <ListMode publiccoproduction={publiccoproduction} t={t} linkProps={linkProps} />
      )}
    </Card>
  );
};

PublicCoproductionCard.propTypes = {
  publiccoproduction: PropTypes.object.isRequired,
};

export default PublicCoproductionCard;
