
    create sequence cohort_seq_id start with 1 increment by 1;

    create sequence participant_seq_id start with 1 increment by 1;

    create sequence sportevent_seq_id start with 1 increment by 1;

    create table BirthyearCohort (
        coh_max integer not null,
        coh_min integer not null,
        coh_id bigint not null,
        primary key (coh_id)
    );

    create table Cohort (
        coh_type integer not null,
        coh_id bigint not null,
        coh_gender smallint check (coh_gender between 0 and 2),
        coh_key uuid not null unique,
        coh_name varchar(255),
        coh_version bigint,
        coh_fk_sportevent bigint not null,
        primary key (coh_id)
    );

    create table GenericCohort (
        coh_id bigint not null,
        primary key (coh_id)
    );

    create table Participant (
        par_id bigint not null,
        par_association varchar(255),
        par_birthday date,
        par_competionnumber varchar(255),
        par_email varchar(255),
        par_firstname varchar(255) not null,
        par_gender smallint not null check (par_gender between 0 and 2),
        par_key uuid not null,
        par_lastname varchar(255) not null,
        par_team varchar(255),
        par_time bigint,
        par_version bigint,
        par_fk_cohort bigint,
        par_fk_sportevent bigint not null,
        primary key (par_id)
    );

    create table SportEvent (
        see_id bigint not null,
        see_date timestamp(6) with time zone not null,
        see_key uuid not null,
        see_name varchar(255) not null,
        see_version bigint,
        primary key (see_id),
        constraint sportevent_uq_key unique (see_key)
    );

    alter table if exists BirthyearCohort 
       add constraint FKo30cxi0bx2o049o72k9ikf9xl 
       foreign key (coh_id) 
       references Cohort;

    alter table if exists Cohort 
       add constraint coh_fkey_sportevent 
       foreign key (coh_fk_sportevent) 
       references SportEvent;

    alter table if exists GenericCohort 
       add constraint FKfblrp5hdqjfb4xj8u3wbybw87 
       foreign key (coh_id) 
       references Cohort;

    alter table if exists Participant 
       add constraint par_fkey_cohort 
       foreign key (par_fk_cohort) 
       references Cohort;

    alter table if exists Participant 
       add constraint par_fkey_sportevent 
       foreign key (par_fk_sportevent) 
       references SportEvent;
INSERT INTO SportEvent (see_id, see_date, see_key, see_name, see_version) VALUES;
(nextval('sportevent_seq_id'), '2024-07-15 09:00:00+00', '8784ad6c-36f9-4bc9-9a53-f4a4807c7326', 'City Marathon 2024', 1),;
(nextval('sportevent_seq_id'), '2024-08-20 10:00:00+00', '7e81030d-2e62-4f35-a270-781a0a6b73b4', 'Ski Downhill 2024', 1);
INSERT INTO Cohort;
(;
coh_id,;
coh_key,;
coh_name,;
coh_fk_sportevent,;
coh_version,;
coh_type,;
coh_gender;
);
VALUES;
(;
nextval('cohort_seq_id'),;
'c8b51d14-f23e-402d-a827-ead331f372d3',;
'Guest Male Cohort',;
1,;
1,;
1,;
0;
);
INSERT INTO GenericCohort (coh_id) VALUES (currval('cohort_seq_id'));
INSERT INTO Cohort;
(;
coh_id,;
coh_key,;
coh_name,;
coh_fk_sportevent,;
coh_version,;
coh_type,;
coh_gender;
);
VALUES;
(;
nextval('cohort_seq_id'),;
'4f816604-9f4f-4946-abdb-13ada2078b3d',;
'Guest Female Cohort',;
1,;
1,;
1,;
1;
);
INSERT INTO GenericCohort (coh_id) VALUES (currval('cohort_seq_id'));
INSERT INTO Cohort;
(;
coh_id,;
coh_key,;
coh_name,;
coh_fk_sportevent,;
coh_version,;
coh_type,;
coh_gender;
);
VALUES;
(;
nextval('cohort_seq_id'),;
'df7ab05b-092b-4eb6-8842-041bffcf1d16',;
'Male Common I',;
1,;
1,;
2,;
0;
);
INSERT INTO BirthyearCohort;
(;
coh_id,;
coh_min,;
coh_max;
);
VALUES;
(;
currval('cohort_seq_id'),;
1980,;
1990;
);
INSERT INTO Participant;
(;
par_id,;
par_key,;
par_version,;
par_firstname,;
par_lastname,;
par_gender,;
par_fk_sportevent,;
par_birthday;
);
VALUES;
(;
nextval('participant_seq_id'),;
'729490b1-20f2-49e1-9179-1aa9a7373667',;
1,;
'John',;
'Doe',;
0,;
1,;
'1985-05-20';
);
