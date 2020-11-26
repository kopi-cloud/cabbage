create table sto_test_person (
  id int not null,
  name varchar(100) not null
);

comment on table flyway_schema_history is
'Flyway schema management. Flyway owns this, don''t touch it.';

comment on table sto_test_person is
'Testing out flyway shennanigans';