package at.mspe.server.service.jpa.cohort;

import java.util.Objects;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.StaleDataException;
import at.mspe.server.service.impl.EventCohortServiceImpl;
import at.mspe.server.service.model.UpdateResult;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.Cohort;
import at.mspe.server.service.model.GenericCohort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UpdateHandlerJPA extends BaseHandler implements EventCohortServiceImpl.UpdateHandler {

    @Inject
    public UpdateHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    @Transactional
    public UpdateResult.Data update(BuilderFactory _factory, String eventKey, String key, Cohort.Patch cohort) {
        return apply(em -> update(em, _factory, eventKey, key, cohort));
    }

    private static UpdateResult.Data update(EntityManager em, BuilderFactory factory, String eventKey, String key,
            Cohort.Patch cohort) {
        if (!Objects.equals(key, cohort.key())) {
            throw new InvalidDataException(
                    "key '%s' and cohort.key '%s' have to be equal".formatted(key, cohort.key()));
        }

        var entity = EventCohortHelper.findCohort(em, eventKey, key);

        if (!Objects.equals(cohort.version(), entity.version)) {
            var message = Utils.createStaleMessage("Cohort", key, entity.version, cohort.version());
            throw new StaleDataException(message);
        }

        if (cohort instanceof GenericCohort.Patch patch) {
            if (entity instanceof GenericCohortEntity gc) {
                patch.name().ifPresent(gc::name);
                GenericCohortEntity.validate(gc);
            } else {
                throw new InvalidDataException(
                        "Typmismatch - Unable to apply 'GenericCohort' patch on %s"
                                .formatted(entity.getClass().getSimpleName()));
            }
        } else if (cohort instanceof BirthyearCohort.Patch patch) {
            if (entity instanceof BirthyearCohortEntity be) {
                patch.name().ifPresent(be::name);
                patch.max().ifPresent(be::max);
                patch.min().ifPresent(be::min);
                BirthyearCohortEntity.validate(be);
            } else {
                throw new InvalidDataException(
                        "Typmismatch - Unable to apply 'BirthyearCohort' patch on %s"
                                .formatted(entity.getClass().getSimpleName()));
            }
        } else {
            throw new IllegalStateException("Unknown Cohort type %s".formatted(cohort.getClass()));
        }

        em.persist(entity);
        em.flush();

        return factory.builder(UpdateResult.DataBuilder.class)
                .key(key)
                .version(entity.version)
                .build();
    }
}
