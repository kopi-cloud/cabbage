import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React, {ChangeEvent, SyntheticEvent, useState} from "react";
import {TextSpan} from "Component/TextSpan";
import {CurrentUser} from "Component/CurrentUser";
import {stopClick} from "Util/EventUtil";
import TextField from "@material-ui/core/TextField/TextField";
import {ButtonContainer} from "Component/ButtonContainer";
import {PrimaryButton, SecondaryButton} from "Component/CabbageButton";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {ErrorInfo} from "Error/ErrorUtil";

const log = console;

const userUrl = "/user";

export function getUserScreenLink(): string{
  return userUrl;
}

export function isUserScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(userUrl);
}

export function UserScreen(){
  return <NavTransition isPath={isUserScreenPath} title={"Cabbage - user home"}>
    <SmallScreenContainer>
      <UserContainer/>
    </SmallScreenContainer>
  </NavTransition>
}

function UserContainer(){
  return <>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      User details
    </Typography>
    <CurrentUser/>
    <UserDetailsForm/>
    <TextSpan/>
  </>
}

function UserDetailsForm(){
  const [currentAction, setCurrentAction] = useState("loading" as
    undefined | "reading" | "updating");
  const [displayName, setDisplayName] = useState("");
  function onSubmit(e: SyntheticEvent){
  stopClick(e);

  }

  function onDisplayNameChange(e: ChangeEvent<HTMLInputElement>){
    stopClick(e);
    setDisplayName(e.currentTarget.value as string);
  }

  return <>
    <form noValidate autoComplete="off"
      onSubmit={onSubmit}
    >
      <TextField id="displayNameInputField" label="Display name"
        value={displayName}
        onChange={onDisplayNameChange}
        disabled={!!currentAction}
        margin="normal"
        variant="outlined"
        autoComplete="on"
        fullWidth={true}
        inputProps={{autoCapitalize: "none"}}
      />
      <ButtonContainer style={{justifyContent: 'flex-end', marginTop: "1em"}}
        error={undefined}
      >
        <SecondaryButton type="reset" disabled={!!currentAction}
          onClick={(e)=>{
            stopClick(e);
          }}
        >
          Reset
        </SecondaryButton>
        <PrimaryButton type="submit" isLoading={false}
          disabled={!!currentAction}
        >
          Update
        </PrimaryButton>
      </ButtonContainer>
    </form>
  </>
}

/*
    <TextSpan paragraph>
      <pre style={{overflowX: 'auto'}}>
        {safeStringify(user, '2-indent')}
      </pre>
    </TextSpan>

 */

async function loadUserInfo(db: SupabaseClient):Promise<string|ErrorInfo>{
  return "";
}