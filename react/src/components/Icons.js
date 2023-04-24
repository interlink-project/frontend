import { Chip, IconButton } from "@mui/material";
import { AccessTime, Check, Done, Loop, Warning } from "@mui/icons-material";

export const InProgressIcon = () => (
  <Loop fontSize="small" sx={{ color: statusColor("in_progress") }} />
);

export const FinishedIcon = () => (
  <Check fontSize="small" sx={{ color: statusColor("finished") }} />
);

export const AwaitingIcon = () => (
  <AccessTime fontSize="small" sx={{ color: statusColor("awaiting") }} />
);

export const WarningIcon = () => (
  <Warning fontSize="small" sx={{ color: "#f0ad4e" }} />
);

export const DoneIcon = () => (
  <Done fontSize="small" sx={{ color: "#4caf50" }} />
);

export const InProgressIconButton = ({ onClick }) => (
  <IconButton size="small" onClick={onClick}>
    <InProgressIcon />
  </IconButton>
);

export const FinishedIconButton = ({ onClick }) => (
  <IconButton size="small" onClick={onClick}>
    <FinishedIcon />
  </IconButton>
);

export const StatusText = ({ status, t }) => (
  <>
    {status === "finished"
      ? t("Finished")
      : status === "in_progress"
      ? t("In progress")
      : t("Awaiting")}
  </>
);

export const statusIcon = (status) =>
  status === "finished" ? (
    <FinishedIcon />
  ) : status === "in_progress" ? (
    <InProgressIcon />
  ) : null;

export const statusColor = (status) =>
  status === "finished"
    ? "#22bb33"
    : status === "in_progress"
    ? "#f0ad4e"
    : "#Oda2ff";

export const OfficialityChip = ({ officiality = "official", t }) => {
  let label = "";
  let color = "";

  switch (officiality) {
    case "official":
      label = t("Official");
      color = "success";
      break;

    case "community":
      label = t("Community");
      color = "warning";
      break;
  }

  return <Chip label={label} color={color} size="small" />;
};

export const StatusChip = ({ status, t }) => {
  let label = t("Awaiting");
  let color = "primary";
  switch (status) {
    case "awaiting":
      label = t("Awaiting");
      color = "default";
      break;

    case "in_progress":
      label = t("In progress");
      color = "warning";
      break;

    case "finished":
      label = t("Finished");
      color = "primary";
      break;

    default:
      label = status;
      color = "default";
  }

  return <Chip label={label} color={color} size="small" />;
};

export const OrganizationChip = ({ type, t, dataCy = null }) => {
  let label = "";
  let color = "";
  switch (type) {
    case "citizen":
      label = t("Citizens");
      color = "success";
      break;

    case "public_administration":
      label = t("Public administration");
      color = "warning";
      break;

    case "nonprofit_organization":
      label = t("Non profit organization");
      color = "primary";
      break;

    case "forprofit_organization":
      label = t("For profit organization");
      color = "secondary";
      break;

    case "administrator":
      label = t("Administrator");
      color = "primary";
      break;
    default:
      label = t("Unknown");
      color = "secondary";
      break;
  }

  return <Chip label={label} color={color} size="small" data-cy={dataCy} />;
};

export const NatureChip = ({ interlinker, t }) => {
  let label = "";
  let color = "";
  if (interlinker.nature === "softwareinterlinker") {
    label = t("Internal software");
    color = "primary";
  } else if (interlinker.nature === "knowledgeinterlinker") {
    label = t("Internal knowledge");
    color = "secondary";
  } else if (interlinker.nature === "externalsoftwareinterlinker") {
    label = t("External software");
    color = "success";
  } else if (interlinker.nature === "externalknowledgeinterlinker") {
    label = t("External knowledge");
    color = "warning";
  }

  return <Chip label={label} color={color} size="small" />;
};

export const TreeItemTypeChip = ({ treeitem, sx = null, t }) => {
  let label = "";
  let color = "";
  if (treeitem.type === "phase") {
    label = t("Phase");
    color = "secondary";
  } else if (treeitem.type === "objective") {
    label = t("Objective");
    color = "primary";
  } else if (treeitem.type === "task") {
    label = t("Task");
    color = "default";
  } else {
    label = t("Unknown");
    color = "default";
  }
  return <Chip label={label} sx={sx} color={color} size="small" />;
};
