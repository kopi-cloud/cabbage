import {NavTransition} from "Navigation/NavigationProvider";
import {TextSpan} from "Component/TextSpan";
import React, {useState} from "react";
import {CardMargin, ContainerCard, FlexCardScreenContainer} from "Component/ContainerCard";
import {SecondaryButton} from "Component/CabbageButton";
import {stopClick} from "Util/EventUtil";
import {useSupabase} from "Api/SupabaseProvider";
import {ErrorInfo} from "Error/ErrorUtil";
import {store_error} from "Api/CabbageApi";

const log = console;

const scratchUrl = "/error-handling";

export function getErrorHandlingScreenLink(): string{
  return scratchUrl;
}

export function isErrorHandlingScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(scratchUrl);
}

export function ErrorHandlingScreen(){
  return <NavTransition isPath={isErrorHandlingScreenPath} title={"Cabbage - error handling examples"}>
    <Content/>
  </NavTransition>
}

function Content(){
  return <FlexCardScreenContainer>
    <CardMargin><UnhandledEventErrorCard/></CardMargin>
    <CardMargin><ReactRenderErrorCard/></CardMargin>
    <CardMargin><HandledApiErrorCard/></CardMargin>
    <CardMargin><StoreSbErrorCard/></CardMargin>
  </FlexCardScreenContainer>
}

function UnhandledEventErrorCard(){

  return <ContainerCard title={<>Event handler error</>} >
    <TextSpan>Throws an error from inside the onClick event.</TextSpan>
    <SecondaryButton
      onClick={async (e)=>{
        stopClick(e);
        throw new Error("intentional event handler error");
      }}
    >Throw handler error</SecondaryButton>
  </ContainerCard>
}

function StoreSbErrorCard(){
  const {db} = useSupabase();

  return <ContainerCard title={<>Store supabase error</>} >
    <TextSpan>Stores an error directly to the endpoint.</TextSpan>
    <SecondaryButton
      onClick={async (e)=>{
        stopClick(e);
        log.debug("storing error to supabase")
        // const result = await db.rpc('store_error', {json_content: {'someerror': 'somevalue2'}});
        const result = await store_error(db, {json_content: {'someerror': 'somevalue2'}});
        log.debug("store result", result);
      }}
    >Store error</SecondaryButton>
  </ContainerCard>
}

function HandledApiErrorCard(){
  const {db} = useSupabase();
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartError, setRestartError] =
    useState(undefined as undefined | ErrorInfo);

  return <ContainerCard title={<>Handled API error</>} >
    <TextSpan>Tries to call a trigger as a function, which will cause an error.</TextSpan>
    <SecondaryButton error={restartError}
      isLoading={isRestarting} disabled={isRestarting}
      onClick={async (e) => {
        stopClick(e);
        setIsRestarting(true);
        setRestartError(undefined);
        const result = await db.rpc('notify_api_restart');
        log.debug("api restart", result);
        if( result.error ){
          setRestartError({
            message: result.error.message, problem: result.error
          });
        }
        setIsRestarting(false);
      }}
    >Cause server error</SecondaryButton>
  </ContainerCard>
}

function ReactRenderErrorCard(){
  const [isRenderError, setIsRenderError] = useState(false);
  return <ContainerCard title={<>React rendering error</>} >
    <TextSpan>Throws an error while trying to render a component.</TextSpan>
    { isRenderError && <BadRenderComponent/> }
    <SecondaryButton
      onClick={async (e)=>{
        stopClick(e);
        setIsRenderError(true);
      }}
    >Cause render error</SecondaryButton>
  </ContainerCard>
}


function BadRenderComponent(){
  console.log("cause render error");
  if( "will fail".length < 100 ){
    throw new Error("intentional render error");
  }

  return <div>This will never render</div>
}

