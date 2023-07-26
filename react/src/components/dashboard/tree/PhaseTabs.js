import { AppBar, LinearProgress, Stack, Tab, Tabs as MuiTabs } from "@mui/material";
import { TreeItemTypeChip } from "components/Icons";


const PhaseTabs = ({ t, loading = false, selectedId, phases, onSelect, extra = null }) => {
    return (
        <AppBar position="static" 
            sx={{
                    color:'white'
                }}
             >
            <MuiTabs
                indicatorColor="secondary"
                onChange={(event, value) => onSelect(value)}
                value={selectedId || phases[0].id}
                // centered
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                textColor="inherit"
                aria-label="Coproduction phases tabs"

                sx={{
                    '& .Mui-selected': {
                    background: '#a4cbd8',
                    color:'black',
                    },
                    '& .MuiTabs-flexContainer': {
                        'justify-content': 'center',
                 
                    }
                }}

            >
                {phases.map((phase) => !phase.is_disabled && (
                    <Tab
                        key={phase.id}
                        label={<Stack sx={{ my: 1 }}>
                            {phase.name}
                            {false && <TreeItemTypeChip treeitem={phase} t={t} sx={{ mt: 1 }} />}

                            {/* <CircularProgressWithLabel value={phase.progress} size={40} sx={{ mb: 2 }} />*/}</Stack>}
                        value={phase.id}
                    />
                ))}
                {extra}
            </MuiTabs>
            {loading && <LinearProgress />}
        </AppBar>
    );
};

export default PhaseTabs;