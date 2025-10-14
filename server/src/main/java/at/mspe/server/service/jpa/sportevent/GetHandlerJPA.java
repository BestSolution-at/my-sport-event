package at.mspe.server.service.jpa.sportevent;

import at.mspe.server.service.jpa.BaseReadonlyHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEvent;

@ApplicationScoped
public class GetHandlerJPA extends BaseReadonlyHandler implements SportEventServiceImpl.GetHandler {
    @Inject
    public GetHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public SportEvent.Data get(BuilderFactory factory, String key) {
        return apply(em -> get(em, factory, key));
    }

    private static SportEvent.Data get(EntityManager em, BuilderFactory factory, String key) {
        var entity = SportEventHelper.findSportEventByKey(em, key);
        var participantCountQuery = em.createQuery("""
                SELECT
                    count(*)
                FROM
                   Participant par
                WHERE
                    par.sportEvent.id = :id
                """, Number.class);
        participantCountQuery.setParameter("id", entity.id);
        var count = participantCountQuery.getSingleResult().intValue();
        return SportEventHelper.toData(entity, (eventId) -> count, factory);
    }
}
