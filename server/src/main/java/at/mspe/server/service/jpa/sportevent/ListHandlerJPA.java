package at.mspe.server.service.jpa.sportevent;

import java.util.List;

import at.mspe.server.service.jpa.BaseReadonlyHandler;
import at.mspe.server.service.jpa.model.SportEventEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEvent;

@ApplicationScoped
public class ListHandlerJPA extends BaseReadonlyHandler implements SportEventServiceImpl.ListHandler {
    @Inject
    public ListHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public List<SportEvent.Data> list(BuilderFactory _factory) {
        return apply(em -> list(em, _factory));
    }

    public List<SportEvent.Data> list(EntityManager em, BuilderFactory _factory) {
        var entities = em.createQuery("""
                SELECT
                    se
                FROM
                    SportEvent se
                """, SportEventEntity.class)
                .getResultList();
        return entities.stream().map(e -> SportEventHelper.toData(e, _factory)).toList();
    }
}
