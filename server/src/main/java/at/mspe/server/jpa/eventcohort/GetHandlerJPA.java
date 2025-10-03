package at.mspe.server.jpa.eventcohort;

import at.mspe.server.jpa.BaseReadonlyHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.Cohort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class GetHandlerJPA extends BaseReadonlyHandler implements EventCohortServiceImpl.GetHandler {

    @Inject
    public GetHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public Cohort.Data get(BuilderFactory _factory, String eventKey, String key) {
        return apply(em -> get(em, _factory, eventKey, key));
    }

    public Cohort.Data get(EntityManager em, BuilderFactory _factory, String eventKey, String key) {
        var e = EventCohortHelper.findCohort(em, eventKey, key);
        return EventCohortHelper.toData(e, _factory);
    }

}
