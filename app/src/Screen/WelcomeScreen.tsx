import {SmallScreenContainer} from "Component/Screen";
import {Typography} from "@material-ui/core";
import {
  cabbageGithubUrl,
  netlifyUrl,
  NewWindowLink,
  supabaseUrl
} from "Component/ExternalLinks";
import {TextSpan} from "Component/TextSpan";
import React from "react";
import {PrimaryButton} from "Component/CabbageButton";
import Popover from "@material-ui/core/Popover";

export function WelcomeScreen(){
  const [anchorEl, setAnchorEl] = React.useState(null as
    null | HTMLButtonElement);

  function onClick(event: React.MouseEvent<HTMLButtonElement>){
    setAnchorEl(event.currentTarget);
  }

  function onClose(){
    setAnchorEl(null);
  }


  const isOpen = Boolean(anchorEl);

  return <div>
    <IntroContainer/>
    <SmallScreenContainer center>
      <PrimaryButton onClick={onClick}>Log in to Cabbage</PrimaryButton>
      <Popover open={isOpen} anchorEl={anchorEl} onClose={onClose}>
        <TextSpan>Sorry, not yet implemented.</TextSpan>
      </Popover>
    </SmallScreenContainer>
  </div>
}

function IntroContainer(){
  return <SmallScreenContainer center>
    <Typography paragraph>Cabbage is a simple demo app
      for <NewWindowLink href={supabaseUrl}>Supabase</NewWindowLink>.
    </Typography>
    <Typography paragraph>The Cabbage app is published
      via <NewWindowLink href={netlifyUrl}>Netlify</NewWindowLink>.
    </Typography>
    <Typography>You can find the source code for Cabbage
      over on <NewWindowLink href={cabbageGithubUrl}>Gihub</NewWindowLink>.
      <br/>
      Note that the code you're looking at currently is published from
      the "tst" branch.
    </Typography>
  </SmallScreenContainer>
}