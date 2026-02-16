package at.mspe.server.service.jpa.participant;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.Utils;

import java.util.Objects;
import java.util.OptionalLong;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.StaleDataException;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.DeleteHandler {
    @Inject
    public DeleteHandlerJPA(EntityManager em) {
        super(em);
    }

    @Transactional
    @Override
    public void delete(BuilderFactory _factory, String eventKey, String key, OptionalLong version) {
        accept(em -> delete(em, _factory, eventKey, key, version.isPresent() ? version.getAsLong() : null));
    }

    private static void delete(EntityManager em, BuilderFactory _factory, String eventKey, String key, Long version) {
        var entity = ParticipantHelper.findParticipant(em, eventKey, key);
        if (version != null && !Objects.equals(version, entity.version)) {
            var message = Utils.createStaleMessage("Participant", key, entity.version, version);
            throw new StaleDataException(message);
        }
        em.remove(entity);
    }
}
