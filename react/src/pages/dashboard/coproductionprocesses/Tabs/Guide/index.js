import { Box, Grid } from '@mui/material';
import RightSide from 'components/dashboard/coproductionprocesses/RightSide';
import { StyledTree } from 'components/dashboard/tree';
import ProcessPhaseTabs from 'components/dashboard/tree/ProcessPhaseTabs';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { softwareInterlinkersApi } from '__api__';
import SettingsTab from '../Settings';

const Guide = ({ setSelectedTreeItem }) => {
  const mounted = useMounted();
  const [softwareInterlinkers, setSoftwareInterlinkers] = useState([]);
  const { process, tree, hasSchema, treeitems, selectedPhaseTab, selectedTreeItem, updatingTree } = useSelector((state) => state.process);
  const t = useCustomTranslation(process.language);
  const [showCoprod, setShowCoprod] = useState(false);
  const navigate = useNavigate()

  if(!hasSchema){
    navigate(`/dashboard/coproductionprocesses/${process.id}`)
    return null
  }

  useEffect(() => {
    softwareInterlinkersApi.getMulti({}, process.language).then((res) => {
      if (mounted.current) {
        setSoftwareInterlinkers(res.items);
      }
    });
  }, []);

  const setNewPhaseTab = (value) => {
    if (mounted.current) {
      console.log(value);
      if (value !== 'coproductionprocess') {
        const treeitem = treeitems.find((el) => el.id === value);
        setShowCoprod(false);
        setSelectedTreeItem(treeitem);
      } else {
        setShowCoprod(true);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Grid container>
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          xs={12}
        >
          <ProcessPhaseTabs
            t={t}
            loading={updatingTree}
            selectedId={showCoprod ? 'coproductionprocess' : selectedPhaseTab.id}
            phases={tree}
            onSelect={setNewPhaseTab}
          />
        </Grid>
        {showCoprod ? (
          <>
            <SettingsTab />
          </>
        ) : (
          <>
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              xs={12}
            >
              <StyledTree
                language={process.language}
                parent={selectedPhaseTab}
                selectedTreeItem={selectedTreeItem}
                setSelectedTreeItem={setSelectedTreeItem}
                showIcon
              />
            </Grid>
            <RightSide softwareInterlinkers={softwareInterlinkers} />
          </>
        )}
      </Grid>

    </Box>
  );
};

export default Guide;
