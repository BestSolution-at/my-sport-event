package at.mspe.server.service.jpa.sportevent;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEventNew;
import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.model.SportEventEntity;

@ApplicationScoped
public class CreateHandlerJPA extends BaseHandler implements SportEventServiceImpl.CreateHandler {
    @Inject
    public CreateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public String create(BuilderFactory _factory, SportEventNew.Data event) {
        return apply(em -> create(em, _factory, event));
    }

    @Transactional
    public String create(EntityManager em, BuilderFactory _factory, SportEventNew.Data event) {
        var entity = SportEventEntity.builder()
                .key(generateKey())
                .name(event.name())
                .date(event.date())
                .build();
        em.persist(entity);
        return entity.key.toString();
    }
}
