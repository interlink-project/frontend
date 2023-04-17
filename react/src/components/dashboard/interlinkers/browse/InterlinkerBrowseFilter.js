import {
  Box,
  Card,
  Chip,
  Divider,
  Input,
  LinearProgress,
  Rating,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import useMounted from "hooks/useMounted";
import React, { useEffect, useState } from "react";
import { problemprofilesApi } from "__api__";
import MultiSelect from "../../../MultiSelect";

const InterlinkerBrowseFilter = ({
  loading,
  filters,
  onFiltersChange,
  language,
}) => {
  const [inputValue, setInputValue] = useState(filters.search);
  const [loadingProblemProfiles, setLoadingProblemProfiles] = useState(true);
  const mounted = useMounted();
  const t = useCustomTranslation(language);
  const [problemProfiles, setProblemProfiles] = useState([]);

  useEffect(() => {
    problemprofilesApi.getMulti({}, language).then((res) => {
      if (mounted.current) {
        setProblemProfiles(res);
        setLoadingProblemProfiles(false);
      }
    });
  }, [language]);

  const problemprofilesMultiselect = {
    label: t("Problem profiles"),
    options: problemProfiles.map((pp) => ({
      label: `${pp.id} - ${pp.name}`,
      value: pp.id,
    })),
  };

  const natureMultiselect = {
    label: t("Nature"),
    options: [
      {
        label: t("Internal software"),
        value: "softwareinterlinker",
      },
      {
        label: t("External software"),
        value: "externalsoftwareinterlinker",
      },
      {
        label: t("Internal knowledge"),
        value: "knowledgeinterlinker",
      },
      {
        label: t("External knowledge"),
        value: "externalknowledgeinterlinker",
      },
    ],
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
              data-cy="search-input-interlinkers"
              placeholder={t("Search")}
              value={inputValue}
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
            label={natureMultiselect.label}
            onChange={(e) => changeFilter("nature", e)}
            options={natureMultiselect.options}
            value={filters.nature}
            datacy="nature-filter"
            datacyOption="nature-filter-option"
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <MultiSelect
            label={problemprofilesMultiselect.label}
            onChange={(e) => changeFilter("problemprofiles", e)}
            options={problemprofilesMultiselect.options}
            value={filters.problemprofiles}
            datacy="problemprofiles-filter"
            datacyOption="problemprofiles-filter-option"
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
          {/* <Typography variant="body2" sx={{ mr: 1 }}><b>Order by:</b></Typography>
        <Select
          labelId={selectOptions.label}
          label={selectOptions.label}
          onChange={console.log}
          value={<Rating value={5} />}
          sx={{ width: "100px", height: "40px" }}
        >
          {selectOptions.options.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </Select> */}
        </Box>
        {(loading || loadingProblemProfiles) && <LinearProgress />}
      </Card>
      <Box sx={{ mt: 1 }}>
        {filters.search && (
          <Chip
            sx={{ mr: 1, mt: 1 }}
            label={`${t("Search")}: ${filters.search}`}
            onDelete={() => changeFilter("search", "")}
          />
        )}
        {filters.nature.map((nature) => (
          <Chip
            key={`active-filter-${nature}`}
            sx={{ mr: 1, mt: 1 }}
            label={`${t("Nature")}: ${
              natureMultiselect.options.find(
                (option) => option.value === nature
              ).label
            }`}
            onDelete={() =>
              changeFilter(
                "nature",
                filters.nature.filter((nt) => nt !== nature)
              )
            }
            data-cy={`active-nature-filter-${nature}`}
          />
        ))}
        {filters.problemprofiles &&
          filters.problemprofiles.map((pp) => (
            <Chip
              key={`active-filter-${pp}`}
              sx={{ mr: 1, mt: 1 }}
              label={`${t("Problem profile")}: ${pp}`}
              onDelete={() =>
                changeFilter(
                  "problemprofiles",
                  filters.problemprofiles.filter(
                    (problemprofile) => problemprofile !== pp
                  )
                )
              }
            />
          ))}
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

export default InterlinkerBrowseFilter;
