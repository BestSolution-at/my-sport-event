package at.mspe.server.service.jpa.cohort;

import java.io.IOException;
import java.nio.file.Files;
import java.util.stream.Stream;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.model.RSDFile;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class DownloadCsvHandlerJPA extends BaseHandler implements EventCohortServiceImpl.DownloadCsvHandler {

    @Inject
    public DownloadCsvHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public RSDFile downloadCsv(BuilderFactory _factory, String eventKey) throws NotFoundException {
        return apply(em -> downloadCsv(em, _factory, eventKey));
    }

    private static RSDFile downloadCsv(EntityManager em, BuilderFactory _factory, String _eventKey) {
        var event = SportEventHelper.findSportEventByKey(em, _eventKey);
        var query = em.createQuery("""
                SELECT
                    co
                FROM
                    Cohort co
                WHERE
                    co.sportEvent.key = :eventKey
                """, CohortEntity.class);
        query.setParameter("eventKey", event.key);
        var cohorts = query.getResultList();
        if (cohorts.isEmpty()) {
            SportEventHelper.findSportEventByKey(em, _eventKey);
        }

        var contentLines = cohorts.stream().map(c -> {
            var sb = new StringBuilder();
            sb.append(c.name).append("\t");
            sb.append(c.gender).append("\t");
            if (c instanceof BirthyearCohortEntity birthyear) {
                sb.append(birthyear.min).append("\t");
                sb.append(birthyear.max).append("\t");
            } else {
                sb.append("\t").append("\t");
            }
            sb.append(c.key);
            return sb;
        });

        var header = new StringBuilder();
        header.append("Name").append("\t");
        header.append("Geschlecht").append("\t");
        header.append("Jahrgang start").append("\t");
        header.append("Jahrgang Ende").append("\t");
        header.append("Key");

        try {
            var csvContent = Stream.concat(Stream.of(header), contentLines).toList();
            var file = Files.createTempFile("mspe", ".csv");
            Files.write(file, csvContent);
            var filename = "%s_cohorts.csv".formatted(event.name);
            return _factory.createFile(file, "text/csv;charset=utf-8;", filename);
        } catch (IOException e) {
            throw new RuntimeException("Error while creating CSV file", e);
        }
    }
}
