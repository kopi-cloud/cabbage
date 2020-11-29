import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {useSupabase} from "Api/SupabaseProvider";
import {safeStringify} from "Util/ObjectUtil";

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
  const {db} = useSupabase();
  const user = db.auth.user()
  const session = db.auth.session();

  log.debug("user screen", {user, session});

  return <NavTransition isPath={isUserScreenPath} title={"Cabbage - user home"}>
    <SmallScreenContainer>
      <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
        User details
      </Typography>
      <Typography paragraph>
        {safeStringify(user)}
      </Typography>
    </SmallScreenContainer>
  </NavTransition>
}


