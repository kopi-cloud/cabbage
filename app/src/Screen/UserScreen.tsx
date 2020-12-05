import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {useSupabase} from "Api/SupabaseProvider";
import {safeStringify} from "Util/ObjectUtil";
import { TextSpan } from "Component/TextSpan";
import {CurrentUser} from "Component/CurrentUser";

const log = console;

const userUrl = "/user";

export function getUserScreenLink(): string{
  return userUrl;
}

export function isUserScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(userUrl);
}

export function UserScreen(){
  const {session, user} = useSupabase();
  log.debug("user screen", {user, session});

  return <NavTransition isPath={isUserScreenPath} title={"Cabbage - user home"}>
    <SmallScreenContainer>
      <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
        User details
      </Typography>
      <CurrentUser/>
      <TextSpan paragraph>
          <pre style={{overflowX: 'auto'}}>
            {safeStringify(user, '2-indent')}
          </pre>
      </TextSpan>
    </SmallScreenContainer>
  </NavTransition>
}


