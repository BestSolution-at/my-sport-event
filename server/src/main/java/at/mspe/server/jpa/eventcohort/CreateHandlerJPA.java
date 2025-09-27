package at.mspe.server.jpa.eventcohort;

import at.mspe.server.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.CohortNew.Data;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class CreateHandlerJPA extends BaseHandler implements EventCohortServiceImpl.CreateHandler {

    public CreateHandlerJPA(EntityManager em) {
        super(em);
        // TODO Auto-generated constructor stub
    }

    @Override
    public String create(BuilderFactory _factory, String eventKey, Data cohort) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

}
