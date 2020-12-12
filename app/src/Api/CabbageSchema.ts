import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";

// this stuff will be generated from the DB, eventually
export const Tables = {
  public_user_info : 'public_user_info',
  private_user_info : 'private_user_info',
}

export const Columns = {
  public_user_info: {
    uuid: "uuid",
    display_name: "display_name",
  },
  private_user_info: {
    uuid: "uuid",
    contact_details: "contact_details",
  },
}

export interface public_user_info {
  uuid: string,
  display_name?: string,
}

export interface private_user_info {
  uuid: string,
  contact_details?: string,
}



