INSERT INTO SportEvent (see_id, see_date, see_key, see_name, see_version) VALUES
(nextval('sportevent_seq_id'), '2024-07-15 09:00:00+00', '8784ad6c-36f9-4bc9-9a53-f4a4807c7326', 'City Marathon 2024', 1),
(nextval('sportevent_seq_id'), '2024-08-20 10:00:00+00', '7e81030d-2e62-4f35-a270-781a0a6b73b4', 'Ski Downhill 2024', 1);

-- Generic Male
INSERT INTO Cohort 
(
    coh_id, 
    coh_key,
    coh_name, 
    coh_fk_sportevent, 
    coh_version, 
    coh_type, 
    coh_gender
) 
VALUES
(
    nextval('cohort_seq_id'), 
    'c8b51d14-f23e-402d-a827-ead331f372d3',
    'Guest Male Cohort', 
    1, 
    1, 
    1, 
    0
);

INSERT INTO GenericCohort (coh_id) VALUES (currval('cohort_seq_id'));

-- Generic Female
INSERT INTO Cohort 
(
    coh_id, 
    coh_key,
    coh_name, 
    coh_fk_sportevent, 
    coh_version, 
    coh_type, 
    coh_gender
) 
VALUES
(
    nextval('cohort_seq_id'), 
    '4f816604-9f4f-4946-abdb-13ada2078b3d',
    'Guest Female Cohort', 
    1, 
    1, 
    1, 
    1
);

INSERT INTO GenericCohort (coh_id) VALUES (currval('cohort_seq_id'));

-- BirthyearCohort - Male 1980-1990
INSERT INTO Cohort 
(
    coh_id, 
    coh_key,
    coh_name, 
    coh_fk_sportevent, 
    coh_version, 
    coh_type,
    coh_gender
)
VALUES
(
    nextval('cohort_seq_id'), 
    'df7ab05b-092b-4eb6-8842-041bffcf1d16',
    'Male Common I', 
    1, 
    1, 
    2, 
    0
);
INSERT INTO BirthyearCohort 
(
    coh_id,
    coh_min,
    coh_max
) 
VALUES
(
    currval('cohort_seq_id'),
    1980,
    1990
);

-- Participant
INSERT INTO Participant 
(
    par_id,
    par_key,
    par_version,
    par_firstname,
    par_lastname,
    par_gender,
    par_fk_sportevent,
    par_birthday
) 
VALUES
(
    nextval('participant_seq_id'),
    '729490b1-20f2-49e1-9179-1aa9a7373667',
    1,
    'John',
    'Doe',
    0,
    1,
    '1985-05-20'
);