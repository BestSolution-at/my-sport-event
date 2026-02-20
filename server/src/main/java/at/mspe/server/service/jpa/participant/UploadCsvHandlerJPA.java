package at.mspe.server.service.jpa.participant;

import java.time.Duration;
import java.time.LocalTime;
import java.util.HashMap;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.model.RSDFile;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UploadCsvHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.UploadCsvHandler {
    @Inject
    public UploadCsvHandlerJPA(EntityManager em) {
        super(em);
    }

    @Transactional
    @Override
    public void uploadCsv(BuilderFactory _factory,
            String eventKey,
            RSDFile csv) throws NotFoundException, InvalidDataException {
        accept(em -> uploadCsv(em, _factory, eventKey, csv));
    }

    public void uploadCsv(EntityManager em,
            BuilderFactory _factory,
            String eventKey,
            RSDFile csv) throws NotFoundException, InvalidDataException {
        var participants = new HashMap<>(ParticipantHelper.getParticipantsByKey(em, eventKey));
        var csvEntries = ParticipantHelper.parseParticipantsCsv(em, eventKey, csv);
        for (var entry : csvEntries.entrySet()) {
            var key = entry.getKey();
            var csvEntry = entry.getValue();
            var participant = participants.remove(key);
            if (participant == null) {
                // ParticipantCreatorJPA.createParticipant(em, eventKey, csvEntry);
            } else {
                participant.time = parseTime(csvEntry.time());
                em.persist(participant);
            }
        }
    }

    private static String padEnd(String s, int length) {
        if (s.length() >= length) {
            return s;
        }
        return s + "0".repeat(length - s.length());
    }

    public static long parseTime(String time) {
        System.err.println("Parsing time: " + time);
        var parts = time.split(":");

        Duration d;
        if (parts.length == 3) {
            if (parts[2].contains(".")) {
                d = Duration.ofHours(Long.parseLong(parts[0]))
                        .plusMinutes(Long.parseLong(parts[1]))
                        .plusSeconds(Long.parseLong(parts[2].split("\\,")[0]))
                        .plusMillis(Long.parseLong(padEnd(parts[2].split("\\,")[1], 3)));
            } else {
                d = Duration.ofHours(Long.parseLong(parts[0]))
                        .plusMinutes(Long.parseLong(parts[1]))
                        .plusSeconds(Long.parseLong(parts[2]));
            }
        } else if (parts.length == 2) {
            if (parts[1].contains(",")) {
                d = Duration.ofMinutes(Long.parseLong(parts[0]))
                        .plusSeconds(Long.parseLong(parts[1].split("\\,")[0]))
                        .plusMillis(Long.parseLong(padEnd(parts[1].split("\\,")[1], 3)));
            } else {
                d = Duration.ofMinutes(Long.parseLong(parts[0]))
                        .plusSeconds(Long.parseLong(parts[1]));
            }
        } else {
            if (parts[0].contains(",")) {
                d = Duration.ofSeconds(Long.parseLong(parts[0].split("\\,")[0]))
                        .plusMillis(Long.parseLong(padEnd(parts[0].split("\\,")[1], 3)));
            } else {
                d = Duration.ofSeconds(Long.parseLong(padEnd(parts[0], 2)));
            }
        }

        return d.toMillis();
    }
}
