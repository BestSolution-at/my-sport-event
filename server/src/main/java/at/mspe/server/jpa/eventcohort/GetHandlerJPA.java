package at.mspe.server.jpa.eventcohort;

import at.mspe.server.jpa.BaseReadonlyHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.Cohort.Data;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class GetHandlerJPA extends BaseReadonlyHandler implements EventCohortServiceImpl.GetHandler {

    public GetHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public Data get(BuilderFactory _factory, String eventKey) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'get'");
    }

}
