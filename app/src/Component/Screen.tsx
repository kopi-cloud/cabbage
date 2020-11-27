import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import {
  Paper,
  Theme, useMediaQuery
} from "@material-ui/core";
import {DialogTitleProps} from "@material-ui/core/DialogTitle";

const maxScreenWidth = 1024;

function mainLayoutBreakpoints(theme: Theme, width: number){
  return {
    [theme.breakpoints.up(width + (theme.spacing(2) * 2))]: {
      width: width,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  }
}

const useLargeScreenStyle = makeStyles(theme =>({
  mainLayout: {
    width: 'auto',
    ...mainLayoutBreakpoints(theme, maxScreenWidth),
    marginTop: ".5em"
  },
}));

export function LargeScreenContainer(props: {
  children:React.ReactNode,
}) {
  const classes = useLargeScreenStyle();
  return <main className={classes.mainLayout}>
    {props.children}
  </main>
}

function paperBreakpoints(theme: Theme, width: number){
  return {
    [theme.breakpoints.up(width + (theme.spacing(3) * 2))]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    }
  }
}

const useSmallScreenStyle = makeStyles(theme =>({
  mainLayout: {
    width: 'auto',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    ...mainLayoutBreakpoints(theme, 600),
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    ...paperBreakpoints(theme, 600),
  },
  centerPaper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    ...paperBreakpoints(theme, 600),
    textAlign: "center",
  }
}));

export function SmallScreenContainer(props: {
  children:React.ReactNode,
  center?: boolean,
}) {
  const style = useSmallScreenStyle();
  return <main className={style.mainLayout}>
    <Paper className={props.center ? style.centerPaper : style.paper}>
      {props.children}
    </Paper>
  </main>
}

export function useFullScreenDialog():boolean{
  // 960 is the "md" breakpoint, the old withMobileDialog defaulted to "sm",
  // which meant the dialog was fullscreen until view size hit the "next"
  // breakpoint after "sm" (i.e. "md")
  return useMediaQuery('(max-width:960px)', {noSsr: true});
}

/** Using these props allows you to supply the content of the dialog title
 * as a two elements, the flex spacing will put the first element (the title)
 * on the left, and the second element (close button) on the right.
 * Remember if you want to override any of these, the override must come *after*
 * the spreaD of these properties.
 */
export const dialogTitleWithCloseButtonProps = {
  disableTypography: true,
  style: {
    padding: ".5em",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
} as DialogTitleProps;
