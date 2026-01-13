ALTER TABLE Participant
    ADD COLUMN par_publish_name boolean NOT NULL DEFAULT true;

INSERT INTO meta_dbversion (version) VALUES (2);