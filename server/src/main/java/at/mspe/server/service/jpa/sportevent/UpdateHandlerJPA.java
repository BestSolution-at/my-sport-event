package at.mspe.server.service.jpa.sportevent;

import java.util.Objects;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.model.SportEventEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.StaleDataException;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEvent;
import at.mspe.server.service.model.UpdateResult;

@ApplicationScoped
public class UpdateHandlerJPA extends BaseHandler implements SportEventServiceImpl.UpdateHandler {

    @Inject
    public UpdateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    @Transactional
    public UpdateResult.Data update(BuilderFactory _factory, String key, SportEvent.Patch event) {
        return apply(em -> update(em, _factory, key, event));
    }

    private static UpdateResult.Data update(EntityManager em, BuilderFactory factory, String key,
            SportEvent.Patch event) {
        if (!Objects.equals(key, event.key())) {
            throw new InvalidDataException("key '%s' and event.key '%s' have to be equal".formatted(key, event.key()));
        }

        var entity = SportEventHelper.findSportEventByKey(em, key);
        if (entity.version != event.version()) {
            throw new StaleDataException("key");
        }
        event.name().ifPresent(entity::name);
        event.date().ifPresent(entity::date);
        SportEventEntity.validate(entity);

        em.persist(entity);
        em.flush();
        return factory.builder(UpdateResult.DataBuilder.class)
                .key(key)
                .version(entity.version)
                .build();
    }
}
