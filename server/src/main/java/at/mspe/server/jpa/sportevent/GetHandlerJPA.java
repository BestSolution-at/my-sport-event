package at.mspe.server.jpa.sportevent;

import at.mspe.server.jpa.BaseReadonlyHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEvent.Data;

@ApplicationScoped
public class GetHandlerJPA extends BaseReadonlyHandler implements SportEventServiceImpl.GetHandler {

    public GetHandlerJPA(EntityManager em) {
        super(em);
        // TODO Auto-generated constructor stub
    }

    @Override
    public Data get(BuilderFactory _factory, String key) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'get'");
    }

}
