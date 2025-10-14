package at.mspe.server.service.jpa.participant;

import java.util.List;
import java.util.function.Function;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.model.Gender;
import at.mspe.server.service.model.Participant;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class ParticipantHelper {
    public static String NOT_FOUND = "Participant with key '%s' for event '%s' not found.";

    public static ParticipantEntity findParticipant(EntityManager em, String _eventKey, String _key) {
        var eventKey = Utils.parseUUID(_eventKey, SportEventHelper.NOT_FOUND);
        var key = Utils.parseUUID(_key, k -> NOT_FOUND.formatted(k, _eventKey));
        try {
            return em.createQuery("""
                        SELECT
                            p
                        FROM
                            Participant as p
                        WHERE
                            p.sportEvent.eventKey = :eventKey
                        AND p.key = :key
                    """, ParticipantEntity.class)
                    .setParameter("eventKey", eventKey)
                    .setParameter("key", key)
                    .getSingleResult();
        } catch (NoResultException ex) {
            throw new NotFoundException(NOT_FOUND.formatted(_key, _eventKey));
        }
    }

    public static Participant.Data toData(BuilderFactory builderFactory, ParticipantEntity entity,
            Function<ParticipantEntity, List<String>> teamMatesLookup) {
        return builderFactory.builder(Participant.DataBuilder.class)
                .key(entity.key.toString())
                .version(entity.version)
                .association(entity.association)
                .birthday(entity.birthday)
                .firstname(entity.firstname)
                .gender(Gender.valueOf(entity.gender.name()))
                .lastname(entity.lastname)
                .team(entity.team)
                .teamMates(entity.team == null || entity.team.isBlank() ? List.of() : teamMatesLookup.apply(entity))
                .build();
    }

    public static String toString(ParticipantEntity p) {
        return "%s %s".formatted(p.lastname, p.firstname);
    }
}
