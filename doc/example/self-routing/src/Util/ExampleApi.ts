/**
 Simple example stand-in for a real backend API.
 */
export const simulatedApiDelay = 1000;

const database: VendorDetail[] = [
  {id: "vid-1", name: "Blue cabbages Incorporated", description: "sweet"},
  {id: "vid-2", name: "The purple cabbage Company", description: "savoury"},
  {id: "vid-3", name: "Cabbages 'r' Us", description: "savoury"},
]

export interface VendorSummary {
  id: string,
  name: string,
}

export interface VendorDetail extends VendorSummary {
  description: string,
}

export async function listVendors(
  matchingName: string = "",
  sortAscending: boolean = true,
): Promise<VendorSummary[]>{
  await delay(simulatedApiDelay);
  let result =  [...database];
  
  result = result.filter(i => {
    return i.name.toLowerCase().includes(matchingName.toLowerCase())
  }).sort((left, right) => left.name.localeCompare(right.name));
  if( !sortAscending ){
    result = result.reverse();
  }
  return result;
}

export async function getVendorDetail(vendorId: string)
: Promise<VendorDetail|undefined> {
  await delay(simulatedApiDelay);
  const found = database.find(iVendor => iVendor.id === vendorId)
  if( !found ){
    return undefined;
  }
  return {...found}; 
}

function delay(ms: number, msg?: string):Promise<never> {
  return new Promise(resolve => {
    if( msg ) {
      console.trace(msg);
    }
    setTimeout(resolve, ms)
  });
}
