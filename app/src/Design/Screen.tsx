import * as React from "react";
import {
  Paper,
  useMediaQuery
} from "@mui/material";
import {DialogTitleProps} from "@mui/material/DialogTitle";
import {styled, Theme} from '@mui/system';

export const largeContainerWidth = 1024;
export const smallContainerWidth = 600;

function mainLayoutBreakpoints(theme: Theme, width: number){
  return {
    [theme.breakpoints.up(width)]: {
      width: width,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  }
}

const LargeScreenStyledMain = styled('main')(({theme}) => ({
  width: 'auto',
  marginTop: ".5em",
  ...mainLayoutBreakpoints(theme, largeContainerWidth)
}));

export function LargeScreenContainer(props: {
  children: React.ReactNode,
}){
  return <LargeScreenStyledMain>
    {props.children}
  </LargeScreenStyledMain>
}

function paperBreakpoints(theme: Theme, width: number){
  return {
    [theme.breakpoints.up(width)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    }
  }
}

const SmallScreenStyledMain = styled('main')(({theme}) => ({
    width: 'auto',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    ...mainLayoutBreakpoints(theme, smallContainerWidth),
}));

const SmallScreenStyledPaper = styled(Paper)(({theme}) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  ...paperBreakpoints(theme, smallContainerWidth),
}));

export function SmallScreenContainer(props: {
  children: React.ReactNode,
  center?: boolean,
}){
  return <SmallScreenStyledMain>
    <SmallScreenStyledPaper style={props.center ? {textAlign: "center"} : {}}>
      {props.children}
    </SmallScreenStyledPaper>
  </SmallScreenStyledMain>
}

export function useFullScreenDialog(): boolean{
  // 960 is the "md" breakpoint, the old withMobileDialog defaulted to "sm",
  // which meant the dialog was fullscreen until view size hit the "next"
  // breakpoint after "sm" (i.e. "md")
  return useMediaQuery('(max-width:960px)', {noSsr: true});
}

/** Using these props allows you to supply the content of the dialog title
 * as a two elements, the flex spacing will put the first element (the title)
 * on the left, and the second element (close button) on the right.
 * Remember if you want to override any of these, the override must come *after*
 * the spread of these properties.
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
