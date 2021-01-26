# Using your own Supabase DB

## Supabase setup

You would need to do this multiple times, depending on what environments you
want to use (local-dev, ci, tst, prd).

### Create Supabase project 

* login to Supabase and create a project
  * use a new, secure password for the project, save it somewhere like KeePass
* nav to `/ Authentication / Settings`
  * `site url` = `http://localhost:6042` or `https://rabbit-cabbage.netlify.app/`, etc.
    * the localhost port is configured in [.env](/app/.env)
    * I don't actually know what, if any, effect his has  
  * `disable email confirmations` = true
    * if you don't do this, any new user has to register with a real email a
      ddress that can follow the confirmation link in the signup email 
  * optional: enable google and github and populate with relevant 
    settings from those sevices
    * If you don't do this, you won't be able to use Single Sign-On
* nav to `/ Database / Backups`
  * click the `Backup now` button before doing anything so you can restore 
  back to this point if you mess anything up.
  * this is good to have in case you need to re-try steps. 
  A Supabase database is not "empty" and it's nice to be able to restart the 
  whole thing again without having to create new Supabase project (which 
  will change the "database id").



## Build environment configuration

* update [Config.ts](/app/src/Config.ts) with the value from `/ Api / URL`
  * if you're just doing local development, you can just supply the 
    `REACT_APP_SUPBASE_DEV_URL` environment variable when you 
    run `npm start` instead


## CI environment configuration

Intended for regression testing the `main` branch.  You don't need to configure
this environment if you don't want.  

Note: this won't work in a multi-person team, because regression testing would 
likely require exclusive access to the Supabase DB.  You'd need to find a 
way to lock the Github action so that it only runs one `main` action at a time.

I believe the Supabase folks have a plan for supporting branching workflows 
though, so eventually the regression testing will likely be done on a PR branch.
The other obvious alternative is to run Supabasee locally on the CI machine, 
which is allegedly do-able, but there's not a lot of doco on that yet.

* the Github CI pipeline is defined to run on the `main` branch, see 
  [main.yml](/.github/workflows/main.yml)
* In the Github UI, `/ Cabbage repository / Settings / Secrets`
  * add secret `CABBAGE_CI_DB_ID` = the project's unique "database id"
    * get this value from `/ Settings / Database / Host`, it's the "xxx" part 
      from "db.xxx.supabase.co"
    * writing this documentation makes me realise that coining my own special 
      "database id" concept was a mistake, I should've just used "host"
  * add secret `CABBAGE_CI_DB_PASSWORD` = password used when creating project   


## TST environment configuration

The `tst` git branch is published at:
[rabbit-cabbage.netlify.app](https://rabbit-cabbage.netlify.app/)

"Deploying" the app is done by merging to the `tst` branch and then pushing 
the commit to Github.

From there:

* the Supabase TST database will be migrated by the 
[tst.yml](/.github/workflows/tst.yml) Github action
* the App client will be built and deployed by netlify, as defined by 
  [netlify.toml](/netlify.toml).  This was configured by signing in to Netlify
  and creating a new "site" pointed at the `tst` branch.

Note that there's no synchronisation between Github and Nelify.
So the new DB *or* the new App might be deployed first.  Right now the DB
migration runs much faster than the app build, so the schema gets migrated 
before the app is deployed.  But with a production app - that 
would likely not be true - at least sometimes (think "large amounts of data 
and some data migration requirements").  

In a real situation, you'd need the DB schema to be both forward and backward
compatible (or just accept some downtime).  But that's not really a problem
that's exclusive to Supabase.  

Cross-version schema compatibility is a tricky 
issue you have to contend with any time you're aiming to do zero-downtime 
deployments with the ability to rollback.
It's not as hard as it sounds, but it does mean major schema changes often 
involve multiple deployments.
In my experience, that's usually a better plan than a big-bang deployment 
anyway.


## PRD environment configuration

If Cabbage were a real app, I'd define a "production" (`PRD`) environment and 
`TST` would be used as a "pre-production" environment. 

There's no need for that at the moment since Cabbage is just a demonstration.
I created/planned out all these different environments as an exercise to 
feel out what it might look like if I wanted to use Supabase for a produciton
app.


### Baseline the Supabase database

Because a Supabase database is not empty  - we need to do a one-time
"baseline" operation to prepare the database before Flyway schema migrations
can be run.

If you haven't run the baseline task, you'll see an error like 
"database is not empty" when you try to run a Flyway migration.

Using the Github UI: 

* ` / Cabbage repo / Actions / baseline-<env>-database`
* click the "Run workflow" button
* this will run the Flyway baseline task for the database (`CI` or `TST` to 
  set it up)   





