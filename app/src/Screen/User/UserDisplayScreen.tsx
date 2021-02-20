import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {TextSpan} from "Component/TextSpan";

const log = console;

const userUrl = "/user-view/";

export function getUserDisplayScreenLink(userId: string): string{
  return userUrl + "/" + userId;
}

export function isUserDisplayScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(userUrl);
}

export function UserDisplayScreen(){
  return <NavTransition isPath={isUserDisplayScreenPath} title={"Cabbage - user display"}>
    <SmallScreenContainer>
      <UserDisplayContainer/>
    </SmallScreenContainer>
  </NavTransition>
}

function UserDisplayContainer(){
  return <div style={{display: "flex", flexDirection: "column"}}>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      User details
    </Typography>
    <TextSpan>
      User display details here
    </TextSpan>
  </div>
}

