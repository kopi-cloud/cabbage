import {Config} from "Config";
import {NavTransition} from "Navigation/NavigationProvider";
import React, {useState} from "react";
import {SmallScreenContainer} from "Component/Screen";
import {TextSpan} from "Component/TextSpan";
import {SecondaryButton} from "Component/CabbageButton";
import {useSupabase} from "Api/SupabaseProvider";
import {stopClick} from "Util/EventUtil";
import {ButtonContainer} from "Component/ButtonContainer";

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
  const {db} = useSupabase();
  const [isRestarting, setIsRestarting] = useState(false);

  return <SmallScreenContainer>
    <TextSpan>Miscellaneous stuff</TextSpan>
    <ButtonContainer>
      <SecondaryButton isLoading={isRestarting} disabled={isRestarting}
        onClick={async (e)=>{
          stopClick(e);
          setIsRestarting(true);
          const result = await db.rpc('notify_api_restart');
          log.debug("api restart", result);
          setIsRestarting(false);
        }}
      >API restart</SecondaryButton>
    </ButtonContainer>
  </SmallScreenContainer>
}