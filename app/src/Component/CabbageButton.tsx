import {ErrorInfo} from "Error/ErrorUtil";
import {ButtonProps} from "@material-ui/core";
import React from "react";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {CSSProperties} from "@material-ui/core/styles/withStyles";


export const primaryButtonProps : ButtonProps = {
  variant:"contained", color:"primary",
  style:{textTransform: "none"},
};

export const secondaryButtonProps : ButtonProps = {
  variant:"outlined", color:"primary",
  style:{textTransform: "none"},
};

export const primaryLinearStyle : CSSProperties = {
  /* this "overlays" the progress bar without taking up vertical space,
  so that the content doesn't "jump" when toggling the progress state  */
  position: "absolute",

  /* make it small and a bit up from bottom, using px to avoid any weird
  rounding / fuzziness issues. */
  height: "2px", bottom: "5px",

  // center the progress bar
  width: "80%", marginLeft: "10%",
};

export function PrimaryButton({ isLoading, error, ...buttonProps }:
  { isLoading?: boolean, error?: ErrorInfo} & ButtonProps
){
  return <>
    {/*for the absolute positioning of linearProgress*/}
    <div style={{position: "relative",}}>
      <Button {...primaryButtonProps} {...buttonProps}
        style={{...primaryButtonProps.style}}
      />
      { isLoading &&
        <LinearProgress style={{...primaryLinearStyle}}/>
      }
    </div>
    <CompactErrorPanel error={error} border={"h-pad"}/>
  </>
}

export function SecondaryButton({ isLoading, error, ...buttonProps }:
  { isLoading?: boolean, error?: ErrorInfo} & ButtonProps
){
  return <>
    {/*for the absolute positioning of linearProgress*/}
    <div style={{position: "relative",}}>
      <Button {...secondaryButtonProps} {...buttonProps}
        style={{...secondaryButtonProps.style}}
      />
      { isLoading &&
        <LinearProgress style={{...primaryLinearStyle}}/>
      }
    </div>
    <CompactErrorPanel error={error} border={"h-pad"}/>
  </>
}
