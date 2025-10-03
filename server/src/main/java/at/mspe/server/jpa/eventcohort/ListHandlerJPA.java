package at.mspe.server.jpa.eventcohort;

import java.util.List;

import at.mspe.server.jpa.BaseReadonlyHandler;
import at.mspe.server.jpa.Utils;
import at.mspe.server.jpa.model.CohortEntity;
import at.mspe.server.jpa.sportevent.SportEventHelper;
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

    public List<Cohort.Data> list(EntityManager em, BuilderFactory _factory, String _eventKey) {
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
        return query.getResultList()
                .stream()
                .map(e -> EventCohortHelper.toData(e, _factory))
                .toList();
    }
}
