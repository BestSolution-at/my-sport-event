package at.mspe.server.service.jpa.participant;

import at.mspe.server.service.jpa.BaseReadonlyHandler;
import at.mspe.server.service.jpa.model.ParticipantEntity;

import java.util.List;

import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.Participant;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class GetHandlerJPA extends BaseReadonlyHandler implements EventParticipantServiceImpl.GetHandler {
    @Inject
    public GetHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public Participant.Data get(BuilderFactory _factory, String eventKey, String key) {
        return apply(em -> get(em, _factory, eventKey, key));
    }

    public static Participant.Data get(EntityManager em, BuilderFactory _factory, String eventKey, String key) {
        var entity = ParticipantHelper.findParticipant(em, eventKey, key);
        return ParticipantHelper.toData(_factory, entity, p -> getTeamMates(em, entity));
    }

    private static List<String> getTeamMates(EntityManager em, ParticipantEntity entity) {
        return em.createQuery("""
                SELECT
                    p
                FROM
                    Participant p
                WHERE
                    p.sportEvent.id = :eventId
                AND p.team = :team
                AND p.id != :id
                """, ParticipantEntity.class)
                .setParameter("eventId", entity.sportEvent.id)
                .setParameter("team", entity.team)
                .setParameter("id", entity.id)
                .getResultList()
                .stream()
                .map(ParticipantHelper::toString)
                .toList();
    }
}
