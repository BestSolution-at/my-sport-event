FROM docker.io/library/alpine:3

RUN adduser -u 1000 -h /opt/mspe/ -G root -D dbinit
WORKDIR /opt/mspe/

ARG POSTGRES_VERSION=17
RUN apk add --no-cache postgresql${POSTGRES_VERSION}-client
USER dbinit

ENV SETUP_SQL_DATA_DIR=/opt/mspe/sql/

COPY setup.sh .
COPY sql/ ${SETUP_SQL_DATA_DIR}
COPY sql-generated/postgresql${POSTGRES_VERSION}.sql ${SETUP_SQL_DATA_DIR}/structure.sql

CMD [ "/opt/mspe/setup.sh" ]
