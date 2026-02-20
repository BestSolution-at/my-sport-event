ALTER TABLE SportEvent ADD COLUMN see_status smallint check (see_status between 0 and 3);

UPDATE SportEvent SET see_status = 0;

ALTER TABLE Sportevent ALTER COLUMN see_status SET NOT NULL;

INSERT INTO meta_dbversion (version) VALUES (3);