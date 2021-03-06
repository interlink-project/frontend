import { Box, Card, Input, LinearProgress } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { getLanguage } from 'translations/i18n';

const SearchBox = ({ language = getLanguage(), loading, inputValue, setInputValue, size = 'medium' }) => {
  const t = useCustomTranslation(language);

  return (
    <Card>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          py: size === 'small' ? 1 : 2,
          px: 2
        }}
      >
        <Search fontSize='small' />
        <Box
          sx={{
            flexGrow: 1,
            ml: 3
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
            placeholder={t('Search')}
            value={inputValue}
          />
        </Box>
      </Box>
      {loading && <LinearProgress />}
    </Card>
  );
};

export default SearchBox;
