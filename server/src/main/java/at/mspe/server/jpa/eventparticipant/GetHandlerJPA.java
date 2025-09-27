package at.mspe.server.jpa.eventparticipant;

import at.mspe.server.jpa.BaseReadonlyHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.Participant.Data;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class GetHandlerJPA extends BaseReadonlyHandler implements EventParticipantServiceImpl.GetHandler {

    public GetHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public Data get(BuilderFactory _factory, String eventKey) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'get'");
    }

}
