
// This file is currently maintained by hand.
// This stuff is intended to be generated from the DB schema, eventually.

export const Tables = {
  public_user_info : 'public_user_info',
  list_public_user_info : 'list_public_user_info',
  private_user_info : 'private_user_info',
  flyway_schema_history : 'flyway_schema_history',
}

export const Functions = {
  store_sentry_event: 'store_sentry_event',
}

const publicUserInfoColumns = {
  uuid: "uuid",
  display_name: "display_name",
  about: "about",
};

export const Columns = {
  public_user_info: publicUserInfoColumns,
  list_public_user_info: {
    ...publicUserInfoColumns,
    created: "created",
  },
  private_user_info: {
    uuid: "uuid",
    contact_details: "contact_details",
  },
  flyway_schema_history: {
    installed_rank: "installed_rank",
    version: "version",
    description: "description",
    type: "type",
    script: "script",
    checksum: "checksum",
    installed_by: "installed_by",
    installed_on: "installed_on",
    execution_time: "execution_time",
    success: "success",
  },
}

export interface store_sentry_event_params {
  // I'm going with unknown for the moment until I need more, or someone resolves
  // https://github.com/microsoft/TypeScript/issues/1897
  json_content: unknown,
}

export interface public_user_info {
  uuid: string,
  display_name?: string,
  about?: string,
}

export interface list_public_user_info extends public_user_info {
  // row in auth.users table might be deleted? 
  created?: "string",
}

export interface private_user_info {
  uuid: string,
  contact_details?: string,
}

export interface flyway_schema_history {
  installed_rank: number,
  version?: string,
  description: string,
  type: string,
  script: string,
  checksum: number,
  installed_by: string,
  installed_on: string,
  execution_time: number,
  success: boolean,
}



