import { Box, Card, Input, LinearProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useCustomTranslation } from "hooks/useDependantTranslation";
import { getLanguage } from "translations/i18n";

const SearchBox = ({
  language = getLanguage(),
  loading,
  inputValue,
  setInputValue,
  size = "medium",
  datacy = null,
}) => {
  const t = useCustomTranslation(language);

  return (
    <Card>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          py: size === "small" ? 1 : 2,
          px: 2,
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
            autoFocus={!loading}
            disableUnderline
            size={size}
            fullWidth
            onChange={(event) => {
              !loading && setInputValue(event.target.value);
            }}
            placeholder={t("Search")}
            value={inputValue}
            data-cy={datacy}
          />
        </Box>
      </Box>
      {loading && <LinearProgress />}
    </Card>
  );
};

export default SearchBox;
