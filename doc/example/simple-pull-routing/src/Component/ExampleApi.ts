
export interface VendorSummary {
  id: string,
  name: string,
}

export interface VendorDetail extends VendorSummary {
  description: string,
}

export async function listVendors(): Promise<VendorSummary[]>{
  await delay(1000);
  return [...database]; 
}

export async function getVendorDetail(vendorId: string)
: Promise<VendorDetail|undefined> {
  await delay(1000);
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

const database: VendorDetail[] = [
  {id: "vid-1", name: "Blue cabbages Incorporated", description: "sweet"},
  {id: "vid-2", name: "The purple cabbage Company", description: "savoury"},
]