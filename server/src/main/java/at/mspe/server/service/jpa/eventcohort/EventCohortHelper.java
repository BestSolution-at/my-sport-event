package at.mspe.server.service.jpa.eventcohort;

import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.Cohort;
import at.mspe.server.service.model.Gender;
import at.mspe.server.service.model.GenericCohort;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class EventCohortHelper {
    public static String NOT_FOUND = "Cohort with key '%s' for event '%s' not found.";

    public static CohortEntity findCohort(EntityManager em, String _eventKey, String _key) {
        var eventKey = Utils.parseUUID(_eventKey, SportEventHelper.NOT_FOUND);
        var key = Utils.parseUUID(_key, k -> NOT_FOUND.formatted(k, _eventKey));
        try {
            return em.createQuery("""
                    SELECT
                        co
                    FROM
                        Cohort co
                    WHERE
                        co.sportEvent.key = :eventKey
                    AND co.key = :key
                    """, CohortEntity.class)
                    .setParameter("eventKey", eventKey)
                    .setParameter("key", key)
                    .getSingleResult();
        } catch (NoResultException ex) {
            throw new NotFoundException(NOT_FOUND.formatted(_key, _eventKey));
        }
    }

    public static Cohort.Data toData(CohortEntity entity, BuilderFactory factory) {
        if (entity instanceof GenericCohortEntity) {
            return factory.builder(GenericCohort.DataBuilder.class)
                    .key(entity.key.toString())
                    .version(entity.version)
                    .name(entity.name)
                    .gender(Gender.valueOf(entity.gender.toString()))
                    .build();
        } else if (entity instanceof BirthyearCohortEntity be) {
            return factory.builder(BirthyearCohort.DataBuilder.class)
                    .key(be.key.toString())
                    .version(entity.version)
                    .max(be.max)
                    .min(be.min)
                    .name(be.name)
                    .gender(Gender.valueOf(entity.gender.toString()))
                    .build();
        }

        throw new IllegalStateException("Unknown type '%s'".formatted(entity.getClass()));
    }
}
