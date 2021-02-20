/**
 * Encapsulates all the event sending functions so I can replace
 * Sentry later (20KB zipped is way too big).
 */
import * as Sentry from "@sentry/browser";
import {Status} from "@sentry/browser";
import {Config} from "Config";
import {Functions} from "Api/CabbageSchema";
import {Event} from "@sentry/types";
import {Response as SentryResponse} from "@sentry/types/dist/response";

const log = console;

const storeUrl =
  `${Config.supabaseUrl}/rest/v1/rpc/${Functions.store_sentry_event}`;

export function initSendEvent(){
  /** Note that development builds may send render errors twice, see
   * {@link ReactErrorBoundary#componentDidCatch} */
  Sentry.init({
    /* Sentry won't work if you don't give something that looks valid */
    dsn: Config.sentryDsn ?? "https://1@example.com/1",
    transport: Config.sentryDsn ? undefined : SentrySupabaseTransport,
    environment: Config.environmentName,
    release: "cabbage@" + Config.gitCommit,
    autoSessionTracking: false,
  });
}

export function setUserId(userId: string){
  Sentry.setUser({id: userId});
}

export function captureException(error: any, context: string){
  Sentry.captureException(error, {extra: {"context":context}});
}

class SentrySupabaseTransport extends Sentry.Transports.BaseTransport {
  sendEvent(event: Event): PromiseLike<SentryResponse>{
    log.debug("sending event to supabase");
    /* POST the request directly to the Supabase endpoint so that we can log
    errors as soon as the page is loaded, not worrying about if the
    supabase client is properly intialised yet. */
    return fetch(storeUrl, {
      method: 'POST', cache: 'no-cache', credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Config.supabaseAnonKey!,
      },
      body: JSON.stringify({json_content: event})
    }).then((response) => {
      if( response.status === 200 ){
        return {status: Status.Success, event: event};
      }
      else {
        log.warn("couldn't POST the event to supabase, non-200 reponse", response);
        return {status: Status.Failed, event: event};
      }
    }).catch((error) => {
      log.warn("couldn't post event to supabase, error", error);
      return {status: Status.Failed, event: event};
    });
  }
}

