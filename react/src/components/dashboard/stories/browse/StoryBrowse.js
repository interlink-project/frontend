import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Box } from '@mui/material';

import { useState } from 'react';
import { getLanguage } from 'translations/i18n';
import StoryBrowseFilter from './StoryBrowseFilter';
import StoryResults from './StoryResults';

const initialDefaultFilters = {

  //problemprofiles: [],
  //nature: ['softwareinterlinker', 'knowledgeinterlinker', 'externalsoftwareinterlinker', 'externalknowledgeinterlinker'],
  keyword: ['childcare'],
  
  rating: null,
};
   // const initialDefaultFilters = {};

const StoryBrowse = ({ language = getLanguage(), initialFilters = {}, onStoryClick }) => {
  // const mounted = useMounted();
  // const t = useCustomTranslation(language)

  const [filters, _setFilters] = useState({ ...initialDefaultFilters, ...initialFilters });
  const [loading, setLoading] = useState(true);
  //const { trackEvent } = useMatomo();

  const setFilters = (filters) => {
    // trackEvent({
    //   category: 'catalogue',
    //   action: 'filter-interlinkers',
    //   name: JSON.stringify(filters)
    // });
    _setFilters(filters);
  };
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <StoryBrowseFilter
          loading={loading}
          language={language}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Box>

      <Box sx={{ mt: 6 }}>
        <StoryResults
          loading={loading}
          setLoading={setLoading}
          language={language}
          filters={filters}
          onStoryClick={onStoryClick}
        />
      </Box>
    </>
  );
};

export default StoryBrowse;
