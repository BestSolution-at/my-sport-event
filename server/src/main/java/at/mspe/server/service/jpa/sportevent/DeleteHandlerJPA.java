package at.mspe.server.service.jpa.sportevent;

import java.util.Objects;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.SportEventEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.StaleDataException;
import at.mspe.server.service.impl.SportEventServiceImpl;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements SportEventServiceImpl.DeleteHandler {
    @Inject
    public DeleteHandlerJPA(EntityManager em) {
        super(em);
    }

    @Transactional
    @Override
    public void delete(BuilderFactory _factory, String key, Long version) {
        accept(em -> delete(em, key, version));
    }

    private static void delete(EntityManager em, String key, Long version) {
        var entity = SportEventHelper.findSportEventByKey(em, key);
        if (version != null && !Objects.equals(version, entity.version)) {
            throw new StaleDataException(Utils.createStaleMessage(key, key, entity.version, version));
        }

        deleteParticipants(em, entity);
        em.flush();
        deleteCohorts(em, entity);
        em.flush();

        em.remove(entity);
    }

    private static void deleteParticipants(EntityManager em, SportEventEntity sportEvent) {
        var query = em.createQuery("""
                DELETE FROM
                    Participant pa
                WHERE
                    pa.sportEvent = :sportEvent
                """);
        query.setParameter("sportEvent", sportEvent);
        query.executeUpdate();
    }

    private static void deleteCohorts(EntityManager em, SportEventEntity sportEvent) {
        var query = em.createQuery("""
                DELETE FROM
                    Cohort co
                WHERE
                    co.sportEvent = :sportEvent
                """);
        query.setParameter("sportEvent", sportEvent);
        query.executeUpdate();
    }
}
