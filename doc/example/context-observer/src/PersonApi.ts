export interface Person {
  id: number,
  name: string,
}

export function loadPerson(id: number): Person {
  // imagine this loads from an api/database or something 
  return {
    id,
    name: "person " + id,
  }
}