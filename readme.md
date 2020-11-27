# Cabbage

Cabbage is my play area for learning about 
[Supabase](https://github.com/supabase/supabase).

The app is published on Netlify: 
[rabbit-cabbage](https://rabbit-cabbage.netlify.app/) 
(site is published from the `tst` branch).

I'm using Gradle, Flyway, Java etc. just because they're the tools that I know 
best, not saying this is the right way to do it.

## Structure 

* [.github](/.github) - github action config
* [/app/](/app) - client app
* [/database/](/database) - database schema management
  * gradle sub-project 
  * uses Flyway, connects to Supabase via `postgres://` protocol (yikes!)
* [/doc/](/doc) - misc documentation, notes, etc.
* [/gradle/](/gradle) - gradle wrapper stuff
  * used for bootstrapping Gradle
  

