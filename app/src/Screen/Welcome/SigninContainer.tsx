import {redirectAfterSignIn, useSupabase} from "Api/SupabaseProvider";
import React, {SyntheticEvent, useState} from "react";
import {ErrorInfo} from "Error/ErrorUtil";
import {SmallContentMain} from "Design/LayoutMain";
import {EmailSignInContainer} from "Screen/Welcome/EmailSignInContainer";
import {stopClick} from "Util/EventUtil";
import {useNavigation} from "Design/NavigationProvider";
import Divider from "@mui/material/Divider";
import {CurrentUserSignOutContainer} from "./CurrentUserSignOutContainer";
import {SsoSignInContainer} from "Screen/Welcome/SsoSignInContainer";

const log = console;

export type SignInAction =
  "email sign in" | "google sign in" | "github sign in" | "signing out";

/** IMPROVE: this might be better using a reducer? */
export function SignInContainer({signInRedirect}:{signInRedirect?: string}){
  const {db, user} = useSupabase();
  const nav = useNavigation();
  const [currentAction, setCurrentAction] =
    useState(undefined as undefined | SignInAction);
  const [lastEmailError, setLastEmailError] =
    useState(undefined as undefined | ErrorInfo);
  const [lastSsoError, setLastSsoError] =
    useState(undefined as undefined | ErrorInfo);
  const [lastSignOutError, setLastSignOutError] =
    useState(undefined as undefined | ErrorInfo);

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
      redirectAfterSignIn();
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
    else {
      // leave currentAction so controls are disabled for browser SSO navigation
    }
  }

  const disabled = !!currentAction;

  if( user ){
    if( signInRedirect ){
      log.debug("user is signed in, naving to screen", signInRedirect);
      /* navigation is usually done during event handling, but here we're
       rendering; so use a timeout to do the hav *after* rendering otherwise
       react will complain about setting NavProvider state during rendering
       of SignInContainer. */
      setTimeout(()=>nav.navigateTo(signInRedirect));

      /* let render fall through to displaying the signin container, no
      point showing something different for one or two renders */
    }
    else {
      return <SmallContentMain center>
        <CurrentUserSignOutContainer disabled={disabled}
          isSigningOut={currentAction === "signing out"}
          onSignOut={onSignOut} lastSignOutError={lastSignOutError} />
      </SmallContentMain>
    }
  }

  return <SmallContentMain center>
    <SsoSignInContainer disabled={disabled} onSsoSignIn={onSsoSignIn}
      currentAction={currentAction} lastSsoError={lastSsoError} />
    <Divider variant={"middle"}
      style={{paddingTop: "2em", paddingBottom: "2em"}}
    >Or</Divider>
    <EmailSignInContainer disabled={disabled}
      isSigningIn={currentAction === "email sign in"}
      onSignIn={onEmailSignIn} lastEmailError={lastEmailError} />
  </SmallContentMain>
}


