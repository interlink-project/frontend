import {
  Box,
  Card,
  Chip,
  Divider,
  Input,
  Rating,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import React, { useEffect, useState } from "react";
import MultiSelect from "../../../MultiSelect";
import { tagsApi } from "__api__";

const StoryBrowseFilter = ({ loading, filters, onFiltersChange, language }) => {
  const [inputValue, setInputValue] = useState(filters.search);
  const mounted = useMounted();
  const t = useCustomTranslation(language);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    tagsApi.getMulti({}, language).then((res) => {
      if (mounted.current) {
        setTags(res);
      }
    });
  }, [language]);

  const topicsMultiselect = {
    label: t("Topic"),
    options: tags.map((pp) => ({
      label: ` ${pp.name}`,
      value: pp.name,
    })),
  };

  const changeFilter = (key, value) => {
    console.log("CHANGED", key, value);
    const newFilters = { ...filters };
    newFilters[key] = value;
    onFiltersChange(newFilters);
  };

  useEffect(() => {
    let delayDebounceFn;
    if (mounted.current && inputValue !== filters.search) {
      delayDebounceFn = setTimeout(() => {
        changeFilter("search", inputValue);
      }, 800);
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [inputValue]);

  return (
    <>
      <Card>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            p: 2,
          }}
        >
          <Search fontSize="small" />
          <Box
            sx={{
              flexGrow: 1,
              ml: 3,
            }}
          >
            <Input
              disableUnderline
              fullWidth
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              placeholder={t("Search")}
              value={inputValue}
              data-cy="search-input-stories"
            />
          </Box>
        </Box>

        <Divider />
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            p: 1,
          }}
        >
          <MultiSelect
            label={topicsMultiselect.label}
            onChange={(e) => changeFilter("keyword", e)}
            options={topicsMultiselect.options}
            value={filters.keyword}
            datacy="keyword-multiselect"
            datacyOption="keyword-multiselect-option"
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Typography variant="body2" sx={{ mx: 1 }}>
            <b>{t("Minimum rating")}:</b>
          </Typography>
          <Rating
            value={filters.rating}
            onChange={(e, value) => changeFilter("rating", value)}
            data-cy="rating-filter"
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        </Box>
      </Card>
      <Box sx={{ mt: 1 }}>
        {filters.search && (
          <Chip
            sx={{ mr: 1, mt: 1 }}
            label={`${t("Search")}: ${filters.search}`}
            onDelete={() => changeFilter("search", "")}
          />
        )}
        {filters.keyword &&
          filters.keyword.map((keyword) => {
            const etiquetaBuscar = topicsMultiselect.options.find(
              (option) => option.value === keyword
            ).label;
            return (
              <Chip
                key={`active-filter-${keyword}`}
                sx={{ mr: 1, mt: 1 }}
                // label={`${t('Topic')}: ${keyword}`}
                label={`${t("Topic")}: ${etiquetaBuscar}`}
                onDelete={() =>
                  changeFilter(
                    "keyword",
                    filters.keyword.filter((nt) => nt !== keyword)
                  )
                }
                data-cy={`active-topic-filter-${keyword}`}
              />
            );
          })}

        {filters.rating && (
          <Chip
            sx={{ mr: 1, mt: 1 }}
            label={`${t("Minimum rating")}: ${filters.rating}`}
            onDelete={() => changeFilter("rating", null)}
          />
        )}
      </Box>
    </>
  );
};

export default StoryBrowseFilter;
