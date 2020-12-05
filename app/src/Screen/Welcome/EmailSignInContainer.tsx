import React, {ChangeEvent, SyntheticEvent, useState} from "react";
import {PrimaryButton, SecondaryButton} from "Component/CabbageButton";
import {EmailSignupContainer} from "Screen/Welcome/EmailSignupContainer";
import {TextField} from "@material-ui/core";
import {ButtonContainer} from "Component/ButtonContainer";
import Typography from "@material-ui/core/Typography";
import {MailOutline} from "@material-ui/icons";
import {ErrorInfo} from "Error/ErrorUtil";
import {stopClick} from "Util/EventUtil";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowSignUp, setIsShowSignUp] = useState(false);

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

  if( isShowSignUp ){
    return <EmailSignupContainer onCancel={(e)=>{
      stopClick(e);
      setIsShowSignUp(false);
    }}/>
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
        <SecondaryButton style={{marginRight: "1em"}} onClick={(e)=>{
          stopClick(e);
          setIsShowSignUp(true);
        }}>
          Sign up
        </SecondaryButton>
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