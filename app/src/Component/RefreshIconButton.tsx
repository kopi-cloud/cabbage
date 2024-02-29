// import makeStyles from '@mui/styles/makeStyles';
import React, {EventHandler, SyntheticEvent} from "react";
import {stopClick} from "Util/EventUtil";
import {IconButton, keyframes} from "@mui/material";
import {Refresh} from "@mui/icons-material";
import { analytics } from "segment";


const spin = keyframes({
  // these used to have `scale(1)` too, but not sure why
  from: {transform: 'rotate(0deg);'},
  to: {transform: 'rotate(360deg);'},
});

export function RefreshIconButton(props:{
  disabled?: boolean,
  refreshing?: boolean,
  onClick?: EventHandler<SyntheticEvent>,
}){
  const handleOnClick = (event: SyntheticEvent)=>{
    stopClick(event);
    props.onClick?.(event);
    analytics.track({
      event: "Refresh Clicked",
      properties: {
        refreshing: props.refreshing
      },
      type: "track"
    })
  };

  let isDisabled = props.disabled;
  if( props.disabled === undefined || props.disabled == null ){
    isDisabled = props.refreshing;
  }
  
  return <IconButton href="#" size="large" 
    disabled={isDisabled} onClick={handleOnClick} 
  >
    <Refresh sx={{
      animation: props.refreshing ? `${spin} 2s infinite linear` : undefined
    }}/>
  </IconButton>;
}
