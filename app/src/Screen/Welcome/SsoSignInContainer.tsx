import Typography from "@material-ui/core/Typography";
import React, {SyntheticEvent} from "react";
import {PrimaryButton} from "Component/CabbageButton";
import { Google } from "Component/Icon";
import {GitHub} from "@material-ui/icons";
import {ErrorInfo} from "Error/ErrorUtil";
import {SignInAction} from "Screen/Welcome/SigninContainer";
import {CompactErrorPanel} from "Error/CompactErrorPanel";

export type SsoProvider = "google" | "github";

export function SsoSignInContainer({
  disabled,
  currentAction,
  onSsoSignIn,
  lastSsoError,
}:{
  disabled: boolean,
  currentAction?: SignInAction,
  onSsoSignIn: (event: SyntheticEvent, provider: SsoProvider)=>void,
  lastSsoError?: ErrorInfo,
}){
  return <>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      SSO sign in
    </Typography>
    <div style={{display: "flex", justifyContent: "center"}}>
      <PrimaryButton disabled={disabled}
        isLoading={currentAction === "google sign in"}
        onClick={(e)=>{// noinspection JSIgnoredPromiseFromCall
          onSsoSignIn(e, 'google') }}
        endIcon={<Google/>}
      >
        Google
      </PrimaryButton>
      &emsp;
      <PrimaryButton disabled={disabled}
        isLoading={currentAction === "github sign in"}
        onClick={(e)=>{// noinspection JSIgnoredPromiseFromCall
          onSsoSignIn(e, 'github') }}
        endIcon={<GitHub/>}
      >
        Github
      </PrimaryButton>
    </div>
    <div style={{display: "flex", justifyContent: "center"}}>
      <CompactErrorPanel error={lastSsoError}/>
    </div>
  </>
}