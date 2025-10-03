package at.mspe.server.jpa.eventcohort;

import at.mspe.server.jpa.Utils;
import at.mspe.server.jpa.model.CohortEntity;
import at.mspe.server.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.Cohort;
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
                        c
                    FROM
                        CohortEntity c
                    WHERE
                        c.event.key = :eventKey
                    AND c.key = :key
                    """, CohortEntity.class)
                    .setParameter("key", eventKey)
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
                    .name(entity.name)
                    .build();
        } else if (entity instanceof BirthyearCohortEntity be) {
            return factory.builder(BirthyearCohort.DataBuilder.class)
                    .key(be.key.toString())
                    .max(be.max)
                    .min(be.min)
                    .name(be.name)
                    .build();
        }

        throw new IllegalStateException("Unknown type '%s'".formatted(entity.getClass()));
    }
}
