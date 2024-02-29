import React from "react";
import {ButtonProps, Link as MuiLink, LinkProps} from "@mui/material";
import {useNavigation} from "Design/NavigationProvider";
import {stopClick} from "Util/EventUtil";
import Button from "@mui/material/Button";
import { analytics } from "segment";

/** Just for convenience so caller doesn't need to inject nav,
 * duplicate href and weird typing of mui Link.
 */
export function Link({href, children, ...props}:{
  href:string,
  children: React.ReactNode
} & LinkProps){
  const nav = useNavigation();
  return <MuiLink {...props} 
    href={href}
    // have to define type with using m-ui Link, no idea why
    onClick={(e:React.SyntheticEvent)=>{
      stopClick(e);
      nav.navigateTo(href, e);
      analytics.track({
        event: "Link Clicked",
        properties: {
          href,
          text: children
        },
        type: "track"
      })
    }}
  >
    {children}
  </MuiLink>
}

export function NavButton({href, children, ...buttonProps}:{
  href:string,
  children: React.ReactNode
} & ButtonProps ){
  const nav = useNavigation();
  return <Button {...buttonProps} variant="text"
    style={{...buttonProps.style, textTransform: "none"}}
    onClick={(e)=>{
      stopClick(e);
      nav.navigateTo(href, e);
      analytics.track({
        event: "Button Clicked",
        properties: {
          href,
          text: children
        },
        type: "track"
      })
    }}
  >
    {children}
  </Button>
}