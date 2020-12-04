import {SmallScreenContainer} from "Component/Screen";
import {Typography} from "@material-ui/core";
import {
  cabbageGithubUrl,
  netlifyUrl,
  NewWindowLink,
  supabaseUrl
} from "Component/ExternalLinks";
import React from "react";
import {Config} from "Config";
import {NavTransition} from "Navigation/NavigationProvider";
import {SignInContainer} from "Screen/Welcome/SigninContainer";
import {CabbageCountContainer} from "Screen/Welcome/CabbageCountContainer";

const log = console;


const welcomeUrl = "/welcome";


export function getWelcomeScreenLink(): string{
  return welcomeUrl;
}

export function isWelcomeScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(welcomeUrl);
}

export function WelcomeScreen(){
  return <NavTransition isPath={isWelcomeScreenPath} title={"Cabbage"}>
    <IntroContainer/>
    <SignInContainer/>
    <CabbageCountContainer/>
  </NavTransition>
}


function IntroContainer(){
  return <SmallScreenContainer center>
    <Typography paragraph>Cabbage is a simple demo app
      for <NewWindowLink href={supabaseUrl}>Supabase</NewWindowLink>.
    </Typography>
    <Typography paragraph>The Cabbage app is published
      via <NewWindowLink href={netlifyUrl}>Netlify</NewWindowLink>.
    </Typography>
    <Typography>You can find the source code for Cabbage over
      on <NewWindowLink href={cabbageGithubUrl}>Github</NewWindowLink>.
      <br/>
      This app was published from the `{Config.environmentName}` branch
      ({Config.gitCommit.substr(0, 8).trim()}).
    </Typography>
  </SmallScreenContainer>
}

