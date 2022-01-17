import {useNavigation} from "Design/NavigationProvider";
import React, {ChangeEvent, SyntheticEvent, useState} from "react";
import {TextField} from "@mui/material";
import {useSupabase} from "Api/SupabaseProvider";
import {PrimaryButton, SecondaryButton} from "Component/CabbageButton";
import {stopClick} from "Util/EventUtil";
import Typography from "@mui/material/Typography";
import {ButtonContainer} from "Component/ButtonContainer";
import {ErrorInfo, isError} from "Error/ErrorUtil";
import {getUserEditScreenLink} from "Screen/User/UserEditScreen";
import {PasswordField} from "Component/PasswordField";

const log = console;


export function EmailSignupContainer({onCancel}:{
  onCancel:(e: SyntheticEvent)=>void
}){
  const {db} = useSupabase();
  const nav = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] =
    useState(undefined as undefined | ErrorInfo);

  async function onSubmit(event: SyntheticEvent){
    stopClick(event);

    setIsSigningUp(true);
    setSignupError(undefined);
    log.debug("signing up user", {email, password});

    // IMPROVE: was returning a "422" at one point, handle that
    const { user, session, error } = await db.auth.signUp({email, password});
    log.debug("sb signup result", {user, session, error});

    if( error ){
      setIsSigningUp(false);
      if( isError(error) ){
        setSignupError({
          message: error.message, problem: error });
      }
      else {
        setSignupError({
          message: "error while signing up with Supabase", problem: error });
      }
    }
    else {
      log.debug("after signup auth.user", db.auth.user());
      nav.navigateTo(getUserEditScreenLink(), event);
      /* don't reset isSignignUp to keep the button disabled while navigating
      and to avoid changing unmounted state error */
    }
  }

  const onEmailTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue = event.currentTarget.value as string;
    newValue = newValue.toLowerCase();
    setEmail(newValue);
  };

  const onPasswordTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value as string);
  };

  let canClickCreate = false;
  if( email && password ){
    canClickCreate = true;
  }

  return <div>
    <Typography variant={"h5"} style={{textAlign: "center"}}>
      Signup for a Cabbage
    </Typography>
    <Typography paragraph variant={"subtitle2"} style={{textAlign: "center"}}>
      (Not verified, doesn't need to be a real email)
    </Typography>
    <form onSubmit={onSubmit} noValidate autoComplete="off">
      <TextField id="emailInputField" label="Email"
        autoFocus
        value={email}
        onChange={onEmailTextChange}
        disabled={isSigningUp}
        margin="normal"
        variant="outlined"
        autoComplete="on"
        fullWidth={true}
        inputProps={{autoCapitalize: "none"}}
      />
      <PasswordField value={password} onChange={onPasswordTextChange}
        disabled={isSigningUp} />
      <br/>
      <ButtonContainer  error={signupError}
        style={{justifyContent: 'center', marginTop: "1em"}}
      >
        <SecondaryButton disabled={isSigningUp}
          onClick={onCancel}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" isLoading={isSigningUp}
          disabled={!canClickCreate || isSigningUp}
        >
          Sign up
        </PrimaryButton>
      </ButtonContainer>
    </form>
  </div>
}