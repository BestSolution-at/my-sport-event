package at.mspe.server.jpa.sportevent;

import at.mspe.server.jpa.BaseHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.Participant.Patch;

@ApplicationScoped
public class UpdateHandlerJPA extends BaseHandler implements SportEventServiceImpl.UpdateHandler {

    public UpdateHandlerJPA(EntityManager em) {
        super(em);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void update(BuilderFactory _factory, String key, Patch participant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

}
