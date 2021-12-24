import {NavTransition} from "Design/NavigationProvider";
import {TextSpan} from "Component/TextSpan";
import React, {useState} from "react";
import {
  CardMargin,
  ContainerCard,
} from "Design/ContainerCard";
import {SecondaryButton} from "Component/CabbageButton";
import {stopClick} from "Util/EventUtil";
import {useSupabase} from "Api/SupabaseProvider";
import {ErrorInfo} from "Error/ErrorUtil";
import {store_event} from "Api/CabbageApi";
import {FlexContentMain} from "Design/LayoutMain";

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
  return <NavTransition isPath={isErrorHandlingScreenPath}
    title={"Cabbage - error handling examples"}
  >
    <Content/>
  </NavTransition>
}

function Content(){
  return <FlexContentMain>
    <CardMargin><UnhandledOnClickErrorCard/></CardMargin>
    <CardMargin><ReactRenderErrorCard/></CardMargin>
    <CardMargin><HandledApiErrorCard/></CardMargin>
    <CardMargin><StoreSbEventCard/></CardMargin>
  </FlexContentMain>
}

function UnhandledOnClickErrorCard(){
  return <ContainerCard title={<>Event handler error</>} >
    <TextSpan>Throws an error from inside an onClick event.</TextSpan>
    <TextSpan>This simulates a coding error when writing event handling code
    (usually server calls, etc.)</TextSpan>
    <SecondaryButton
      onClick={async (e)=>{
        stopClick(e);
        throw new Error("intentional event handler error");
      }}
    >Throw handler error</SecondaryButton>
  </ContainerCard>
}

function StoreSbEventCard(){
  const {db} = useSupabase();
  return <ContainerCard title={<>Store supabase event</>} >
    <TextSpan>Stores an event directly to the REST endpoint.</TextSpan>
    <SecondaryButton
      onClick={async (e)=>{
        stopClick(e);
        log.debug("storing event to supabase")
        const result = await store_event(db, {
          json_content: {'somefield': 'somevalue2'} });
        log.debug("store result", result);
      }}
    >Store event</SecondaryButton>
  </ContainerCard>
}

function HandledApiErrorCard(){
  const {db} = useSupabase();
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartError, setRestartError] =
    useState(undefined as undefined | ErrorInfo);

  return <ContainerCard title={<>Handled API error</>} >
    <TextSpan>Tries to call a trigger as a function, which will cause an
      error on the server-side.</TextSpan>
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
    <TextSpan>
      This simulates a coding error when writing React display code.
    </TextSpan>
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

