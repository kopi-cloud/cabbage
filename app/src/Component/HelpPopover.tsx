import * as React from "react";
import {ReactNode} from "react";
import {IconButton, Popover} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Help} from "@material-ui/icons";

export function HelpPopover(props: { content: ReactNode }){
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState(undefined as
    undefined | HTMLElement);

  return <>
    <IconButton color="inherit" onClick={(e) => {
      setOpen(true);
      setAnchor(e.currentTarget);
    }}>
      <Help/>
    </IconButton>
    <Popover
      id="help-popover"
      open={open}
      anchorEl={anchor}
      onClose={() => {
        setOpen(false);
        setAnchor(undefined);
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Typography style={{
        padding: "1em",
        // was ugly on desktop because it spanned the whole window
        maxWidth: "30em",
      }}>
        {props.content}
      </Typography>
    </Popover>
  </>
}