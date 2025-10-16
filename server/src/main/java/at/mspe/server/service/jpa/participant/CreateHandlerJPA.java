package at.mspe.server.service.jpa.participant;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.cohort.EventCohortHelper;
import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.model.Gender;
import at.mspe.server.service.jpa.model.ParticipantEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.NotFoundException;
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
    public String create(BuilderFactory _factory, String eventKey, ParticipantNew.Data participant,
            Boolean autoAssignCohort) {
        return apply(em -> create(em, _factory, eventKey, participant, autoAssignCohort));
    }

    private static String create(EntityManager em, BuilderFactory _factory, String eventKey,
            ParticipantNew.Data participant, Boolean autoAssignCohort) {
        var sportEvent = SportEventHelper.findSportEventByKey(em, eventKey);
        CohortEntity cohort = null;
        if (participant.cohortKey() != null) {
            try {
                cohort = EventCohortHelper.findCohort(em, eventKey, participant.cohortKey());
            } catch (NotFoundException e) {
                throw new InvalidDataException(
                        "Provided cohortKey '%s' is not known".formatted(participant.cohortKey()));
            }
        }
        var e = ParticipantEntity.builder()
                .association(participant.association())
                .birthday(participant.birthday())
                .cohort(cohort)
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
        if (e.cohort == null && Boolean.TRUE.equals(autoAssignCohort)) {
            cohort = EventCohortHelper.findMatchingCohort(em, e);
        }
        em.persist(e);
        return e.key.toString();
    }
}
