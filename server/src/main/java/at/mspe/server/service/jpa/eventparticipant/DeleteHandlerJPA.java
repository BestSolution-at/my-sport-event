package at.mspe.server.service.jpa.eventparticipant;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.DeleteHandler {
    @Inject
    public DeleteHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public void delete(BuilderFactory _factory, String eventKey, String key, Long version) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
