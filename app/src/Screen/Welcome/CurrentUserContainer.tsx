import React, {SyntheticEvent} from "react";
import {ErrorInfo} from "Error/ErrorUtil";
import {useSupabase} from "Api/SupabaseProvider";
import {SmallScreenContainer} from "Component/Screen";
import {Typography} from "@material-ui/core";
import {Link} from "Navigation/Link";
import {getUserScreenLink} from "Screen/UserScreen";
import {ButtonContainer} from "Component/ButtonContainer";
import {PrimaryButton} from "Component/CabbageButton";

export function CurrentUserContainer({
  disabled,
  isSigningOut,
  onSignOut,
  lastSignOutError,
}:{
  disabled: boolean,
  isSigningOut: boolean,
  onSignOut: (event: SyntheticEvent)=>void,
  lastSignOutError: undefined | ErrorInfo,
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
    <ButtonContainer style={{justifyContent: 'space-around'}}
      error={lastSignOutError}
    >
      <PrimaryButton isLoading={isSigningOut} disabled={disabled}
        onClick={onSignOut}
      >
        Sign out
      </PrimaryButton>
    </ButtonContainer>
  </>
}
