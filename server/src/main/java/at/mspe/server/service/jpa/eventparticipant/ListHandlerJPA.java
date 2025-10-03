package at.mspe.server.service.jpa.eventparticipant;

import java.util.List;

import at.mspe.server.service.jpa.BaseReadonlyHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.Participant.Data;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class ListHandlerJPA extends BaseReadonlyHandler implements EventParticipantServiceImpl.ListHandler {
    @Inject
    public ListHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public List<Data> list(BuilderFactory _factory, String eventKey) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'list'");
    }

}
