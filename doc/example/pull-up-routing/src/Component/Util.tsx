import {useEffect, useRef} from 'react';

export function useIsMounted(){
  const isMounted = useRef(true);

  useEffect(()=>{
    return ()=>{isMounted.current = false;}
  }, []);

  return isMounted;
}

export function parseBoolean(val: string|null, defaultValue=false):boolean {
  try {
    return !!JSON.parse(String(val).toLowerCase());
  }
  catch( e ){
    return defaultValue;
  }
}