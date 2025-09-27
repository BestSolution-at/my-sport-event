package at.mspe.server.jpa.sportevent;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEventNew.Data;
import at.mspe.server.jpa.BaseHandler;

@ApplicationScoped
public class CreateHandlerJPA extends BaseHandler implements SportEventServiceImpl.CreateHandler {

    public CreateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public String create(BuilderFactory _factory, Data participant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

}
