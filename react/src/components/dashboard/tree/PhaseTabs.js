import { AppBar, LinearProgress, Stack, Tab, Tabs as MuiTabs } from "@material-ui/core";
import React from "react";
import { TreeItemTypeChip } from "../assets/Icons";
import { Button } from "@material-ui/core";
import { Add } from '@material-ui/icons';
import TreeItemCreate from "./TreeItemCreate";


const PhaseTabs = ({ t, loading = false, selectedId, phases, onSelect }) => {
    const [treeItemCreatorOpen, setTreeItemCreatorOpen] = React.useState(false);
    const [treeItemLoading, setTreeItemLoading] = React.useState(false);

    const onItemCreate = (res) => {
        
      }

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
                        label={<Stack sx={{ my: 1 }}>
                            {phase.name}
                            {false && <TreeItemTypeChip treeitem={phase} t={t} sx={{ mt: 1 }} />}

                            {/* <CircularProgressWithLabel value={phase.progress} size={40} sx={{ mb: 2 }} />*/}</Stack>}
                        value={phase.id}
                    />
                ))}
                {/* <Button onClick={() => setCoproductionProcessCreatorOpen(true)} sx={{ my: 3, width: 400 }} variant="contained" size="small">{t("Create a new co-production process")}</Button> */}
                <Button onClick={() => setTreeItemCreatorOpen(true)} variant="link" startIcon={<Add />}></Button>
            </MuiTabs>
            {loading && <LinearProgress />}
            <TreeItemCreate
                open={treeItemCreatorOpen}
                setOpen={setTreeItemCreatorOpen}
                loading={treeItemLoading}
                setLoading={setTreeItemLoading}
                onCreate={onItemCreate}
              />
        </AppBar>
    );
};

export default PhaseTabs