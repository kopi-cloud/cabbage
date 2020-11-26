create table sto_test_person (
  id int not null,
  name varchar(100) not null
);

comment on table flyway_schema_history is
'Flyway schema management. Flyway owns this, don''t touch it.';

comment on table STO_TEST_PERSON_V2 is
'Testing out flyway shennanigans';