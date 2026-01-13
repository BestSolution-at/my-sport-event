package at.mspe.server.service.jpa.cohort;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import at.mspe.server.service.jpa.BaseReadonlyHandler;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.Cohort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class ListHandlerJPA extends BaseReadonlyHandler implements EventCohortServiceImpl.ListHandler {
    @Inject
    public ListHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public List<Cohort.Data> list(BuilderFactory _factory, String eventKey) {
        return apply(em -> list(em, _factory, eventKey));
    }

    private static List<Cohort.Data> list(EntityManager em, BuilderFactory factory, String _eventKey) {
        var eventKey = Utils.parseUUID(_eventKey, SportEventHelper.NOT_FOUND);
        var query = em.createQuery("""
                SELECT
                    co
                FROM
                    Cohort co
                WHERE
                    co.sportEvent.key = :eventKey
                """, CohortEntity.class);
        query.setParameter("eventKey", eventKey);
        if (query.getResultList().isEmpty()) {
            SportEventHelper.findSportEventByKey(em, _eventKey);
        }
        var cohortCounts = fetchCohortCounts(em, eventKey).stream()
                .collect(Collectors.toMap(CohortCount::cohortKey, CohortCount::count));
        return query.getResultList()
                .stream()
                .map(e -> CohortHelper.toData(e, factory, cohortKey -> cohortCounts.getOrDefault(cohortKey, 0)))
                .toList();
    }

    private static List<CohortCount> fetchCohortCounts(EntityManager em, UUID eventKey) {
        var query = em.createQuery("""
                SELECT
                    p.cohort.key,
                    COUNT(p)
                FROM
                    Participant p
                WHERE
                    p.cohort.sportEvent.key = :eventKey
                GROUP BY
                    p.cohort.key
                """, Object[].class);
        query.setParameter("eventKey", eventKey);
        return query.getResultList()
                .stream()
                .map(r -> new CohortCount((UUID) r[0], ((Long) r[1]).intValue()))
                .toList();
    }

    record CohortCount(UUID cohortKey, int count) {

    }
}
