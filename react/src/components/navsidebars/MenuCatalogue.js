import * as React from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import i18n from "translations/i18n";

import {
  ExpandMore,

} from "@mui/icons-material";

export default function MenuCatalogue({ page = {} }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const listSubMenus = [
    
    {
      id: "interlinkers",
      label: i18n.t("Interlinkers"),
      path: "/dashboard/interlinkers",
      dataCy: "Catalogue-page",
    },
    
    {
      id: "processes",
      label: i18n.t("Processes"),
      path: "/publiccoproductions",
      dataCy: "PublicCoproductions-page",
    }
  ];


  return (
    <div>
         <Button
            key={page.id}
            sx={{ ml: 2, ...(page.sx || {}) }}
            //component={RouterLink}
            //to={page.path}
            color="inherit"
            variant={
              window.location.pathname === page.path ? "outlined" : "text"
            }
            data-cy={page?.dataCy}
            disabled={page.disabled}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Typography textAlign="center" variant="button">
              {page.label}
            </Typography>
            <ExpandMore />
          </Button>

         
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {listSubMenus.map((subPage) => (
              <MenuItem
                key={subPage.id}
                component={RouterLink}
                to={subPage.path}
                onClick={handleClose}
              >
                {subPage.label}
              </MenuItem>
            ))}
           
          </Menu>
    </div>
  );
}
