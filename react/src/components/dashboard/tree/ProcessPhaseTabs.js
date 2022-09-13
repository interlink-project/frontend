import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTree } from "slices/process";
import PhaseTabs from "./PhaseTabs";
import TreeItemCreate from "./TreeItemCreate";


const ProcessPhaseTabs = ({ t, loading = false, selectedId, phases, onSelect }) => {
    const [treeItemCreatorOpen, setTreeItemCreatorOpen] = React.useState(false);
    const [treeItemLoading, setTreeItemLoading] = React.useState(false);
    const dispatch = useDispatch();
    const { selectedTreeItem, process } = useSelector((state) => state.process);

    const onItemCreate = (res) => {
        dispatch(getTree(process.id, selectedTreeItem.id));
    }

    return (
        <>
            <PhaseTabs t={t} loading={loading} selectedId={selectedId} phases={phases} onSelect={onSelect} extra={<>
                <Button onClick={() => setTreeItemCreatorOpen(true)} variant="link" startIcon={<Add />}></Button>
                <TreeItemCreate
                    open={treeItemCreatorOpen}
                    setOpen={setTreeItemCreatorOpen}
                    loading={treeItemLoading}
                    setLoading={setTreeItemLoading}
                    onCreate={onItemCreate}
                />
            </>} />

        </>
    );
};

export default ProcessPhaseTabs;