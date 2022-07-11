import { AppBar, LinearProgress, Stack, Tab, Tabs as MuiTabs } from "@material-ui/core";
import React from "react";
import { TreeItemTypeChip } from "../assets/Icons";

const PhaseTabs = ({ t, loading = false, selectedId, phases, onSelect }) => {
    return (
        <AppBar position="static" sx={{ color: "white" }}>
            <MuiTabs
                indicatorColor="secondary"
                onChange={(event, value) => onSelect(value)}
                value={selectedId || phases[0].id}
                centered

                textColor="inherit"
                aria-label="Coproduction phases tabs"
            >
                {phases.map((phase) => !phase.is_disabled && (
                    <Tab
                        key={phase.id}
                        label={<Stack sx={{my: 1}}>
                        {phase.name}
                        {false && <TreeItemTypeChip treeitem={phase} t={t} sx={{mt: 1}} />}
                        
                            {/* <CircularProgressWithLabel value={phase.progress} size={40} sx={{ mb: 2 }} />*/}</Stack>}
                        value={phase.id}
                    />
                ))}
            </MuiTabs>
            {loading && <LinearProgress />}
        </AppBar>
    );
};

export default PhaseTabs