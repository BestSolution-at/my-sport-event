package at.mspe.server;

import java.time.ZonedDateTime;
import java.util.UUID;

import org.hibernate.StatelessSession;
import org.junit.jupiter.api.BeforeEach;

import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.model.SportEventEntity;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

public class BaseTest {
    @Inject
    EntityManager em;

    @Inject
    StatelessSession session;

    public String SimpleEmptyEventKey;
    public String FullEventKey;

    public String FullEvent_GenericCohortKey;
    public String FullEvent_BirthyearCohortKey;
    public String FullEvent_GenericCohortNotReferencedKey;

    public String FullEvent_ParticpantKey;
    public String FullEvent_ParticpantWithGenericCohortKey;
    public String FullEvent_ParticpantWithBirthyearCohortKey;

    @BeforeEach
    @Transactional
    public void setupDatabase() {
        setupSimpleEmptyEvent();
        setupFullEvent();
    }

    private void setupSimpleEmptyEvent() {
        var event = SportEventEntity.builder()
                .key(UUID.randomUUID())
                .date(ZonedDateTime.parse("2000-01-01T10:00:00Z"))
                .name("Simple Event")
                .build();
        em.persist(event);
        this.SimpleEmptyEventKey = event.key.toString();
    }

    private void setupFullEvent() {
        var event = SportEventEntity.builder()
                .key(UUID.randomUUID())
                .date(ZonedDateTime.parse("2000-01-02T10:00:00Z"))
                .name("Simple Full Event")
                .build();
        em.persist(event);
        em.flush();

        {
            var participant = ParticipantEntity.builder()
                    .key(UUID.randomUUID())
                    .firstname("John")
                    .lastname("Doe")
                    .sportEvent(event)
                    .build();
            em.persist(participant);
            this.FullEvent_ParticpantKey = participant.key.toString();
            em.flush();
        }

        {

            var cohort = GenericCohortEntity.builder()
                    .key(UUID.randomUUID())
                    .name("Generic Cohort - not referenced")
                    .sportEvent(event)
                    .build();
            em.persist(cohort);
            this.FullEvent_GenericCohortNotReferencedKey = cohort.key.toString();
        }

        {
            var cohort = GenericCohortEntity.builder()
                    .key(UUID.randomUUID())
                    .name("Generic Cohort")
                    .sportEvent(event)
                    .build();
            em.persist(cohort);
            this.FullEvent_GenericCohortKey = cohort.key.toString();
            em.flush();

            {
                var participant = ParticipantEntity.builder()
                        .key(UUID.randomUUID())
                        .firstname("Jane")
                        .lastname("Dune")
                        .sportEvent(event)
                        .cohort(cohort)
                        .build();
                em.persist(participant);
                this.FullEvent_ParticpantWithGenericCohortKey = participant.key.toString();
            }
            em.flush();
        }

        {
            var cohort = BirthyearCohortEntity.builder()
                    .key(UUID.randomUUID())
                    .name("Birthyear Cohort")
                    .min(1970)
                    .max(1980)
                    .sportEvent(event)
                    .build();
            em.persist(cohort);
            this.FullEvent_BirthyearCohortKey = cohort.key.toString();
            em.flush();

            {
                var participant = ParticipantEntity.builder()
                        .key(UUID.randomUUID())
                        .firstname("Jim")
                        .lastname("Dome")
                        .sportEvent(event)
                        .cohort(cohort)
                        .build();
                em.persist(participant);
                this.FullEvent_ParticpantWithBirthyearCohortKey = participant.key.toString();
                em.flush();
            }

        }

        this.FullEventKey = event.key.toString();
        em.flush();
    }

    public SportEventEntity getSportEventEntity(String key) {
        var query = session.createQuery("""
                SELECT
                    se
                FROM
                    SportEvent se
                WHERE
                    se.key = :key
                """, SportEventEntity.class);
        query.setParameter("key", UUID.fromString(key));
        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public CohortEntity getCohortEntity(String key) {
        var query = session.createQuery("""
                SELECT
                    co
                FROM
                    Cohort co
                WHERE
                    co.key = :key
                """, CohortEntity.class);
        query.setParameter("key", UUID.fromString(key));
        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public ParticipantEntity getParticipantEntity(String key) {
        var query = session.createQuery("""
                SELECT
                    pa
                FROM
                    Participant pa
                LEFT JOIN FETCH pa.cohort
                WHERE
                    pa.key = :key
                """, ParticipantEntity.class);
        query.setParameter("key", UUID.fromString(key));
        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
