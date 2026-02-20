package at.mspe.server.service.jpa.participant;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.model.Gender;
import at.mspe.server.service.model.Participant;
import at.mspe.server.service.model.RSDFile;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class ParticipantHelper {
    public record CsvEntry(String gender, String lastname, String firstname, String birthyear, String key,
            String time) {
    }

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
                            p.sportEvent.key = :eventKey
                        AND p.key = :key
                    """, ParticipantEntity.class)
                    .setParameter("eventKey", eventKey)
                    .setParameter("key", key)
                    .getSingleResult();
        } catch (NoResultException ex) {
            throw new NotFoundException(NOT_FOUND.formatted(_key, _eventKey));
        }
    }

    public static Map<String, ParticipantEntity> getParticipantsByKey(EntityManager em, String _eventKey) {
        var eventKey = Utils.parseUUID(_eventKey, SportEventHelper.NOT_FOUND);
        return em.createQuery("""
                SELECT
                    p
                FROM
                    Participant p
                WHERE
                    p.sportEvent.key = :eventKey
                    """, ParticipantEntity.class)
                .setParameter("eventKey", eventKey)
                .getResultList()
                .stream()
                .collect(Collectors.toMap(p -> p.key.toString(), Function.identity()));
    }

    public static Map<String, CsvEntry> parseParticipantsCsv(EntityManager em, String _eventKey, RSDFile csv) {
        var reader = new BufferedReader(new InputStreamReader(csv.stream(), StandardCharsets.UTF_8));
        return reader.lines()
                .map(line -> line.split("\t"))
                .filter(cells -> cells.length >= 6)
                .map(cells -> {
                    var gender = cells[0].trim();
                    var lastname = cells[1].trim();
                    var firstname = cells[2].trim();
                    var birthyear = cells[3].trim();
                    var key = cells[4].trim();
                    var time = cells[5].trim();
                    return new CsvEntry(gender, lastname, firstname, birthyear, key, time);
                })
                .collect(Collectors.toMap(e -> e.key, Function.identity()));
    }

    public static Participant.Data toData(BuilderFactory builderFactory, ParticipantEntity entity,
            Function<ParticipantEntity, List<String>> teamMatesLookup) {
        var b = builderFactory.builder(Participant.DataBuilder.class)
                .key(entity.key.toString())
                .version(entity.version)
                .association(entity.association)
                .birthday(entity.birthday)
                .cohortKey(entity.cohort() == null ? null : entity.cohort().key.toString())
                .firstname(entity.firstname)
                .gender(Gender.valueOf(entity.gender.name()))
                .lastname(entity.lastname)
                .team(entity.team)
                .teamMates(entity.team == null || entity.team.isBlank() ? List.of() : teamMatesLookup.apply(entity))
                .publishName(entity.publishName);
        if (entity.time != null) {
            b.time(entity.time);
        }
        return b.build();
    }

    public static String toString(ParticipantEntity p) {
        return "%s %s".formatted(p.lastname, p.firstname);
    }
}
