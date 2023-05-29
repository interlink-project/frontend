import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Box } from '@mui/material';

import { useState } from 'react';
import { getLanguage } from 'translations/i18n';
import PublicCoproductionBrowseFilter from './PublicCoproductionBrowseFilter';
import PublicCoproductionResults from './PublicCoproductionResults';

const initialDefaultFilters = {

  //problemprofiles: [],
  //nature: ['softwareinterlinker', 'knowledgeinterlinker', 'externalsoftwareinterlinker', 'externalknowledgeinterlinker'],
  keyword: ['childcare'],
  
  rating: null,
};
   // const initialDefaultFilters = {};

const PublicCoproductionBrowse = ({ language = getLanguage(), initialFilters = {}, onPublicCoproductionClick }) => {
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
        <PublicCoproductionBrowseFilter
          loading={loading}
          language={language}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Box>

      <Box sx={{ mt: 6 }}>
        <PublicCoproductionResults
          loading={loading}
          setLoading={setLoading}
          language={language}
          filters={filters}
          onPublicCoproductionClick={onPublicCoproductionClick}
        />
      </Box>
    </>
  );
};

export default PublicCoproductionBrowse;
