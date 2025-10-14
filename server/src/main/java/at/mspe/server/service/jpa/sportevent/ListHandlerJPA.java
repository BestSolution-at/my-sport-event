package at.mspe.server.service.jpa.sportevent;

import java.util.List;
import java.util.stream.Collectors;

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

    private static List<SportEvent.Data> list(EntityManager em, BuilderFactory _factory) {
        var entities = em.createQuery("""
                SELECT
                    se
                FROM
                    SportEvent se
                """, SportEventEntity.class)
                .getResultList();
        var count = em.createQuery("""
                        SELECT
                            par.sportEvent.id,
                            count(*)
                        FROM
                            Participant par
                        GROUP BY
                            par.sportEvent.id
                """, Object[].class);
        var countMap = count
                .getResultList()
                .stream()
                .collect(Collectors.toMap(o -> (Long) o[0], o -> (Number) o[1]));
        return entities.stream()
                .map(e -> SportEventHelper.toData(e, (id) -> countMap.getOrDefault(id, 0).intValue(), _factory))
                .toList();
    }
}
