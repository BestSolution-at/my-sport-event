package at.mspe.server.service.jpa.participant;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import at.mspe.server.service.jpa.BaseReadonlyHandler;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.Participant;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class ListHandlerJPA extends BaseReadonlyHandler implements EventParticipantServiceImpl.ListHandler {
    @Inject
    public ListHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public List<Participant.Data> list(BuilderFactory _factory, String eventKey) {
        return apply(em -> list(em, _factory, eventKey));
    }

    private static List<Participant.Data> list(EntityManager em, BuilderFactory _factory, String _eventKey) {
        var eventKey = Utils.parseUUID(_eventKey, SportEventHelper.NOT_FOUND);
        var resultList = em.createQuery("""
                SELECT
                    p
                FROM
                    Participant p
                WHERE
                    p.sportEvent.key = :eventKey;
                    """, ParticipantEntity.class)
                .setParameter("eventKey", eventKey)
                .getResultList();
        var teams = resultList.stream()
                .filter(p -> p.team != null && !p.team.isBlank())
                .collect(Collectors.groupingBy(ParticipantEntity::team));
        Function<ParticipantEntity, List<String>> lookup = (p) -> {
            return teams
                    .getOrDefault(p.team, List.of())
                    .stream()
                    .filter(e -> e != p)
                    .map(ParticipantHelper::toString)
                    .toList();
        };
        return resultList.stream()
                .map(p -> ParticipantHelper.toData(_factory, p, lookup))
                .toList();
    }
}
