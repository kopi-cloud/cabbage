import React from "react";
import {SmallScreenContainer} from "Design/Screen";
import Typography from "@mui/material/Typography";
import {LinearProgress} from "@mui/material";

export function SmallScreenSpinner({message}: {
  message: string | React.ReactNode
}){
  return <SmallScreenContainer center>
    <Typography paragraph>
      {message}
    </Typography>
    <CompactLinearProgress isLoading style={{width: "100%"}}/>
  </SmallScreenContainer>
}

export function CompactLinearProgress(props: {
  isLoading?: boolean,
  color?: "primary"|"secondary"
  style?: React.CSSProperties,
}){
  const {isLoading} = props;
  const style: React.CSSProperties = {...props.style, height: "2px"};

  /* placeholder that stops the screen content underneath the progress bar
  from "jumping" as indicator is toggled.
  Should change this to the overlay style from button, one day.
   */
  if( !isLoading ){
    return <div style={style} />;
  }

  return <LinearProgress variant="indeterminate"
    color={props.color} style={style} />
}