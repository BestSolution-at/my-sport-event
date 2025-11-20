#!/bin/sh
set -e

DATA_DIR=${SETUP_SQL_DATA_DIR:-./sql}

versionexists=$(psql -qtAc "SELECT to_regclass('meta_dbversion')")
if [ -z "$versionexists" ]; then
  echo "setting up database structure..."
  psql -v ON_ERROR_STOP=1 --single-transaction -f ${DATA_DIR}/setup_dbversion.sql -f ${DATA_DIR}/structure.sql
fi

# run all migrations if needed (in deployments the complete script is run against an existing
# database, thus all migrations should be listed here even though the structure.sql would set up
# the latest version)

dbversion=$(psql -qtAc "SELECT version FROM meta_dbversion ORDER BY id DESC LIMIT 1")
# if [ "$dbversion" -lt 2 ]; then
#  echo "running DB upgrades for version 0.2.0..."
#  psql -v ON_ERROR_STOP=1 --single-transaction -f ${DATA_DIR}/migrations/upgrade-0.2.0.sql
# fi
