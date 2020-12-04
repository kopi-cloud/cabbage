import {useSupabase} from "Api/SupabaseProvider";
import React, {SyntheticEvent, useState} from "react";
import {ErrorInfo} from "Error/ErrorUtil";
import {SmallScreenContainer} from "Component/Screen";
import {getUserScreenLink} from "Screen/UserScreen";
import {EmailSignInContainer} from "Screen/Welcome/EmailSignInContainer";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {stopClick} from "Util/EventUtil";
import {useNavigation} from "Navigation/NavigationProvider";
import Divider from "@material-ui/core/Divider";
import {CurrentUserContainer} from "./CurrentUserContainer";
import {SsoSignInContainer} from "Screen/Welcome/SsoSignInContainer";

const log = console;

export type SignInAction =
  "email sign in" | "google sign in" | "github sign in" | "signing out";

export function SignInContainer(){
  const {db, user} = useSupabase();
  const nav = useNavigation();
  const [currentAction, setCurrentAction] = useState(undefined as
    undefined | SignInAction);
  const [lastEmailError, setLastEmailError] = useState(
    undefined as undefined | ErrorInfo);
  const [lastSsoError, setLastSsoError] = useState(
    undefined as undefined | ErrorInfo);
  const [lastSignOutError, setLastSignOutError] = useState(
    undefined as undefined | ErrorInfo);

  async function onSignOut(event: SyntheticEvent){
    stopClick(event);
    setCurrentAction("signing out");
    setLastSignOutError(undefined);
    try {
      const result = await db.auth.signOut();
      if( result.error ){
        setLastSignOutError({
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
    setLastEmailError(undefined);

    const result = await db.auth.signIn({email, password});
    log.debug("sb signin result", result);
    const {error} = result;

    if( error ){
      setCurrentAction(undefined);
      setLastEmailError({ problem: error,
        message: error.message ?? "error while signing in via email" });
    }
    else {
      // leave currentAction so controls are disabled during animation
      nav.navigateTo(event, getUserScreenLink());
    }
  }

  async function onSsoSignIn(
    event: SyntheticEvent,
    provider: 'google'|'github'
  ){
    stopClick(event);
    setCurrentAction(provider === "google" ?
      "google sign in" : "github sign in" );
    setLastSsoError(undefined);

    const result = await db.auth.signIn({provider});
    log.debug(`${provider} signin result`, result);
    if( result.error ){
      setLastSsoError({ problem: result.error,
        message: result.error.message ?? `error signing in via ${provider}`
      });
    }

    // leave currentAction so controls are disabled for browser SSO navigation
  }

  const disabled = !!currentAction;

  let content;
  if( user ){
    content = <CurrentUserContainer disabled={disabled}
      isSigningOut={currentAction === "signing out"}
      onSignOut={onSignOut} lastSignOutError={lastSignOutError} />
  }
  else {
    content = <>
      <EmailSignInContainer disabled={disabled}
        isSigningIn={currentAction === "email sign in"}
        onSignIn={onEmailSignIn} lastEmailError={lastEmailError} />
      <Divider variant={"middle"}/>
      <br/>
      <SsoSignInContainer disabled={disabled} onSsoSignIn={onSsoSignIn}
        currentAction={currentAction} lastSsoError={lastSsoError} />
    </>
  }

  return <SmallScreenContainer center>
    {content}
    <CompactErrorPanel error={lastSsoError}/>
  </SmallScreenContainer>
}


