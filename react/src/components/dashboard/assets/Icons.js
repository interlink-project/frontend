import {
    Chip,
    IconButton
} from '@material-ui/core';
import { Check, Loop } from '@material-ui/icons';
import i18n from 'translations/i18n';

export const InProgressIcon = () => <Loop fontSize="small" sx={{ color: "#f0ad4e" }} />

export const FinishedIcon = () => <Check fontSize="small" sx={{ color: "#22bb33" }} />

export const InProgressIconButton = ({ onClick }) => <IconButton size="small" onClick={onClick}>
    <InProgressIcon />
</IconButton>

export const FinishedIconButton = ({ onClick }) => <IconButton size="small" onClick={onClick}>
    <FinishedIcon />
</IconButton>


export const statusText = (status) => status === "finished" ? "Finished" : status === "in_progress" ? i18n.t("In progress") : i18n.t("Awaiting")

export const statusIcon = (status) => status === "finished" ? <FinishedIcon /> : status === "in_progress" && <InProgressIcon />


export const OfficialityChip = ({ officiality = "official" }) => {
    let label = ""
    let color = ""
    switch (officiality) {
        case 'official':
            label = i18n.t("Official")
            color = "success"
            break;

        case 'community':
            label = i18n.t("Community")
            color = "warning"
            break;
    }

    return <Chip label={label} color={color} size="small" />
}


export const NatureChip = ({ interlinker }) => {
    let label = ""
    let color = ""
    if (interlinker.nature === 'softwareinterlinker') {
        label = i18n.t("Internal software")
        color = "primary"

    } else if (interlinker.nature === 'knowledgeinterlinker') {
        label = i18n.t("Internal knowledge")
        color = "secondary"
    }
    else if (interlinker.nature === 'externalsoftwareinterlinker') {
        label = i18n.t("External software")
        color = "success"
    }
    else if (interlinker.nature === 'externalknowledgeinterlinker') {
        label = i18n.t("External knowledge")
        color = "warning"
    }

    return <Chip label={label} color={color} size="small" />
}