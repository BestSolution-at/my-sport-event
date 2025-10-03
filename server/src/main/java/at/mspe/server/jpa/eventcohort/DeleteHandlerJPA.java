package at.mspe.server.jpa.eventcohort;

import java.util.Objects;

import at.mspe.server.jpa.BaseHandler;
import at.mspe.server.jpa.Utils;
import at.mspe.server.jpa.model.CohortEntity;
import at.mspe.server.jpa.model.ParticipantEntity;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.StaleDataException;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements EventCohortServiceImpl.DeleteHandler {

    @Inject
    public DeleteHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    @Transactional
    public void delete(BuilderFactory _factory, String eventKey, String key, Long version) {
        accept(em -> delete(em, _factory, eventKey, key, version));
    }

    static void delete(EntityManager em, BuilderFactory factory, String eventKey, String key, Long version) {
        var entity = EventCohortHelper.findCohort(em, eventKey, key);
        if (version != null && !Objects.equals(version, entity.version)) {
            var message = Utils.createStaleMessage("Cohort", key, entity.version, version);
            throw new StaleDataException(message);
        }
        updateParticipants(em, entity);
        em.remove(entity);
    }

    private static void updateParticipants(EntityManager em, CohortEntity cohort) {
        var query = em.createQuery("""
                SELECT
                    pa
                FROM
                    Participant
                WHERE
                    pa.cohort = :cohort
                """, ParticipantEntity.class);
        query.setParameter("cohort", cohort);
        query.getResultList().forEach(p -> p.cohort(null));
    }
}
