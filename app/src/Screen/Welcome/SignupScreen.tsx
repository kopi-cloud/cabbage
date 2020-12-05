import {NavTransition, useNavigation} from "Navigation/NavigationProvider";
import React, {ChangeEvent} from "react";
import {SmallScreenContainer} from "Component/Screen";
import {TextField} from "@material-ui/core";
import {useSupabase} from "Api/SupabaseProvider";
import {PrimaryButton, SecondaryButton} from "Component/CabbageButton";
import {stopClick} from "Util/EventUtil";
import Typography from "@material-ui/core/Typography";
import {ButtonContainer} from "Component/ButtonContainer";
import {ErrorInfo, isError} from "Error/ErrorUtil";
import {getUserScreenLink} from "Screen/UserScreen";

const log = console;

const signupUrl = "/signup";


export function getSignupScreenLink(): string{
  return signupUrl;
}

export function isSignupScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(signupUrl);
}

export function SignupScreen(){
  return <NavTransition isPath={isSignupScreenPath} title={"Cabbage - signup"}>
    <SmallScreenContainer>
      <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
        Signup for a Cabbage
      </Typography>
      <EmailSignupForm />
    </SmallScreenContainer>
  </NavTransition>
}

function EmailSignupForm(){
  const {db} = useSupabase();
  const nav = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const [signupError, setSignupError] = React.useState(undefined as
    undefined | ErrorInfo);

  async function onSubmit(event: React.FormEvent){
    stopClick(event);

    setIsSigningUp(true);
    setSignupError(undefined);
    log.debug("signing up user", {email, password});

    try {
        // IMPROVE: was returning a "422" at one point, handle that
      const { data, user, error } = await db.auth.signUp({email, password});
      log.debug("sb signup result", {data, user, error});

      if( error ){
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
        nav.navigateTo(getUserScreenLink(), event);
      }

    }
    finally {
      setIsSigningUp(false);
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
      <TextField id="passwordInputField" type="password"
        label="Password"
        value={password}
        onChange={onPasswordTextChange}
        disabled={isSigningUp}
            margin="normal"
            variant="outlined"
        autoComplete="on"
        fullWidth={true}
        inputProps={{autoCapitalize: "none"}}
      />
      <br/>
      <ButtonContainer  error={signupError}
        style={{justifyContent: 'flex-end'}}
      >
        <SecondaryButton disabled={isSigningUp}
          onClick={(e)=>{stopClick(e);window.history.back();}}
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