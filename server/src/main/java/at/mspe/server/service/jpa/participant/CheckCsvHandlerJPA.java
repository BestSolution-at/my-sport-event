package at.mspe.server.service.jpa.participant;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.model.CheckCsvResult;
import at.mspe.server.service.model.CheckCsvResultParticipant;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.model.RSDFile;

@ApplicationScoped
public class CheckCsvHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.CheckCsvHandler {
    public CheckCsvHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public CheckCsvResult.Data checkCsv(BuilderFactory _factory,
            String eventKey,
            RSDFile csv) throws NotFoundException, InvalidDataException {
        return apply(em -> checkCsv(em, _factory, eventKey, csv));
    }

    public CheckCsvResult.Data checkCsv(EntityManager em,
            BuilderFactory _factory,
            String eventKey,
            RSDFile csv) throws NotFoundException, InvalidDataException {
        var participants = ParticipantHelper.getParticipantsByKey(em, eventKey);
        var csvEntries = ParticipantHelper.parseParticipantsCsv(em, eventKey, csv);
        var b = _factory.builder(CheckCsvResult.DataBuilder.class);

        return b
                .unkownParticipants(getUnknownParticipants(_factory, participants, csvEntries))
                .noTimeParticipants(getNoTimeParticipants(_factory, participants, csvEntries))
                .build();
    }

    private static List<CheckCsvResultParticipant.Data> getUnknownParticipants(
            BuilderFactory _factory,
            Map<String, ParticipantEntity> participants,
            Map<String, ParticipantHelper.CsvEntry> csvEntries) {
        var unknown = new HashMap<>(csvEntries);
        unknown.keySet().removeAll(participants.keySet());
        return unknown.values().stream()
                .map(e -> {
                    return _factory.builder(CheckCsvResultParticipant.DataBuilder.class)
                            .lastname(e.lastname())
                            .firstname(e.firstname())
                            .key(e.key())
                            .build();
                })
                .toList();
    }

    private static List<CheckCsvResultParticipant.Data> getNoTimeParticipants(
            BuilderFactory _factory,
            Map<String, ParticipantEntity> participants,
            Map<String, ParticipantHelper.CsvEntry> csvEntries) {
        var noTime = new HashSet<>(participants.keySet());
        noTime.removeAll(csvEntries.keySet());
        return noTime.stream()
                .map(k -> participants.get(k))
                .map(p -> {
                    return _factory.builder(CheckCsvResultParticipant.DataBuilder.class)
                            .lastname(p.lastname)
                            .firstname(p.firstname)
                            .key(p.key.toString())
                            .build();
                })
                .toList();
    }
}
