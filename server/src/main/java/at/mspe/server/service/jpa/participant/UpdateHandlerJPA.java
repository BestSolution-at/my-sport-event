package at.mspe.server.service.jpa.participant;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.Gender;

import java.util.Objects;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.StaleDataException;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.Participant;
import at.mspe.server.service.model.UpdateResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UpdateHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.UpdateHandler {
    @Inject
    public UpdateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Transactional
    @Override
    public UpdateResult.Data update(BuilderFactory _factory, String eventKey, String key,
            Participant.Patch participant) {
        return apply(em -> update(em, _factory, eventKey, key, participant));
    }

    private static UpdateResult.Data update(EntityManager em, BuilderFactory factory, String eventKey, String key,
            Participant.Patch participant) {
        if (!Objects.equals(key, participant.key())) {
            throw new InvalidDataException(
                    "key '%s' and participant.key '%s' have to be equal".formatted(key, participant.key()));
        }
        var entity = ParticipantHelper.findParticipant(em, eventKey, key);
        if (!Objects.equals(participant.version(), entity.version)) {
            var message = Utils.createStaleMessage("Cohort", key, entity.version, participant.version());
            throw new StaleDataException(message);
        }

        participant.association().accept(entity::association);
        participant.birthday().ifPresent(entity::birthday);
        participant.firstname().ifPresent(entity::firstName);
        participant.gender().map(g -> Gender.valueOf(g.name())).ifPresent(entity::gender);
        participant.lastname().ifPresent(entity::lastname);
        participant.team().ifPresent(entity::team);

        em.persist(entity);
        em.flush();

        return factory.builder(UpdateResult.DataBuilder.class)
                .key(key)
                .version(entity.version)
                .build();
    }

}
