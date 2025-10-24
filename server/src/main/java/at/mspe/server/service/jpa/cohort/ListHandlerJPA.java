package at.mspe.server.service.jpa.cohort;

import java.util.List;

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
        return query.getResultList()
                .stream()
                .map(e -> CohortHelper.toData(e, factory))
                .toList();
    }
}
