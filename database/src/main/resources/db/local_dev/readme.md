The files in this directory aren't part of the database schema definition.

This entire directory and all its contents may be purged any point.  

And, of course, DO NOT COMMIT SENSITIVE DATA.

If you're working on production data, or with authentication keys or any
other kind of sensitive data - then you shouldn't be working with that stuff
in this directoy.

No, not even if you have an ignore file. If it's sensitive data - don't let
it anywhere near the source tree.


This is a "development-harness" area where you can put whatever SQL you want.

As with a development-harness, it's good to have a safe place where you can 
commit "work-in-progress" that is clearly defined as being "safe" from being
included into production or being subject to code-review requirements, etc. 

It's useful to have this in the repo because sometimes it's good to be able 
go back and look at the SQL your were slinging while figuring out how to 
do something / write the flyway migration scripts.

