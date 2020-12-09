import {useSupabase} from "Api/SupabaseProvider";
import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Config } from "Config";

const log = console;

const otherUrl = "/other";

export function getOtherScreenLink(): string{
  return otherUrl;
}

export function isOtherScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(otherUrl);
}

const swaggerUrl =
  `${Config.supabaseUrl}/rest/v1/?apikey=${Config.supabaseAnonKey}`;

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
      <Typography paragraph>
        Types:
        <a rel={"noopener noreferrer"} target={"_"} href={swaggerUrl}>
          swagger
        </a>
      </Typography>
    </SmallScreenContainer>
  </NavTransition>
}


