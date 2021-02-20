import {NavTransition, useNavigation} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {TextSpan} from "Component/TextSpan";
import Divider from "@material-ui/core/Divider";

const log = console;

const screenUrl = "/user/";

export function getUserDisplayScreenLink(uuid: string): string{
  return screenUrl + uuid;
}

export function isUserDisplayScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(screenUrl);
}

export function getMappingIdFromPath(path: string): string | undefined{
  return path.match(`${screenUrl}(.*)`)?.[1];
}

export function UserDisplayScreen(){
  return <NavTransition isPath={isUserDisplayScreenPath} title={"Cabbage - user display"}>
    <SmallScreenContainer>
      <UserDisplayContainer/>
    </SmallScreenContainer>
  </NavTransition>
}

function UserDisplayContainer(){
  const nav = useNavigation();

  const uuid = getMappingIdFromPath(nav.currentLocation);
  if( !uuid ){
    return <TextSpan>Unable to parse UUID from browser location bar</TextSpan>;
  }
  
  return <div style={{display: "flex", flexDirection: "column"}}>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      User details
    </Typography>
    <TextSpan>
      UUID - {uuid}
    </TextSpan>
    <Divider style={{paddingTop: "2em"}}>Public details</Divider>
    <TextSpan>
      Display name - [not yet implemented]
    </TextSpan>
    <TextSpan>
      About - [not yet implemented]
    </TextSpan>
    
  </div>
}

