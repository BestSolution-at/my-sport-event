package at.mspe.server.service.jpa.eventparticipant;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.Participant.Patch;
import at.mspe.server.service.model.UpdateResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class UpdateHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.UpdateHandler {
    @Inject
    public UpdateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public UpdateResult.Data update(BuilderFactory _factory, String eventKey, String key, Patch participant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

}
