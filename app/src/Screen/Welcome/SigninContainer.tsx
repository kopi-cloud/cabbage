import {useSupabase} from "Api/SupabaseProvider";
import React, {SyntheticEvent, useState} from "react";
import {ErrorInfo} from "Error/ErrorUtil";
import {SmallScreenContainer} from "Component/Screen";
import {Typography} from "@material-ui/core";
import {Link} from "Navigation/Link";
import {getUserScreenLink} from "Screen/UserScreen";
import {ButtonContainer} from "Component/ButtonContainer";
import {PrimaryButton} from "Component/CabbageButton";
import {EmailSignInContainer} from "Screen/Welcome/EmailSignInContainer";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {stopClick} from "Util/EventUtil";
import {useNavigation} from "Navigation/NavigationProvider";
import Divider from "@material-ui/core/Divider";
import {GitHub, YouTube} from "@material-ui/icons";

const log = console;

export function SignInContainer(){
  const {db, user} = useSupabase();
  const nav = useNavigation();
  const [currentAction, setCurrentAction] = useState(undefined as undefined |
    "email sign in" | "google sign in" | "github sign in" | "signing out");
  const [lastActionError, setLastActionError] = useState(
    undefined as undefined | ErrorInfo);

  async function onSignOut(event: SyntheticEvent){
    stopClick(event);
    setCurrentAction("signing out");
    setLastActionError(undefined);
    try {
      const result = await db.auth.signOut();
      if( result.error ){
        setLastActionError({
          message: "error while signing out", problem: result.error });
      }
    }
    finally {
      setCurrentAction(undefined);
    }
  }

  async function onEmailSignIn(
    event: SyntheticEvent,
    email: string,
    password: string
  ){
    stopClick(event);
    setCurrentAction("email sign in");
    setLastActionError(undefined);

    const result = await db.auth.signIn({email, password});
    log.debug("sb signin result", result);
    const {error} = result;

    if( error ){
      setLastActionError({ problem: error,
        message: error.message ?? "error while signing in via email" });
    }
    else {
      // leave currentAction so controls are disabled during animation
      nav.navigateTo(event, getUserScreenLink());
    }
  }

  async function onGoogleSignIn(event: SyntheticEvent,){
    stopClick(event);
    setCurrentAction("google sign in");

    const result = await db.auth.signIn({provider: "google"});
    log.debug("google signin result", result);
    if( result.error ){
      setLastActionError({ problem: result.error,
        message: result.error.message ?? "error while signing in via google"
      });
    }

    // leave currentAction so controls are disabled for browser SSO navigation
  }

  async function onGithubSignIn(event: SyntheticEvent,){
    stopClick(event);
    setCurrentAction("github sign in");

    const result = await db.auth.signIn({provider: "github"});
    log.debug("github signin result", result);
    if( result.error ){
      setLastActionError({ problem: result.error,
        message: result.error.message ?? "error while signing in via github"
      });
    }

    // leave currentAction so controls are disabled for browser SSO navigation
  }

  const disabled = !!currentAction;

  let content;
  if( user ){
    content = <CurrentUserContainer disabled={disabled}
      isSigningOut={currentAction === "signing out"}
      onSignOut={onSignOut}
    />
  }
  else {
    content = <>
      <EmailSignInContainer disabled={disabled}
        isSigningIn={currentAction === "email sign in"}
        onSignIn={onEmailSignIn}
      />
      <br/>
      <Divider variant={"middle"}/>
      <br/>
      <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
        SSO sign in
      </Typography>
      <div style={{display: "flex", justifyContent: "center"}}>
        <PrimaryButton disabled={disabled}
          isLoading={currentAction === "google sign in"}
          onClick={onGoogleSignIn}
          endIcon={<YouTube/>}
        >
          Google
        </PrimaryButton>
        &emsp;
        <PrimaryButton disabled={disabled}
          isLoading={currentAction === "github sign in"}
          onClick={onGithubSignIn}
          endIcon={<GitHub/>}
        >
          Github
        </PrimaryButton>
      </div>
    </>
  }

  return <SmallScreenContainer center>
    {content}
    <CompactErrorPanel error={lastActionError}/>
  </SmallScreenContainer>
}

export function CurrentUserContainer({
  disabled,
  isSigningOut,
  onSignOut,
}:{
  disabled: boolean,
  isSigningOut: boolean,
  onSignOut: (event: SyntheticEvent)=>void
}){
  const {user} = useSupabase();

  if( !user ){
    return <SmallScreenContainer center>
      <Typography paragraph>
        You are not currently signed in.
      </Typography>
    </SmallScreenContainer>
  }

  return <>
    <Typography paragraph>
      You are currently signed in
      via '{user.app_metadata.provider ?? 'unknown'}'{' '}
      as '{user.email ?? 'unknown'}'.
    </Typography>
    <Typography paragraph>
      Sign out if you want to change user, or click here to go to
      the <Link href={getUserScreenLink()}>home screen</Link>.
    </Typography>
    <ButtonContainer style={{justifyContent: 'space-around'}}>
      <PrimaryButton isLoading={isSigningOut} disabled={disabled}
        onClick={onSignOut}
      >
        Sign out
      </PrimaryButton>
    </ButtonContainer>
  </>
}