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



