import {
  Avatar,
  AvatarGroup,
  Chip,
  Paper,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  Check,
  KeyboardArrowDown,
  KeyboardArrowUp,
  People,
} from "@mui/icons-material";
import UserAvatar from "components/UserAvatar";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";

function OrganizationRow({ organization, collapseElement }) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <TableRow
        hover={!open}
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
        onClick={() => {
          setOpen(!open);
        }}
        data-cy={`org-row-${organization?.name}`}
      >
        <TableCell align="center" component="th" scope="row">
          <Stack alignItems="center" direction="row" spacing={1}>
            {organization.logotype_link ? (
              <Avatar
                sx={{ height: "25px", width: "25px" }}
                variant="rounded"
                src={organization.logotype_link}
              />
            ) : (
              <People />
            )}
            <b data-cy={`org-name-${organization?.name}`}>
              {organization.name}
            </b>
          </Stack>
        </TableCell>
        <TableCell
          align="center"
          component="th"
          scope="row"
          data-cy={`org-public${organization?.name}`}
        >
          {organization.public && <Check />}
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <AvatarGroup
            data-cy={`org-admin-len-${organization?.administrators?.length}`}
          >
            {organization.administrators.map((admin) => (
              <UserAvatar
                key={admin.id}
                sx={{ width: 30, height: 30 }}
                user={admin}
              />
            ))}
          </AvatarGroup>
        </TableCell>
        <TableCell
          align="center"
          data-cy={`org-createdDate-${organization?.created_at}`}
        >
          {moment(organization.created_at).fromNow()}
        </TableCell>
        <TableCell
          align="center"
          data-cy={`org-team-length-${organization?.teams_ids?.length}`}
        >
          {organization.teams_ids.length}
        </TableCell>
        <TableCell align="center">
          {organization.current_user_participation.length > 0 ? (
            organization.current_user_participation.map((p) => (
              <Chip
                size="small"
                sx={{ ml: 1 }}
                key={organization.id + p}
                variant={p === "administrator" ? "contained" : "outlined"}
                label={p}
                data-cy={`org-participation-${p}`}
              />
            ))
          ) : (
            <Chip label={t("None")} />
          )}
        </TableCell>
        <TableCell align="center">
          {open ? (
            <KeyboardArrowUp data-cy={`Close-${organization.name}`} />
          ) : (
            <KeyboardArrowDown data-cy={`Open-${organization.name}`} />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            border: 0,
            paddingTop: !open && 0,
            paddingBottom: !open && 0,
          }}
          sx={{ bgcolor: "background.default" }}
          colSpan={7}
        >
          <Paper>{open && collapseElement}</Paper>
        </TableCell>
      </TableRow>
    </>
  );
}

export default OrganizationRow;
