CREATE TABLE meta_dbversion (
  id SERIAL PRIMARY KEY,
  version integer NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO meta_dbversion (version) VALUES (1);
