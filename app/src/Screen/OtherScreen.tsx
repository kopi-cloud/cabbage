import {useSupabase} from "Api/SupabaseProvider";
import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React from "react";

const log = console;

const otherUrl = "/other";

export function getOtherScreenLink(): string{
  return otherUrl;
}

export function isOtherScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(otherUrl);
}

export function OtherScreen(){
  const {session, user} = useSupabase();

  return <NavTransition isPath={isOtherScreenPath} title={"Cabbage - other"}>
    <SmallScreenContainer>
      <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
        Other stuff
      </Typography>
      <Typography paragraph>
        This screen is just a placeholder because I needed 2
        authenticated screens.
      </Typography>
    </SmallScreenContainer>
  </NavTransition>
}


