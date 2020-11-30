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


