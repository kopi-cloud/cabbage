import React from 'react';
import {PersonContextProvider, usePerson} from "Component/PersonContext";
import {loadPerson} from "PersonApi";

const screenPath = "/context";

export function getContextScreenPath(){
  return screenPath;
}

function isContextScreenPath(location: string): boolean{
  return location === screenPath;
}

export function PersonContextScreen(){
  if( !isContextScreenPath(window.location.pathname) ){
    return null;
  }
  window.document.title = "context-observer / Context"
  return <Content/>;
}

function Content(){
  return <div>
    <h1>Context Screen</h1>
    
    <h2>Person widgets</h2>
    <PersonContextProvider initPerson={loadPerson(1)}>
      <PersonDisplay/>
      <PersonChange/>
    </PersonContextProvider>
  </div>
}

function PersonDisplay(){
  const {person} = usePerson();
  return <div>
    Person: {person?.name ?? "not defined"}
  </div>
}

function PersonChange(){
  const person = usePerson();
  return <div>
    <button type={"button"} onClick={e=>{
      e.preventDefault();
      person.changePerson(person.person.id + 1);
    }
    }>Change person</button>
  </div>
}




