package at.mspe.server.service.jpa.participant;

import java.io.IOException;
import java.nio.file.Files;

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
                    """, ParticipantEntity.class)
                .setParameter("eventKey", eventKey);

        try {
            var csvLines = q.getResultList().stream().map(e -> {
                var sb = new StringBuilder();
                sb.append(e.gender == Gender.FEMALE ? "w" : "m").append("\t");
                sb.append(e.lastname).append("\t");
                sb.append(e.firstname).append("\t");
                sb.append(e.birthday.getYear()).append("\t");
                sb.append(e.key);
                return sb;
            }).toList();
            var file = Files.createTempFile("mspe", ".csv");
            Files.write(file, csvLines);
            var filename = "%s_participants.csv".formatted(event.name);
            return _factory.createFile(file, "text/csv;charset=utf-8;", filename);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
