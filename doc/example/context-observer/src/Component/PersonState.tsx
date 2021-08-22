import {useCallback, useState} from "react";
import {loadPerson} from "PersonApi";

export function usePerson(startId: number){
  const [person, setPerson] = useState(loadPerson(startId));

  const changePerson = useCallback((id: number) => {
    console.log("changePerson() called", id);
    setPerson(loadPerson(id));
  }, [setPerson]);

  return {person, changePerson}
}