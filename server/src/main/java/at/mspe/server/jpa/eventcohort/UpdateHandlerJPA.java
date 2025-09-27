package at.mspe.server.jpa.eventcohort;

import at.mspe.server.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.Cohort.Patch;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class UpdateHandlerJPA extends BaseHandler implements EventCohortServiceImpl.UpdateHandler {

    public UpdateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public void update(BuilderFactory _factory, String eventKey, String key, Patch cohort) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

}
