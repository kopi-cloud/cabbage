import {ErrorInfo} from "Error/ErrorUtil";

export function parseSbQueryResult<T>(selectResult: any):ErrorInfo|T[]{
  if( selectResult.error ){
    return { problem: selectResult.error,
      message: selectResult.error.message ?? "problem while loading data" };
  }
  if( selectResult?.data === null || selectResult?.data === undefined ){
    return { problem: "no data",
      message: "no data returned from query" };
  }

  return selectResult.data as T[]
}


export function parseSbVoidFunctionResult(selectResult: any):ErrorInfo|undefined{
  if( selectResult.error ){
    return { problem: selectResult.error,
      message: selectResult.error.message ?? "problem while calling function" };
  }
  return undefined;
}
