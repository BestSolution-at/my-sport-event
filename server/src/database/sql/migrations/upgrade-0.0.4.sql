ALTER TABLE Participant
    ADD COLUMN par_publish_name boolean;

UPDATE Participant
    SET par_publish_name = true;

ALTER TABLE Cohort
    ADD COLUMN coh_autoassign boolean;

UPDATE Cohort
    SET coh_autoassign = true;

ALTER TABLE IF EXISTS Participant
    ALTER COLUMN par_publish_name SET NOT NULL;
ALTER TABLE IF EXISTS Cohort
    ALTER COLUMN coh_autoassign SET NOT NULL;

ALTER TABLE SportEvent
    ADD COLUMN see_registration_url varchar(255);

INSERT INTO meta_dbversion (version) VALUES (2);