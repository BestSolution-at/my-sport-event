package at.mspe.server.service.jpa.cohort;

import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;
import java.util.function.ToIntFunction;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.Cohort;
import at.mspe.server.service.model.Gender;
import at.mspe.server.service.model.GenericCohort;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class CohortHelper {
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

    public static Cohort.Data toData(
            CohortEntity entity,
            BuilderFactory factory,
            ToIntFunction<UUID> participantCountProvider) {
        if (entity instanceof GenericCohortEntity) {
            return factory.builder(GenericCohort.DataBuilder.class)
                    .key(entity.key.toString())
                    .version(entity.version)
                    .autoAssign(entity.autoAssign)
                    .name(entity.name)
                    .gender(Gender.valueOf(entity.gender.toString()))
                    .participantCount(participantCountProvider.applyAsInt(entity.key))
                    .build();
        } else if (entity instanceof BirthyearCohortEntity be) {
            return factory.builder(BirthyearCohort.DataBuilder.class)
                    .key(be.key.toString())
                    .version(entity.version)
                    .autoAssign(entity.autoAssign)
                    .max(be.max)
                    .min(be.min)
                    .name(be.name)
                    .gender(Gender.valueOf(entity.gender.toString()))
                    .participantCount(participantCountProvider.applyAsInt(entity.key))
                    .build();
        }

        throw new IllegalStateException("Unknown type '%s'".formatted(entity.getClass()));
    }

    public static CohortEntity findMatchingCohort(EntityManager em, ParticipantEntity participant) {
        var list = em.createQuery("""
                    SELECT
                        c
                    FROM
                        Cohort c
                    WHERE
                        c.sportEvent.id = :id
                    AND c.autoAssign = true
                """, CohortEntity.class)
                .setParameter("id", participant.sportEvent.id)
                .getResultList();
        // try to find correct birthyear cohort
        if (participant.birthday != null) {
            var birthday = participant.birthday;
            return list.stream()
                    .filter(c -> c.gender == participant.gender)
                    .filter(c -> c instanceof BirthyearCohortEntity)
                    .map(BirthyearCohortEntity.class::cast)
                    .filter(Objects::nonNull)
                    .filter(c -> containsDate(birthday, LocalDate.of(c.min, 1, 1), LocalDate.of(c.max, 12, 31)))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    private static boolean containsDate(LocalDate date, LocalDate min, LocalDate max) {
        return min.compareTo(date) <= 0 && max.compareTo(date) >= 0;
    }
}
