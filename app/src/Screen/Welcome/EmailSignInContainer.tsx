import React, {ChangeEvent, SyntheticEvent} from "react";
import {PrimaryButton} from "Component/CabbageButton";
import {getSignupScreenLink} from "Screen/SignupScreen";
import {NavButton} from "Navigation/Link";
import {TextField} from "@material-ui/core";
import {ButtonContainer} from "Component/ButtonContainer";
import Typography from "@material-ui/core/Typography";
import {MailOutline} from "@material-ui/icons";
import {ErrorInfo} from "Error/ErrorUtil";

const log = console;

export function EmailSignInContainer({
  disabled,
  isSigningIn,
  onSignIn,
  lastEmailError,
}:{
  disabled: boolean,
  isSigningIn: boolean,
  onSignIn: (event: SyntheticEvent, email: string, password: string)=>void,
  lastEmailError?: ErrorInfo,
}){
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

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

  return <>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      Sign in via email
    </Typography>
    <form noValidate autoComplete="off"
      onSubmit={(e)=>onSignIn(e, email, password)}
    >
      <TextField id="emailInputField" label="Email"
        value={email}
        onChange={onEmailTextChange}
        disabled={disabled}
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
        disabled={disabled}
        margin="normal"
        variant="outlined"
        autoComplete="on"
        fullWidth={true}
        inputProps={{autoCapitalize: "none"}}
      />
      <ButtonContainer style={{justifyContent: 'center', marginTop: "1em"}}
        error={lastEmailError}
      >
        <NavButton href={getSignupScreenLink()} style={{marginRight: "1em"}}>
          Sign up
        </NavButton>
        <PrimaryButton type="submit" isLoading={isSigningIn}
          disabled={!canClickLogin || disabled}
          endIcon={<MailOutline/>}
        >
          Sign in
        </PrimaryButton>
      </ButtonContainer>
    </form>
  </>
}