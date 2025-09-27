package at.mspe.server.jpa.sportevent;

import at.mspe.server.jpa.BaseHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements SportEventServiceImpl.DeleteHandler {

    public DeleteHandlerJPA(EntityManager em) {
        super(em);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void delete(BuilderFactory _factory, String key) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
