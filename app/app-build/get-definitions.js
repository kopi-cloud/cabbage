
const axios = require('axios');
const assert = require("assert");
const log = console;

async function getGoogle(){
  // console.log("args", process.argv);
  const sbUrl = process.argv[2];
  assert(sbUrl, "supabase DB url must be provided, including apikey");

  // don't print the key
  log.debug("sbUrl", sbUrl.substring(0, sbUrl.indexOf("?")))

  let json = await axios.get(sbUrl);

  if( json.status !== 200 ){
    log.error("supbase get result", json);
    throw new Error("error status returned from supabase, see log");
  }

  if( json?.data?.info?.title !== "PostgREST API" ){
    log.error("supbase get result", json);
    throw new Error("unexpected result from supabase, see log");
  }

  console.log("paths", Object.keys(json.data.paths));
  console.log("definitions...");
  console.log(JSON.stringify(json.data.definitions, null, 2));
}

getGoogle().
then(()=>{console.log("completed successfully")}).
catch(error => {
  console.log("failed", error);
});


// axios.get('https://google.com')
//   .then(response => {
//     console.log(response.headers);
//     // console.log(response.data.explanation);
//   })
//   .catch(error => {
//     console.log(error);
//   });
//
