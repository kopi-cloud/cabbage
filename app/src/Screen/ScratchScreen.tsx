import {Config} from "Config";
import {NavTransition} from "Navigation/NavigationProvider";
import React, {useState} from "react";
import {SmallScreenContainer} from "Component/Screen";
import {TextSpan} from "Component/TextSpan";
import {SecondaryButton} from "Component/CabbageButton";
import {useSupabase} from "Api/SupabaseProvider";
import {stopClick} from "Util/EventUtil";
import {ButtonContainer} from "Component/ButtonContainer";
import {ErrorInfo} from "Error/ErrorUtil";

const log = console;

const otherUrl = "/scratch";

export function getScratchScreenLink(): string{
  return otherUrl;
}

export function isScratchScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(otherUrl);
}

const swaggerUrl =
  `${Config.supabaseUrl}/rest/v1/?apikey=${Config.supabaseAnonKey}`;

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