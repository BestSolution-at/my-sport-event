
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
        par_birthday date,
        par_competionnumber varchar(255),
        par_email varchar(255),
        par_firstname varchar(255) not null,
        par_key uuid not null,
        par_lastname varchar(255) not null,
        par_team varchar(255),
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
