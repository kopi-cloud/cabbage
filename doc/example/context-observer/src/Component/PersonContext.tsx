import React, {useCallback, useContext, useState} from "react";
import {Person} from "PersonApi";

export interface PersonContextState {
  person: Person,
  changePerson: (id: number)=>void,
}

const PersonContext = React.createContext({} as PersonContextState );
export const usePerson = ()=> useContext(PersonContext);

export function PersonContextProvider({initPerson, children}: {
  initPerson: Person, children: React.ReactNode
}){
  const[person, setPerson] = useState(initPerson);
  const changePerson = useCallback((id: number)=>{
    console.log("changePerson() called", id);
    setPerson({id: id, name: "person " + id});
  }, [setPerson]);

  return <PersonContext.Provider value={{
    person,
    changePerson,
  }}>
    {children}
  </PersonContext.Provider>;
}