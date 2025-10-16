package at.mspe.server.service.jpa.participant;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.cohort.EventCohortHelper;
import at.mspe.server.service.jpa.model.Gender;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventParticipantServiceImpl;
import at.mspe.server.service.model.ParticipantNew;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CreateHandlerJPA extends BaseHandler implements EventParticipantServiceImpl.CreateHandler {
    @Inject
    public CreateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Transactional
    @Override
    public String create(BuilderFactory _factory, String eventKey, ParticipantNew.Data participant) {
        return apply(em -> create(em, _factory, eventKey, participant));
    }

    private static String create(EntityManager em, BuilderFactory _factory, String eventKey,
            ParticipantNew.Data participant) {
        var sportEvent = SportEventHelper.findSportEventByKey(em, eventKey);
        var e = ParticipantEntity.builder()
                .association(participant.association())
                .birthday(participant.birthday())
                .cohort(participant.cohortKey() == null ? null
                        : EventCohortHelper.findCohort(em, eventKey, participant.cohortKey()))
                // .competitionNumber(null)
                // .email(null)
                .firstname(participant.firstname())
                .gender(Gender.valueOf(participant.gender().toString()))
                .key(generateKey())
                .lastname(participant.lastname())
                .sportEvent(sportEvent)
                .team(participant.team())
                .association(participant.association())
                .build();
        em.persist(e);
        return e.key.toString();
    }
}
