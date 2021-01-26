import * as Sentry from "@sentry/browser";
import {Event} from "@sentry/types";
import {Response as SentryResponse} from "@sentry/types/dist/response";
import {Config} from "Config";
import {Status} from "@sentry/browser";

const log = console;

export class SentrySupabaseTransport extends Sentry.Transports.BaseTransport {
  sendEvent(event: Event): PromiseLike<SentryResponse>{
    log.debug("sending error to supabase");
    /* POST the request directly to the Supabase endpoint so that we can log
    errors as soon as the page is loaded, not worrying about if the
    supabase client is properly intialised yet. */
    return fetch(Config.supabaseUrl + "/rest/v1/rpc/store_error", {
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

