import * as React from "react"
import {CSSProperties} from "react"

import {Link, Paper} from "@material-ui/core";
import {TextSpan} from "Component/TextSpan";
import {
  ErrorInfo,
  isErrorInfo,
} from "Error/ErrorUtil";
import {useOpenErrorDialog} from "Error/ErrorDialog";
import {safeStringify} from "Util/ObjectUtil";
import {isNonEmptyArrayOfStrings} from "Util/TypeUtil";

const log = console;

/** This component is intended to be displayed "inline" on a screen;
 ideally next to or in place of the UI element that triggered the error.
 The link to error screen allows the user to inspect the error in more
 detail without disrupting the layout/state of the originating screen.
 If desired, you can use ErrorInfo.message to pass custom JSX
 but the primary purpose of this class is to be simple and compact, if
 you are tempted to get fancy with the rendering of this component so that it
 works with your layout - consider using your own component.  If you change
 how this component renders, you should go check every single place it's used
 to make sure it still looks right.
 The error property is declared optional so that callers can use the component
 without having to surround it with a conditional, if you pass no error
 nothing will be rendered.
 The temptation will arise to re-define the error prop like "ErrorInfo|any"
 so your calling component can declare its state as "ErrorInfo|CustomResult".
 Don't do that - use separate state for "last error" and "last result",
 it gives you more flexibility with regard to deciding what to show when
 instead of having that dictated by what the current content of your
 state variable happens to be.
 If you really want a single piece of state, go define a separate component
 that works as a wrapper HOC using conditional types or something.
 */
export function CompactErrorPanel(props:{
  /** can pass anything, but this component only displays something if  the
   * error is an ErrorInfo */
  error?: any;
  nolinkToErrorScreen?: boolean;
  border?: "redline" | "paper" | "h-pad";
}){

  if( !props.error ){
    return null;
  }

  if( !isErrorInfo(props.error) ){
    return null;
  }

  if( React.isValidElement(props.error.message) ){
    log.debug("error panel, error.message is a react element", props.error);
  }
  else {
    // can't use JSON.stringify in case error is a react component or the
    // actual error itself is problematic (circular references, etc.)
    log.debug("compact error panel rendered for",
      safeStringify(props.error) );
  }

  let message = props.error.message;
  if( !message ){
    // shouldn't happen, but we're in the land of errors now - trust nothing
    message = "unknown error";
  }

  let {border, nolinkToErrorScreen} = props;

  let linkToErrorScreen = true;
  let detailsErrorContent = <TextSpan>
    {message}
  </TextSpan>;

  if( isNonEmptyArrayOfStrings(props.error.problem) ){
    detailsErrorContent = <TextSpan>
      {props.error.problem.map((i, index)=>
        <React.Fragment key={index}>{i}&nbsp;</React.Fragment>
      )}
    </TextSpan>;
  }

  if( nolinkToErrorScreen ){
    linkToErrorScreen = false;
  }

  // wrap content in link
  if( linkToErrorScreen ){
    detailsErrorContent = <ErrorLink error={props.error}>
      {detailsErrorContent}
    </ErrorLink>;
  }

  let compactPanel = <span id="compactMessage">
    {detailsErrorContent}
  </span>;

  if( border === "redline" ){
    compactPanel = <span style={{...RedBorderStyle}}>{compactPanel}</span>
  }
  else if( border === "paper" ){
    compactPanel = <Paper style={{padding: ".5em"}}>{compactPanel}</Paper>;
  }
  else if( border === "h-pad" ){
    compactPanel = <span style={{...HPadBorderStyle}}>{compactPanel}</span>
  }

  return compactPanel;
}

function ErrorLink(props: {
  error: ErrorInfo, children: React.ReactNode,
}){
  const handleError = useOpenErrorDialog();
  return <Link onClick={() =>{
    handleError({type: "handleError", error: props.error})
  }}>
    {props.children}
  </Link>
}


export const RedBorderStyle: CSSProperties = {
  border: "solid red 1px", borderRadius: ".25em",
  marginBottom: ".25em"
};

export const HPadBorderStyle: CSSProperties = {
  paddingLeft: "1em", paddingRight: "1em"
};

