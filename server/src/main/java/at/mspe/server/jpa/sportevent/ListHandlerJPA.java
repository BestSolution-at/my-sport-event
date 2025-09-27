package at.mspe.server.jpa.sportevent;

import java.util.List;

import at.mspe.server.jpa.BaseReadonlyHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEvent.Data;

@ApplicationScoped
public class ListHandlerJPA extends BaseReadonlyHandler implements SportEventServiceImpl.ListHandler {

    public ListHandlerJPA(EntityManager em) {
        super(em);
        // TODO Auto-generated constructor stub
    }

    @Override
    public List<Data> list(BuilderFactory _factory) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'list'");
    }

}
