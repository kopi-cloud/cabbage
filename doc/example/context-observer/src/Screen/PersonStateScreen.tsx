import React from 'react';
import {Person} from "PersonApi";
import {usePerson} from "Component/PersonState";

const screenPath = "/state";

export function getStateScreenPath(){
  return screenPath;
}

function isStateScreenPath(location: string): boolean{
  return location === screenPath;
}

export function PersonStateScreen(){
  if( !isStateScreenPath(window.location.pathname) ){
    return null;
  }
  window.document.title = "context-observer / State"
  return <Content/>;
}

function Content(){
  const personState = usePerson(1);
  return <div>
    <h1>State Screen</h1>
    
    <h2>Person widgets</h2>
    <PersonDisplay person={personState.person}/>
    { personState &&
      <PersonChange changePerson={()=> 
        personState.changePerson(personState.person.id + 1)
      }/>
    }
  </div>
}

function PersonDisplay({person}: {person: Person}){
  return <div>
    Person: {person?.name ?? "not defined"}
  </div>
}

function PersonChange({changePerson}:{changePerson:()=>void}){
  return <div>
    <button type={"button"} onClick={e=>{
      e.preventDefault();
      changePerson();
    }
    }>Change person</button>
  </div>
}




