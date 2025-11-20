#!/bin/sh
set -e

DATA_DIR=${SETUP_SQL_DATA_DIR:-./sql}

event_count=$(psql -qtAc "SELECT COUNT(*) FROM SportEvent")
if [ "$event_count" -gt 0 ]; then
  echo "data already present, no further demo data will be loaded"
  exit 0
else
  for sql in $(ls ${DATA_DIR}/*.sql); do
    echo "loading demo data file: $(basename ${sql})"
    psql -v ON_ERROR_STOP=1 --single-transaction -f ${sql}
  done
fi
