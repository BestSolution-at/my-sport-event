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

    public static long parseTime(String time) {

        var d = Duration.parse(time);
        return 0;
    }
}
