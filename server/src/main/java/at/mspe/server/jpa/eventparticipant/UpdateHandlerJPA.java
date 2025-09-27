package at.mspe.server.jpa.eventparticipant;

import at.mspe.server.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.Participant.Patch;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class UpdateHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.UpdateHandler {

    public UpdateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public void update(BuilderFactory _factory, String eventKey, String key, Patch participant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

}
