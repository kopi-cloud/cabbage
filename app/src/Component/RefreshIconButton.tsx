import makeStyles from "@material-ui/core/styles/makeStyles";
import React, {EventHandler, SyntheticEvent} from "react";
import {stopClick} from "Util/EventUtil";
import {IconButton} from "@material-ui/core";
import {Refresh} from "@material-ui/icons";

const useRefreshStyle = makeStyles({
  '@keyframes spin': {
    from: { transform: 'scale(1) rotate(0deg);' },
    to: { transform: 'scale(1) rotate(360deg);' },
  },
  refreshSpin: {
    animation: '$spin 2s infinite linear',
    opacity: 0.6,
  }
});

export function RefreshIconButton(props:{
  disabled?: boolean,
  refreshing?: boolean,
  onClick?: EventHandler<SyntheticEvent>,
}){
  const style = useRefreshStyle();
  const handleOnClick = (event: SyntheticEvent)=>{
    stopClick(event);
    props.onClick?.(event);
  };

  let isDisabled = props.disabled;
  if( props.disabled === undefined || props.disabled == null ){
    isDisabled = props.refreshing;
  }
  return <IconButton href="#" disabled={isDisabled}
    onClick={handleOnClick}>
    <Refresh className={props.refreshing ? style.refreshSpin : undefined}/>
  </IconButton>
}
