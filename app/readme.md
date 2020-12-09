This diretory is both a gradle sub-project (of the larget project) and a
Node.js project.

The Gradle functionality is mostly just for downloading node/npm.
The [main.yml](/.github/workflows/main.yml) file does have a node install
step, but if the versions get out of sync - the Gradle tasks will use download
and use whatever version is specified in build.gradle.   

  * create-react-app project
  * material-ui as the component library
  * deployed to netlify, see [netlify.toml](/netlify.toml)

[App.tsx](src/App.tsx) comprises the structure of the app.


### Running locally

Run the npm `start` script to start a local dev server, you will need to provide
some env vars to connect to a dev supabase:
`REACT_APP_CABBAGE_ENV=DEV;REACT_APP_SUPABASE_ANON_KEY=xxx.yyy.zzz`


### Generating types

Run the npm `generate-types` build script, you need to add the supabase 
[swagger url](https://supabase.io/docs/client/generating-types#generate-database-types-from-swagger-openapi-specification)
as a command line arg: 
```
 https://<db id>>.supabase.co/rest/v1/?apikey=<xxx.yyy.zzz> 
```