This project is about managing the "dabatabase schema" over time via migrations.

It uses [Flyway](https://flywaydb.org/documentation/) to manage and apply 
the migrations to upgrade a schema to the latest version.

From a build perspective, the project is implemented as a 
[Gradle sub-project](https://docs.gradle.org/current/userguide/multi_project_builds.html) 
of the overall Cabbage project.

The actual migration files can be found in the 
[migration](src/main/resources/db/migration) directory. 

# Migrating an existing database

The gradle tasks use environment variables (as opposed to Java system 
properties) because that makes using Github actions simpler.

I normally run the tasks from within IDEA (which understands Gradle projects).
Here's an example of running the migration for the dev environment from the 
command line: 

* from the root of the Git repostiry (i.e. the parent directory to this one), 
  run:
  * `CABBAGE_TARGET_ENV=dev CABBAGE_DB_ID=xxx CABBAGE_DB_PASSWORD=xxx ./gradlew flywayMigrate flywayInfo`
  * see the [environment config doco](../doc/environment-config.md) for an 
  explanation of where to get the "database id" and password.


# Making a new database

If you want to fork and run your own copy of Cabbage, before worrying about 
doing any schema migration, you need to create a Supabase project and configure
Cabbage to use it.  
See the [environment config doco](../doc/environment-config.md) for a guide to 
creating and setting up a new Supabase project.

Flyway is configured to access the Supabase database directly via the
`postgres://` protocol (i.e. not using the REST API).

Note that a newly created Supabase db is *not* empty.

This means two things:
* you can't run `flywayClean` or any similar logic, or it'll break supabase
  * see https://github.com/supabase/supabase/discussions/344#discussioncomment-182886
* when starting from scratch on a new database, you must do a one-time call of 
`flywayBaseline` because if you try to just run `flywayMigrate`, it will fail 
because 'the public schema is not "empty"'
  * that's why the version numbers start from "V2", because "V1" will be 
  the initial baseline of the version history 
    
The inability to run `clean` logic means you want to avoid committing 
work-in-progress to the `migration` directory, use the `local_dev` directory
instead until you're ready to promote your work to the `migration` directory
at which point (once you push) your stuff will be including the automatic
migration of the DB for each environment.



