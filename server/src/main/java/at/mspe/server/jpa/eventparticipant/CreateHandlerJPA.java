package at.mspe.server.jpa.eventparticipant;

import at.mspe.server.jpa.BaseHandler;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.ParticipantNew.Data;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class CreateHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.CreateHandler {
    @Inject
    public CreateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public String create(BuilderFactory _factory, String eventKey, Data participant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

}
