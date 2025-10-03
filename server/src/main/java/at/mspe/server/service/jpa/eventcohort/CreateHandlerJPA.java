package at.mspe.server.service.jpa.eventcohort;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.service.jpa.sportevent.SportEventHelper;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.GenericCohort;
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

    @Override
    public String create(BuilderFactory _factory, String eventKey, CohortNew.Data cohort) {
        return apply(em -> create(em, _factory, eventKey, cohort));
    }

    @Transactional
    public String create(EntityManager em, BuilderFactory factory, String eventKey, CohortNew.Data cohort) {
        var sportEvent = SportEventHelper.findSportEventByKey(em, eventKey);

        if (cohort instanceof GenericCohort.Data generic) {
            var entity = GenericCohortEntity.builder()
                    .key(generateKey())
                    .name(generic.name())
                    .sportEvent(sportEvent)
                    .build();

            em.persist(entity);
            em.flush();
            return entity.key.toString();
        } else if (cohort instanceof BirthyearCohort.Data birthyear) {
            var entity = BirthyearCohortEntity.builder()
                    .key(generateKey())
                    .name(birthyear.name())
                    .min(birthyear.min())
                    .max(birthyear.max())
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
