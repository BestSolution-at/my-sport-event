package at.mspe.server.jpa.eventcohort;

import at.mspe.server.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements EventCohortServiceImpl.DeleteHandler {

    public DeleteHandlerJPA(EntityManager em) {
        super(em);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void delete(BuilderFactory _factory, String eventKey, String key) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
