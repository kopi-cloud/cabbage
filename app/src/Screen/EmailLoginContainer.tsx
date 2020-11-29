import React, {ChangeEvent} from "react";
import {SmallScreenContainer} from "Component/Screen";
import {PrimaryButton} from "Component/CabbageButton";
import {useSupabase} from "Api/SupabaseProvider";
import {getSignupScreenLink} from "Screen/SignupScreen";
import {Link} from "Navigation/Link";
import {useNavigation} from "Navigation/NavigationProvider";
import {useLocation} from "Navigation/UseLocation";
import {ErrorInfo, isError} from "Error/ErrorUtil";
import {stopClick} from "Util/EventUtil";
import {getUserScreenLink} from "Screen/UserScreen";
import {TextField} from "@material-ui/core";
import {ButtonContainer} from "Component/ButtonContainer";
import Typography from "@material-ui/core/Typography";

const log = console;

export function EmailLoginContainer(){
  const {db} = useSupabase();

  return <SmallScreenContainer center>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      Login via email
    </Typography>
    <EmailLoginForm />
    <br/>
    <Link href={getSignupScreenLink()}>
      Sign up
    </Link>
  </SmallScreenContainer>
}


function EmailLoginForm(){
  const {db} = useSupabase();
  const nav = useNavigation();
  const location = useLocation();
  const [email, setEmail] = React.useState("wibble@wobble");
  const [password, setPassword] = React.useState("wobble");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [loginError, setLoginError] = React.useState(undefined as
    undefined | ErrorInfo);

  async function onLoginSubmit(event: React.FormEvent){
    log.debug("onLoginSubmit() called");
    stopClick(event);

    setIsLoggingIn(true);
    setLoginError(undefined);
    log.debug("logging in user", {email, password});

    try {
      const result = await db.auth.signIn({email, password});
      log.debug("sb login result", result);
      const {error} = result;

      if( error ){
        if( isError(error) ){
          setLoginError({
            message: error.message, problem: error });
        }
        else {
          setLoginError({
            message: "error while logging in with Supabase", problem: error });
        }
      }
      else {
        log.debug("after login auth.user", db.auth.user());

        nav.navigateTo(event, getUserScreenLink());
        // window.location.reload();
      }

    }
    finally {
      setIsLoggingIn(false);
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

  let canClickLogin = false;
  if( email && password ){
    canClickLogin = true;
  }

  return <div>
    <form onSubmit={onLoginSubmit} noValidate autoComplete="off">
      <TextField id="emailInputField" label="Email"
        value={email}
        onChange={onEmailTextChange}
        disabled={isLoggingIn}
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
        disabled={isLoggingIn}
        margin="normal"
        variant="outlined"
        autoComplete="on"
        fullWidth={true}
        inputProps={{autoCapitalize: "none"}}
      />
      <br/>
      <ButtonContainer justifyRight error={loginError}>
        <PrimaryButton type="submit" isLoading={isLoggingIn}
          disabled={!canClickLogin || isLoggingIn}
        >
          Log in
        </PrimaryButton>
      </ButtonContainer>
    </form>
  </div>
}