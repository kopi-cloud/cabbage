import * as React from "react";

export interface ErrorInfo {
  message: string | JSX.Element;
  problem: any;
}

export function isError<T>(e: T | Error): e is Error{
  if( e === undefined ){
    return false;
  }
  return (e as Error).stack !== undefined;
}

export function isErrorInfo<T>(e: T | ErrorInfo): e is ErrorInfo{
  if( e === undefined ){
    return false;
  }
  return (e as ErrorInfo).message !== undefined &&
    (e as ErrorInfo).problem !== undefined;
}

