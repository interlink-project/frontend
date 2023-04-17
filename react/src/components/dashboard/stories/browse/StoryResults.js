import { useMatomo } from "@datapunt/matomo-tracker-react";
import {
  Box,
  Collapse,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { List, ViewModule } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import { useEffect, useState } from "react";
import { getLanguage } from "translations/i18n";
//import { interlinkersApi } from '__api__';
import { TransitionGroup } from "react-transition-group";
import StoryCard from "./StoryCard";
import { storiesApi } from "__api__";

const StoryResults = ({
  loading: propLoading = null,
  setLoading: propSetLoading = null,
  language = getLanguage(),
  filters = {},
  onStoryClick,
  defaultMode = "list",
  defaultSize = 9,
}) => {
  const mounted = useMounted();
  const t = useCustomTranslation(language);
  //const { trackSiteSearch } = useMatomo();

  const [mode, setMode] = useState(defaultMode);
  const [_loading, _setLoading] = useState(false);

  const loading = propLoading || _loading;
  const setLoading = propSetLoading || _setLoading;

  const handleModeChange = (event, value) => {
    if (value) {
      setMode(value);
    }
  };

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(defaultSize);
  const [loadedRows, setLoadedRows] = useState([]);

  const hasNextPage = loadedRows.length < total;

  const loadServerRows = async (page, loadedRows) => {
    setLoading(true);
    try {
      storiesApi
        .getMulti({ page: page + 1, size, ...filters }, language)
        .then((res) => {
          if (mounted.current) {
            setLoading(false);
            setPage(page + 1);
            setTotal(res.total);
            setLoadedRows(
              [...loadedRows, ...res.items].filter(
                (element, index, self) =>
                  self.indexOf((el) => el.id === element.id) !== index
              )
            );
            // if (filters.search) {
            //   trackSiteSearch({
            //     keyword: filters.hasOwnProperty('search') ? filters.search : '',
            //     category: 'interlinkers',
            //     count: res.total
            //   });
            // }
          }
        });
    } catch (err) {
      console.error("Failed to load data: ", err);
    }

    // setLoadedRows(storiesList);
    // setLoading(false);
    // setPage(page + 1);
    // setTotal(storiesList.length);
  };

  const handleLoadMore = async () => {
    console.log(hasNextPage, loadedRows.length, "/", total);
    if (hasNextPage) {
      loadServerRows(page, loadedRows);
    }
  };

  useEffect(() => {
    setPage(0);
    setLoadedRows([]);
    loadServerRows(0, []);
  }, [filters]);

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          color="textPrimary"
          sx={{
            position: "relative",
            "&:after": {
              backgroundColor: "primary.main",
              bottom: "-8px",
              content: '" "',
              height: "3px",
              left: 0,
              position: "absolute",
              width: "48px",
            },
          }}
          variant="h6"
          data-cy={`stories-catalogue-total-${total}`}
        >
          {t("stories-catalogue-total", { total })}
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <ToggleButtonGroup
            exclusive
            onChange={handleModeChange}
            size="small"
            value={mode}
          >
            <ToggleButton value="list">
              <List fontSize="small" />
            </ToggleButton>
            <ToggleButton value="grid">
              <ViewModule fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {mode === "grid" ? (
          <>
            {loadedRows.map((story, i) => (
              <Grid item key={story.id} md={4} sm={6} xs={12}>
                <StoryCard
                  language={language}
                  story={story}
                  onStoryClick={onStoryClick}
                  mode={mode}
                />
              </Grid>
            ))}
          </>
        ) : (
          <>
            <TransitionGroup>
              {loadedRows.map((story, i) => (
                <Collapse sx={{ mt: 4, ml: 3 }}>
                  <StoryCard
                    language={language}
                    story={story}
                    onStoryClick={onStoryClick}
                    mode={mode}
                    data-cy={`story-card-${story?.id}`}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
          </>
        )}

        <Grid
          item
          xs={12}
          sx={{ justifyContent: "center", textAlign: "center" }}
        >
          {hasNextPage && (
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={handleLoadMore}
            >
              {t("Load more")}
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StoryResults;
