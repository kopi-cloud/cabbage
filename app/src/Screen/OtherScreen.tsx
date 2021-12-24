import {useSupabase} from "Api/SupabaseProvider";
import {NavTransition} from "Design/NavigationProvider";
import {SmallContentMain} from "Design/LayoutMain";
import Typography from "@mui/material/Typography";
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
  return <NavTransition isPath={isOtherScreenPath} title={"Cabbage - other"}>
    <Content/>
  </NavTransition>
}

function Content(){
  const {session, user} = useSupabase();

  return <SmallContentMain>
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
    { [...Array(100)].map((value, index) => {
      return <Typography key={index} paragraph>content</Typography>
    })}
  </SmallContentMain>
}



