package at.mspe.server.service.jpa.participant;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Objects;
import java.util.stream.Stream;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.jpa.BaseReadonlyHandler;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.Gender;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.model.RSDFile;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class DownloadCsvHandlerJPA extends BaseReadonlyHandler
        implements EventParticipantServiceImpl.DownloadCsvHandler {

    @Inject
    public DownloadCsvHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public RSDFile downloadCsv(BuilderFactory _factory, String eventKey)
            throws NotFoundException {
        return apply(em -> downloadCsv(em, _factory, eventKey));
    }

    private RSDFile downloadCsv(EntityManager em, BuilderFactory _factory, String _eventKey) {
        var eventKey = Utils.parseUUID(_eventKey, SportEventHelper.NOT_FOUND);
        var event = SportEventHelper.findSportEventByKey(em, _eventKey);

        var q = em.createQuery("""
                SELECT
                    p
                FROM
                    Participant p
                WHERE
                    p.sportEvent.key = :eventKey
                ORDER BY p.key""", ParticipantEntity.class)
                .setParameter("eventKey", eventKey);

        try {
            var contentLines = q.getResultList().stream().map(e -> {
                var sb = new StringBuilder();
                sb.append(e.gender == Gender.FEMALE ? "W" : "M").append("\t");
                sb.append(e.lastname).append("\t");
                sb.append(e.firstname).append("\t");
                sb.append(Objects.toString(e.association, "")).append("\t");
                sb.append(e.birthday.getYear()).append("\t");
                sb.append(e.cohort != null ? e.cohort.name : "").append("\t");
                sb.append(Objects.toString(e.team, "").trim()).append("\t");
                sb.append(e.key);
                return sb;
            });
            var header = new StringBuilder();
            header.append("Geschlecht").append("\t");
            header.append("Nachname").append("\t");
            header.append("Vorname").append("\t");
            header.append("Verein").append("\t");
            header.append("Jahrgang").append("\t");
            header.append("Klasse").append("\t");
            header.append("Mannschaft").append("\t");
            header.append("Key");
            var csvContent = Stream.concat(Stream.of(header), contentLines).toList();
            var file = Files.createTempFile("mspe", ".csv");
            Files.write(file, csvContent);
            var filename = "%s_participants.csv".formatted(event.name);
            return _factory.createFile(file, "text/csv;charset=utf-8;", filename);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
