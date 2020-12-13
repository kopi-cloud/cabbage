import {NavTransition} from "Navigation/NavigationProvider";
import React, {ChangeEvent, SyntheticEvent, useCallback, useState} from "react";
import {SmallScreenContainer} from "Component/Screen";
import {TextSpan} from "Component/TextSpan";
import {SecondaryButton} from "Component/CabbageButton";
import {useSupabase} from "Api/SupabaseProvider";
import {stopClick} from "Util/EventUtil";
import {ButtonContainer} from "Component/ButtonContainer";
import {ErrorInfo} from "Error/ErrorUtil";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";
import {useAuthnUser} from "Api/AuthenticatedUserProvider";
import {private_user_info, public_user_info, Tables} from "Api/CabbageSchema";
import {CurrentUser} from "Component/CurrentUser";

const log = console;

const scratchUrl = "/scratch";

export function getScratchScreenLink(): string{
  return scratchUrl;
}

export function isScratchScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(scratchUrl);
}

export function ScratchScreen(){
  return <NavTransition isPath={isScratchScreenPath} title={"Cabbage - scratch"}>
    <Content/>
  </NavTransition>
}

function Content(){
  return <SmallScreenContainer>
    <TextSpan>Miscellaneous stuff</TextSpan>
    <ButtonContainer>
      <ApiRestartButton/>
    </ButtonContainer>
    <HackDisplayNameContainer stompValue={'xxx'}/>
  </SmallScreenContainer>
}

function ApiRestartButton(){
  const {db} = useSupabase();
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartError, setRestartError] =
    useState(undefined as undefined | ErrorInfo);

  return <SecondaryButton error={restartError}
    isLoading={isRestarting} disabled={isRestarting}
      onClick={async (e)=>{
        stopClick(e);
        setIsRestarting(true);
        setRestartError(undefined);
        const result = await db.rpc('notify_api_restart');
        log.debug("api restart", result);
        if( result.error ){
          setRestartError({
            message: result.error.message, problem: result.error });
        }
        setIsRestarting(false);
      }}
    >API restart</SecondaryButton>
}

export function HackDisplayNameContainer({stompValue}:{
  stompValue: string,
}){
  const [uuid, setUuid] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [writeError, setWriteError] =
    useState(undefined as undefined | ErrorInfo);
  const {db} = useAuthnUser();

  const onUuidChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUuid(event.currentTarget.value as string);
  };

  const onHackDisplayNameClick = useCallback(async(e: SyntheticEvent)=>{
    stopClick(e);
    setIsWriting(true);
    setWriteError(undefined);

    const result = await db.from<public_user_info>(Tables.public_user_info).
      insert({uuid, display_name: stompValue}, {upsert: true});
    log.debug("hack result", {myId: db.auth.user()?.id, result});
    if( result.error ){
      setWriteError({message: result.error.message, problem: result.error});
    }
    setIsWriting(false);
  }, [db, uuid, stompValue]);

  const onHackContactDetailsClick = useCallback(async(e: SyntheticEvent)=>{
    stopClick(e);
    setIsWriting(true);
    setWriteError(undefined);

    const result = await db.from<private_user_info>(Tables.private_user_info).
      insert({uuid, contact_details: stompValue}, {upsert: true});
    log.debug("hack result", {myId: db.auth.user()?.id, result});
    if( result.error ){
      setWriteError({message: result.error.message, problem: result.error});
    }
    setIsWriting(false);
  }, [db, uuid, stompValue]);

  return <>
    <Typography variant={"h5"} style={{textAlign: "center"}}>
      Stomp someone else's display name
    </Typography>
    <div>
      <CurrentUser/>
      <Typography>Your own UUID is {db.auth.user()?.id}</Typography>
    </div>
    <form autoComplete="on" noValidate>
      <TextField id="uuidInputField" label="UUID"
        value={uuid}
        onChange={onUuidChange}
        disabled={isWriting}
        margin="normal"
        variant="outlined"
        autoComplete="on"
        fullWidth={true}
        inputProps={{autoCapitalize: "none"}}
      />
      <ButtonContainer style={{justifyContent: 'center', marginTop: "1em"}}
        error={writeError}
      >
        <SecondaryButton type="button" isLoading={isWriting}
          disabled={isWriting} onClick={onHackDisplayNameClick}
        >
          Set display_name = '{stompValue}'
        </SecondaryButton>
        <SecondaryButton type="button" isLoading={isWriting}
          disabled={isWriting} onClick={onHackContactDetailsClick}
        >
          Set contact_details = '{stompValue}'
        </SecondaryButton>
      </ButtonContainer>
    </form>
  </>
}
