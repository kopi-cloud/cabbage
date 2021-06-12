This project is the client "app" for Cabbage.  

It's a [create-react-app](https://create-react-app.dev/) project, statically
typed using [Typescript](https://www.typescriptlang.org/), using 
[Material UI](https://material-ui.com/) as the component library.
Note that, at the moment, Cabbage uses an alpha version of Material-UI 
version 5. 

From a build perspective, the project is implemented as both a
[Gradle sub-project](https://docs.gradle.org/current/userguide/multi_project_builds.html)
(of the larger Cabbage project) and a standalone Node.js project.

The Gradle functionality is mostly just for downloading node/npm.
The [main.yml](/.github/workflows/main.yml) file does have a node install
step, but if the versions get out of sync - the Gradle tasks will use download
and use whatever version is specified in build.gradle.   

  * create-react-app project
  * material-ui as the component library
  * deployed to netlify, see [netlify.toml](/netlify.toml)


### Architecture

[App.tsx](src/App.tsx) is the place to start to see how the app works.
It's what I call a 
[Funnel architecture](http://kopi.cloud/blog/2021/funnel-architecture/).


### Running locally

Run the npm `start` script to start a local dev server, you will need to provide
some env vars to connect to a dev supabase:
`REACT_APP_CABBAGE_ENV=DEV;REACT_APP_SUPABASE_ANON_KEY=xxadd intro contax.yyy.zzz`

Look in the Supabase UI under /Settings/API/API Keys for your anon key.
Remember that Supabase will "pause" your DB after it's been inactive for a while 
(1 week at the moment for free tier: https://supabase.io/pricing).


### Generating types

*Note*: Type generation is a WIP.  At the moment, I write the types used by 
Cabbage [by hand](./src/Api/CabbageSchema.ts).

Run the npm `generate-types` build script, you need to add the supabase 
[swagger url](https://supabase.io/docs/client/generating-types#generate-database-types-from-swagger-openapi-specification)
as a command line arg: 
```
 https://<db id>>.supabase.co/rest/v1/?apikey=<xxx.yyy.zzz> 
```
