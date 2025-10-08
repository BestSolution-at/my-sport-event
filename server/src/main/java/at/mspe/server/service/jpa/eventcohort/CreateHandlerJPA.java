package at.mspe.server.service.jpa.eventcohort;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.model.Gender;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.BirthyearCohortNew;
import at.mspe.server.service.model.GenericCohortNew;
import at.mspe.server.service.model.CohortNew;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CreateHandlerJPA extends BaseHandler implements EventCohortServiceImpl.CreateHandler {

    @Inject
    public CreateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Transactional
    @Override
    public String create(BuilderFactory _factory, String eventKey, CohortNew.Data cohort) {
        return apply(em -> create(em, _factory, eventKey, cohort));
    }

    private static String create(EntityManager em, BuilderFactory factory, String eventKey, CohortNew.Data cohort) {
        var sportEvent = SportEventHelper.findSportEventByKey(em, eventKey);

        if (cohort instanceof GenericCohortNew.Data generic) {
            var entity = GenericCohortEntity.builder()
                    .key(generateKey())
                    .name(generic.name())
                    .sportEvent(sportEvent)
                    .gender(Gender.valueOf(cohort.gender().toString()))
                    .build();

            em.persist(entity);
            em.flush();
            return entity.key.toString();
        } else if (cohort instanceof BirthyearCohortNew.Data birthyear) {
            var entity = BirthyearCohortEntity.builder()
                    .key(generateKey())
                    .name(birthyear.name())
                    .min(birthyear.min())
                    .max(birthyear.max())
                    .gender(Gender.valueOf(cohort.gender().toString()))
                    .sportEvent(sportEvent)
                    .build();
            em.persist(entity);
            em.flush();
            return entity.key.toString();
        } else {
            throw new IllegalStateException("Unsupported cohort type: " + cohort);
        }
    }

}
