package at.mspe.server.jpa.eventparticipant;

import at.mspe.server.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.DeleteHandler {

    public DeleteHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public void delete(BuilderFactory _factory, String eventKey, String key) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
