import React, {SyntheticEvent} from "react";
import {ErrorInfo} from "Error/ErrorUtil";
import {useSupabase} from "Api/SupabaseProvider";
import {SmallContentMain} from "Design/LayoutMain";
import {Typography} from "@mui/material";
import {Link} from "Component/Link";
import {getUserEditScreenLink} from "Screen/User/UserEditScreen";
import {ButtonContainer} from "Component/ButtonContainer";
import {PrimaryButton} from "Component/CabbageButton";

export function CurrentUserSignOutContainer({
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
    return <SmallContentMain center>
      <Typography paragraph>
        You are not currently signed in.
      </Typography>
    </SmallContentMain>
  }

  return <>
    <Typography paragraph>
      You are currently signed in
      via '{user.app_metadata.provider ?? 'unknown'}'{' '}
      as '{user.email ?? 'unknown'}'.
    </Typography>
    <Typography paragraph>
      Sign out if you want to change user, or click here to go to
      the <Link href={getUserEditScreenLink()}>home screen</Link>.
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
