import {SyntheticEvent} from "react";

export function stopClick(e: SyntheticEvent<any>){
  e.preventDefault();
  e.stopPropagation();
}

export function delay(ms: number):Promise<never> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

