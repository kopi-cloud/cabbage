import React from "react";
import {Link as MuiLink} from "@material-ui/core";
import {useNavigation} from "Navigation/NavigationProvider";
import {stopClick} from "Util/EventUtil";

/** Just for convenience so caller doesn't need to inject nav,
 * duplicate href and weird typing of mui Link.
 */
export function Link({href, children}:{
  href:string,
  children: React.ReactNode
}){
  const nav = useNavigation();
  return <MuiLink href={href}
    // have to define type with using m-ui Link, no idea why
    onClick={(e:React.SyntheticEvent)=>{
      stopClick(e);
      nav.navigateTo(e, href);
    }}
  >
    {children}
  </MuiLink>
}