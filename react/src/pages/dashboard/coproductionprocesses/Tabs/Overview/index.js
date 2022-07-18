import { AppBar, Box, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { AccountTree, OpenInNew } from '@material-ui/icons';
import { AssetsTable } from 'components/dashboard/assets';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useMounted from 'hooks/useMounted';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setSelectedTreeItemById } from 'slices/process';
import { coproductionProcessesApi } from '__api__';
import TimeLine from 'components/dashboard/coproductionprocesses/TimeLine';


export default function Overview({ }) {
    const { process, isAdministrator, tree } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language)
    const [tab, setTab] = useState(isAdministrator ? "progress" : "assets")
    const [loading, setLoading] = React.useState(true)
    const [assets, setAssets] = React.useState([])
    const mounted = useMounted()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    React.useEffect(() => {
        setLoading(true)
        coproductionProcessesApi.getAssets(process.id).then(res => {
            if (mounted.current) {
                setAssets(res)
                setLoading(false)
            }
        })
    }, [process])

    const getAssetsActions = (asset) => {
        const actions = []
        actions.push({
            id: `${asset.id}-open-action`,
            onClick: (closeMenuItem) => {
                window.open(asset.link + "/view", "_blank")
                closeMenuItem()
            },
            text: t("Open"),
            icon: <OpenInNew fontSize="small" />
        })
        actions.push({
            id: `${asset.id}-open-task-action`,
            onClick: (closeMenuItem) => {
                dispatch(setSelectedTreeItemById(asset.task_id, () => {
                    navigate(`/dashboard/coproductionprocesses/${process.id}/guide`);
                }))
            },
            text: t("Go to the task"),
            icon: <AccountTree fontSize="small" />
        })
        return actions
    }

    if (!process || !tree) {
        return
    }

    return <Box sx={{ pb: 3, justifyContent: "center" }}>

        <AppBar sx={{ position: 'relative' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                {t("Coproduction process overview")}
            </Typography>
        </AppBar>
        {isAdministrator && <Paper sx={{ bgcolor: "background.default" }}>
            <Tabs
                value={tab}
                onChange={(event, newValue) => {
                    setTab(newValue);
                }}
                aria-label="overview-tabs"
                centered
            >
                <Tab value="progress" label={t("Progress")} />
                <Tab value="assets" label={t("Resources") + " (" + (loading ? "..." : assets.length) + ")"} />
            </Tabs>
        </Paper>}
        {tab === "progress" ?
            <TimeLine />
            :
            <Box sx={{ p: 3, justifyContent: "center" }}>
                <AssetsTable language={process.language} loading={loading} assets={assets} getActions={getAssetsActions} />
            </Box>
        }
    </Box>
}