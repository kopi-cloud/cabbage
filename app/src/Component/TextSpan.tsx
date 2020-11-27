import * as React from "react";
import {Typography} from "@material-ui/core";
import {TypographyProps} from "@material-ui/core/Typography";

export function TextSpan(
  props: TypographyProps
){
  return <Typography {...props} component="span">
    {props.children}
  </Typography>
}


