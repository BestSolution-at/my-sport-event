package at.mspe.server.jpa.eventcohort;

import java.util.List;

import at.mspe.server.jpa.BaseReadonlyHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.Cohort.Data;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class ListHandlerJPA extends BaseReadonlyHandler implements EventCohortServiceImpl.ListHandler {

    public ListHandlerJPA(EntityManager em) {
        super(em);
        // TODO Auto-generated constructor stub
    }

    @Override
    public List<Data> list(BuilderFactory _factory, String eventKey) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'list'");
    }

}
