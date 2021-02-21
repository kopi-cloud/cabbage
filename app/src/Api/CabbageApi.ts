import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {
  Columns,
  flyway_schema_history,
  Functions,
  list_public_user_info,
  private_user_info,
  public_user_info,
  store_sentry_event_params,
  Tables
} from "Api/CabbageSchema";
import {parseSbQueryResult, parseSbVoidFunctionResult} from "Api/SupabaseUtil";

const log = console;

export async function queryDisplayName(db: SupabaseClient):
Promise<string|ErrorInfo>{
  const result = await db.from<public_user_info>(Tables.public_user_info).
    select(Columns.public_user_info.display_name).
    eq("uuid", db.auth.user()?.id);

  const data = parseSbQueryResult<public_user_info>(result);
  if( isErrorInfo(data) ){
    return data;
  }

  return data?.[0]?.display_name ?? "";
}

export async function upsertDisplayName(
  db: SupabaseClient, newValue: string
): Promise<string|ErrorInfo>{
  const result = await db.from<public_user_info>(Tables.public_user_info).
    insert({uuid: db.auth.user()?.id, display_name: newValue}, {upsert: true});

  log.debug("result of save", result);
  if( result.error ){
    if( result.status === 404 ){
      /* when I was having problems with bad RLS policicies, sometimes
       error was populated with an empty array - wtf? */
      return { problem: result, message: result.statusText};
    }
    return { problem: result.error, message: result.error.message};
  }
  if( result.data?.length !== 1 ){
    return { problem: result, message: "unexpected data returned from db"};
  }
  return result.data[0].display_name ?? "";
}

export async function queryAbout(db: SupabaseClient):
Promise<string|ErrorInfo>{
  const result = await db.from<public_user_info>(Tables.public_user_info).
    select(Columns.public_user_info.about).
    eq("uuid", db.auth.user()?.id);

  const data = parseSbQueryResult<public_user_info>(result);
  if( isErrorInfo(data) ){
    return data;
  }

  if( data?.length < 1 ){
    return "";
  }
  
  return data?.[0].about ?? "";
}

export async function upsertAbout(
  db: SupabaseClient, newValue: string
): Promise<string|ErrorInfo>{
  const result = await db.from<public_user_info>(Tables.public_user_info).
    insert({uuid: db.auth.user()?.id, about: newValue}, {upsert: true});

  log.debug("result of save", result);
  if( result.error ){
    if( result.status === 404 ){
      return { problem: result, message: result.statusText};
    }
    return { problem: result.error, message: result.error.message};
  }
  if( result.data?.length !== 1 ){
    return { problem: result, message: "unexpected data returned from db"};
  }
  return result.data[0].about ?? "";
}

export async function upsertContactDetails(
  db: SupabaseClient, newValue: string
): Promise<string|ErrorInfo>{
  const result = await db.from<private_user_info>(Tables.private_user_info).
    insert(
      { uuid: db.auth.user()?.id,
        contact_details: newValue },
      {upsert: true} );

  log.debug("result of save", result);
  if( result.error ){
    return { problem: result.error, message: result.error.message};
  }
  if( result.data?.length !== 1 ){
    return { problem: result, message: "unexpectec data returned from db"};
  }
  return result.data[0].contact_details ?? "";
}


export async function queryContactDetails(db: SupabaseClient):
  Promise<string|ErrorInfo>
{
  const result = await db.from<private_user_info>(Tables.private_user_info).
    select(Columns.private_user_info.contact_details);

  const data = parseSbQueryResult<private_user_info>(result);
  if( isErrorInfo(data) ){
    return data;
  }

  return data?.[0]?.contact_details ?? "";
}

export async function queryFlywaySchemaHistory(db: SupabaseClient):
  Promise<flyway_schema_history[]|ErrorInfo>
{
  // note that "version" here is typed - a wrong column name will not compile
  const result = await db.
    from<flyway_schema_history>(Tables.flyway_schema_history).
    select().order("installed_rank", {ascending: true});

  const data = parseSbQueryResult<flyway_schema_history>(result);
  if( isErrorInfo(data) ){
    return data;
  }

  return data;
}

/** @return undefined indicates a successful invocation **/
export async function store_event(
  db: SupabaseClient,
  params: store_sentry_event_params
):
  Promise<ErrorInfo | undefined>
{
  const result = await db.rpc(Functions.store_sentry_event, params);
  return parseSbVoidFunctionResult(result);
}

export async function queryListPublicUserInfo(db: SupabaseClient):
Promise<list_public_user_info[]|ErrorInfo>{
  const result = await db.
    from<list_public_user_info>(Tables.list_public_user_info).
    select().order("created", {ascending: false, nullsFirst: false});

  const data = parseSbQueryResult<list_public_user_info>(result);
  if( isErrorInfo(data) ){
    return data;
  }

  return data;
}

export async function queryReadPublicUserInfo(
  db: SupabaseClient, 
  uuid:string
): Promise<public_user_info|ErrorInfo>{
  const result = await db.from<public_user_info>(Tables.public_user_info).
    select().eq("uuid", uuid);

  const data = parseSbQueryResult<public_user_info>(result);
  if( isErrorInfo(data) ){
    return data;
  }
  
  if( data.length === 0 ){
    // haven't tested this yet
    return {message: "no row returned for uuid", uuid};
  }

  return data?.[0];
}

